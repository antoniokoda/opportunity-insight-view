
import { useMemo } from 'react';
import type { Opportunity } from '@/types/opportunity';
import type { LeadSource } from '@/hooks/useLeadSourcesWithPersistence';

export const useLeadSourceData = (filteredOpportunities: Opportunity[], leadSources: LeadSource[]) => {
  return useMemo(() => {
    const customLeadSources = leadSources.map(ls => ls.name);
    const sourceMap = new Map<string, number>();
    
    // Initialize all lead sources
    customLeadSources.forEach(source => {
      sourceMap.set(source, 0);
    });
    
    // Count opportunities by lead source
    filteredOpportunities.forEach(opp => {
      const current = sourceMap.get(opp.lead_source) || 0;
      sourceMap.set(opp.lead_source, current + 1);
    });

    return Array.from(sourceMap.entries())
      .filter(([_, count]) => count > 0)
      .map(([name, value]) => ({
        name,
        value,
        fill: `hsl(${Math.random() * 360}, 70%, 50%)`
      }));
  }, [filteredOpportunities, leadSources]);
};
