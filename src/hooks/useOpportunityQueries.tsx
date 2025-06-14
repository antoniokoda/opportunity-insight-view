
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import type { Opportunity } from '@/types/opportunity';

export const useOpportunityQueries = () => {
  const { user } = useAuth();

  console.log('🔍 OPPORTUNITIES DEBUG: Hook called', {
    hasUser: !!user,
    userId: user?.id,
    userEmail: user?.email
  });

  const { data: opportunities = [], isLoading, error } = useQuery({
    queryKey: ['opportunities', user?.id],
    queryFn: async () => {
      console.log('🔍 OPPORTUNITIES DEBUG: Starting query...');
      
      if (!user) {
        console.log('🔍 OPPORTUNITIES DEBUG: No user, returning empty array');
        return [];
      }

      console.log('🔍 OPPORTUNITIES DEBUG: Fetching opportunities for user:', user.id);

      try {
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
          console.error('🔍 OPPORTUNITIES DEBUG: Query error:', error);
          throw error;
        }

        console.log('🔍 OPPORTUNITIES DEBUG: Query successful', {
          resultCount: data?.length || 0,
          data: data
        });

        return data as Opportunity[];
      } catch (queryError) {
        console.error('🔍 OPPORTUNITIES DEBUG: Query failed:', queryError);
        throw queryError;
      }
    },
    enabled: !!user,
    meta: {
      onError: (error: any) => {
        console.error('🔍 OPPORTUNITIES DEBUG: Query hook error:', error);
      }
    }
  });

  console.log('🔍 OPPORTUNITIES DEBUG: Hook result', {
    opportunitiesCount: opportunities?.length || 0,
    isLoading,
    hasError: !!error,
    error: error?.message
  });

  return {
    opportunities,
    isLoading,
    error,
  };
};
