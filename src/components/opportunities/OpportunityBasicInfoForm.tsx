
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Salesperson } from '@/hooks/useSalespeople';

interface OpportunityBasicInfoFormProps {
  editData: {
    name: string;
    salesperson_id: string;
    lead_source: string;
    revenue: string;
    cash_collected: string;
  };
  setEditData: React.Dispatch<React.SetStateAction<{
    name: string;
    salesperson_id: string;
    lead_source: string;
    revenue: string;
    cash_collected: string;
  }>>;
  salespeople: Salesperson[];
}

export const OpportunityBasicInfoForm: React.FC<OpportunityBasicInfoFormProps> = ({
  editData,
  setEditData,
  salespeople,
}) => {
  return (
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
  );
};
