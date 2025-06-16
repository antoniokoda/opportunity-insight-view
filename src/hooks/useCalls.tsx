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

  console.log('🔍 CALLS DEBUG: Hook called', {
    hasUser: !!user,
    userId: user?.id,
    opportunityId,
    excludeFutureCalls
  });

  const { data: calls = [], isLoading, error } = useQuery({
    queryKey: ['calls', opportunityId, excludeFutureCalls],
    queryFn: async () => {
      console.log('🔍 CALLS DEBUG: Starting query...');
      
      if (!user) {
        console.log('🔍 CALLS DEBUG: No user, returning empty array');
        return [];
      }

      console.log('🔍 CALLS DEBUG: Fetching all calls (shared data model)');

      try {
        let query = supabase
          .from('calls')
          .select('*')
          .order('date', { ascending: false });

        if (opportunityId) {
          query = query.eq('opportunity_id', opportunityId);
          console.log('🔍 CALLS DEBUG: Filtering by opportunity:', opportunityId);
        }
        
        if (excludeFutureCalls) {
          query = query.lte('date', new Date().toISOString());
          console.log('🔍 CALLS DEBUG: Excluding future calls');
        }
        
        const { data, error } = await query;
        
        if (error) {
          console.error('🔍 CALLS DEBUG: Query error:', error);
          throw error;
        }

        console.log('🔍 CALLS DEBUG: Query successful', {
          resultCount: data?.length || 0,
          data: data
        });

        // Enhanced logging for link field verification
        if (data) {
          data.forEach(call => {
            console.log(`🔍 CALL LINK DEBUG - Call ${call.id}:`, {
              link: call.link,
              linkType: typeof call.link,
              linkLength: call.link ? call.link.length : 0
            });
          });
        }

        return data as Call[];
      } catch (queryError) {
        console.error('🔍 CALLS DEBUG: Query failed:', queryError);
        throw queryError;
      }
    },
    enabled: !!user,
    meta: {
      onError: (error: any) => {
        console.error('🔍 CALLS DEBUG: Query hook error:', error);
      }
    }
  });

  console.log('🔍 CALLS DEBUG: Hook result', {
    callsCount: calls?.length || 0,
    isLoading,
    hasError: !!error,
    error: error?.message
  });

  const addCall = useMutation({
    mutationFn: async (newCall: {
      opportunity_id: number;
      type: CallType;
      date: string;
      duration: number;
      attended?: boolean | null;
      link?: string | null;
    }) => {
      if (!user) throw new Error('Usuario no autenticado');
      
      console.log('🔍 ADD CALL DEBUG: Starting add call mutation');
      console.log('🔍 ADD CALL INPUT:', newCall);
      console.log('🔍 ADD CALL LINK:', {
        link: newCall.link,
        linkType: typeof newCall.link,
        linkLength: newCall.link ? newCall.link.length : 0
      });

      // Enhanced input validation
      if (
        !newCall.type ||
        !newCall.date ||
        isNaN(Number(newCall.duration)) ||
        newCall.duration < 0
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

      // Prepare the data for insertion with explicit link handling
      const insertData = {
        opportunity_id: newCall.opportunity_id,
        type: newCall.type,
        date: newCall.date,
        duration: newCall.duration,
        number: nextNumber,
        user_id: user.id,
        attended: newCall.attended ?? null,
        link: newCall.link || null, // Explicitly handle empty string as null
      };

      console.log('🔍 ADD CALL PREPARED DATA:', insertData);
      console.log('🔍 ADD CALL LINK FINAL:', {
        link: insertData.link,
        linkType: typeof insertData.link
      });

      const { data, error } = await supabase
        .from('calls')
        .insert([insertData])
        .select()
        .single();

      if (error) {
        console.error('🔍 ADD CALL ERROR:', error);
        throw error;
      }

      console.log('🔍 ADD CALL SUCCESS:', data);
      console.log('🔍 ADD CALL RETURNED LINK:', {
        link: data.link,
        linkType: typeof data.link
      });

      return data;
    },
    onSuccess: (data) => {
      console.log('🔍 ADD CALL SUCCESS CALLBACK:', data);
      queryClient.invalidateQueries({ queryKey: ['calls'] });
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      toast({
        title: 'Llamada agregada',
        description: 'La llamada ha sido agregada exitosamente.',
      });
    },
    onError: (error: any) => {
      console.error('🔍 ADD CALL ERROR CALLBACK:', error);
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

      console.log('🔍 UPDATE CALL DEBUG: Starting update call mutation');
      console.log('🔍 UPDATE CALL INPUT:', callData);
      console.log('🔍 UPDATE CALL LINK:', {
        link: callData.updates.link,
        linkType: typeof callData.updates.link
      });

      // Process updates with explicit link handling
      const processedUpdates = { ...callData.updates };
      if ('link' in processedUpdates) {
        // Convert empty string to null for database
        processedUpdates.link = processedUpdates.link || null;
      }

      console.log('🔍 UPDATE CALL PROCESSED:', processedUpdates);

      const { data, error } = await supabase
        .from('calls')
        .update(processedUpdates)
        .eq('id', callData.id)
        .select()
        .single();

      if (error) {
        console.error('🔍 UPDATE CALL ERROR:', error);
        throw error;
      }

      console.log('🔍 UPDATE CALL SUCCESS:', data);
      console.log('🔍 UPDATE CALL RETURNED LINK:', {
        link: data.link,
        linkType: typeof data.link
      });

      return data;
    },
    onSuccess: (data) => {
      console.log('🔍 UPDATE CALL SUCCESS CALLBACK:', data);
      queryClient.invalidateQueries({ queryKey: ['calls'] });
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      toast({
        title: 'Llamada actualizada',
        description: 'La llamada ha sido actualizada exitosamente.',
      });
    },
    onError: (error: any) => {
      console.error('🔍 UPDATE CALL ERROR CALLBACK:', error);
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
