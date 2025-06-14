
import React from 'react';
import { KpiCard } from '@/components/ui/KpiCard';
import { DollarSign, TrendingUp, Phone, Users, Target, Clock, Percent, UserCheck, FileText, Shield } from 'lucide-react';
import { formatCurrency } from '@/config/currency';

interface DashboardKpisProps {
  kpis: {
    totalRevenue: number;
    potentialRevenue: number;
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
    <div className="space-y-10">
      {/* Métricas Principales */}
      <div>
        <h2 className="text-2xl font-bold text-apple-gray-900 mb-6 tracking-tight">Métricas principales</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <KpiCard
            title="Facturación potencial"
            value={formatCurrency(kpis.potentialRevenue)}
            icon={<Shield size={28} />}
            subtitle="Monto potencial en oportunidades activas"
          />
          <KpiCard
            title="Facturación real"
            value={formatCurrency(kpis.totalRevenue)}
            change={formatChange(kpiChanges.revenueChange)}
            changeType={getChangeType(kpiChanges.revenueChange)}
            icon={<DollarSign size={28} />}
            subtitle="Facturación sólo de tratos ganados"
          />
          <KpiCard
            title="Cash recaudado"
            value={formatCurrency(kpis.totalCash)}
            change={formatChange(kpiChanges.cashChange)}
            changeType={getChangeType(kpiChanges.cashChange)}
            icon={<TrendingUp size={28} />}
          />
          <KpiCard
            title="Valor promedio del trato"
            value={formatCurrency(kpis.averageDealSize)}
            change={formatChange(kpiChanges.averageDealSizeChange)}
            changeType={getChangeType(kpiChanges.averageDealSizeChange)}
            icon={<Target size={28} />}
          />
          <KpiCard
            title="Tasa de cierre"
            value={`${kpis.closingRate.toFixed(1)}%`}
            change={formatChange(kpiChanges.closingRateChange)}
            changeType={getChangeType(kpiChanges.closingRateChange)}
            icon={<Percent size={28} />}
          />
        </div>
      </div>

      {/* Segunda fila de métricas */}
      <div>
        <h2 className="text-2xl font-bold text-apple-gray-900 mb-6 tracking-tight">Métricas de actividad</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KpiCard
            title="Total de llamadas"
            value={kpis.totalCalls}
            change={formatChange(kpiChanges.callsChange)}
            changeType={getChangeType(kpiChanges.callsChange)}
            icon={<Phone size={28} />}
          />
          <KpiCard
            title="Tasa asistencia general"
            value={`${kpis.overallShowUpRate.toFixed(1)}%`}
            change={formatChange(kpiChanges.showUpRateChange)}
            changeType={getChangeType(kpiChanges.showUpRateChange)}
            icon={<UserCheck size={28} />}
          />
          <KpiCard
            title="Propuestas pitcheadas"
            value={kpis.proposalsPitched}
            change={undefined}
            changeType="neutral"
            icon={<FileText size={28} />}
          />
          <KpiCard
            title="Oportunidades activas"
            value={kpis.activeOpportunities}
            change={undefined}
            changeType="neutral"
            icon={<Users size={28} />}
          />
        </div>
      </div>
    </div>
  );
};

