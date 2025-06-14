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

const sanitizeError = (error: any) => {
  if (error && (error.message || typeof error === "string")) {
    if (
      String(error.message).toLowerCase().includes("supabase") ||
      String(error.message).toLowerCase().includes("sql") ||
      String(error.message).toLowerCase().includes("stack") ||
      String(error.message).toLowerCase().includes("column") ||
      String(error.message).toLowerCase().includes("trace")
    ) {
      return "Ocurrió un error inesperado. Por favor intenta de nuevo.";
    }
    return error.message || String(error);
  }
  return "Ocurrió un error inesperado. Por favor intenta de nuevo.";
};

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
      if (excludeFutureCalls) {
        query = query.lte('date', new Date().toISOString());
      }
      const { data, error } = await query;
      if (error) {
        if (import.meta.env.DEV) console.error('Error fetching calls:', error);
        throw error;
      }
      return data as Call[];
    },
    enabled: !!user,
    meta: {
      onError: (error: any) => {
        if (import.meta.env.DEV) console.error('Error fetching calls:', error);
      }
    }
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
      if (!user) throw new Error('Usuario no autenticado');
      // Input validation
      if (
        !newCall.type ||
        !newCall.date ||
        isNaN(Number(newCall.duration)) ||
        newCall.duration <= 0
      ) {
        throw new Error("Todos los campos de la llamada deben ser válidos.");
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
          attended: newCall.attended ?? null,
          link: newCall.link ?? null,
        }])
        .select()
        .single();

      if (error) {
        if (import.meta.env.DEV) console.error('Error adding call:', error);
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
    onError: (error: any) => {
      if (import.meta.env.DEV) console.error('Error adding call:', error);
      toast({
        title: 'Error',
        description: sanitizeError(error),
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
      if (!user) throw new Error('Usuario no autenticado');

      const { data, error } = await supabase
        .from('calls')
        .update(callData.updates)
        .eq('id', callData.id)
        .select()
        .single();

      if (error) {
        if (import.meta.env.DEV) console.error('Error updating call:', error);
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
    onError: (error: any) => {
      if (import.meta.env.DEV) console.error('Error updating call:', error);
      toast({
        title: 'Error',
        description: sanitizeError(error),
        variant: 'destructive',
      });
    },
  });

  const deleteCall = useMutation({
    mutationFn: async (id: number) => {
      if (!user) throw new Error('Usuario no autenticado');
      const { error } = await supabase
        .from('calls')
        .delete()
        .eq('id', id);

      if (error) {
        if (import.meta.env.DEV) console.error('Error deleting call:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calls'] });
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      toast({
        title: 'Llamada eliminada',
        description: 'La llamada ha sido eliminada exitosamente.',
      });
    },
    onError: (error: any) => {
      if (import.meta.env.DEV) console.error('Error deleting call:', error);
      toast({
        title: 'Error',
        description: sanitizeError(error),
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
    deleteCall: deleteCall.mutate,
    isDeleting: deleteCall.isPending,
  };
};
