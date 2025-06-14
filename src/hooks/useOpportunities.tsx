
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { Call } from './useCalls';

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

const sanitizeError = (error: any) => {
  // If error is user-facing, return only safe info
  if (error && (error.message || typeof error === "string")) {
    // Avoid leaking error.stack, sql, details etc.
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
        if (import.meta.env.DEV) console.error('Error fetching opportunities:', error);
        throw error;
      }
      return data as Opportunity[];
    },
    enabled: !!user,
    meta: {
      onError: (error: any) => {
        if (import.meta.env.DEV) console.error('Error fetching opportunities:', error);
      }
    }
  });

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

  // Modified addOpportunity function to accept custom callbacks
  const addOpportunityWithCallbacks = (
    newOpportunity: {
      name: string;
      salesperson_id: number;
      lead_source: string;
      revenue: number;
      cash_collected: number;
    },
    callbacks?: {
      onSuccess?: (opportunity: Opportunity) => void;
      onError?: (error: any) => void;
    }
  ) => {
    return addOpportunity.mutate(newOpportunity, {
      onSuccess: (data) => {
        // Call the default success handler first
        addOpportunity.options?.onSuccess?.(data, newOpportunity, undefined);
        // Then call the custom callback if provided
        callbacks?.onSuccess?.(data);
      },
      onError: (error) => {
        // Call the default error handler first
        addOpportunity.options?.onError?.(error, newOpportunity, undefined);
        // Then call the custom callback if provided
        callbacks?.onError?.(error);
      }
    });
  };

  return {
    opportunities,
    isLoading,
    error,
    addOpportunity: addOpportunityWithCallbacks,
    updateOpportunity: updateOpportunity.mutate,
    deleteOpportunity: deleteOpportunity.mutate,
    isAdding: addOpportunity.isPending,
    isUpdating: updateOpportunity.isPending,
    isDeleting: deleteOpportunity.isPending,
  };
};
