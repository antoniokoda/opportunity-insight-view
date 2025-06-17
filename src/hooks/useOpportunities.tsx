
import { useOpportunityQueries } from './useOpportunityQueries';
import { useOpportunityMutations } from './useOpportunityMutations';

export const useOpportunities = () => {
  const { opportunities, isLoading, error } = useOpportunityQueries();
  const mutations = useOpportunityMutations();

  return {
    opportunities,
    isLoading,
    error,
    ...mutations,
  };
};
