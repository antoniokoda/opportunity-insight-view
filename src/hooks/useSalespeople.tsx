
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
        .eq('user_id', user.id)
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

      console.log('Deleting salesperson with ID:', id, 'for user:', user.id);
      
      // First check if the salesperson exists and belongs to the user
      const { data: existingData, error: checkError } = await supabase
        .from('salespeople')
        .select('id, name')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (checkError) {
        console.error('Error checking salesperson:', checkError);
        throw new Error('No se pudo verificar el vendedor');
      }

      if (!existingData) {
        throw new Error('Vendedor no encontrado');
      }

      console.log('Salesperson found, proceeding with deletion:', existingData);

      const { error } = await supabase
        .from('salespeople')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting salesperson:', error);
        throw error;
      }

      console.log('Successfully deleted salesperson:', id);
      return id;
    },
    onSuccess: (deletedId) => {
      queryClient.invalidateQueries({ queryKey: ['salespeople'] });
      toast({
        title: 'Vendedor eliminado',
        description: 'El vendedor ha sido eliminado exitosamente.',
      });
      console.log('Salesperson deletion completed for ID:', deletedId);
    },
    onError: (error) => {
      console.error('Error deleting salesperson:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el vendedor.',
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
