import React, { useState } from 'react';
import { DashboardKpis } from '@/components/dashboard/DashboardKpis';
import { DashboardCharts } from '@/components/dashboard/DashboardCharts';
import { DashboardFilters } from '@/components/dashboard/DashboardFilters';
import { CallDetails } from '@/components/dashboard/CallDetails';
import { useOpportunities } from '@/hooks/useOpportunities';
import { useCalls } from '@/hooks/useCalls';
import { useSalespeople } from '@/hooks/useSalespeople';
import { useLeadSources } from '@/hooks/useLeadSources';
import { useDashboardFilters } from '@/hooks/useDashboardFilters';
import { useDashboardKpis } from '@/hooks/useDashboardKpis';
import { useDashboardChartData } from '@/hooks/useDashboardChartData';
import { useLeadSourceData } from '@/hooks/useLeadSourceData';
import { useDetailedCallMetrics } from '@/hooks/useDetailedCallMetrics';

export const Dashboard = () => {
  const { opportunities, isLoading: opportunitiesLoading } = useOpportunities();
  const { calls: allCalls, isLoading: callsLoading } = useCalls();
  // Get calls excluding future ones for metrics calculations
  const { calls: metricsCall, isLoading: metricsCallsLoading } = useCalls(undefined, true);
  
  const { 
    salespeople, 
    isLoading: salespeopleLoading, 
    addSalesperson, 
    updateSalesperson, 
    deleteSalesperson,
    isAdding 
  } = useSalespeople();
  
  const { 
    customLeadSources, 
    addLeadSource, 
    updateLeadSource, 
    deleteLeadSource 
  } = useLeadSources();

  const [newSalesperson, setNewSalesperson] = useState({ name: '', email: '' });
  const [newLeadSource, setNewLeadSource] = useState('');
  const [showSalespersonDialog, setShowSalespersonDialog] = useState(false);
  const [showLeadSourceDialog, setShowLeadSourceDialog] = useState(false);

  // Chart visibility state
  const [visibleMetrics, setVisibleMetrics] = useState({
    revenue: true,
    cash: true,
    calls: true,
  });

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
  const chartData = useDashboardChartData();
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

  const handleAddSalesperson = () => {
    if (newSalesperson.name && newSalesperson.email) {
      addSalesperson(newSalesperson);
      setNewSalesperson({ name: '', email: '' });
      setShowSalespersonDialog(false);
    }
  };

  const handleAddLeadSource = () => {
    if (newLeadSource.trim()) {
      addLeadSource(newLeadSource.trim());
      setNewLeadSource('');
      setShowLeadSourceDialog(false);
    }
  };

  const handleUpdateSalesperson = (id: string, newName: string) => {
    const salesperson = salespeople.find(s => s.id.toString() === id);
    if (salesperson) {
      updateSalesperson({
        id: parseInt(id),
        name: newName,
        email: salesperson.email
      });
    }
  };

  const handleDeleteSalesperson = (id: string) => {
    deleteSalesperson(parseInt(id));
    // Si el vendedor eliminado estaba seleccionado, cambiar a "all"
    if (selectedSalesperson === id) {
      setSelectedSalesperson('all');
    }
  };

  const handleUpdateLeadSource = (oldSource: string, newSource: string) => {
    updateLeadSource(oldSource, newSource);
    // Si la fuente editada estaba seleccionada, actualizar la selección
    if (selectedLeadSource === oldSource) {
      setSelectedLeadSource(newSource);
    }
  };

  const handleDeleteLeadSource = (source: string) => {
    deleteLeadSource(source);
    // Si la fuente eliminada estaba seleccionada, cambiar a "all"
    if (selectedLeadSource === source) {
      setSelectedLeadSource('all');
    }
  };

  if (opportunitiesLoading || callsLoading || metricsCallsLoading || salespeopleLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-80 bg-gray-200 rounded"></div>
            <div className="h-80 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
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
        newSalesperson={newSalesperson}
        setNewSalesperson={setNewSalesperson}
        newLeadSource={newLeadSource}
        setNewLeadSource={setNewLeadSource}
        showSalespersonDialog={showSalespersonDialog}
        setShowSalespersonDialog={setShowSalespersonDialog}
        showLeadSourceDialog={showLeadSourceDialog}
        setShowLeadSourceDialog={setShowLeadSourceDialog}
        handleAddSalesperson={handleAddSalesperson}
        handleAddLeadSource={handleAddLeadSource}
        handleDeleteLeadSource={handleDeleteLeadSource}
        handleUpdateSalesperson={handleUpdateSalesperson}
        handleDeleteSalesperson={handleDeleteSalesperson}
        handleUpdateLeadSource={handleUpdateLeadSource}
        isAdding={isAdding}
      />

      <DashboardKpis kpis={kpis} />

      <DashboardCharts 
        chartData={chartData} 
        leadSourceData={leadSourceData}
        visibleMetrics={visibleMetrics}
        setVisibleMetrics={setVisibleMetrics}
      />

      <CallDetails 
        callCounts={detailedCallMetrics.callCounts}
        averageDurations={detailedCallMetrics.averageDurations}
        showUpRates={detailedCallMetrics.showUpRates}
      />
    </div>
  );
};
