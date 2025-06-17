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

  const { data, isLoading, error } = useQuery({
    queryKey: ['opportunities', page, searchTerm, status, sortBy, sortOrder],
    queryFn: async () => {
      if (!user) {
        return {
          opportunities: [],
          total: 0,
          page,
          totalPages: 0,
        };
      }

      try {
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

        const { data: opportunities, error: queryError, count } = await query;

        if (queryError) {
          throw queryError;
        }

        return {
          opportunities: opportunities as Opportunity[],
          total: count || 0,
          page,
          totalPages: Math.ceil((count || 0) / ITEMS_PER_PAGE),
        };
      } catch (error) {
        handleError(error, 'useOpportunityQueries');
        throw error;
      }
    },
    enabled: !!user,
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5, // 5 minutes
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
