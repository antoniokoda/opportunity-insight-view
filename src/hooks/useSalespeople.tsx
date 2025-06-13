
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

      console.log('Adding salesperson:', newSalesperson);
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
        description: 'No se pudo agregar el vendedor.',
        variant: 'destructive',
      });
    },
  });

  const updateSalesperson = useMutation({
    mutationFn: async ({ id, name, email }: { id: number; name: string; email: string }) => {
      if (!user) throw new Error('User not authenticated');

      console.log('Updating salesperson:', { id, name, email });
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
        description: 'No se pudo actualizar el vendedor.',
        variant: 'destructive',
      });
    },
  });

  const deleteSalesperson = useMutation({
    mutationFn: async (id: number) => {
      if (!user) throw new Error('User not authenticated');

      console.log('Deleting salesperson with ID:', id);
      
      // Check for opportunities assigned to this salesperson
      const { data: opportunities, error: oppError } = await supabase
        .from('opportunities')
        .select('id, name')
        .eq('salesperson_id', id);

      if (oppError) {
        console.error('Error checking opportunities:', oppError);
        throw new Error('No se pudo verificar las oportunidades asociadas');
      }

      // Update opportunities to remove salesperson assignment
      if (opportunities && opportunities.length > 0) {
        console.log(`Found ${opportunities.length} opportunities assigned to this salesperson`);
        
        const { error: updateError } = await supabase
          .from('opportunities')
          .update({ salesperson_id: null })
          .eq('salesperson_id', id);

        if (updateError) {
          console.error('Error updating opportunities:', updateError);
          throw new Error('No se pudieron actualizar las oportunidades asociadas');
        }

        console.log(`Updated ${opportunities.length} opportunities to remove salesperson assignment`);
      }

      // Delete the salesperson
      const { error } = await supabase
        .from('salespeople')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting salesperson:', error);
        throw error;
      }

      console.log('Successfully deleted salesperson:', id);
      return { id, affectedOpportunities: opportunities?.length || 0 };
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
    deleteSalesperson: deleteSalesperson.mutate,
    isAdding: addSalesperson.isPending,
    isUpdating: updateSalesperson.isPending,
    isDeleting: deleteSalesperson.isPending,
  };
};
