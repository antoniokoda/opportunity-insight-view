
import { useMemo } from 'react';
import { format } from 'date-fns';
import type { Opportunity } from '@/types/opportunity';
import type { Call } from '@/hooks/useCalls';
import type { DashboardFilters } from './types';

export const useDashboardData = (
  opportunities: Opportunity[], 
  allCalls: Call[], 
  filters: DashboardFilters
) => {
  const { selectedSalesperson, selectedMonth, selectedLeadSource } = filters;

  // Filtered data
  const { filteredOpportunities, filteredCalls } = useMemo(() => {
    const filteredOpps = opportunities.filter(opp => {
      if (selectedSalesperson !== 'all' && opp.salesperson_id !== parseInt(selectedSalesperson)) {
        return false;
      }
      if (selectedLeadSource !== 'all' && opp.lead_source !== selectedLeadSource) {
        return false;
      }
      if (selectedMonth !== 'all') {
        const oppMonth = format(new Date(opp.created_at), 'yyyy-MM');
        if (oppMonth !== selectedMonth) {
          return false;
        }
      }
      return true;
    });

    const filteredCallsData = allCalls.filter(call => {
      const opportunity = opportunities.find(opp => opp.id === call.opportunity_id);
      if (!opportunity) return false;
      
      if (selectedSalesperson !== 'all' && opportunity.salesperson_id !== parseInt(selectedSalesperson)) {
        return false;
      }
      if (selectedLeadSource !== 'all' && opportunity.lead_source !== selectedLeadSource) {
        return false;
      }
      if (selectedMonth !== 'all') {
        const callMonth = format(new Date(call.date), 'yyyy-MM');
        if (callMonth !== selectedMonth) {
          return false;
        }
      }
      return true;
    });

    return { filteredOpportunities: filteredOpps, filteredCalls: filteredCallsData };
  }, [opportunities, allCalls, selectedSalesperson, selectedLeadSource, selectedMonth]);

  return {
    filteredOpportunities,
    filteredCalls,
  };
};
