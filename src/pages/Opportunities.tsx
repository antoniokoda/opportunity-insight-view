
import React, { useState, useEffect, useCallback } from 'react';
import { DropResult } from '@hello-pangea/dnd';
import { TooltipProvider } from '@/components/ui/tooltip';
import { usePipelines } from '@/hooks/usePipelines';
import { useOpportunitiesWithPipeline } from '@/hooks/useOpportunitiesWithPipeline';
import { useOpportunityMutations } from '@/hooks/useOpportunityMutations';
import { useSalespeople } from '@/hooks/useSalespeople';
import { useLeadSourcesWithPersistence } from '@/hooks/useLeadSourcesWithPersistence';
import { useUserViewSettings } from '@/hooks/useUserViewSettings';
import { OpportunityDialog } from '@/components/opportunities/OpportunityDialog';
import { OpportunityEditSheet } from '@/components/opportunities/OpportunityEditSheet';
import { OpportunityFilesDialog } from '@/components/opportunities/OpportunityFilesDialog';
import { OpportunityNotesDialog } from '@/components/opportunities/OpportunityNotesDialog';
import { OpportunityContactsDialog } from '@/components/opportunities/OpportunityContactsDialog';
import { DeleteOpportunityDialog } from '@/components/opportunities/DeleteOpportunityDialog';
import { OpportunitiesHeader } from '@/components/opportunities/OpportunitiesHeader';
import { OpportunitiesViewFilters } from '@/components/opportunities/OpportunitiesViewFilters';
import { OpportunitiesPipelineView } from '@/components/opportunities/OpportunitiesPipelineView';
import { OpportunitiesTable } from '@/components/pipeline/OpportunitiesTable';
import { OpportunitiesLoading } from '@/components/opportunities/OpportunitiesLoading';
import type { OpportunityWithPipeline } from '@/hooks/useOpportunitiesWithPipeline';

interface FilterState {
  search: string;
  salesperson: string;
  leadSource: string;
  status: string;
  proposalStatus: string;
  revenueMin: string;
  revenueMax: string;
}

export const Opportunities = () => {
  const { pipelines, stages, isLoading: pipelinesLoading, getStagesByPipeline, getDefaultPipeline } = usePipelines();
  const { opportunities, isLoading: opportunitiesLoading } = useOpportunitiesWithPipeline();
  const { updateOpportunity } = useOpportunityMutations();
  const { salespeople } = useSalespeople();
  const { leadSources } = useLeadSourcesWithPersistence();
  const { settings, setViewType, setSelectedPipeline, isLoading: settingsLoading } = useUserViewSettings();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState<OpportunityWithPipeline | null>(null);
  const [pendingEditOpportunity, setPendingEditOpportunity] = useState<number | null>(null);
  const [filesDialogOpportunity, setFilesDialogOpportunity] = useState<OpportunityWithPipeline | null>(null);
  const [notesDialogOpportunity, setNotesDialogOpportunity] = useState<OpportunityWithPipeline | null>(null);
  const [contactsDialogOpportunity, setContactsDialogOpportunity] = useState<OpportunityWithPipeline | null>(null);
  const [opportunityToDelete, setOpportunityToDelete] = useState<OpportunityWithPipeline | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    salesperson: '',
    leadSource: '',
    status: '',
    proposalStatus: '',
    revenueMin: '',
    revenueMax: '',
  });

  // Get current view and pipeline from settings
  const currentView = settings?.view_type || 'pipeline';
  const selectedPipelineId = settings?.selected_pipeline_id || null;

  // Get current pipeline (default or selected)
  const currentPipeline = selectedPipelineId 
    ? pipelines.find(p => p.id === selectedPipelineId)
    : getDefaultPipeline();

  const currentStages = currentPipeline ? getStagesByPipeline(currentPipeline.id) : [];

  // Filter opportunities based on current pipeline and filters
  const filteredOpportunities = opportunities.filter(opp => {
    // Filter by pipeline
    if (currentPipeline && opp.pipeline_id !== currentPipeline.id) {
      return false;
    }
    
    // Apply other filters
    if (filters.search && !opp.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.salesperson && opp.salesperson_id?.toString() !== filters.salesperson) {
      return false;
    }
    if (filters.leadSource && opp.lead_source !== filters.leadSource) {
      return false;
    }
    if (filters.status && opp.opportunity_status !== filters.status) {
      return false;
    }
    if (filters.proposalStatus && opp.proposal_status !== filters.proposalStatus) {
      return false;
    }
    if (filters.revenueMin && opp.revenue < Number(filters.revenueMin)) {
      return false;
    }
    if (filters.revenueMax && opp.revenue > Number(filters.revenueMax)) {
      return false;
    }
    
    return true;
  });

  const handleOpportunityCreated = useCallback((createdOpportunity: any) => {
    console.log('Opportunity created:', createdOpportunity);
    setPendingEditOpportunity(createdOpportunity.id);
    setIsDialogOpen(false);
  }, []);

  useEffect(() => {
    if (pendingEditOpportunity && !isDialogOpen) {
      requestAnimationFrame(() => {
        const foundOpportunity = opportunities.find(o => o.id === pendingEditOpportunity);
        if (foundOpportunity) {
          setEditingOpportunity(foundOpportunity);
          setPendingEditOpportunity(null);
        }
      });
    }
  }, [pendingEditOpportunity, isDialogOpen, opportunities]);

  const getSalespersonName = (id: number | null) => {
    if (!id) return 'Sin asignar';
    const salesperson = salespeople.find(s => s.id === id);
    return salesperson ? salesperson.name : 'Sin asignar';
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

  const handleViewChange = (view: 'pipeline' | 'table') => {
    setViewType(view);
  };

  const handlePipelineChange = (pipelineId: string | null) => {
    setSelectedPipeline(pipelineId);
  };

  if (pipelinesLoading || opportunitiesLoading || settingsLoading) {
    return <OpportunitiesLoading />;
  }

  return (
    <TooltipProvider>
      <div className="p-6">
        <OpportunitiesHeader onNewOpportunity={() => setIsDialogOpen(true)} />

        <OpportunitiesViewFilters
          selectedPipelineId={selectedPipelineId}
          onPipelineChange={handlePipelineChange}
          currentView={currentView}
          onViewChange={handleViewChange}
          filters={filters}
          onFiltersChange={setFilters}
        />

        {currentView === 'pipeline' ? (
          <OpportunitiesPipelineView
            opportunities={filteredOpportunities}
            stages={currentStages}
            getSalespersonName={getSalespersonName}
            onDragEnd={handleDragEnd}
            onEdit={setEditingOpportunity}
            onFiles={setFilesDialogOpportunity}
            onNotes={setNotesDialogOpportunity}
            onContacts={setContactsDialogOpportunity}
            onDelete={(op) => {
              setOpportunityToDelete(op);
              setDeleteDialogOpen(true);
            }}
          />
        ) : (
          <OpportunitiesTable
            opportunities={filteredOpportunities}
            getSalespersonName={getSalespersonName}
            onEdit={setEditingOpportunity}
            onDelete={(op) => {
              setOpportunityToDelete(op);
              setDeleteDialogOpen(true);
            }}
          />
        )}

        <OpportunityDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onCreated={handleOpportunityCreated}
        />

        <OpportunityEditSheet
          opportunity={editingOpportunity}
          isOpen={!!editingOpportunity}
          onClose={() => setEditingOpportunity(null)}
        />

        {filesDialogOpportunity && (
          <OpportunityFilesDialog
            opportunityId={filesDialogOpportunity.id}
            opportunityName={filesDialogOpportunity.name}
            isOpen={!!filesDialogOpportunity}
            onClose={() => setFilesDialogOpportunity(null)}
          />
        )}

        {notesDialogOpportunity && (
          <OpportunityNotesDialog
            opportunityId={notesDialogOpportunity.id}
            opportunityName={notesDialogOpportunity.name}
            isOpen={!!notesDialogOpportunity}
            onClose={() => setNotesDialogOpportunity(null)}
          />
        )}

        {contactsDialogOpportunity && (
          <OpportunityContactsDialog
            opportunityId={contactsDialogOpportunity.id}
            opportunityName={contactsDialogOpportunity.name}
            isOpen={!!contactsDialogOpportunity}
            onClose={() => setContactsDialogOpportunity(null)}
          />
        )}

        <DeleteOpportunityDialog
          opportunity={opportunityToDelete}
          isOpen={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={(opportunityId) => {
            // Handle delete confirmation
            setDeleteDialogOpen(false);
            setOpportunityToDelete(null);
          }}
          isDeleting={false}
        />
      </div>
    </TooltipProvider>
  );
};
