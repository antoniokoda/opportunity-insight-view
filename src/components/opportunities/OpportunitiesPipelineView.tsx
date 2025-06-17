
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { formatCurrency } from '@/config/currency';
import type { OpportunityWithPipeline } from '@/hooks/useOpportunitiesWithPipeline';
import type { PipelineStage } from '@/hooks/usePipelines';

interface OpportunitiesPipelineViewProps {
  opportunities: OpportunityWithPipeline[];
  stages: PipelineStage[];
  getSalespersonName: (id: number | null) => string;
  onDragEnd: (result: DropResult) => void;
  onEdit: (opportunity: OpportunityWithPipeline) => void;
  onFiles: (opportunity: OpportunityWithPipeline) => void;
  onNotes: (opportunity: OpportunityWithPipeline) => void;
  onContacts: (opportunity: OpportunityWithPipeline) => void;
  onDelete: (opportunity: OpportunityWithPipeline) => void;
}

export const OpportunitiesPipelineView: React.FC<OpportunitiesPipelineViewProps> = ({
  opportunities,
  stages,
  getSalespersonName,
  onDragEnd,
  onEdit,
  onFiles,
  onNotes,
  onContacts,
  onDelete,
}) => {
  const navigate = useNavigate();

  const getOpportunitiesByStage = (stageId: string) => {
    return opportunities.filter(opp => opp.stage_id === stageId);
  };

  const handleOpportunityClick = (opportunityId: number) => {
    navigate(`/opportunities/${opportunityId}`);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-6 overflow-x-auto pb-6">
        {stages.map((stage) => {
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
                            className={`cursor-pointer active:cursor-grabbing transition-shadow ${
                              snapshot.isDragging ? 'shadow-lg' : 'shadow-sm hover:shadow-md'
                            }`}
                            onClick={() => handleOpportunityClick(opportunity.id)}
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
                                {getSalespersonName(opportunity.salesperson_id)}
                              </div>
                              <div className="text-xs text-zinc-500">
                                {new Date(opportunity.created_at).toLocaleDateString('es-ES')}
                              </div>
                              <div className="flex gap-1 pt-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit(opportunity);
                                  }}
                                  className="h-6 px-2 text-xs"
                                >
                                  Editar
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="h-6 px-1"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <MoreVertical className="w-3 h-3" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent>
                                    <DropdownMenuItem onClick={(e) => {
                                      e.stopPropagation();
                                      onFiles(opportunity);
                                    }}>
                                      Archivos
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={(e) => {
                                      e.stopPropagation();
                                      onNotes(opportunity);
                                    }}>
                                      Notas
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={(e) => {
                                      e.stopPropagation();
                                      onContacts(opportunity);
                                    }}>
                                      Contactos
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={(e) => {
                                      e.stopPropagation();
                                      onDelete(opportunity);
                                    }}>
                                      Eliminar
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
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
  );
};
