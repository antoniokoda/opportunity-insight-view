
import React from 'react';
import { Edit, Folder, StickyNote, Trash, Users } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { formatCurrency } from '@/config/currency';
import { CallSummaryList } from '@/components/opportunities/CallSummaryList';
import type { Opportunity } from '@/hooks/useOpportunities';

interface OpportunityCardProps {
  opportunity: Opportunity;
  getSalespersonName: (id: number) => string;
  getStatusBadge: (status: string) => string;
  onEdit: (op: Opportunity) => void;
  onFiles: (op: Opportunity) => void;
  onNotes: (op: Opportunity) => void;
  onContacts: (op: Opportunity) => void;
  onDelete: (op: Opportunity) => void;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  getSalespersonName,
  getStatusBadge,
  onEdit,
  onFiles,
  onNotes,
  onContacts,
  onDelete,
}) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg text-zinc-900 line-clamp-2">{opportunity.name}</CardTitle>
            <p className="text-sm text-zinc-600 mt-1">{getSalespersonName(opportunity.salesperson_id)}</p>
          </div>
          <div className="flex gap-1 ml-2">
            <Button variant="ghost" size="sm" onClick={() => onContacts(opportunity)}>
              <Users className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onFiles(opportunity)}>
              <Folder className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onNotes(opportunity)}>
              <StickyNote className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onEdit(opportunity)}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(opportunity)}>
              <Trash className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-zinc-600">Estado:</span>
            <Badge variant="outline" className={getStatusBadge(opportunity.opportunity_status)}>
              {opportunity.opportunity_status === 'active' && 'Activo'}
              {opportunity.opportunity_status === 'won' && 'Ganado'}
              {opportunity.opportunity_status === 'lost' && 'Perdido'}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-zinc-600">Propuesta:</span>
            <Badge variant="outline" className={getStatusBadge(opportunity.proposal_status)}>
              {opportunity.proposal_status === 'n/a' && 'N/A'}
              {opportunity.proposal_status === 'created' && 'Creada'}
              {opportunity.proposal_status === 'pitched' && 'Presentada'}
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-center p-2 bg-zinc-50 rounded">
              <div className="text-xs text-zinc-600">Revenue</div>
              <div className="font-semibold text-sm text-zinc-900">{formatCurrency(opportunity.revenue)}</div>
            </div>
            <div className="text-center p-2 bg-zinc-50 rounded">
              <div className="text-xs text-zinc-600">Cobrado</div>
              <div className="font-semibold text-sm text-zinc-900">{formatCurrency(opportunity.cash_collected)}</div>
            </div>
          </div>
        </div>
        {opportunity.calls && opportunity.calls.length > 0 && (
          <CallSummaryList calls={opportunity.calls} />
        )}
        <div className="pt-2 border-t space-y-1">
          <div className="flex justify-between items-center text-xs">
            <span className="text-zinc-600">Fuente:</span>
            <span className="font-medium text-zinc-900">{opportunity.lead_source}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-zinc-600">Creada:</span>
            <span className="text-zinc-900">
              {format(new Date(opportunity.created_at), 'dd/MM/yyyy', { locale: es })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
