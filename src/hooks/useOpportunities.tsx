
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
      
      console.log('Fetching opportunities for user:', user.id);
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
        .eq('user_id', user.id)
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
      cash_collected: number;
    }) => {
      if (!user) throw new Error('User not authenticated');

      console.log('Adding opportunity:', newOpportunity);
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

      console.log('Added opportunity:', data);
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
        description: 'No se pudo agregar la oportunidad.',
        variant: 'destructive',
      });
    },
  });

  const updateOpportunity = useMutation({
    mutationFn: async ({ id, updates }: { 
      id: number; 
      updates: Partial<Omit<Opportunity, 'id' | 'user_id' | 'created_at' | 'calls'>>
    }) => {
      console.log('Updating opportunity:', id, updates);
      const { data, error } = await supabase
        .from('opportunities')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user?.id)
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

  const deleteOpportunity = useMutation({
    mutationFn: async (id: number) => {
      console.log('Deleting opportunity:', id);
      const { error } = await supabase
        .from('opportunities')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) {
        console.error('Error deleting opportunity:', error);
        throw error;
      }

      console.log('Deleted opportunity:', id);
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
