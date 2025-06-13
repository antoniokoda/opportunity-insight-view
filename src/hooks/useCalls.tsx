
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

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

export const useCalls = (opportunityId?: number) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: calls = [], isLoading, error } = useQuery({
    queryKey: ['calls', user?.id, opportunityId],
    queryFn: async () => {
      if (!user) return [];
      
      console.log('Fetching calls for user:', user.id, 'opportunity:', opportunityId);
      let query = supabase
        .from('calls')
        .select('*')
        .order('date', { ascending: false });

      if (opportunityId) {
        query = query.eq('opportunity_id', opportunityId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching calls:', error);
        throw error;
      }

      console.log('Fetched calls:', data);
      return data as Call[];
    },
    enabled: !!user,
  });

  const addCall = useMutation({
    mutationFn: async (newCall: {
      opportunity_id: number;
      type: 'Discovery' | 'Closing';
      date: string;
      duration: number;
    }) => {
      if (!user) throw new Error('User not authenticated');

      // Get the next call number for this opportunity
      const { data: existingCalls } = await supabase
        .from('calls')
        .select('number')
        .eq('opportunity_id', newCall.opportunity_id)
        .order('number', { ascending: false })
        .limit(1);

      const nextNumber = existingCalls && existingCalls.length > 0 
        ? (existingCalls[0] as any).number + 1 
        : 1;

      console.log('Adding call:', { ...newCall, number: nextNumber });
      const { data, error } = await supabase
        .from('calls')
        .insert([{
          ...newCall,
          number: nextNumber,
          user_id: user.id,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error adding call:', error);
        throw error;
      }

      console.log('Added call:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calls'] });
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      toast({
        title: 'Llamada agregada',
        description: 'La llamada ha sido agregada exitosamente.',
      });
    },
    onError: (error) => {
      console.error('Error adding call:', error);
      toast({
        title: 'Error',
        description: 'No se pudo agregar la llamada.',
        variant: 'destructive',
      });
    },
  });

  return {
    calls,
    isLoading,
    error,
    addCall: addCall.mutate,
    isAdding: addCall.isPending,
  };
};
