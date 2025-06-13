
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Phone, DollarSign, Edit, Loader2 } from 'lucide-react';
import { useSalespeople } from '@/hooks/useSalespeople';
import { useOpportunities } from '@/hooks/useOpportunities';
import { useCalls } from '@/hooks/useCalls';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { formatCurrency } from '@/config/currency';

export const Opportunities: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newOpportunity, setNewOpportunity] = useState({
    name: '',
    salesperson_id: '',
    lead_source: '',
    revenue: '',
  });

  const { salespeople, isLoading: salesLoading } = useSalespeople();
  const { 
    opportunities, 
    isLoading: oppsLoading, 
    addOpportunity, 
    updateOpportunity, 
    isAdding 
  } = useOpportunities();

  const isLoading = salesLoading || oppsLoading;

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-blue-100 text-blue-800',
      won: 'bg-success-50 text-success-600',
      lost: 'bg-red-100 text-red-800',
      created: 'bg-gray-100 text-gray-800',
      pitched: 'bg-yellow-100 text-yellow-800',
    };
    return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800';
  };

  const handleAddOpportunity = () => {
    if (newOpportunity.name && newOpportunity.salesperson_id && newOpportunity.lead_source) {
      addOpportunity({
        name: newOpportunity.name,
        salesperson_id: parseInt(newOpportunity.salesperson_id),
        lead_source: newOpportunity.lead_source,
        revenue: parseInt(newOpportunity.revenue) || 0,
      });
      
      setNewOpportunity({ name: '', salesperson_id: '', lead_source: '', revenue: '' });
      setShowAddForm(false);
    }
  };

  const updateOpportunityStatus = (id: number, field: 'opportunity_status' | 'proposal_status', value: string) => {
    updateOpportunity({
      id,
      updates: { [field]: value }
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando oportunidades...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Oportunidades</h1>
          <p className="text-muted-foreground">Gestiona tus deals y propuestas</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)} className="flex items-center gap-2">
          <Plus size={16} />
          Nueva Oportunidad
        </Button>
      </div>

      {showAddForm && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Nueva Oportunidad</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nombre</label>
              <Input
                value={newOpportunity.name}
                onChange={(e) => setNewOpportunity(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ej: ABC Corporation Deal"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Vendedor</label>
              <Select value={newOpportunity.salesperson_id} onValueChange={(value) => setNewOpportunity(prev => ({ ...prev, salesperson_id: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar vendedor" />
                </SelectTrigger>
                <SelectContent>
                  {salespeople.map(person => (
                    <SelectItem key={person.id} value={person.id.toString()}>
                      {person.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Fuente</label>
              <Select value={newOpportunity.lead_source} onValueChange={(value) => setNewOpportunity(prev => ({ ...prev, lead_source: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar fuente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Website">Website</SelectItem>
                  <SelectItem value="Referral">Referencia</SelectItem>
                  <SelectItem value="Cold Outreach">Prospección</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Revenue (€)</label>
              <Input
                type="number"
                value={newOpportunity.revenue}
                onChange={(e) => setNewOpportunity(prev => ({ ...prev, revenue: e.target.value }))}
                placeholder="50000"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={handleAddOpportunity} disabled={isAdding}>
              {isAdding && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Crear Oportunidad
            </Button>
            <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancelar</Button>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {opportunities.map(opportunity => {
          const salesperson = salespeople.find(p => p.id === opportunity.salesperson_id);
          const opportunityCalls = opportunity.calls || [];
          
          return (
            <Card key={opportunity.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold mb-1">{opportunity.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {salesperson?.name} • {opportunity.lead_source}
                  </p>
                </div>
                <Button variant="ghost" size="sm">
                  <Edit size={16} />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="text-primary" size={16} />
                  <div>
                    <p className="text-sm text-muted-foreground">Revenue</p>
                    <p className="font-semibold">{formatCurrency(opportunity.revenue)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="text-success-600" size={16} />
                  <div>
                    <p className="text-sm text-muted-foreground">Cash Collected</p>
                    <p className="font-semibold text-success-600">{formatCurrency(opportunity.cash_collected)}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mb-4">
                <Select
                  value={opportunity.opportunity_status}
                  onValueChange={(value) => updateOpportunityStatus(opportunity.id, 'opportunity_status', value)}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Abierto</SelectItem>
                    <SelectItem value="won">Ganado</SelectItem>
                    <SelectItem value="lost">Perdido</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={opportunity.proposal_status}
                  onValueChange={(value) => updateOpportunityStatus(opportunity.id, 'proposal_status', value)}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="created">Creada</SelectItem>
                    <SelectItem value="pitched">Presentada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium flex items-center gap-2">
                    <Phone size={16} />
                    Llamadas ({opportunityCalls.length})
                  </h4>
                  <Button variant="outline" size="sm">
                    <Plus size={14} />
                  </Button>
                </div>
                {opportunityCalls.length > 0 ? (
                  <div className="space-y-2">
                    {opportunityCalls.map(call => (
                      <div key={call.id} className="flex items-center justify-between p-2 bg-muted rounded">
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusBadge(call.type.toLowerCase())}>
                            {call.type} #{call.number}
                          </Badge>
                          <span className="text-sm">
                            {format(new Date(call.date), 'dd/MM/yyyy HH:mm', { locale: es })}
                          </span>
                        </div>
                        <span className="text-sm text-muted-foreground">{call.duration}min</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No hay llamadas registradas</p>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {opportunities.length === 0 && !isLoading && (
        <Card className="p-12 text-center">
          <h3 className="text-lg font-semibold mb-2">No hay oportunidades</h3>
          <p className="text-muted-foreground mb-4">
            Crea tu primera oportunidad para comenzar a gestionar tus deals.
          </p>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus size={16} className="mr-2" />
            Crear Primera Oportunidad
          </Button>
        </Card>
      )}
    </div>
  );
};
