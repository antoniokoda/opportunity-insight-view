
import { useMemo } from 'react';
import { format, subMonths } from 'date-fns';
import { Opportunity } from './useOpportunities';
import { Call } from './useCalls';

export const useDashboardKpiChanges = (
  allOpportunities: Opportunity[], 
  allCalls: Call[], 
  currentFilteredOpportunities: Opportunity[],
  currentFilteredCalls: Call[],
  selectedMonth: string
) => {
  return useMemo(() => {
    // If showing all data, can't calculate previous period changes
    if (selectedMonth === 'all') {
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

    // Calculate previous month
    const currentDate = new Date(selectedMonth + '-01');
    const previousDate = subMonths(currentDate, 1);
    const previousMonth = format(previousDate, 'yyyy-MM');

    // Filter opportunities and calls for previous month
    const previousOpportunities = allOpportunities.filter(opp => {
      const oppMonth = format(new Date(opp.created_at), 'yyyy-MM');
      return oppMonth === previousMonth;
    });

    const previousCalls = allCalls.filter(call => {
      const callMonth = format(new Date(call.date), 'yyyy-MM');
      return callMonth === previousMonth;
    });

    // Calculate current metrics
    const currentRevenue = currentFilteredOpportunities.reduce((sum, opp) => sum + opp.revenue, 0);
    const currentCash = currentFilteredOpportunities.reduce((sum, opp) => sum + opp.cash_collected, 0);
    const currentCallsCount = currentFilteredCalls.length;

    // Calculate current closing rate
    const currentWonOpportunities = currentFilteredOpportunities.filter(opp => opp.opportunity_status === 'won');
    const currentLostOpportunities = currentFilteredOpportunities.filter(opp => opp.opportunity_status === 'lost');
    const currentClosedOpportunities = currentWonOpportunities.length + currentLostOpportunities.length;
    const currentClosingRate = currentClosedOpportunities > 0 ? (currentWonOpportunities.length / currentClosedOpportunities) * 100 : 0;

    // Calculate current average deal size
    const currentAverageDealSize = currentWonOpportunities.length > 0 
      ? currentWonOpportunities.reduce((sum, opp) => sum + opp.revenue, 0) / currentWonOpportunities.length
      : 0;

    // Calculate current show-up rates
    const currentCallsForShowUp = currentFilteredCalls.filter(call => call.attended !== null);
    const currentAttendedCalls = currentFilteredCalls.filter(call => call.attended === true);
    const currentShowUpRate = currentCallsForShowUp.length > 0 ? (currentAttendedCalls.length / currentCallsForShowUp.length) * 100 : 0;

    const currentFirstDiscoveryCalls = currentFilteredCalls.filter(call => call.type === 'Discovery 1' && call.attended !== null);
    const currentFirstDiscoveryAttended = currentFilteredCalls.filter(call => call.type === 'Discovery 1' && call.attended === true);
    const currentFirstDiscoveryShowUpRate = currentFirstDiscoveryCalls.length > 0 ? (currentFirstDiscoveryAttended.length / currentFirstDiscoveryCalls.length) * 100 : 0;

    // Calculate previous metrics
    const previousRevenue = previousOpportunities.reduce((sum, opp) => sum + opp.revenue, 0);
    const previousCash = previousOpportunities.reduce((sum, opp) => sum + opp.cash_collected, 0);
    const previousCallsCount = previousCalls.length;

    // Calculate previous closing rate
    const previousWonOpportunities = previousOpportunities.filter(opp => opp.opportunity_status === 'won');
    const previousLostOpportunities = previousOpportunities.filter(opp => opp.opportunity_status === 'lost');
    const previousClosedOpportunities = previousWonOpportunities.length + previousLostOpportunities.length;
    const previousClosingRate = previousClosedOpportunities > 0 ? (previousWonOpportunities.length / previousClosedOpportunities) * 100 : 0;

    // Calculate previous average deal size
    const previousAverageDealSize = previousWonOpportunities.length > 0 
      ? previousWonOpportunities.reduce((sum, opp) => sum + opp.revenue, 0) / previousWonOpportunities.length
      : 0;

    // Calculate previous show-up rates
    const previousCallsForShowUp = previousCalls.filter(call => call.attended !== null);
    const previousAttendedCalls = previousCalls.filter(call => call.attended === true);
    const previousShowUpRate = previousCallsForShowUp.length > 0 ? (previousAttendedCalls.length / previousCallsForShowUp.length) * 100 : 0;

    const previousFirstDiscoveryCalls = previousCalls.filter(call => call.type === 'Discovery 1' && call.attended !== null);
    const previousFirstDiscoveryAttended = previousCalls.filter(call => call.type === 'Discovery 1' && call.attended === true);
    const previousFirstDiscoveryShowUpRate = previousFirstDiscoveryCalls.length > 0 ? (previousFirstDiscoveryAttended.length / previousFirstDiscoveryCalls.length) * 100 : 0;

    // Calculate percentage changes
    const calculateChange = (current: number, previous: number) => {
      if (previous === 0) {
        return current > 0 ? 100 : 0;
      }
      return ((current - previous) / previous) * 100;
    };

    return {
      revenueChange: calculateChange(currentRevenue, previousRevenue),
      cashChange: calculateChange(currentCash, previousCash),
      callsChange: calculateChange(currentCallsCount, previousCallsCount),
      averageDealSizeChange: calculateChange(currentAverageDealSize, previousAverageDealSize),
      closingRateChange: calculateChange(currentClosingRate, previousClosingRate),
      showUpRateChange: calculateChange(currentShowUpRate, previousShowUpRate),
      firstDiscoveryShowUpRateChange: calculateChange(currentFirstDiscoveryShowUpRate, previousFirstDiscoveryShowUpRate),
    };
  }, [allOpportunities, allCalls, currentFilteredOpportunities, currentFilteredCalls, selectedMonth]);
};
