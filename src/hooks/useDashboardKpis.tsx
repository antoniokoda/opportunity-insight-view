
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

    // Calculate show-up rates - calls array already excludes future calls
    const totalCallsForShowUp = calls.filter(call => call.attended !== null).length;
    const attendedCalls = calls.filter(call => call.attended === true).length;
    const overallShowUpRate = totalCallsForShowUp > 0 ? (attendedCalls / totalCallsForShowUp) * 100 : 0;

    // First discovery show-up rate
    const firstDiscoveryCalls = calls.filter(call => 
      call.type === 'Discovery 1' && call.attended !== null
    );
    const firstDiscoveryAttended = calls.filter(call => 
      call.type === 'Discovery 1' && call.attended === true
    );
    const firstDiscoveryShowUpRate = firstDiscoveryCalls.length > 0 
      ? (firstDiscoveryAttended.length / firstDiscoveryCalls.length) * 100 
      : 0;

    return {
      totalRevenue,
      totalCash,
      totalCalls,
      activeOpportunities,
      averageDealSize,
      closingRate,
      proposalsPitched,
      overallShowUpRate,
      firstDiscoveryShowUpRate,
    };
  }, [filteredOpportunities, calls]);
};
