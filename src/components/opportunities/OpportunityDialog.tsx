
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useOpportunities } from '@/hooks/useOpportunities';
import { useSalespeople } from '@/hooks/useSalespeople';
import { useLeadSourcesWithPersistence } from '@/hooks/useLeadSourcesWithPersistence';
import type { Opportunity } from '@/hooks/useOpportunities';

interface OpportunityDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (opportunity: Opportunity) => void; // NUEVA prop para manejar la oportunidad creada
}

export const OpportunityDialog: React.FC<OpportunityDialogProps> = ({
  isOpen,
  onClose,
  onCreated,
}) => {
  const { addOpportunity, isAdding } = useOpportunities();
  const { salespeople } = useSalespeople();
  const { leadSources } = useLeadSourcesWithPersistence();

  const [formData, setFormData] = useState({
    name: '',
    salesperson_id: '',
    lead_source: '',
    revenue: '',
    cash_collected: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.salesperson_id || !formData.lead_source) {
      return;
    }

    addOpportunity(
      {
        name: formData.name,
        salesperson_id: parseInt(formData.salesperson_id),
        lead_source: formData.lead_source,
        revenue: parseFloat(formData.revenue) || 0,
        cash_collected: parseFloat(formData.cash_collected) || 0,
      },
      {
        onSuccess: (created: Opportunity) => {
          // Al crear con éxito, invocar el callback si existe
          if (onCreated) {
            onCreated(created);
          }
          // Resetear estado local y cerrar
          setFormData({
            name: '',
            salesperson_id: '',
            lead_source: '',
            revenue: '',
            cash_collected: '',
          });
          onClose();
        },
        onError: () => {
          // El toast se maneja desde useOpportunities
        },
      }
    );
  };

  const handleClose = () => {
    setFormData({
      name: '',
      salesperson_id: '',
      lead_source: '',
      revenue: '',
      cash_collected: '',
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>Nueva Oportunidad</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre de la oportunidad</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ej: Venta de software a empresa X"
              required
            />
          </div>

          <div>
            <Label htmlFor="salesperson">Vendedor</Label>
            <Select 
              value={formData.salesperson_id} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, salesperson_id: value }))}
            >
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
            <Label htmlFor="lead_source">Fuente del lead</Label>
            <Select 
              value={formData.lead_source} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, lead_source: value }))}
            >
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
              <Label htmlFor="revenue">Revenue (€)</Label>
              <Input
                id="revenue"
                type="number"
                value={formData.revenue}
                onChange={(e) => setFormData(prev => ({ ...prev, revenue: e.target.value }))}
                placeholder="50000"
              />
            </div>
            <div>
              <Label htmlFor="cash_collected">Cash Collected (€)</Label>
              <Input
                id="cash_collected"
                type="number"
                value={formData.cash_collected}
                onChange={(e) => setFormData(prev => ({ ...prev, cash_collected: e.target.value }))}
                placeholder="25000"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isAdding} className="flex-1">
              {isAdding ? 'Creando...' : 'Crear Oportunidad'}
            </Button>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
