
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

  return {
    salespeople,
    isLoading,
    error,
    addSalesperson: addSalesperson.mutate,
    isAdding: addSalesperson.isPending,
  };
};
