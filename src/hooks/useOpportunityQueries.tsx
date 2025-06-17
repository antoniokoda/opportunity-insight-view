
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { handleError } from '@/utils/errorUtils';
import type { Opportunity } from '@/types/opportunity';

const ITEMS_PER_PAGE = 10;

interface UseOpportunityQueriesOptions {
  page?: number;
  searchTerm?: string;
  status?: string;
  sortBy?: 'created_at' | 'updated_at' | 'name';
  sortOrder?: 'asc' | 'desc';
}

export const useOpportunityQueries = (options: UseOpportunityQueriesOptions = {}) => {
  const {
    page = 1,
    searchTerm = '',
    status,
    sortBy = 'created_at',
    sortOrder = 'desc',
  } = options;

  const { user } = useAuth();

  console.log('🔍 useOpportunityQueries: Starting with user:', !!user);

  const { data, isLoading, error } = useQuery({
    queryKey: ['opportunities', page, searchTerm, status, sortBy, sortOrder],
    queryFn: async () => {
      console.log('🔍 useOpportunityQueries: Query function called');
      
      if (!user) {
        console.log('🔍 useOpportunityQueries: No user, returning empty data');
        return {
          opportunities: [],
          total: 0,
          page,
          totalPages: 0,
        };
      }

      try {
        console.log('🔍 useOpportunityQueries: Starting Supabase query');
        
        let query = supabase
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
          `, { count: 'exact' });

        // Apply filters
        if (searchTerm) {
          query = query.ilike('name', `%${searchTerm}%`);
        }

        if (status) {
          query = query.eq('status', status);
        }

        // Apply sorting
        query = query.order(sortBy, { ascending: sortOrder === 'asc' });

        // Apply pagination
        const from = (page - 1) * ITEMS_PER_PAGE;
        const to = from + ITEMS_PER_PAGE - 1;
        query = query.range(from, to);

        console.log('🔍 useOpportunityQueries: Executing query');
        const { data: opportunities, error: queryError, count } = await query;

        if (queryError) {
          console.error('🔍 useOpportunityQueries: Query error:', queryError);
          throw queryError;
        }

        console.log('🔍 useOpportunityQueries: Query successful, count:', count);

        return {
          opportunities: opportunities as Opportunity[],
          total: count || 0,
          page,
          totalPages: Math.ceil((count || 0) / ITEMS_PER_PAGE),
        };
      } catch (error) {
        console.error('🔍 useOpportunityQueries: Catch block error:', error);
        handleError(error, 'useOpportunityQueries');
        throw error;
      }
    },
    enabled: !!user,
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  console.log('🔍 useOpportunityQueries: Returning data:', {
    opportunitiesCount: data?.opportunities?.length || 0,
    isLoading,
    hasError: !!error,
    error: error?.message
  });

  return {
    opportunities: data?.opportunities || [],
    total: data?.total || 0,
    page: data?.page || 1,
    totalPages: data?.totalPages || 0,
    isLoading,
    error,
  };
};
