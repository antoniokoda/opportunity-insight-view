
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash, MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { formatCurrency } from '@/config/currency';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { OpportunityWithPipeline } from '@/hooks/useOpportunitiesWithPipeline';

interface OpportunitiesTableProps {
  opportunities: OpportunityWithPipeline[];
  getSalespersonName: (id: number | null) => string;
  onEdit: (opportunity: OpportunityWithPipeline) => void;
  onDelete: (opportunity: OpportunityWithPipeline) => void;
}

export const OpportunitiesTable: React.FC<OpportunitiesTableProps> = ({
  opportunities,
  getSalespersonName,
  onEdit,
  onDelete,
}) => {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'won': return 'default';
      case 'lost': return 'secondary';
      default: return 'outline';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'won': return 'Ganado';
      case 'lost': return 'Perdido';
      default: return status;
    }
  };

  const getProposalStatusLabel = (status: string) => {
    switch (status) {
      case 'n/a': return 'N/A';
      case 'created': return 'Creada';
      case 'pitched': return 'Presentada';
      default: return status;
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Vendedor</TableHead>
            <TableHead>Pipeline</TableHead>
            <TableHead>Etapa</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Propuesta</TableHead>
            <TableHead>Revenue</TableHead>
            <TableHead>Cobrado</TableHead>
            <TableHead>Fuente</TableHead>
            <TableHead>Creada</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {opportunities.map((opportunity) => (
            <TableRow key={opportunity.id}>
              <TableCell className="font-medium">
                {opportunity.name}
              </TableCell>
              <TableCell>
                {getSalespersonName(opportunity.salesperson_id)}
              </TableCell>
              <TableCell>
                <span className="text-sm text-zinc-600">
                  {opportunity.pipeline_name || 'Sin pipeline'}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {opportunity.stage_color && (
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: opportunity.stage_color }}
                    />
                  )}
                  <span className="text-sm">
                    {opportunity.stage_name || 'Sin etapa'}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(opportunity.opportunity_status)}>
                  {getStatusLabel(opportunity.opportunity_status)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {getProposalStatusLabel(opportunity.proposal_status)}
                </Badge>
              </TableCell>
              <TableCell className="font-semibold text-green-600">
                {formatCurrency(opportunity.revenue)}
              </TableCell>
              <TableCell className="font-semibold">
                {formatCurrency(opportunity.cash_collected)}
              </TableCell>
              <TableCell>
                <span className="text-sm text-zinc-600">
                  {opportunity.lead_source}
                </span>
              </TableCell>
              <TableCell className="text-sm text-zinc-600">
                {format(new Date(opportunity.created_at), 'dd/MM/yyyy', { locale: es })}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(opportunity)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onDelete(opportunity)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash className="w-4 h-4 mr-2" />
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
