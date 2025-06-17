
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Settings, MoreVertical } from 'lucide-react';
import { usePipelines } from '@/hooks/usePipelines';
import { useOpportunitiesWithPipeline } from '@/hooks/useOpportunitiesWithPipeline';
import { useSalespeople } from '@/hooks/useSalespeople';
import { useOpportunityMutations } from '@/hooks/useOpportunityMutations';
import { formatCurrency } from '@/config/currency';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

export const Pipeline = () => {
  const { pipelines, stages, isLoading: pipelinesLoading, getStagesByPipeline, getDefaultPipeline } = usePipelines();
  const { opportunities, isLoading: opportunitiesLoading } = useOpportunitiesWithPipeline();
  const { salespeople } = useSalespeople();
  const { updateOpportunity } = useOpportunityMutations();
  
  const [selectedPipeline, setSelectedPipeline] = useState<string>('');

  // Get current pipeline (default or selected)
  const currentPipeline = selectedPipeline 
    ? pipelines.find(p => p.id === selectedPipeline)
    : getDefaultPipeline();

  const currentStages = currentPipeline ? getStagesByPipeline(currentPipeline.id) : [];

  const getSalespersonName = (id: number) => {
    const salesperson = salespeople.find(s => s.id === id);
    return salesperson ? salesperson.name : 'Sin asignar';
  };

  const getOpportunitiesByStage = (stageId: string) => {
    return opportunities.filter(opp => opp.stage_id === stageId);
  };

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const opportunityId = parseInt(draggableId);
    const newStageId = destination.droppableId;

    try {
      await updateOpportunity({
        id: opportunityId,
        updates: {
          stage_id: newStageId,
          last_interaction_at: new Date().toISOString(),
        }
      });
    } catch (error) {
      console.error('Error updating opportunity stage:', error);
    }
  };

  if (pipelinesLoading || opportunitiesLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-zinc-200 rounded w-1/4"></div>
          <div className="flex gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex-1 space-y-4">
                <div className="h-12 bg-zinc-200 rounded"></div>
                <div className="space-y-2">
                  {[1, 2].map(j => (
                    <div key={j} className="h-32 bg-zinc-100 rounded"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!currentPipeline) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-zinc-900 mb-4">No hay pipelines disponibles</h1>
          <p className="text-zinc-600 mb-6">Crea tu primer pipeline para empezar a gestionar tus oportunidades.</p>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Crear Pipeline
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">{currentPipeline.name}</h1>
          <p className="text-zinc-600">{currentPipeline.description || 'Gestiona tus oportunidades de venta'}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Configurar Pipeline
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Oportunidad
          </Button>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-6 overflow-x-auto pb-6">
          {currentStages.map((stage) => {
            const stageOpportunities = getOpportunitiesByStage(stage.id);
            const stageValue = stageOpportunities.reduce((sum, opp) => sum + opp.revenue, 0);

            return (
              <div key={stage.id} className="flex-shrink-0 w-80">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-zinc-900">{stage.name}</h3>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>Editar etapa</DropdownMenuItem>
                        <DropdownMenuItem>Eliminar etapa</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: stage.color }}
                    />
                    <span className="text-sm text-zinc-600">
                      {stageOpportunities.length} oportunidad{stageOpportunities.length !== 1 ? 'es' : ''}
                    </span>
                    <span className="text-sm font-medium text-zinc-900">
                      {formatCurrency(stageValue)}
                    </span>
                  </div>
                </div>

                <Droppable droppableId={stage.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`min-h-32 space-y-3 p-2 rounded-lg transition-colors ${
                        snapshot.isDraggingOver ? 'bg-zinc-100' : 'bg-transparent'
                      }`}
                    >
                      {stageOpportunities.map((opportunity, index) => (
                        <Draggable
                          key={opportunity.id}
                          draggableId={opportunity.id.toString()}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`cursor-grab active:cursor-grabbing transition-shadow ${
                                snapshot.isDragging ? 'shadow-lg' : 'shadow-sm hover:shadow-md'
                              }`}
                            >
                              <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium line-clamp-2">
                                  {opportunity.name}
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="pt-0 space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="font-semibold text-green-600">
                                    {formatCurrency(opportunity.revenue)}
                                  </span>
                                  <Badge variant="secondary" className="text-xs">
                                    {opportunity.lead_source}
                                  </Badge>
                                </div>
                                <div className="text-xs text-zinc-600">
                                  {getSalespersonName(opportunity.salesperson_id || 0)}
                                </div>
                                <div className="text-xs text-zinc-500">
                                  {new Date(opportunity.created_at).toLocaleDateString('es-ES')}
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
};
