
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Opportunity } from '@/hooks/useOpportunities';

interface OpportunityStatusFormProps {
  opportunity: Opportunity;
  updateOpportunityStatus: (field: 'opportunity_status' | 'proposal_status', value: string) => void;
}

export const OpportunityStatusForm: React.FC<OpportunityStatusFormProps> = ({
  opportunity,
  updateOpportunityStatus,
}) => {
  return (
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
  );
};
