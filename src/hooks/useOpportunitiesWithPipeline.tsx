
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import type { Call } from './useCalls';

export interface OpportunityWithPipeline {
  id: number;
  name: string;
  salesperson_id: number | null;
  revenue: number;
  cash_collected: number;
  user_id: string;
  proposal_status: string;
  lead_source: string;
  opportunity_status: string;
  created_at: string;
  pipeline_id: string | null;
  stage_id: string | null;
  last_interaction_at: string | null;
  pipeline_name: string | null;
  stage_name: string | null;
  stage_color: string | null;
  stage_order: number | null;
  stage_is_final: boolean | null;
  calls?: Call[];
}

export const useOpportunitiesWithPipeline = () => {
  const { user } = useAuth();

  const { data: opportunities = [], isLoading, error } = useQuery({
    queryKey: ['opportunities-with-pipeline'],
    queryFn: async () => {
      console.log('🔍 OPPORTUNITIES WITH PIPELINE DEBUG: Starting query...');
      
      if (!user) {
        console.log('🔍 OPPORTUNITIES WITH PIPELINE DEBUG: No user, returning empty array');
        return [];
      }

      try {
        // Fetch all opportunities with pipeline information (shared data model)
        const { data, error } = await supabase
          .from('opportunities_with_pipeline')
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
          console.error('🔍 OPPORTUNITIES WITH PIPELINE DEBUG: Query error:', error);
          throw error;
        }

        console.log('🔍 OPPORTUNITIES WITH PIPELINE DEBUG: Query successful', {
          resultCount: data?.length || 0,
          data: data
        });

        return data as OpportunityWithPipeline[];
      } catch (queryError) {
        console.error('🔍 OPPORTUNITIES WITH PIPELINE DEBUG: Query failed:', queryError);
        throw queryError;
      }
    },
    enabled: !!user,
    meta: {
      onError: (error: any) => {
        console.error('🔍 OPPORTUNITIES WITH PIPELINE DEBUG: Query hook error:', error);
      }
    }
  });

  console.log('🔍 OPPORTUNITIES WITH PIPELINE DEBUG: Hook result', {
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
