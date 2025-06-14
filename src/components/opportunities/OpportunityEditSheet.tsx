import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Phone, Plus, Loader2, X, ExternalLink, Edit, Trash } from 'lucide-react';
import { Opportunity } from '@/hooks/useOpportunities';
import { useSalespeople } from '@/hooks/useSalespeople';
import { useOpportunities } from '@/hooks/useOpportunities';
import { useCalls, CallType, Call } from '@/hooks/useCalls';
import { useLeadSourcesWithPersistence } from '@/hooks/useLeadSourcesWithPersistence';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { formatCurrency } from '@/config/currency';
import { CallForm } from "./CallForm";
import { CallList } from "./CallList";
import { getStatusBadge, getCallTypeColor } from "./opportunityHelpers";

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
  const { addCall, isAdding, updateCall, isUpdating, deleteCall, isDeleting } = useCalls();
  const { leadSources } = useLeadSourcesWithPersistence();
  
  const [editData, setEditData] = useState({
    name: opportunity?.name || '',
    salesperson_id: opportunity?.salesperson_id?.toString() || '',
    lead_source: opportunity?.lead_source || '',
    revenue: opportunity?.revenue?.toString() || '',
    cash_collected: opportunity?.cash_collected?.toString() || '',
  });

  const [showAddCall, setShowAddCall] = useState(false);
  const [editingCall, setEditingCall] = useState<Call | null>(null);
  
  const initialNewCallState = {
    type: 'Discovery 1' as CallType,
    date: new Date().toISOString().slice(0, 16),
    duration: '30',
    attended: false,
    link: '',
  };
  const [newCall, setNewCall] = useState(initialNewCallState);

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
    if (!isOpen) {
      setShowAddCall(false);
      setEditingCall(null);
      setNewCall(initialNewCallState);
    }
  }, [opportunity, isOpen]);

  React.useEffect(() => {
    if (editingCall) {
        setNewCall({
            type: editingCall.type,
            date: format(new Date(editingCall.date), "yyyy-MM-dd'T'HH:mm"),
            duration: editingCall.duration.toString(),
            attended: !!editingCall.attended,
            link: editingCall.link || '',
        });
        setShowAddCall(true);
    }
  }, [editingCall]);

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

  const handleSaveCall = () => {
    if (!opportunity) return;

    const callPayload = {
      type: newCall.type,
      date: new Date(newCall.date).toISOString(),
      duration: parseInt(newCall.duration) || 30,
      attended: newCall.attended,
      link: newCall.link || undefined,
    };

    if (editingCall) {
      updateCall({ id: editingCall.id, updates: callPayload });
    } else {
      addCall({
        opportunity_id: opportunity.id,
        ...callPayload,
      });
    }

    handleCancelEdit();
  };

  const handleCancelEdit = () => {
    setShowAddCall(false);
    setEditingCall(null);
    setNewCall(initialNewCallState);
  };
  
  const handleAddNewCallClick = () => {
    setEditingCall(null);
    setNewCall(initialNewCallState);
    setShowAddCall(true);
  };

  const handleEditCallClick = (call: Call) => {
    setEditingCall(call);
  };

  const handleDeleteCall = (callId: number) => {
    const confirmed = window.confirm('¿Estás seguro de que quieres eliminar esta llamada? Esta acción no se puede deshacer.');
    if (!confirmed) return;
    deleteCall(callId);
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

  const getCallTypeColor = (type: string) => {
    if (type.startsWith('Discovery')) {
      return 'bg-blue-100 text-blue-800';
    } else if (type.startsWith('Closing')) {
      return 'bg-success-50 text-success-600';
    }
    return 'bg-gray-100 text-gray-800';
  };

  const updateOpportunityStatus = (field: 'opportunity_status' | 'proposal_status', value: string) => {
    if (!opportunity) return;
    updateOpportunity({
      id: opportunity.id,
      updates: { [field]: value }
    });
  };

  if (!opportunity) return null;

  const opportunityCalls = (opportunity.calls || []) as Call[];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto bg-white">
        <SheetHeader>
          <SheetTitle>Editar Oportunidad</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Información Básica */}
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
                  {leadSources.map(source => (
                    <SelectItem key={source.id} value={source.name}>
                      {source.name}
                    </SelectItem>
                  ))}
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

          {/* Estado */}
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
                    <SelectItem value="n/a">N/A</SelectItem>
                    <SelectItem value="created">Creada</SelectItem>
                    <SelectItem value="pitched">Presentada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Llamadas */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Phone size={20} />
                Llamadas ({opportunityCalls.length})
              </h3>
              <Button onClick={handleAddNewCallClick} size="sm">
                <Plus size={16} className="mr-2" />
                Añadir Llamada
              </Button>
            </div>
            {/* Add/Edit Call Form */}
            {showAddCall && (
              <CallForm
                callValues={newCall}
                setCallValues={setNewCall}
                loading={isAdding || isUpdating}
                isEditing={!!editingCall}
                onCancel={handleCancelEdit}
                onSave={handleSaveCall}
              />
            )}
            <CallList
              calls={opportunityCalls}
              onEdit={handleEditCallClick}
              onDelete={handleDeleteCall}
              isDeleting={isDeleting}
            />
          </div>

          {/* Botones de Guardar/Cerrar */}
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
