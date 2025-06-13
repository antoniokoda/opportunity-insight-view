
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Phone, Plus } from 'lucide-react';
import { Opportunity } from '@/hooks/useOpportunities';
import { useSalespeople } from '@/hooks/useSalespeople';
import { useOpportunities } from '@/hooks/useOpportunities';
import { useCalls, CallType } from '@/hooks/useCalls';
import { OpportunityBasicInfoForm } from './OpportunityBasicInfoForm';
import { OpportunityStatusForm } from './OpportunityStatusForm';
import { AddCallForm } from './AddCallForm';
import { CallsList } from './CallsList';

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
  const { addCall, isAdding } = useCalls();
  
  const [editData, setEditData] = useState({
    name: opportunity?.name || '',
    salesperson_id: opportunity?.salesperson_id?.toString() || '',
    lead_source: opportunity?.lead_source || '',
    revenue: opportunity?.revenue?.toString() || '',
    cash_collected: opportunity?.cash_collected?.toString() || '',
  });

  const [showAddCall, setShowAddCall] = useState(false);
  const [newCall, setNewCall] = useState({
    type: 'Discovery 1' as CallType,
    date: new Date().toISOString().slice(0, 16),
    duration: '',
    attended: null as boolean | null,
    link: '',
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
    if (!opportunity || !newCall.duration || isNaN(parseInt(newCall.duration)) || parseInt(newCall.duration) <= 0) {
      console.log('Cannot add call: missing opportunity, duration, or invalid duration', {
        opportunity: !!opportunity,
        duration: newCall.duration,
        parsedDuration: parseInt(newCall.duration),
        isValid: !isNaN(parseInt(newCall.duration)) && parseInt(newCall.duration) > 0
      });
      return;
    }

    console.log('Adding call with data:', {
      opportunity_id: opportunity.id,
      type: newCall.type,
      date: new Date(newCall.date).toISOString(),
      duration: parseInt(newCall.duration),
      attended: newCall.attended,
      link: newCall.link || undefined,
    });

    addCall({
      opportunity_id: opportunity.id,
      type: newCall.type,
      date: new Date(newCall.date).toISOString(),
      duration: parseInt(newCall.duration),
      attended: newCall.attended,
      link: newCall.link || undefined,
    });

    setNewCall({
      type: 'Discovery 1',
      date: new Date().toISOString().slice(0, 16),
      duration: '',
      attended: null,
      link: '',
    });
    setShowAddCall(false);
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

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Editar Oportunidad</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          <OpportunityBasicInfoForm
            editData={editData}
            setEditData={setEditData}
            salespeople={salespeople}
          />

          <OpportunityStatusForm
            opportunity={opportunity}
            updateOpportunityStatus={updateOpportunityStatus}
          />

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

            <AddCallForm
              showAddCall={showAddCall}
              setShowAddCall={setShowAddCall}
              newCall={newCall}
              setNewCall={setNewCall}
              handleAddCall={handleAddCall}
              isAdding={isAdding}
            />

            <CallsList calls={opportunityCalls} />
          </div>

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
