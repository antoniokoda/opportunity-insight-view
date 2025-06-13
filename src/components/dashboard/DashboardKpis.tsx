
import React from 'react';
import { KpiCard } from '@/components/ui/KpiCard';
import { DollarSign, TrendingUp, Phone, Users, Target, Clock, Percent, UserCheck, FileText } from 'lucide-react';
import { formatCurrency } from '@/config/currency';

interface DashboardKpisProps {
  kpis: {
    totalRevenue: number;
    totalCash: number;
    averageDealSize: number;
    closingRate: number;
    totalCalls: number;
    activeOpportunities: number;
    proposalsPitched: number;
    overallShowUpRate: number;
    firstDiscoveryShowUpRate: number;
  };
  kpiChanges: {
    revenueChange: number | null;
    cashChange: number | null;
    callsChange: number | null;
    averageDealSizeChange: number | null;
    closingRateChange: number | null;
    showUpRateChange: number | null;
    firstDiscoveryShowUpRateChange: number | null;
  };
}

export const DashboardKpis: React.FC<DashboardKpisProps> = ({ kpis, kpiChanges }) => {
  const formatChange = (change: number | null) => {
    if (change === null) return undefined;
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}%`;
  };

  const getChangeType = (change: number | null): 'positive' | 'negative' | 'neutral' => {
    if (change === null) return 'neutral';
    if (change > 0) return 'positive';
    if (change < 0) return 'negative';
    return 'neutral';
  };

  return (
    <>
      {/* Métricas Principales */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Métricas Principales</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KpiCard
            title="Revenue Total"
            value={formatCurrency(kpis.totalRevenue)}
            change={formatChange(kpiChanges.revenueChange)}
            changeType={getChangeType(kpiChanges.revenueChange)}
            icon={<DollarSign size={24} />}
          />
          <KpiCard
            title="Cash Collected"
            value={formatCurrency(kpis.totalCash)}
            change={formatChange(kpiChanges.cashChange)}
            changeType={getChangeType(kpiChanges.cashChange)}
            icon={<TrendingUp size={24} />}
          />
          <KpiCard
            title="Valor Promedio del Trato"
            value={formatCurrency(kpis.averageDealSize)}
            change={formatChange(kpiChanges.averageDealSizeChange)}
            changeType={getChangeType(kpiChanges.averageDealSizeChange)}
            icon={<Target size={24} />}
          />
          <KpiCard
            title="Tasa de Cierre"
            value={`${kpis.closingRate.toFixed(1)}%`}
            change={formatChange(kpiChanges.closingRateChange)}
            changeType={getChangeType(kpiChanges.closingRateChange)}
            icon={<Percent size={24} />}
          />
        </div>
      </div>

      {/* Segunda fila de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="Total Llamadas"
          value={kpis.totalCalls}
          change={formatChange(kpiChanges.callsChange)}
          changeType={getChangeType(kpiChanges.callsChange)}
          icon={<Phone size={24} />}
        />
        <KpiCard
          title="Tasa Asistencia General"
          value={`${kpis.overallShowUpRate.toFixed(1)}%`}
          change={formatChange(kpiChanges.showUpRateChange)}
          changeType={getChangeType(kpiChanges.showUpRateChange)}
          icon={<UserCheck size={24} />}
        />
        <KpiCard
          title="Propuestas Pitcheadas"
          value={kpis.proposalsPitched}
          change={undefined}
          changeType="neutral"
          icon={<FileText size={24} />}
        />
        <KpiCard
          title="Oportunidades Activas"
          value={kpis.activeOpportunities}
          change={undefined}
          changeType="neutral"
          icon={<Users size={24} />}
        />
      </div>
    </>
  );
};
