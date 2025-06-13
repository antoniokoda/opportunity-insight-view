
import { useMemo } from 'react';
import { Opportunity } from './useOpportunities';
import { Call } from './useCalls';

export const useDashboardKpis = (filteredOpportunities: Opportunity[], calls: Call[]) => {
  return useMemo(() => {
    const totalRevenue = filteredOpportunities.reduce((sum, opp) => sum + opp.revenue, 0);
    const totalCash = filteredOpportunities.reduce((sum, opp) => sum + opp.cash_collected, 0);
    const totalCalls = calls.length;
    const activeOpportunities = filteredOpportunities.filter(opp => opp.opportunity_status === 'active').length;
    
    const wonOpportunities = filteredOpportunities.filter(opp => opp.opportunity_status === 'won');
    const lostOpportunities = filteredOpportunities.filter(opp => opp.opportunity_status === 'lost');
    const closedOpportunities = wonOpportunities.length + lostOpportunities.length;
    
    const averageDealSize = wonOpportunities.length > 0 
      ? wonOpportunities.reduce((sum, opp) => sum + opp.revenue, 0) / wonOpportunities.length
      : 0;
    
    const closingRate = closedOpportunities > 0 
      ? (wonOpportunities.length / closedOpportunities) * 100
      : 0;
    
    const proposalsPitched = filteredOpportunities.filter(opp => opp.proposal_status === 'pitched').length;

    return {
      totalRevenue,
      totalCash,
      totalCalls,
      activeOpportunities,
      averageDealSize,
      closingRate,
      proposalsPitched,
    };
  }, [filteredOpportunities, calls]);
};
