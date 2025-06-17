
import React from 'react';
import { PipelineSelector } from '@/components/pipeline/PipelineSelector';
import { ViewSelector } from '@/components/pipeline/ViewSelector';
import { AdvancedFilters } from '@/components/pipeline/AdvancedFilters';

interface FilterState {
  search: string;
  salesperson: string;
  leadSource: string;
  status: string;
  proposalStatus: string;
  revenueMin: string;
  revenueMax: string;
}

interface OpportunitiesViewFiltersProps {
  selectedPipelineId: string | null;
  onPipelineChange: (pipelineId: string | null) => void;
  currentView: 'pipeline' | 'table';
  onViewChange: (view: 'pipeline' | 'table') => void;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onCreatePipeline?: () => void;
  onManagePipelines?: () => void;
}

export const OpportunitiesViewFilters: React.FC<OpportunitiesViewFiltersProps> = ({
  selectedPipelineId,
  onPipelineChange,
  currentView,
  onViewChange,
  filters,
  onFiltersChange,
  onCreatePipeline,
  onManagePipelines,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PipelineSelector
          selectedPipelineId={selectedPipelineId}
          onPipelineChange={onPipelineChange}
          onCreatePipeline={onCreatePipeline}
          onManagePipelines={onManagePipelines}
        />
        <ViewSelector
          currentView={currentView}
          onViewChange={onViewChange}
        />
      </div>
      
      <AdvancedFilters
        filters={filters}
        onFiltersChange={onFiltersChange}
      />
    </div>
  );
};
