
import { useMemo } from 'react';
import { format, subMonths } from 'date-fns';
import type { Opportunity } from '@/types/opportunity';
import type { Call } from '@/hooks/useCalls';
import type { DashboardKpis, KpiChanges, DashboardFilters } from './types';

export const useDashboardKpis = (
  opportunities: Opportunity[],
  allCalls: Call[],
  filteredOpportunities: Opportunity[],
  filteredCalls: Call[],
  filters: DashboardFilters
) => {
  // KPIs calculation
  const kpis: DashboardKpis = useMemo(() => {
    const wonOpportunities = filteredOpportunities.filter(opp => opp.opportunity_status === 'won');
    const totalRevenue = wonOpportunities.reduce((sum, opp) => sum + opp.revenue, 0);
    const potentialRevenue = filteredOpportunities.reduce((sum, opp) => sum + opp.revenue, 0);
    const totalCash = filteredOpportunities.reduce((sum, opp) => sum + opp.cash_collected, 0);
    const totalCalls = filteredCalls.length;
    const activeOpportunities = filteredOpportunities.filter(opp => opp.opportunity_status === 'active').length;

    const lostOpportunities = filteredOpportunities.filter(opp => opp.opportunity_status === 'lost');
    const closedOpportunities = wonOpportunities.length + lostOpportunities.length;

    const averageDealSize = wonOpportunities.length > 0 
      ? wonOpportunities.reduce((sum, opp) => sum + opp.revenue, 0) / wonOpportunities.length
      : 0;
    
    const closingRate = closedOpportunities > 0 
      ? (wonOpportunities.length / closedOpportunities) * 100
      : 0;
    
    const proposalsPitched = filteredOpportunities.filter(opp => opp.proposal_status === 'pitched').length;

    const now = new Date();
    const pastFilteredCalls = filteredCalls.filter(call => new Date(call.date) <= now);

    const attendedPastCalls = pastFilteredCalls.filter(call => call.attended === true).length;
    const overallShowUpRate = pastFilteredCalls.length > 0
      ? (attendedPastCalls / pastFilteredCalls.length) * 100
      : 0;

    const firstDiscoveryPastCalls = pastFilteredCalls.filter(call => call.type === 'Discovery 1');
    const attendedFirstDiscoveryPast = firstDiscoveryPastCalls.filter(call => call.attended === true).length;
    const firstDiscoveryShowUpRate = firstDiscoveryPastCalls.length > 0
      ? (attendedFirstDiscoveryPast / firstDiscoveryPastCalls.length) * 100
      : 0;

    return {
      totalRevenue,
      potentialRevenue,
      totalCash,
      totalCalls,
      activeOpportunities,
      averageDealSize,
      closingRate,
      proposalsPitched,
      overallShowUpRate,
      firstDiscoveryShowUpRate,
    };
  }, [filteredOpportunities, filteredCalls]);

  // KPI changes calculation
  const kpiChanges: KpiChanges = useMemo(() => {
    if (filters.selectedMonth === 'all') {
      return {
        revenueChange: null,
        cashChange: null,
        callsChange: null,
        averageDealSizeChange: null,
        closingRateChange: null,
        showUpRateChange: null,
        firstDiscoveryShowUpRateChange: null,
      };
    }

    const currentDate = new Date(filters.selectedMonth + '-01');
    const previousDate = subMonths(currentDate, 1);
    const previousMonth = format(previousDate, 'yyyy-MM');

    const previousOpportunities = opportunities.filter(opp => {
      const oppMonth = format(new Date(opp.created_at), 'yyyy-MM');
      if (oppMonth !== previousMonth) return false;
      
      if (filters.selectedSalesperson !== 'all' && opp.salesperson_id !== parseInt(filters.selectedSalesperson)) {
        return false;
      }
      if (filters.selectedLeadSource !== 'all' && opp.lead_source !== filters.selectedLeadSource) {
        return false;
      }
      return true;
    });

    const previousCalls = allCalls.filter(call => {
      const callMonth = format(new Date(call.date), 'yyyy-MM');
      if (callMonth !== previousMonth) return false;
      
      const opportunity = opportunities.find(opp => opp.id === call.opportunity_id);
      if (!opportunity) return false;
      
      if (filters.selectedSalesperson !== 'all' && opportunity.salesperson_id !== parseInt(filters.selectedSalesperson)) {
        return false;
      }
      if (filters.selectedLeadSource !== 'all' && opportunity.lead_source !== filters.selectedLeadSource) {
        return false;
      }
      return true;
    });

    const calculateChange = (current: number, previous: number) => {
      if (previous === 0) {
        return current > 0 ? 100 : 0;
      }
      return ((current - previous) / previous) * 100;
    };

    // Calculate previous metrics
    const previousRevenue = previousOpportunities.reduce((sum, opp) => sum + opp.revenue, 0);
    const previousCash = previousOpportunities.reduce((sum, opp) => sum + opp.cash_collected, 0);
    const previousCallsCount = previousCalls.length;

    return {
      revenueChange: calculateChange(kpis.totalRevenue, previousRevenue),
      cashChange: calculateChange(kpis.totalCash, previousCash),
      callsChange: calculateChange(kpis.totalCalls, previousCallsCount),
      averageDealSizeChange: null,
      closingRateChange: null,
      showUpRateChange: null,
      firstDiscoveryShowUpRateChange: null,
    };
  }, [opportunities, allCalls, filteredOpportunities, filteredCalls, filters, kpis]);

  return {
    kpis,
    kpiChanges,
  };
};
