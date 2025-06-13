
import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { KpiCard } from '@/components/ui/KpiCard';
import { SalespersonManager } from '@/components/SalespersonManager';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, TrendingUp, Phone, Users, Loader2, Target, Clock, Percent, Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useSalespeople } from '@/hooks/useSalespeople';
import { useOpportunities } from '@/hooks/useOpportunities';
import { useCalls } from '@/hooks/useCalls';
import { formatCurrency } from '@/config/currency';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'];

export const Dashboard: React.FC = () => {
  const [selectedSalesperson, setSelectedSalesperson] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedLeadSource, setSelectedLeadSource] = useState('all');
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

  // Generate dynamic months based on actual data
  const availableMonths = useMemo(() => {
    const monthsWithData = new Set<string>();
    
    // Add months from opportunities
    opportunities.forEach(opp => {
      const month = format(new Date(opp.created_at), 'yyyy-MM');
      monthsWithData.add(month);
    });
    
    // Add months from calls
    calls.forEach(call => {
      const month = format(new Date(call.date), 'yyyy-MM');
      monthsWithData.add(month);
    });

    const sortedMonths = Array.from(monthsWithData).sort().reverse();
    
    return [
      { value: 'all', label: 'Todos los meses' },
      ...sortedMonths.map(month => ({
        value: month,
        label: format(new Date(month + '-01'), 'MMMM yyyy', { locale: es })
      }))
    ];
  }, [opportunities, calls]);

  const filteredOpportunities = useMemo(() => {
    return opportunities.filter(opp => {
      if (selectedSalesperson !== 'all' && opp.salesperson_id !== parseInt(selectedSalesperson)) {
        return false;
      }
      if (selectedLeadSource !== 'all' && opp.lead_source !== selectedLeadSource) {
        return false;
      }
      if (selectedMonth !== 'all') {
        const oppMonth = format(new Date(opp.created_at), 'yyyy-MM');
        if (oppMonth !== selectedMonth) {
          return false;
        }
      }
      return true;
    });
  }, [opportunities, selectedSalesperson, selectedLeadSource, selectedMonth]);

  const kpis = useMemo(() => {
    const totalRevenue = filteredOpportunities.reduce((sum, opp) => sum + opp.revenue, 0);
    const totalCash = filteredOpportunities.reduce((sum, opp) => sum + opp.cash_collected, 0);
    const totalCalls = calls.length;
    const activeOpportunities = filteredOpportunities.filter(opp => opp.opportunity_status === 'active').length;
    
    const wonOpportunities = filteredOpportunities.filter(opp => opp.opportunity_status === 'won');
    const lostOpportunities = filteredOpportunities.filter(opp => opp.opportunity_status === 'lost');
    const closedOpportunities = wonOpportunities.length + lostOpportunities.length;
    
    const averageDealSize = wonOpportunities.length > 0 
      ? wonOpportunities.reduce((sum, opp) => sum + opp.revenue, 0) / wonOpportunities.length
      : 0;
    
    const closingRate = closedOpportunities > 0 
      ? (wonOpportunities.length / closedOpportunities) * 100
      : 0;
    
    const proposalsPitched = filteredOpportunities.filter(opp => opp.proposal_status === 'pitched').length;

    return {
      totalRevenue,
      totalCash,
      totalCalls,
      activeOpportunities,
      averageDealSize,
      closingRate,
      proposalsPitched,
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
    const sources = customLeadSources;
    return sources.map(source => {
      const sourceOpps = opportunities.filter(opp => opp.lead_source === source);
      return {
        source,
        count: sourceOpps.length,
        revenue: sourceOpps.reduce((sum, opp) => sum + opp.revenue, 0),
      };
    });
  }, [opportunities, customLeadSources]);

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
      <Card className="p-6">
        <div className="flex flex-wrap gap-4">
          <div className="min-w-[200px]">
            <label className="block text-sm font-medium mb-2">Vendedor</label>
            <div className="flex gap-2">
              <Select value={selectedSalesperson} onValueChange={setSelectedSalesperson}>
                <SelectTrigger className="flex-1">
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
              <Dialog open={showSalespersonDialog} onOpenChange={setShowSalespersonDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus size={16} />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Gestionar Vendedores</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        placeholder="Nombre"
                        value={newSalesperson.name}
                        onChange={(e) => setNewSalesperson(prev => ({ ...prev, name: e.target.value }))}
                      />
                      <Input
                        placeholder="Email"
                        value={newSalesperson.email}
                        onChange={(e) => setNewSalesperson(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                    <Button onClick={handleAddSalesperson} disabled={isAdding} className="w-full">
                      {isAdding && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      Agregar Vendedor
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          <div className="min-w-[200px]">
            <label className="block text-sm font-medium mb-2">Mes</label>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar mes" />
              </SelectTrigger>
              <SelectContent>
                {availableMonths.map(month => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="min-w-[200px]">
            <label className="block text-sm font-medium mb-2">Fuente de Lead</label>
            <div className="flex gap-2">
              <Select value={selectedLeadSource} onValueChange={setSelectedLeadSource}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Seleccionar fuente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las fuentes</SelectItem>
                  {customLeadSources.map(source => (
                    <SelectItem key={source} value={source}>
                      {source}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Dialog open={showLeadSourceDialog} onOpenChange={setShowLeadSourceDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus size={16} />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Gestionar Fuentes de Lead</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Nueva fuente de lead"
                        value={newLeadSource}
                        onChange={(e) => setNewLeadSource(e.target.value)}
                      />
                      <Button onClick={handleAddLeadSource}>
                        Agregar
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Fuentes existentes:</h4>
                      {customLeadSources.map(source => (
                        <div key={source} className="flex items-center justify-between p-2 bg-muted rounded">
                          <span>{source}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteLeadSource(source)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </Card>

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
          title="Oportunidades Activas"
          value={kpis.activeOpportunities}
          change="-2.1%"
          changeType="negative"
          icon={<Users size={24} />}
        />
        <KpiCard
          title="Propuestas Presentadas"
          value={kpis.proposalsPitched}
          change="+7.8%"
          changeType="positive"
          icon={<Target size={24} />}
        />
        <KpiCard
          title="Duración Promedio del Ciclo"
          value="24 días"
          change="-3.2%"
          changeType="positive"
          icon={<Clock size={24} />}
        />
      </div>

      {/* Charts and Lead Sources */}
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

        {/* Lead Source Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Distribución de Fuentes</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={leadSourceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ source, percent }) => `${source} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {leadSourceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Performance and Salespeople Manager */}
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
                    <p className="font-semibold">{formatCurrency(person.revenue)}</p>
                    <p className="text-sm text-success-600">{formatCurrency(person.cash)}</p>
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

        {/* Salespeople Manager */}
        <div>
          <SalespersonManager />
        </div>
      </div>
    </div>
  );
};
