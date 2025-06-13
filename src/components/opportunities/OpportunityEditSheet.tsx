
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Phone, Plus, Loader2, X } from 'lucide-react';
import { Opportunity } from '@/hooks/useOpportunities';
import { useSalespeople } from '@/hooks/useSalespeople';
import { useOpportunities } from '@/hooks/useOpportunities';
import { useCalls } from '@/hooks/useCalls';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { formatCurrency } from '@/config/currency';

interface OpportunityEditSheetProps {
  opportunity: Opportunity | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OpportunityEditSheet: React.FC<OpportunityEditSheetProps> = ({
  opportunity,
  isOpen,
  onClose,
}) => {
  const { salespeople } = useSalespeople();
  const { updateOpportunity } = useOpportunities();
  const { addCall } = useCalls();
  
  const [editData, setEditData] = useState({
    name: opportunity?.name || '',
    salesperson_id: opportunity?.salesperson_id?.toString() || '',
    lead_source: opportunity?.lead_source || '',
    revenue: opportunity?.revenue?.toString() || '',
    cash_collected: opportunity?.cash_collected?.toString() || '',
  });

  const [showAddCall, setShowAddCall] = useState(false);
  const [newCall, setNewCall] = useState({
    type: 'Discovery' as 'Discovery' | 'Closing',
    date: new Date().toISOString().slice(0, 16),
    duration: '',
  });

  React.useEffect(() => {
    if (opportunity) {
      setEditData({
        name: opportunity.name,
        salesperson_id: opportunity.salesperson_id.toString(),
        lead_source: opportunity.lead_source,
        revenue: opportunity.revenue.toString(),
        cash_collected: opportunity.cash_collected.toString(),
      });
    }
  }, [opportunity]);

  const handleSave = () => {
    if (!opportunity) return;
    
    updateOpportunity({
      id: opportunity.id,
      updates: {
        name: editData.name,
        salesperson_id: parseInt(editData.salesperson_id),
        lead_source: editData.lead_source,
        revenue: parseFloat(editData.revenue) || 0,
        cash_collected: parseFloat(editData.cash_collected) || 0,
      },
    });
  };

  const handleAddCall = () => {
    if (!opportunity || !newCall.duration) return;

    addCall({
      opportunity_id: opportunity.id,
      type: newCall.type,
      date: new Date(newCall.date).toISOString(),
      duration: parseInt(newCall.duration),
    });

    setNewCall({
      type: 'Discovery',
      date: new Date().toISOString().slice(0, 16),
      duration: '',
    });
    setShowAddCall(false);
  };

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

  const updateOpportunityStatus = (field: 'opportunity_status' | 'proposal_status', value: string) => {
    if (!opportunity) return;
    updateOpportunity({
      id: opportunity.id,
      updates: { [field]: value }
    });
  };

  if (!opportunity) return null;

  const opportunityCalls = opportunity.calls || [];
  const salesperson = salespeople.find(p => p.id === opportunity.salesperson_id);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Editar Oportunidad</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Información Básica</h3>
            
            <div>
              <label className="block text-sm font-medium mb-2">Nombre</label>
              <Input
                value={editData.name}
                onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nombre de la oportunidad"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Vendedor</label>
              <Select value={editData.salesperson_id} onValueChange={(value) => setEditData(prev => ({ ...prev, salesperson_id: value }))}>
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
              <Select value={editData.lead_source} onValueChange={(value) => setEditData(prev => ({ ...prev, lead_source: value }))}>
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Revenue (€)</label>
                <Input
                  type="number"
                  value={editData.revenue}
                  onChange={(e) => setEditData(prev => ({ ...prev, revenue: e.target.value }))}
                  placeholder="50000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Cash Collected (€)</label>
                <Input
                  type="number"
                  value={editData.cash_collected}
                  onChange={(e) => setEditData(prev => ({ ...prev, cash_collected: e.target.value }))}
                  placeholder="25000"
                />
              </div>
            </div>
          </div>

          {/* Status Updates */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Estado</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Estado de Oportunidad</label>
                <Select
                  value={opportunity.opportunity_status}
                  onValueChange={(value) => updateOpportunityStatus('opportunity_status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Abierto</SelectItem>
                    <SelectItem value="won">Ganado</SelectItem>
                    <SelectItem value="lost">Perdido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Estado de Propuesta</label>
                <Select
                  value={opportunity.proposal_status}
                  onValueChange={(value) => updateOpportunityStatus('proposal_status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="created">Creada</SelectItem>
                    <SelectItem value="pitched">Presentada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Calls Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Phone size={20} />
                Llamadas ({opportunityCalls.length})
              </h3>
              <Button onClick={() => setShowAddCall(true)} size="sm">
                <Plus size={16} className="mr-2" />
                Añadir Llamada
              </Button>
            </div>

            {/* Add Call Form */}
            {showAddCall && (
              <div className="p-4 border rounded-lg bg-muted/50">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium">Nueva Llamada</h4>
                  <Button variant="ghost" size="sm" onClick={() => setShowAddCall(false)}>
                    <X size={16} />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Tipo</label>
                    <Select value={newCall.type} onValueChange={(value: 'Discovery' | 'Closing') => setNewCall(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Discovery">Discovery</SelectItem>
                        <SelectItem value="Closing">Closing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Fecha y Hora</label>
                    <Input
                      type="datetime-local"
                      value={newCall.date}
                      onChange={(e) => setNewCall(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Duración (min)</label>
                    <Input
                      type="number"
                      value={newCall.duration}
                      onChange={(e) => setNewCall(prev => ({ ...prev, duration: e.target.value }))}
                      placeholder="30"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button onClick={handleAddCall} size="sm">
                    Añadir Llamada
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setShowAddCall(false)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            )}

            {/* Calls List */}
            {opportunityCalls.length > 0 ? (
              <div className="space-y-2">
                {opportunityCalls.map(call => (
                  <div key={call.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusBadge(call.type.toLowerCase())}>
                        {call.type} #{call.number}
                      </Badge>
                      <span className="text-sm">
                        {format(new Date(call.date), 'dd/MM/yyyy HH:mm', { locale: es })}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {call.duration} min
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No hay llamadas registradas</p>
            )}
          </div>

          {/* Save Button */}
          <div className="flex gap-2 pt-4 border-t">
            <Button onClick={handleSave} className="flex-1">
              Guardar Cambios
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cerrar
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
