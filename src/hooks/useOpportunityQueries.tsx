
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import type { Opportunity } from '@/types/opportunity';

export const useOpportunityQueries = () => {
  const { user } = useAuth();

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

  return {
    opportunities,
    isLoading,
    error,
  };
};
