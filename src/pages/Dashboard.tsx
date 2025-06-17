
import React, { useState } from 'react';
import { DashboardKpis } from '@/components/dashboard/DashboardKpis';
import { DashboardCharts } from '@/components/dashboard/DashboardCharts';
import { DashboardFilters } from '@/components/dashboard/DashboardFilters';
import { CallDetails } from '@/components/dashboard/CallDetails';
import { SalespersonManager } from '@/components/SalespersonManager';
import { LeadSourceManager } from '@/components/LeadSourceManager';
import { useDashboard } from '@/hooks/useDashboard';
import { useAuth } from '@/hooks/useAuth';

export const Dashboard = () => {
  const { user, session, loading: authLoading } = useAuth();
  const {
    // Data and loading
    isLoading,
    
    // Filters
    selectedSalesperson,
    setSelectedSalesperson,
    selectedMonth,
    setSelectedMonth,
    selectedLeadSource,
    setSelectedLeadSource,
    availableMonths,
    salespeople,
    customLeadSources,
    
    // Computed data
    kpis,
    kpiChanges,
    leadSourceData,
    callMetrics,
  } = useDashboard();

  console.log('🔍 DASHBOARD DEBUG: Unified hook data', {
    hasUser: !!user,
    isLoading,
    kpisCount: Object.keys(kpis).length,
    leadSourceDataCount: leadSourceData.length,
    callMetricsKeys: Object.keys(callMetrics.callCounts).length
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

  if (isLoading) {
    console.log('🔍 DASHBOARD DEBUG: Data still loading...');
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

  console.log('🔍 DASHBOARD DEBUG: Rendering dashboard with unified data');

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-zinc-900 tracking-tight mb-2">Dashboard</h1>
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

      <div className="border-t border-zinc-200 pt-10">
        <DashboardCharts 
          leadSourceData={leadSourceData}
        />
      </div>

      <div className="border-t border-zinc-200 pt-10">
        <h2 className="text-2xl font-bold text-zinc-900 mb-6">Gestión</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SalespersonManager />
          <LeadSourceManager />
        </div>
      </div>

      <div className="border-t border-zinc-200 pt-10">
        <CallDetails 
          callCounts={callMetrics.callCounts}
          averageDurations={callMetrics.averageDurations}
          showUpRates={callMetrics.showUpRates}
        />
      </div>
    </div>
  );
};
