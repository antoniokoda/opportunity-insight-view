
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface Opportunity {
  id: number;
  name: string;
  salesperson_id: number;
  lead_source: string;
  opportunity_status: 'active' | 'won' | 'lost';
  proposal_status: 'created' | 'pitched';
  revenue: number;
  cash_collected: number;
  user_id: string;
  created_at: string;
  calls?: Call[];
}

export interface Call {
  id: number;
  opportunity_id: number;
  type: 'Discovery' | 'Closing';
  number: number;
  date: string;
  duration: number;
  user_id: string;
  created_at: string;
}

export const useOpportunities = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: opportunities = [], isLoading, error } = useQuery({
    queryKey: ['opportunities', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      console.log('Fetching opportunities for user:', user.id);
      const { data, error } = await supabase
        .from('opportunities')
        .select(`
          *,
          calls (*)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching opportunities:', error);
        throw error;
      }

      console.log('Fetched opportunities:', data);
      return data as Opportunity[];
    },
    enabled: !!user,
  });

  const addOpportunity = useMutation({
    mutationFn: async (newOpportunity: {
      name: string;
      salesperson_id: number;
      lead_source: string;
      revenue: number;
    }) => {
      if (!user) throw new Error('User not authenticated');

      console.log('Adding opportunity:', newOpportunity);
      const { data, error } = await supabase
        .from('opportunities')
        .insert([{
          ...newOpportunity,
          user_id: user.id,
          opportunity_status: 'active' as const,
          proposal_status: 'created' as const,
          cash_collected: 0,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error adding opportunity:', error);
        throw error;
      }

      console.log('Added opportunity:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      toast({
        title: 'Oportunidad creada',
        description: 'La oportunidad ha sido creada exitosamente.',
      });
    },
    onError: (error) => {
      console.error('Error adding opportunity:', error);
      toast({
        title: 'Error',
        description: 'No se pudo crear la oportunidad.',
        variant: 'destructive',
      });
    },
  });

  const updateOpportunity = useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: number;
      updates: Partial<Opportunity>;
    }) => {
      console.log('Updating opportunity:', id, updates);
      const { data, error } = await supabase
        .from('opportunities')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating opportunity:', error);
        throw error;
      }

      console.log('Updated opportunity:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      toast({
        title: 'Oportunidad actualizada',
        description: 'La oportunidad ha sido actualizada exitosamente.',
      });
    },
    onError: (error) => {
      console.error('Error updating opportunity:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar la oportunidad.',
        variant: 'destructive',
      });
    },
  });

  return {
    opportunities,
    isLoading,
    error,
    addOpportunity: addOpportunity.mutate,
    updateOpportunity: updateOpportunity.mutate,
    isAdding: addOpportunity.isPending,
    isUpdating: updateOpportunity.isPending,
  };
};
