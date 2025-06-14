
import React, { useState } from 'react';
import { DashboardKpis } from '@/components/dashboard/DashboardKpis';
import { DashboardCharts } from '@/components/dashboard/DashboardCharts';
import { DashboardFilters } from '@/components/dashboard/DashboardFilters';
import { CallDetails } from '@/components/dashboard/CallDetails';
import { SalespersonManager } from '@/components/SalespersonManager';
import { LeadSourceManager } from '@/components/LeadSourceManager';
import { useOpportunities } from '@/hooks/useOpportunities';
import { useCalls } from '@/hooks/useCalls';
import { useSalespeople } from '@/hooks/useSalespeople';
import { useLeadSourcesWithPersistence } from '@/hooks/useLeadSourcesWithPersistence';
import { useDashboardFilters } from '@/hooks/useDashboardFilters';
import { useDashboardKpis } from '@/hooks/useDashboardKpis';
import { useDashboardChartData } from '@/hooks/useDashboardChartData';
import { useLeadSourceData } from '@/hooks/useLeadSourceData';
import { useDetailedCallMetrics } from '@/hooks/useDetailedCallMetrics';
import { useDashboardKpiChanges } from '@/hooks/useDashboardKpiChanges';
import { usePeriodFilter } from '@/hooks/usePeriodFilter';
import { useAuth } from '@/hooks/useAuth';

export const Dashboard = () => {
  const { user, session, loading: authLoading } = useAuth();
  
  // Dashboard debug logging
  console.log('🔍 DASHBOARD DEBUG: Component rendered', {
    hasUser: !!user,
    userId: user?.id,
    userEmail: user?.email,
    hasSession: !!session,
    authLoading
  });

  const { opportunities, isLoading: opportunitiesLoading } = useOpportunities();
  const { calls: allCalls, isLoading: callsLoading } = useCalls();
  // Get calls excluding future ones for metrics calculations
  const { calls: metricsCall, isLoading: metricsCallsLoading } = useCalls(undefined, true);
  
  const { 
    salespeople, 
    isLoading: salespeopleLoading
  } = useSalespeople();
  
  const { 
    leadSources,
    isLoading: leadSourcesLoading 
  } = useLeadSourcesWithPersistence();

  // Debug logging for data hooks
  console.log('🔍 DASHBOARD DEBUG: Data hooks state', {
    opportunities: {
      count: opportunities?.length || 0,
      loading: opportunitiesLoading
    },
    calls: {
      allCallsCount: allCalls?.length || 0,
      metricsCallsCount: metricsCall?.length || 0,
      loading: callsLoading || metricsCallsLoading
    },
    salespeople: {
      count: salespeople?.length || 0,
      loading: salespeopleLoading
    },
    leadSources: {
      count: leadSources?.length || 0,
      loading: leadSourcesLoading
    }
  });

  // Chart visibility state
  const [visibleMetrics, setVisibleMetrics] = useState({
    revenue: true,
    cash: true,
    calls: true,
  });

  // Nuevo hook para manejar período y rango de fechas
  const { periodType, setPeriodType, dateRange, setDateRange } = usePeriodFilter();

  // Use all calls for filtering but metrics calls for KPI calculations
  const {
    selectedSalesperson,
    setSelectedSalesperson,
    selectedMonth,
    setSelectedMonth,
    selectedLeadSource,
    setSelectedLeadSource,
    availableMonths,
    filteredOpportunities,
  } = useDashboardFilters(opportunities, allCalls);

  // Use metrics calls (excluding future) for KPI calculations
  const kpis = useDashboardKpis(filteredOpportunities, metricsCall);
  
  // Create custom lead sources from the persistent lead sources for backward compatibility
  const customLeadSources = leadSources.map(ls => ls.name);
  const leadSourceData = useLeadSourceData(filteredOpportunities, customLeadSources);
  
  // Get detailed call metrics for the filtered calls
  const filteredCalls = metricsCall.filter(call => {
    // Apply the same filters as opportunities
    const opportunity = opportunities.find(opp => opp.id === call.opportunity_id);
    if (!opportunity) return false;
    
    if (selectedSalesperson !== 'all' && opportunity.salesperson_id !== parseInt(selectedSalesperson)) {
      return false;
    }
    if (selectedLeadSource !== 'all' && opportunity.lead_source !== selectedLeadSource) {
      return false;
    }
    if (selectedMonth !== 'all') {
      const callMonth = new Date(call.date).toISOString().slice(0, 7);
      if (callMonth !== selectedMonth) {
        return false;
      }
    }
    return true;
  });
  
  const detailedCallMetrics = useDetailedCallMetrics(filteredCalls);

  // Add the new KPI changes hook
  const kpiChanges = useDashboardKpiChanges(
    opportunities, 
    allCalls, 
    filteredOpportunities, 
    filteredCalls, 
    selectedMonth
  );

  // Debug logging for filtered data
  console.log('🔍 DASHBOARD DEBUG: Filtered data', {
    filteredOpportunities: filteredOpportunities?.length || 0,
    filteredCalls: filteredCalls?.length || 0,
    filters: {
      selectedSalesperson,
      selectedMonth,
      selectedLeadSource
    }
  });

  if (authLoading) {
    console.log('🔍 DASHBOARD DEBUG: Auth still loading...');
    return (
      <div className="space-y-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-zinc-200 rounded-xl w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-zinc-200 rounded-2xl"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-96 bg-zinc-200 rounded-2xl"></div>
            <div className="h-96 bg-zinc-200 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('🔍 DASHBOARD DEBUG: No user found, this should redirect to login');
    return null;
  }

  if (opportunitiesLoading || callsLoading || metricsCallsLoading || salespeopleLoading || leadSourcesLoading) {
    console.log('🔍 DASHBOARD DEBUG: Data still loading...');
    return (
      <div className="space-y-8">
        <div className="animate-pulse space-y-8">
          {/* Loading skeleton con mejor contraste */}
          <div className="h-8 bg-zinc-200 rounded-xl w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-zinc-200 rounded-2xl"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-96 bg-zinc-200 rounded-2xl"></div>
            <div className="h-96 bg-zinc-200 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  console.log('🔍 DASHBOARD DEBUG: Rendering dashboard with data');

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-start">
        <div>
          {/* Título principal con color primario para máximo contraste - Tarea 1.2 */}
          <h1 className="text-4xl font-bold text-zinc-900 tracking-tight mb-2">Dashboard</h1>
          {/* Subtítulo con color secundario legible - Tarea 1.2 */}
          <p className="text-lg text-zinc-600 font-medium">
            Vista general de tu rendimiento de ventas
          </p>
        </div>
      </div>

      <DashboardFilters
        selectedSalesperson={selectedSalesperson}
        setSelectedSalesperson={setSelectedSalesperson}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        selectedLeadSource={selectedLeadSource}
        setSelectedLeadSource={setSelectedLeadSource}
        availableMonths={availableMonths}
        salespeople={salespeople}
        customLeadSources={customLeadSources}
      />

      <DashboardKpis kpis={kpis} kpiChanges={kpiChanges} />

      {/* Separador sutil entre secciones principales - Tarea 2.2 */}
      <div className="border-t border-zinc-200 pt-10">
        <DashboardCharts 
          leadSourceData={leadSourceData}
        />
      </div>

      {/* Management section */}
      <div className="border-t border-zinc-200 pt-10">
        <h2 className="text-2xl font-bold text-zinc-900 mb-6">Gestión</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SalespersonManager />
          <LeadSourceManager />
        </div>
      </div>

      {/* Otro separador sutil para la sección de llamadas - Tarea 2.2 */}
      <div className="border-t border-zinc-200 pt-10">
        <CallDetails 
          callCounts={detailedCallMetrics.callCounts}
          averageDurations={detailedCallMetrics.averageDurations}
          showUpRates={detailedCallMetrics.showUpRates}
        />
      </div>
    </div>
  );
};
