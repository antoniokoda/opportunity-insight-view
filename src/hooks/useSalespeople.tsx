import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface Salesperson {
  id: number;
  name: string;
  email: string;
  user_id: string;
  created_at: string;
}

export const useSalespeople = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: salespeople = [], isLoading, error } = useQuery({
    queryKey: ['salespeople', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      console.log('Fetching salespeople for user:', user.id);
      const { data, error } = await supabase
        .from('salespeople')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching salespeople:', error);
        throw error;
      }

      console.log('Fetched salespeople:', data);
      return data as Salesperson[];
    },
    enabled: !!user,
  });

  const addSalesperson = useMutation({
    mutationFn: async (newSalesperson: { name: string; email: string }) => {
      if (!user) throw new Error('User not authenticated');
      if (!newSalesperson.name.trim() || !newSalesperson.email.trim()) {
        throw new Error('Name and email are required.');
      }
      if (!/^\S+@\S+\.\S+$/.test(newSalesperson.email)) {
        throw new Error('Invalid email format.');
      }

      const { data, error } = await supabase
        .from('salespeople')
        .insert([{
          ...newSalesperson,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) {
        console.error('Error adding salesperson:', error);
        throw error;
      }

      console.log('Added salesperson:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salespeople'] });
      toast({
        title: 'Vendedor agregado',
        description: 'El vendedor ha sido agregado exitosamente.',
      });
    },
    onError: (error) => {
      console.error('Error adding salesperson:', error);
      toast({
        title: 'Error',
        description: error.message || 'No se pudo agregar el vendedor.',
        variant: 'destructive',
      });
    },
  });

  const updateSalesperson = useMutation({
    mutationFn: async ({ id, name, email }: { id: number; name: string; email: string }) => {
      if (!user) throw new Error('User not authenticated');
      if (!name.trim() || !email.trim()) {
        throw new Error('Name and email cannot be empty.');
      }
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        throw new Error('Invalid email format.');
      }

      const { data, error } = await supabase
        .from('salespeople')
        .update({ name, email })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating salesperson:', error);
        throw error;
      }

      console.log('Updated salesperson:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salespeople'] });
      toast({
        title: 'Vendedor actualizado',
        description: 'El vendedor ha sido actualizado exitosamente.',
      });
    },
    onError: (error) => {
      console.error('Error updating salesperson:', error);
      toast({
        title: 'Error',
        description: error.message || 'No se pudo actualizar el vendedor.',
        variant: 'destructive',
      });
    },
  });

  const deleteSalesperson = useMutation({
    mutationFn: async (id: number) => {
      if (!user) throw new Error('User not authenticated');
      
      try {
        // Check for opportunities assigned to this salesperson
        const { data: opportunities, error: oppError } = await supabase
          .from('opportunities')
          .select('id, name')
          .eq('salesperson_id', id);

        if (oppError) {
          console.error('Error checking opportunities:', oppError);
          throw new Error('No se pudo verificar las oportunidades asociadas');
        }

        console.log(`Found ${opportunities?.length || 0} opportunities assigned to salesperson ${id}`);

        // Update opportunities to remove salesperson assignment if any exist
        if (opportunities && opportunities.length > 0) {
          console.log(`Updating ${opportunities.length} opportunities to remove salesperson assignment`);
          
          const { error: updateError } = await supabase
            .from('opportunities')
            .update({ salesperson_id: null })
            .eq('salesperson_id', id);

          if (updateError) {
            console.error('Error updating opportunities:', updateError);
            throw new Error(`No se pudieron actualizar las oportunidades asociadas: ${updateError.message}`);
          }

          console.log(`Successfully updated ${opportunities.length} opportunities`);
        }

        // Delete the salesperson
        const { error: deleteError } = await supabase
          .from('salespeople')
          .delete()
          .eq('id', id);

        if (deleteError) {
          console.error('Error deleting salesperson:', deleteError);
          throw new Error(`No se pudo eliminar el vendedor: ${deleteError.message}`);
        }

        console.log('Successfully deleted salesperson:', id);
        return { id, affectedOpportunities: opportunities?.length || 0 };
      } catch (error) {
        console.error('Error in deleteSalesperson:', error);
        throw error;
      }
    },
    onSuccess: ({ id, affectedOpportunities }) => {
      queryClient.invalidateQueries({ queryKey: ['salespeople'] });
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      
      const message = affectedOpportunities > 0 
        ? `El vendedor ha sido eliminado exitosamente. ${affectedOpportunities} oportunidad(es) fueron desasignadas.`
        : 'El vendedor ha sido eliminado exitosamente.';
      
      toast({
        title: 'Vendedor eliminado',
        description: message,
      });
      console.log('Salesperson deletion completed for ID:', id);
    },
    onError: (error) => {
      console.error('Error deleting salesperson:', error);
      toast({
        title: 'Error',
        description: error.message || 'No se pudo eliminar el vendedor.',
        variant: 'destructive',
      });
    },
  });

  return {
    salespeople,
    isLoading,
    error,
    addSalesperson: addSalesperson.mutate,
    updateSalesperson: updateSalesperson.mutate,
    deleteSalesperson: deleteSalesperson.mutateAsync,
    isAdding: addSalesperson.isPending,
    isUpdating: updateSalesperson.isPending,
    isDeleting: deleteSalesperson.isPending,
  };
};
