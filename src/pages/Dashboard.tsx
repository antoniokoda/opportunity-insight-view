
import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { KpiCard } from '@/components/ui/KpiCard';
import { SalespersonManager } from '@/components/SalespersonManager';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DollarSign, TrendingUp, Phone, Users, Loader2 } from 'lucide-react';
import { useSalespeople } from '@/hooks/useSalespeople';
import { useOpportunities } from '@/hooks/useOpportunities';
import { useCalls } from '@/hooks/useCalls';

const months = [
  { value: 'all', label: 'Todos los meses' },
  { value: '2024-06', label: 'Junio 2024' },
  { value: '2024-05', label: 'Mayo 2024' },
  { value: '2024-04', label: 'Abril 2024' },
];

const leadSources = [
  { value: 'all', label: 'Todas las fuentes' },
  { value: 'Website', label: 'Website' },
  { value: 'Referral', label: 'Referencia' },
  { value: 'Cold Outreach', label: 'Prospección' },
];

export const Dashboard: React.FC = () => {
  const [selectedSalesperson, setSelectedSalesperson] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedLeadSource, setSelectedLeadSource] = useState('all');
  const [visibleMetrics, setVisibleMetrics] = useState({
    revenue: true,
    cash: true,
    calls: true,
  });

  const { salespeople, isLoading: salesLoading } = useSalespeople();
  const { opportunities, isLoading: oppsLoading } = useOpportunities();
  const { calls, isLoading: callsLoading } = useCalls();

  const isLoading = salesLoading || oppsLoading || callsLoading;

  const filteredOpportunities = useMemo(() => {
    return opportunities.filter(opp => {
      if (selectedSalesperson !== 'all' && opp.salesperson_id !== parseInt(selectedSalesperson)) {
        return false;
      }
      if (selectedLeadSource !== 'all' && opp.lead_source !== selectedLeadSource) {
        return false;
      }
      return true;
    });
  }, [opportunities, selectedSalesperson, selectedLeadSource]);

  const kpis = useMemo(() => {
    const totalRevenue = filteredOpportunities.reduce((sum, opp) => sum + opp.revenue, 0);
    const totalCash = filteredOpportunities.reduce((sum, opp) => sum + opp.cash_collected, 0);
    const totalCalls = calls.length;
    const activeOpportunities = filteredOpportunities.filter(opp => opp.opportunity_status === 'active').length;

    return {
      totalRevenue,
      totalCash,
      totalCalls,
      activeOpportunities,
    };
  }, [filteredOpportunities, calls]);

  const chartData = useMemo(() => {
    const data = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      
      data.push({
        date: date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
        revenue: Math.floor(Math.random() * 20000) + 10000,
        cash: Math.floor(Math.random() * 15000) + 5000,
        calls: Math.floor(Math.random() * 10) + 5,
      });
    }
    return data;
  }, []);

  const salesPerformance = useMemo(() => {
    return salespeople.map(salesperson => {
      const salesPersonOpps = opportunities.filter(opp => opp.salesperson_id === salesperson.id);
      const revenue = salesPersonOpps.reduce((sum, opp) => sum + opp.revenue, 0);
      const cash = salesPersonOpps.reduce((sum, opp) => sum + opp.cash_collected, 0);
      return {
        name: salesperson.name,
        revenue,
        cash,
        deals: salesPersonOpps.length,
      };
    });
  }, [salespeople, opportunities]);

  const leadSourceData = useMemo(() => {
    const sources = ['Website', 'Referral', 'Cold Outreach'];
    return sources.map(source => {
      const sourceOpps = opportunities.filter(opp => opp.lead_source === source);
      return {
        source,
        count: sourceOpps.length,
        revenue: sourceOpps.reduce((sum, opp) => sum + opp.revenue, 0),
      };
    });
  }, [opportunities]);

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
      <Card className="p-6">
        <div className="flex flex-wrap gap-4">
          <div className="min-w-[200px]">
            <label className="block text-sm font-medium mb-2">Vendedor</label>
            <Select value={selectedSalesperson} onValueChange={setSelectedSalesperson}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar vendedor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los vendedores</SelectItem>
                {salespeople.map(person => (
                  <SelectItem key={person.id} value={person.id.toString()}>
                    {person.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="min-w-[200px]">
            <label className="block text-sm font-medium mb-2">Mes</label>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar mes" />
              </SelectTrigger>
              <SelectContent>
                {months.map(month => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="min-w-[200px]">
            <label className="block text-sm font-medium mb-2">Fuente de Lead</label>
            <Select value={selectedLeadSource} onValueChange={setSelectedLeadSource}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar fuente" />
              </SelectTrigger>
              <SelectContent>
                {leadSources.map(source => (
                  <SelectItem key={source.value} value={source.value}>
                    {source.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="Revenue Total"
          value={`$${kpis.totalRevenue.toLocaleString()}`}
          change="+12.5%"
          changeType="positive"
          icon={<DollarSign size={24} />}
        />
        <KpiCard
          title="Cash Collected"
          value={`$${kpis.totalCash.toLocaleString()}`}
          change="+8.2%"
          changeType="positive"
          icon={<TrendingUp size={24} />}
        />
        <KpiCard
          title="Total Llamadas"
          value={kpis.totalCalls}
          change="+15.3%"
          changeType="positive"
          icon={<Phone size={24} />}
        />
        <KpiCard
          title="Oportunidades Activas"
          value={kpis.activeOpportunities}
          change="-2.1%"
          changeType="negative"
          icon={<Users size={24} />}
        />
      </div>

      {/* Charts and Salespeople Manager */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Tendencias</h3>
              <div className="flex gap-2">
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={visibleMetrics.revenue}
                    onChange={(e) => setVisibleMetrics(prev => ({ ...prev, revenue: e.target.checked }))}
                    className="mr-1"
                  />
                  Revenue
                </label>
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={visibleMetrics.cash}
                    onChange={(e) => setVisibleMetrics(prev => ({ ...prev, cash: e.target.checked }))}
                    className="mr-1"
                  />
                  Cash
                </label>
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={visibleMetrics.calls}
                    onChange={(e) => setVisibleMetrics(prev => ({ ...prev, calls: e.target.checked }))}
                    className="mr-1"
                  />
                  Calls
                </label>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                {visibleMetrics.revenue && (
                  <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
                )}
                {visibleMetrics.cash && (
                  <Line type="monotone" dataKey="cash" stroke="#22c55e" strokeWidth={2} />
                )}
                {visibleMetrics.calls && (
                  <Line type="monotone" dataKey="calls" stroke="#f59e0b" strokeWidth={2} />
                )}
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Salespeople Manager */}
        <div>
          <SalespersonManager />
        </div>
      </div>

      {/* Performance and Lead Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Rendimiento por Vendedor</h3>
          <div className="space-y-4">
            {salesPerformance.length > 0 ? (
              salesPerformance.map(person => (
                <div key={person.name} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">{person.name}</p>
                    <p className="text-sm text-muted-foreground">{person.deals} deals</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${person.revenue.toLocaleString()}</p>
                    <p className="text-sm text-success-600">${person.cash.toLocaleString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">
                Agrega vendedores para ver su rendimiento
              </p>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Fuentes de Leads</h3>
          <div className="grid grid-cols-1 gap-4">
            {leadSourceData.map(source => (
              <div key={source.source} className="text-center p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">{source.source}</h4>
                <p className="text-2xl font-bold text-primary">{source.count}</p>
                <p className="text-sm text-muted-foreground">
                  ${source.revenue.toLocaleString()} revenue
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
