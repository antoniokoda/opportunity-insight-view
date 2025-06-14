
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { OpportunityCard } from './OpportunityCard';
import type { Opportunity } from '@/hooks/useOpportunities';

interface OpportunitiesGroupListProps {
  groupedOpportunities: Record<string, { label: string; opportunities: Opportunity[] }>;
  sortedMonthKeys: string[];
  getSalespersonName: (id: number) => string;
  getStatusBadge: (status: string) => string;
  onEdit: (op: Opportunity) => void;
  onFiles: (op: Opportunity) => void;
  onNotes: (op: Opportunity) => void;
  onContacts: (op: Opportunity) => void;
  onDelete: (op: Opportunity) => void;
}

export const OpportunitiesGroupList: React.FC<OpportunitiesGroupListProps> = ({
  groupedOpportunities,
  sortedMonthKeys,
  getSalespersonName,
  getStatusBadge,
  onEdit,
  onFiles,
  onNotes,
  onContacts,
  onDelete,
}) => (
  <div className="space-y-8">
    {sortedMonthKeys.map((monthKey) => (
      <div key={monthKey}>
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-xl font-semibold text-zinc-900">
            {groupedOpportunities[monthKey].label}
          </h2>
          <Separator className="flex-1" />
          <span className="text-sm text-zinc-600">
            {groupedOpportunities[monthKey].opportunities.length} oportunidad
            {groupedOpportunities[monthKey].opportunities.length !== 1 ? 'es' : ''}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {groupedOpportunities[monthKey].opportunities.map((op) => (
            <OpportunityCard
              key={op.id}
              opportunity={op}
              getSalespersonName={getSalespersonName}
              getStatusBadge={getStatusBadge}
              onEdit={onEdit}
              onFiles={onFiles}
              onNotes={onNotes}
              onContacts={onContacts}
              onDelete={onDelete}
            />
          ))}
        </div>
      </div>
    ))}
  </div>
);
