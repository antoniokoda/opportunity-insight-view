
import React from 'react';
import { KpiCard } from '@/components/ui/KpiCard';
import { DollarSign, TrendingUp, Phone, Users, Target, Clock, Percent, UserCheck } from 'lucide-react';
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
}

export const DashboardKpis: React.FC<DashboardKpisProps> = ({ kpis }) => {
  return (
    <>
      {/* Métricas Principales */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Métricas Principales</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KpiCard
            title="Revenue Total"
            value={formatCurrency(kpis.totalRevenue)}
            change="+12.5%"
            changeType="positive"
            icon={<DollarSign size={24} />}
          />
          <KpiCard
            title="Cash Collected"
            value={formatCurrency(kpis.totalCash)}
            change="+8.2%"
            changeType="positive"
            icon={<TrendingUp size={24} />}
          />
          <KpiCard
            title="Valor Promedio del Trato"
            value={formatCurrency(kpis.averageDealSize)}
            change="+5.3%"
            changeType="positive"
            icon={<Target size={24} />}
          />
          <KpiCard
            title="Tasa de Cierre"
            value={`${kpis.closingRate.toFixed(1)}%`}
            change="+2.1%"
            changeType="positive"
            icon={<Percent size={24} />}
          />
        </div>
      </div>

      {/* Segunda fila de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="Total Llamadas"
          value={kpis.totalCalls}
          change="+15.3%"
          changeType="positive"
          icon={<Phone size={24} />}
        />
        <KpiCard
          title="Tasa Asistencia General"
          value={`${kpis.overallShowUpRate.toFixed(1)}%`}
          change="+4.2%"
          changeType="positive"
          icon={<UserCheck size={24} />}
        />
        <KpiCard
          title="Asistencia Discovery 1"
          value={`${kpis.firstDiscoveryShowUpRate.toFixed(1)}%`}
          change="+6.1%"
          changeType="positive"
          icon={<UserCheck size={24} />}
        />
        <KpiCard
          title="Oportunidades Activas"
          value={kpis.activeOpportunities}
          change="-2.1%"
          changeType="negative"
          icon={<Users size={24} />}
        />
      </div>
    </>
  );
};
