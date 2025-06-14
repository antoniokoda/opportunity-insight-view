
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface OpportunitiesHeaderProps {
  onNewOpportunity: () => void;
}

export const OpportunitiesHeader: React.FC<OpportunitiesHeaderProps> = ({ onNewOpportunity }) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
    <div>
      <h1 className="text-3xl font-bold text-zinc-900">Oportunidades</h1>
      <p className="text-zinc-600">Gestiona tus oportunidades de venta</p>
    </div>
    <Button onClick={onNewOpportunity} className="w-full sm:w-auto">
      <Plus className="w-4 h-4 mr-2" />
      Nueva Oportunidad
    </Button>
  </div>
);
