
import { useMemo } from 'react';
import { Opportunity } from './useOpportunities';

export const useLeadSourceData = (opportunities: Opportunity[], customLeadSources: string[]) => {
  return useMemo(() => {
    return customLeadSources.map(source => {
      const sourceOpps = opportunities.filter(opp => opp.lead_source === source);
      return {
        source,
        count: sourceOpps.length,
        revenue: sourceOpps.reduce((sum, opp) => sum + opp.revenue, 0),
      };
    });
  }, [opportunities, customLeadSources]);
};
