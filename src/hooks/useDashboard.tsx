
import { useOpportunities } from './useOpportunities';
import { useCalls } from './useCalls';
import { useSalespeople } from './useSalespeople';
import { useLeadSourcesWithPersistence } from './useLeadSourcesWithPersistence';
import { useDashboardFilters } from './dashboard/useDashboardFilters';
import { useDashboardData } from './dashboard/useDashboardData';
import { useDashboardKpis } from './dashboard/useDashboardKpis';
import { useLeadSourceData } from './dashboard/useLeadSourceData';
import { useCallMetrics } from './dashboard/useCallMetrics';

export * from './dashboard/types';

export const useDashboard = () => {
  // Base data hooks
  const { opportunities, isLoading: opportunitiesLoading } = useOpportunities();
  const { calls: allCalls, isLoading: callsLoading } = useCalls();
  const { calls: metricsCall, isLoading: metricsCallsLoading } = useCalls(undefined, true);
  const { salespeople, isLoading: salespeopleLoading } = useSalespeople();
  const { leadSources, isLoading: leadSourcesLoading } = useLeadSourcesWithPersistence();

  // Filters management
  const {
    filters,
    availableMonths,
    setSelectedSalesperson,
    setSelectedMonth,
    setSelectedLeadSource,
    setPeriodType,
    setDateRange,
  } = useDashboardFilters(opportunities, allCalls);

  // Filtered data
  const { filteredOpportunities, filteredCalls } = useDashboardData(opportunities, allCalls, filters);

  // KPIs calculation
  const { kpis, kpiChanges } = useDashboardKpis(
    opportunities,
    allCalls,
    filteredOpportunities,
    filteredCalls,
    filters
  );

  // Lead source data
  const leadSourceData = useLeadSourceData(filteredOpportunities, leadSources);

  // Call metrics
  const callMetrics = useCallMetrics(filteredCalls);

  // Loading state
  const isLoading = opportunitiesLoading || callsLoading || metricsCallsLoading || salespeopleLoading || leadSourcesLoading;

  return {
    // Data
    opportunities: filteredOpportunities,
    calls: filteredCalls,
    salespeople,
    leadSources,
    
    // Loading states
    isLoading,
    
    // Filters
    selectedSalesperson: filters.selectedSalesperson,
    setSelectedSalesperson,
    selectedMonth: filters.selectedMonth,
    setSelectedMonth,
    selectedLeadSource: filters.selectedLeadSource,
    setSelectedLeadSource,
    availableMonths,
    periodType: filters.periodType,
    setPeriodType,
    dateRange: filters.dateRange,
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
