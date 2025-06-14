
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { sanitizeError } from '@/utils/errorUtils';
import type { Opportunity } from '@/types/opportunity';

export const useOpportunityMutations = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addOpportunity = useMutation({
    mutationFn: async (newOpportunity: {
      name: string;
      salesperson_id: number;
      lead_source: string;
      revenue: number;
      cash_collected: number;
    }) => {
      if (!user) throw new Error('Usuario no autenticado');

      // Sanitize and strengthen validation
      if (
        typeof newOpportunity.name !== "string" ||
        !newOpportunity.name.trim() ||
        typeof newOpportunity.lead_source !== "string" ||
        !newOpportunity.lead_source.trim() ||
        isNaN(Number(newOpportunity.salesperson_id)) ||
        isNaN(Number(newOpportunity.revenue)) ||
        isNaN(Number(newOpportunity.cash_collected))
      ) {
        throw new Error("Todos los campos son requeridos y deben ser válidos.");
      }

      const { data, error } = await supabase
        .from('opportunities')
        .insert([{
          ...newOpportunity,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) {
        if (import.meta.env.DEV) console.error('Error adding opportunity:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      toast({
        title: 'Oportunidad agregada',
        description: 'La oportunidad ha sido agregada exitosamente.',
      });
    },
    onError: (error: any) => {
      if (import.meta.env.DEV) console.error('Error adding opportunity:', error);
      toast({
        title: 'Error',
        description: sanitizeError(error),
        variant: 'destructive',
      });
    },
  });

  const updateOpportunity = useMutation({
    mutationFn: async ({ id, updates }: { 
      id: number; 
      updates: Partial<Omit<Opportunity, 'id' | 'user_id' | 'created_at' | 'calls'>>
    }) => {
      if (updates.name !== undefined && (!updates.name || !String(updates.name).trim())) {
        throw new Error("El nombre de la oportunidad no puede estar vacío.");
      }
      if (updates.lead_source !== undefined && (!updates.lead_source || !String(updates.lead_source).trim())) {
        throw new Error("La fuente de lead no puede estar vacía.");
      }

      const { data, error } = await supabase
        .from('opportunities')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        if (import.meta.env.DEV) console.error('Error updating opportunity:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      toast({
        title: 'Oportunidad actualizada',
        description: 'La oportunidad ha sido actualizada exitosamente.',
      });
    },
    onError: (error: any) => {
      if (import.meta.env.DEV) console.error('Error updating opportunity:', error);
      toast({
        title: 'Error',
        description: sanitizeError(error),
        variant: 'destructive',
      });
    },
  });

  const deleteOpportunity = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from('opportunities')
        .delete()
        .eq('id', id);

      if (error) {
        if (import.meta.env.DEV) console.error('Error deleting opportunity:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      toast({
        title: 'Oportunidad eliminada',
        description: 'La oportunidad ha sido eliminada exitosamente.',
      });
    },
    onError: (error: any) => {
      if (import.meta.env.DEV) console.error('Error deleting opportunity:', error);
      toast({
        title: 'Error',
        description: sanitizeError(error),
        variant: 'destructive',
      });
    },
  });

  return {
    addOpportunity: addOpportunity.mutateAsync,
    updateOpportunity: updateOpportunity.mutate,
    deleteOpportunity: deleteOpportunity.mutate,
    isAdding: addOpportunity.isPending,
    isUpdating: updateOpportunity.isPending,
    isDeleting: deleteOpportunity.isPending,
  };
};
