
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

    const currentDate = new Date(selectedMonth + '-01');
    const previousDate = subMonths(currentDate, 1);
    const previousMonth = format(previousDate, 'yyyy-MM');

    const previousOpportunities = allOpportunities.filter(opp => {
      const oppMonth = format(new Date(opp.created_at), 'yyyy-MM');
      return oppMonth === previousMonth;
    });

    const previousCalls = allCalls.filter(call => {
      const callMonth = format(new Date(call.date), 'yyyy-MM');
      return callMonth === previousMonth;
    });

    // --- NUEVO: Filtrar llamadas pasadas en el mes actual y anterior ---
    const now = new Date();

    // Calls for the period and current filters (PAST calls only)
    const currentPastCalls = currentFilteredCalls.filter(call => new Date(call.date) <= now);
    const previousPastCalls = previousCalls.filter(call => new Date(call.date) <= now);

    // Métricas actuales
    const currentRevenue = currentFilteredOpportunities.reduce((sum, opp) => sum + opp.revenue, 0);
    const currentCash = currentFilteredOpportunities.reduce((sum, opp) => sum + opp.cash_collected, 0);
    const currentCallsCount = currentFilteredCalls.length;

    // Cierre, deal size, etc, igual
    const currentWonOpportunities = currentFilteredOpportunities.filter(opp => opp.opportunity_status === 'won');
    const currentLostOpportunities = currentFilteredOpportunities.filter(opp => opp.opportunity_status === 'lost');
    const currentClosedOpportunities = currentWonOpportunities.length + currentLostOpportunities.length;
    const currentClosingRate = currentClosedOpportunities > 0 ? (currentWonOpportunities.length / currentClosedOpportunities) * 100 : 0;

    const currentAverageDealSize = currentWonOpportunities.length > 0 
      ? currentWonOpportunities.reduce((sum, opp) => sum + opp.revenue, 0) / currentWonOpportunities.length
      : 0;

    // ---- Cambiar Show Up Rate ----
    const attendedCurrentPast = currentPastCalls.filter(call => call.attended === true).length;
    const currentShowUpRate = currentPastCalls.length > 0
      ? (attendedCurrentPast / currentPastCalls.length) * 100
      : 0;

    // ---- Cambiar First Discovery Show Up Rate ----
    const currentFirstDiscoveryPast = currentPastCalls.filter(call => call.type === 'Discovery 1');
    const attendedCurrentFirstDiscovery = currentFirstDiscoveryPast.filter(call => call.attended === true).length;
    const currentFirstDiscoveryShowUpRate = currentFirstDiscoveryPast.length > 0
      ? (attendedCurrentFirstDiscovery / currentFirstDiscoveryPast.length) * 100
      : 0;

    // --- Métricas anteriores ---
    const previousRevenue = previousOpportunities.reduce((sum, opp) => sum + opp.revenue, 0);
    const previousCash = previousOpportunities.reduce((sum, opp) => sum + opp.cash_collected, 0);
    const previousCallsCount = previousCalls.length;

    const previousWonOpportunities = previousOpportunities.filter(opp => opp.opportunity_status === 'won');
    const previousLostOpportunities = previousOpportunities.filter(opp => opp.opportunity_status === 'lost');
    const previousClosedOpportunities = previousWonOpportunities.length + previousLostOpportunities.length;
    const previousClosingRate = previousClosedOpportunities > 0 ? (previousWonOpportunities.length / previousClosedOpportunities) * 100 : 0;

    const previousAverageDealSize = previousWonOpportunities.length > 0 
      ? previousWonOpportunities.reduce((sum, opp) => sum + opp.revenue, 0) / previousWonOpportunities.length
      : 0;

    // --- NUEVO para show up y discovery en mes anterior ---
    const attendedPreviousPast = previousPastCalls.filter(call => call.attended === true).length;
    const previousShowUpRate = previousPastCalls.length > 0
      ? (attendedPreviousPast / previousPastCalls.length) * 100
      : 0;

    const previousFirstDiscoveryPast = previousPastCalls.filter(call => call.type === 'Discovery 1');
    const attendedPreviousFirstDiscovery = previousFirstDiscoveryPast.filter(call => call.attended === true).length;
    const previousFirstDiscoveryShowUpRate = previousFirstDiscoveryPast.length > 0
      ? (attendedPreviousFirstDiscovery / previousFirstDiscoveryPast.length) * 100
      : 0;

    // --- Cambios porcentuales (igual) ---
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

