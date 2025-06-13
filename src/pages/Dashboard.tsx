import React, { useState } from 'react';
import { DashboardKpis } from '@/components/dashboard/DashboardKpis';
import { DashboardCharts } from '@/components/dashboard/DashboardCharts';
import { DashboardFilters } from '@/components/dashboard/DashboardFilters';
import { DashboardPerformance } from '@/components/dashboard/DashboardPerformance';
import { useOpportunities } from '@/hooks/useOpportunities';
import { useCalls } from '@/hooks/useCalls';
import { useSalespeople } from '@/hooks/useSalespeople';
import { useLeadSources } from '@/hooks/useLeadSources';
import { useDashboardFilters } from '@/hooks/useDashboardFilters';
import { useDashboardKpis } from '@/hooks/useDashboardKpis';
import { useDashboardChartData } from '@/hooks/useDashboardChartData';
import { useLeadSourceData } from '@/hooks/useLeadSourceData';
import { useSalesPerformance } from '@/hooks/useSalesPerformance';

export const Dashboard = () => {
  const { opportunities, isLoading: opportunitiesLoading } = useOpportunities();
  const { calls, isLoading: callsLoading } = useCalls();
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

  const {
    selectedSalesperson,
    setSelectedSalesperson,
    selectedMonth,
    setSelectedMonth,
    selectedLeadSource,
    setSelectedLeadSource,
    availableMonths,
    filteredOpportunities,
  } = useDashboardFilters(opportunities, calls);

  const kpis = useDashboardKpis(filteredOpportunities, calls);
  const chartData = useDashboardChartData();
  const leadSourceData = useLeadSourceData(filteredOpportunities, customLeadSources);
  const salesPerformance = useSalesPerformance(salespeople, opportunities);

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

  if (opportunitiesLoading || callsLoading || salespeopleLoading) {
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCharts 
          chartData={chartData} 
          leadSourceData={leadSourceData}
          visibleMetrics={visibleMetrics}
          setVisibleMetrics={setVisibleMetrics}
        />
        <DashboardPerformance 
          salesPerformance={salesPerformance}
        />
      </div>
    </div>
  );
};
