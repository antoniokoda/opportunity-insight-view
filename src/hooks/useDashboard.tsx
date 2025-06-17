
import { useState, useMemo } from 'react';
import { format, subMonths, startOfDay, endOfDay, isWithinInterval, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import { useOpportunities } from './useOpportunities';
import { useCalls } from './useCalls';
import { useSalespeople } from './useSalespeople';
import { useLeadSourcesWithPersistence } from './useLeadSourcesWithPersistence';

export type PeriodType = 'days' | 'weeks' | 'months';

export interface DateRange {
  start: Date;
  end: Date;
}

export interface DashboardKpis {
  totalRevenue: number;
  potentialRevenue: number;
  totalCash: number;
  totalCalls: number;
  activeOpportunities: number;
  averageDealSize: number;
  closingRate: number;
  proposalsPitched: number;
  overallShowUpRate: number;
  firstDiscoveryShowUpRate: number;
}

export interface KpiChanges {
  revenueChange: number | null;
  cashChange: number | null;
  callsChange: number | null;
  averageDealSizeChange: number | null;
  closingRateChange: number | null;
  showUpRateChange: number | null;
  firstDiscoveryShowUpRateChange: number | null;
}

export interface ChartDataPoint {
  date: string;
  revenue: number;
  cash: number;
  calls: number;
}

export interface CallMetrics {
  callCounts: Record<string, number>;
  averageDurations: Record<string, number>;
  showUpRates: Record<string, number>;
}

export const useDashboard = () => {
  // Base data hooks
  const { opportunities, isLoading: opportunitiesLoading } = useOpportunities();
  const { calls: allCalls, isLoading: callsLoading } = useCalls();
  const { calls: metricsCall, isLoading: metricsCallsLoading } = useCalls(undefined, true);
  const { salespeople, isLoading: salespeopleLoading } = useSalespeople();
  const { leadSources, isLoading: leadSourcesLoading } = useLeadSourcesWithPersistence();

  // Filter states
  const [selectedSalesperson, setSelectedSalesperson] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedLeadSource, setSelectedLeadSource] = useState('all');
  const [periodType, setPeriodType] = useState<PeriodType>('days');
  const [dateRange, setDateRange] = useState<DateRange>({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    end: new Date()
  });

  // Loading state
  const isLoading = opportunitiesLoading || callsLoading || metricsCallsLoading || salespeopleLoading || leadSourcesLoading;

  // Available months for filter
  const availableMonths = useMemo(() => {
    if (!opportunities.length && !allCalls.length) return [{ value: 'all', label: 'Todos los meses' }];

    const monthsWithData = new Set<string>();
    
    opportunities.forEach(opp => {
      const month = format(new Date(opp.created_at), 'yyyy-MM');
      monthsWithData.add(month);
    });
    
    allCalls.forEach(call => {
      const month = format(new Date(call.date), 'yyyy-MM');
      monthsWithData.add(month);
    });

    const sortedMonths = Array.from(monthsWithData).sort().reverse();
    
    return [
      { value: 'all', label: 'Todos los meses' },
      ...sortedMonths.map(month => ({
        value: month,
        label: format(new Date(month + '-01'), 'MMMM yyyy', { locale: es })
      }))
    ];
  }, [opportunities, allCalls]);

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

    const previousOpportunities = opportunities.filter(opp => {
      const oppMonth = format(new Date(opp.created_at), 'yyyy-MM');
      if (oppMonth !== previousMonth) return false;
      
      if (selectedSalesperson !== 'all' && opp.salesperson_id !== parseInt(selectedSalesperson)) {
        return false;
      }
      if (selectedLeadSource !== 'all' && opp.lead_source !== selectedLeadSource) {
        return false;
      }
      return true;
    });

    const previousCalls = allCalls.filter(call => {
      const callMonth = format(new Date(call.date), 'yyyy-MM');
      if (callMonth !== previousMonth) return false;
      
      const opportunity = opportunities.find(opp => opp.id === call.opportunity_id);
      if (!opportunity) return false;
      
      if (selectedSalesperson !== 'all' && opportunity.salesperson_id !== parseInt(selectedSalesperson)) {
        return false;
      }
      if (selectedLeadSource !== 'all' && opportunity.lead_source !== selectedLeadSource) {
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
  }, [opportunities, allCalls, filteredOpportunities, filteredCalls, selectedMonth, selectedSalesperson, selectedLeadSource, kpis]);

  // Lead source data
  const leadSourceData = useMemo(() => {
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

  // Call metrics
  const callMetrics: CallMetrics = useMemo(() => {
    const callTypes = ['Discovery 1', 'Discovery 2', 'Discovery 3', 'Closing 1', 'Closing 2', 'Closing 3'];
    const callCounts: Record<string, number> = {};
    const totalDurations: Record<string, number> = {};
    const attendedCounts: Record<string, number> = {};
    const totalCounts: Record<string, number> = {};

    // Initialize
    callTypes.forEach(type => {
      callCounts[type] = 0;
      totalDurations[type] = 0;
      attendedCounts[type] = 0;
      totalCounts[type] = 0;
    });

    // Process calls
    const now = new Date();
    const pastCalls = filteredCalls.filter(call => new Date(call.date) <= now);

    pastCalls.forEach(call => {
      if (callTypes.includes(call.type)) {
        callCounts[call.type]++;
        totalDurations[call.type] += call.duration;
        totalCounts[call.type]++;
        
        if (call.attended === true) {
          attendedCounts[call.type]++;
        }
      }
    });

    // Calculate averages and rates
    const averageDurations: Record<string, number> = {};
    const showUpRates: Record<string, number> = {};

    callTypes.forEach(type => {
      averageDurations[type] = callCounts[type] > 0 ? totalDurations[type] / callCounts[type] : 0;
      showUpRates[type] = totalCounts[type] > 0 ? (attendedCounts[type] / totalCounts[type]) * 100 : 0;
    });

    return { callCounts, averageDurations, showUpRates };
  }, [filteredCalls]);

  return {
    // Data
    opportunities: filteredOpportunities,
    calls: filteredCalls,
    salespeople,
    leadSources,
    
    // Loading states
    isLoading,
    
    // Filters
    selectedSalesperson,
    setSelectedSalesperson,
    selectedMonth,
    setSelectedMonth,
    selectedLeadSource,
    setSelectedLeadSource,
    availableMonths,
    periodType,
    setPeriodType,
    dateRange,
    setDateRange,
    
    // Computed data
    kpis,
    kpiChanges,
    leadSourceData,
    callMetrics,
    
    // Derived data for backward compatibility
    customLeadSources: leadSources.map(ls => ls.name),
  };
};
