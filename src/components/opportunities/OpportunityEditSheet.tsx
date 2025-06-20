import React, { useState, useCallback } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Phone, Plus } from 'lucide-react';
import { Opportunity } from '@/hooks/useOpportunities';
import { useSalespeople } from '@/hooks/useSalespeople';
import { useOpportunities } from '@/hooks/useOpportunities';
import { useCalls, CallType, Call } from '@/hooks/useCalls';
import { useLeadSourcesWithPersistence } from '@/hooks/useLeadSourcesWithPersistence';
import { format } from 'date-fns';
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
  console.log('=== OpportunityEditSheet RENDER ===');
  console.log('isOpen:', isOpen);
  console.log('opportunity:', opportunity);
  console.log('opportunity?.id:', opportunity?.id);
  console.log('timestamp:', new Date().toISOString());

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
  
  // Mejorar estado inicial para nuevas llamadas
  const initialNewCallState = {
    type: 'Discovery 1' as CallType,
    date: new Date().toISOString().slice(0, 16),
    duration: '',
    attended: false,
    link: '', // Asegurar que siempre sea string vacío
  };
  const [newCall, setNewCall] = useState(initialNewCallState);

  // ... keep existing code (useEffect hooks)
  React.useEffect(() => {
    console.log('=== OpportunityEditSheet PROPS CHANGE ===');
    console.log('isOpen changed to:', isOpen);
    console.log('opportunity changed to:', opportunity);
    console.log('opportunity?.id changed to:', opportunity?.id);
  }, [isOpen, opportunity?.id]);

  React.useEffect(() => {
    if (opportunity) {
      console.log('=== Setting edit data for opportunity ===');
      console.log('Abriendo oportunidad para edición:', opportunity);
      setEditData({
        name: opportunity.name,
        salesperson_id: opportunity.salesperson_id.toString(),
        lead_source: opportunity.lead_source,
        revenue: opportunity.revenue.toString(),
        cash_collected: opportunity.cash_collected.toString(),
      });
    }
    if (!isOpen) {
      console.log('=== Sheet is closing, resetting form states ===');
      setShowAddCall(false);
      setEditingCall(null);
      setNewCall(initialNewCallState);
    }
  }, [opportunity, isOpen]);

  React.useEffect(() => {
    if (editingCall) {
      console.log('=== Setting up call for editing ===');
      console.log('Editing call:', editingCall);
      console.log('Editing call link:', editingCall.link);
      
      setNewCall({
        type: editingCall.type,
        date: format(new Date(editingCall.date), "yyyy-MM-dd'T'HH:mm"),
        duration: editingCall.duration ? editingCall.duration.toString() : '',
        attended: !!editingCall.attended,
        link: editingCall.link || '', // Asegurar que nunca sea null/undefined
      });
      setShowAddCall(true);
    }
  }, [editingCall]);

  // ... keep existing code (handleSave function)
  const handleSave = useCallback(() => {
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
  }, [opportunity, editData, updateOpportunity]);

  // Mejorar la lógica de guardado de llamadas con mejor logging
  const handleSaveCall = useCallback(() => {
    if (!opportunity) return;

    console.log('=== handleSaveCall STARTED ===');
    console.log('Current newCall state:', newCall);
    console.log('Link value before processing:', newCall.link);
    console.log('Is editing existing call:', !!editingCall);

    // Preparar payload con mejor manejo de campos opcionales
    const callPayload: any = {
      type: newCall.type,
      date: new Date(newCall.date).toISOString(),
      attended: newCall.attended,
    };

    // Manejar duración (solo incluir si tiene valor)
    if (newCall.duration && newCall.duration.trim() !== '') {
      callPayload.duration = parseInt(newCall.duration) || 0;
    } else {
      // Para nuevas llamadas, usar 0 si no hay duración
      callPayload.duration = 0;
    }

    // Manejar enlace correctamente - CRÍTICO para el fix
    if (newCall.link && newCall.link.trim() !== '') {
      callPayload.link = newCall.link.trim();
      console.log('Including link in payload:', callPayload.link);
    } else {
      callPayload.link = null; // Explícitamente null para vacío
      console.log('Setting link to null (empty)');
    }

    console.log('Final call payload:', callPayload);

    if (editingCall) {
      console.log('Updating existing call with ID:', editingCall.id);
      updateCall({ id: editingCall.id, updates: callPayload });
    } else {
      console.log('Creating new call for opportunity:', opportunity.id);
      addCall({
        opportunity_id: opportunity.id,
        ...callPayload,
      });
    }

    handleCancelEdit();
  }, [opportunity, newCall, editingCall, updateCall, addCall]);

  // ... keep existing code (remaining callback functions)
  const handleCancelEdit = useCallback(() => {
    setShowAddCall(false);
    setEditingCall(null);
    setNewCall(initialNewCallState);
  }, []);
  
  const handleAddNewCallClick = useCallback(() => {
    setEditingCall(null);
    setNewCall(initialNewCallState);
    setShowAddCall(true);
  }, []);

  const handleEditCallClick = useCallback((call: Call) => {
    setEditingCall(call);
  }, []);

  const handleDeleteCall = useCallback((callId: number) => {
    const confirmed = window.confirm('¿Estás seguro de que quieres eliminar esta llamada? Esta acción no se puede deshacer.');
    if (!confirmed) return;
    deleteCall(callId);
  }, [deleteCall]);

  const updateOpportunityStatus = useCallback((field: 'opportunity_status' | 'proposal_status', value: string) => {
    if (!opportunity) return;
    updateOpportunity({
      id: opportunity.id,
      updates: { [field]: value }
    });
  }, [opportunity, updateOpportunity]);

  console.log('=== Sheet render with open prop ===');
  console.log('Sheet open prop:', isOpen);

  if (!opportunity) {
    console.log('=== No opportunity provided, not rendering sheet ===');
    return null;
  }

  const opportunityCalls = (opportunity.calls || []) as Call[];

  return (
    <Sheet open={isOpen} onOpenChange={(open) => {
      console.log('=== Sheet onOpenChange called ===');
      console.log('Sheet open state changing to:', open);
      if (!open) {
        console.log('Sheet is closing, calling onClose');
        onClose();
      }
    }}>
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
