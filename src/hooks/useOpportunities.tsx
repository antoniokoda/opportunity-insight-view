import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { Call, CallType } from './useCalls';

export interface Opportunity {
  id: number;
  name: string;
  salesperson_id: number;
  revenue: number;
  cash_collected: number;
  user_id: string;
  proposal_status: string;
  lead_source: string;
  opportunity_status: string;
  created_at: string;
  calls?: Call[];
}

export const useOpportunities = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: opportunities = [], isLoading, error } = useQuery({
    queryKey: ['opportunities', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('opportunities')
        .select(`
          *,
          calls (
            id,
            opportunity_id,
            type,
            number,
            date,
            duration,
            attended,
            user_id,
            created_at
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching opportunities:', error);
        throw error;
      }

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
      cash_collected: number;
    }) => {
      if (!user) throw new Error('User not authenticated');

      if (!newOpportunity.name.trim() || !newOpportunity.lead_source.trim()) {
        throw new Error("Opportunity name and lead source are required.");
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
        console.error('Error adding opportunity:', error);
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
    onError: (error) => {
      console.error('Error adding opportunity:', error);
      toast({
        title: 'Error',
        description: error.message || 'No se pudo agregar la oportunidad.',
        variant: 'destructive',
      });
    },
  });

  const updateOpportunity = useMutation({
    mutationFn: async ({ id, updates }: { 
      id: number; 
      updates: Partial<Omit<Opportunity, 'id' | 'user_id' | 'created_at' | 'calls'>>
    }) => {
      if (updates.name !== undefined && !updates.name.trim()) {
        throw new Error("Opportunity name cannot be empty.");
      }
      if (updates.lead_source !== undefined && !updates.lead_source.trim()) {
        throw new Error("Lead source cannot be empty.");
      }

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
        description: error.message || 'No se pudo actualizar la oportunidad.',
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
        console.error('Error deleting opportunity:', error);
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
    onError: (error) => {
      console.error('Error deleting opportunity:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar la oportunidad.',
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
    deleteOpportunity: deleteOpportunity.mutate,
    isAdding: addOpportunity.isPending,
    isUpdating: updateOpportunity.isPending,
    isDeleting: deleteOpportunity.isPending,
  };
};
