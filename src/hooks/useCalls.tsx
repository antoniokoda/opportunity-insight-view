import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export type CallType = 'Discovery 1' | 'Discovery 2' | 'Discovery 3' | 'Closing 1' | 'Closing 2' | 'Closing 3';

export interface Call {
  id: number;
  opportunity_id: number;
  type: CallType;
  number: number;
  date: string;
  duration: number;
  attended: boolean | null;
  link: string | null;
  user_id: string;
  created_at: string;
}

export const useCalls = (opportunityId?: number, excludeFutureCalls: boolean = false) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: calls = [], isLoading, error } = useQuery({
    queryKey: ['calls', user?.id, opportunityId, excludeFutureCalls],
    queryFn: async () => {
      if (!user) return [];
      
      let query = supabase
        .from('calls')
        .select('*')
        .order('date', { ascending: false });

      if (opportunityId) {
        query = query.eq('opportunity_id', opportunityId);
      }

      // Add filter to exclude future calls when calculating metrics
      if (excludeFutureCalls) {
        query = query.lte('date', new Date().toISOString());
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching calls:', error);
        throw error;
      }

      return data as Call[];
    },
    enabled: !!user,
  });

  const addCall = useMutation({
    mutationFn: async (newCall: {
      opportunity_id: number;
      type: CallType;
      date: string;
      duration: number;
      attended?: boolean | null;
      link?: string;
    }) => {
      if (!user) throw new Error('User not authenticated');

      if (!newCall.type || !newCall.date) {
        throw new Error("Call type and date are required.");
      }
      if (newCall.duration <= 0) {
        throw new Error("Duration must be a positive number.");
      }

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

      const { data, error } = await supabase
        .from('calls')
        .insert([{
          ...newCall,
          number: nextNumber,
          user_id: user.id,
          attended: newCall.attended || null,
          link: newCall.link || null,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error adding call:', error);
        throw error;
      }

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
        description: error.message || 'No se pudo agregar la llamada.',
        variant: 'destructive',
      });
    },
  });

  const updateCall = useMutation({
    mutationFn: async (callData: {
      id: number;
      updates: {
        type?: CallType;
        date?: string;
        duration?: number;
        attended?: boolean | null;
        link?: string | null;
      };
    }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('calls')
        .update(callData.updates)
        .eq('id', callData.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating call:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calls'] });
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      toast({
        title: 'Llamada actualizada',
        description: 'La llamada ha sido actualizada exitosamente.',
      });
    },
    onError: (error) => {
      console.error('Error updating call:', error);
      toast({
        title: 'Error',
        description: error.message || 'No se pudo actualizar la llamada.',
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
    updateCall: updateCall.mutate,
    isUpdating: updateCall.isPending,
  };
};
