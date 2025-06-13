
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useSalespeople } from '@/hooks/useSalespeople';
import { useOpportunities } from '@/hooks/useOpportunities';
import { useCalls } from '@/hooks/useCalls';
import { useDashboardFilters } from '@/hooks/useDashboardFilters';
import { useDashboardKpis } from '@/hooks/useDashboardKpis';
import { useDashboardChartData } from '@/hooks/useDashboardChartData';
import { useSalesPerformance } from '@/hooks/useSalesPerformance';
import { useLeadSourceData } from '@/hooks/useLeadSourceData';
import { DashboardFilters } from '@/components/dashboard/DashboardFilters';
import { DashboardKpis } from '@/components/dashboard/DashboardKpis';
import { DashboardCharts } from '@/components/dashboard/DashboardCharts';
import { DashboardPerformance } from '@/components/dashboard/DashboardPerformance';

export const Dashboard: React.FC = () => {
  const [visibleMetrics, setVisibleMetrics] = useState({
    revenue: true,
    cash: true,
    calls: true,
  });

  // Modal states for managing salespeople and lead sources
  const [showSalespersonDialog, setShowSalespersonDialog] = useState(false);
  const [showLeadSourceDialog, setShowLeadSourceDialog] = useState(false);
  const [newSalesperson, setNewSalesperson] = useState({ name: '', email: '' });
  const [customLeadSources, setCustomLeadSources] = useState(['Website', 'Referral', 'Cold Outreach']);
  const [newLeadSource, setNewLeadSource] = useState('');

  const { salespeople, isLoading: salesLoading, addSalesperson, isAdding } = useSalespeople();
  const { opportunities, isLoading: oppsLoading } = useOpportunities();
  const { calls, isLoading: callsLoading } = useCalls();

  const isLoading = salesLoading || oppsLoading || callsLoading;

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
  const salesPerformance = useSalesPerformance(salespeople, opportunities);
  const leadSourceData = useLeadSourceData(opportunities, customLeadSources);

  const handleAddSalesperson = () => {
    if (newSalesperson.name && newSalesperson.email) {
      addSalesperson(newSalesperson);
      setNewSalesperson({ name: '', email: '' });
      setShowSalespersonDialog(false);
    }
  };

  const handleAddLeadSource = () => {
    if (newLeadSource && !customLeadSources.includes(newLeadSource)) {
      setCustomLeadSources([...customLeadSources, newLeadSource]);
      setNewLeadSource('');
      setShowLeadSourceDialog(false);
    }
  };

  const handleDeleteLeadSource = (source: string) => {
    setCustomLeadSources(customLeadSources.filter(s => s !== source));
    if (selectedLeadSource === source) {
      setSelectedLeadSource('all');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
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
        isAdding={isAdding}
      />

      {/* KPIs */}
      <DashboardKpis kpis={kpis} />

      {/* Charts and Lead Sources */}
      <DashboardCharts
        chartData={chartData}
        leadSourceData={leadSourceData}
        visibleMetrics={visibleMetrics}
        setVisibleMetrics={setVisibleMetrics}
      />

      {/* Performance and Salespeople Manager */}
      <DashboardPerformance salesPerformance={salesPerformance} />
    </div>
  );
};
