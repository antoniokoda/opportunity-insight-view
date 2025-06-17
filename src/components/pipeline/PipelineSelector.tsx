
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus, Settings } from 'lucide-react';
import { usePipelines } from '@/hooks/usePipelines';

interface PipelineSelectorProps {
  selectedPipelineId: string | null;
  onPipelineChange: (pipelineId: string | null) => void;
  onCreatePipeline?: () => void;
  onManagePipelines?: () => void;
}

export const PipelineSelector: React.FC<PipelineSelectorProps> = ({
  selectedPipelineId,
  onPipelineChange,
  onCreatePipeline,
  onManagePipelines,
}) => {
  const { pipelines, getDefaultPipeline } = usePipelines();

  const currentPipeline = selectedPipelineId 
    ? pipelines.find(p => p.id === selectedPipelineId)
    : getDefaultPipeline();

  return (
    <div className="flex items-center gap-2">
      <Select 
        value={currentPipeline?.id || ''} 
        onValueChange={(value) => onPipelineChange(value || null)}
      >
        <SelectTrigger className="w-64">
          <SelectValue placeholder="Seleccionar pipeline" />
        </SelectTrigger>
        <SelectContent>
          {pipelines.map(pipeline => (
            <SelectItem key={pipeline.id} value={pipeline.id}>
              <div className="flex items-center justify-between w-full">
                <span>{pipeline.name}</span>
                {pipeline.is_default && (
                  <span className="text-xs text-zinc-500 ml-2">(Por defecto)</span>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {onCreatePipeline && (
        <Button variant="outline" size="sm" onClick={onCreatePipeline}>
          <Plus className="w-4 h-4 mr-1" />
          Nuevo
        </Button>
      )}

      {onManagePipelines && (
        <Button variant="outline" size="sm" onClick={onManagePipelines}>
          <Settings className="w-4 h-4 mr-1" />
          Gestionar
        </Button>
      )}
    </div>
  );
};
