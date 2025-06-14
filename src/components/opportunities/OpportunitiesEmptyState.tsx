
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface OpportunitiesEmptyStateProps {
  hasFilters: boolean;
  onNewOpportunity: () => void;
}

export const OpportunitiesEmptyState: React.FC<OpportunitiesEmptyStateProps> = ({ hasFilters, onNewOpportunity }) => (
  <div className="text-center py-12">
    <div className="text-zinc-600 mb-4">
      {hasFilters
        ? 'No se encontraron oportunidades con los filtros aplicados'
        : 'No hay oportunidades aún'}
    </div>
    {!hasFilters && (
      <Button onClick={onNewOpportunity} variant="outline">
        <Plus className="w-4 h-4 mr-2" />
        Crear primera oportunidad
      </Button>
    )}
  </div>
);
