import React, { useState, useEffect } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useOpportunities } from '@/hooks/useOpportunities';
import { useSalespeople } from '@/hooks/useSalespeople';
import { useLeadSourcesWithPersistence } from '@/hooks/useLeadSourcesWithPersistence';
import { OpportunityDialog } from '@/components/opportunities/OpportunityDialog';
import { OpportunityEditSheet } from '@/components/opportunities/OpportunityEditSheet';
import { OpportunityFilesDialog } from '@/components/opportunities/OpportunityFilesDialog';
import { OpportunityNotesDialog } from '@/components/opportunities/OpportunityNotesDialog';
import { OpportunityContactsDialog } from '@/components/opportunities/OpportunityContactsDialog';
import type { Opportunity } from '@/hooks/useOpportunities';
import { OpportunitiesFilters } from '@/components/opportunities/OpportunitiesFilters';
import { OpportunitiesGroupList } from '@/components/opportunities/OpportunitiesGroupList';
import { useGroupedOpportunities } from '@/components/opportunities/useGroupedOpportunities';
import { OpportunitiesLoading } from '@/components/opportunities/OpportunitiesLoading';
import { OpportunitiesHeader } from '@/components/opportunities/OpportunitiesHeader';
import { OpportunitiesEmptyState } from '@/components/opportunities/OpportunitiesEmptyState';
import { DeleteOpportunityDialog } from '@/components/opportunities/DeleteOpportunityDialog';

export const Opportunities = () => {
  const { opportunities, isLoading, deleteOpportunity, isDeleting } = useOpportunities();
  const { salespeople } = useSalespeople();
  const { leadSources } = useLeadSourcesWithPersistence();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState<Opportunity | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [filesDialogOpportunity, setFilesDialogOpportunity] = useState<Opportunity | null>(null);
  const [notesDialogOpportunity, setNotesDialogOpportunity] = useState<Opportunity | null>(null);
  const [contactsDialogOpportunity, setContactsDialogOpportunity] = useState<Opportunity | null>(null);
  const [opportunityToDelete, setOpportunityToDelete] = useState<Opportunity | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleOpportunityCreated = (createdOpportunity: Opportunity) => {
    console.log('handleOpportunityCreated called with:', createdOpportunity);
    console.log('Setting editing opportunity to:', createdOpportunity);
    
    // Ensure the opportunity has the calls array
    const opportunityWithCalls = {
      ...createdOpportunity,
      calls: createdOpportunity.calls ?? [],
    };
    
    setEditingOpportunity(opportunityWithCalls);
    console.log('Edit sheet should now be open with opportunity:', opportunityWithCalls);
  };

  useEffect(() => {
    if (editingOpportunity) {
      const updatedOpportunity = opportunities.find(o => o.id === editingOpportunity.id);
      if (updatedOpportunity) {
        if (JSON.stringify(updatedOpportunity) !== JSON.stringify(editingOpportunity)) {
          setEditingOpportunity(updatedOpportunity);
        }
      } else {
        setEditingOpportunity(null);
      }
    }
  }, [opportunities, editingOpportunity]);

  const getSalespersonName = (id: number) => {
    const salesperson = salespeople.find(s => s.id === id);
    return salesperson ? salesperson.name : 'Unknown';
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-blue-100 text-blue-800',
      won: 'bg-success-50 text-success-600',
      lost: 'bg-red-100 text-red-800',
      created: 'bg-gray-100 text-gray-800',
      pitched: 'bg-yellow-100 text-yellow-800',
      'n/a': 'bg-gray-100 text-gray-800',
    };
    return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800';
  };

  const { groupedOpportunities, sortedMonthKeys, filteredOpportunities } = useGroupedOpportunities(
    opportunities, searchTerm, statusFilter, sourceFilter, getSalespersonName
  );

  const handleDeleteConfirm = (opportunityId: number) => {
    deleteOpportunity(opportunityId);
    setDeleteDialogOpen(false);
    setOpportunityToDelete(null);
  };

  if (isLoading) {
    return <OpportunitiesLoading />;
  }

  return (
    <TooltipProvider>
      <div className="p-6">
        <OpportunitiesHeader onNewOpportunity={() => setIsDialogOpen(true)} />

        <OpportunitiesFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          sourceFilter={sourceFilter}
          setSourceFilter={setSourceFilter}
          leadSources={leadSources}
        />
        
        <OpportunitiesGroupList
          groupedOpportunities={groupedOpportunities}
          sortedMonthKeys={sortedMonthKeys}
          getSalespersonName={getSalespersonName}
          getStatusBadge={getStatusBadge}
          onEdit={setEditingOpportunity}
          onFiles={setFilesDialogOpportunity}
          onNotes={setNotesDialogOpportunity}
          onContacts={setContactsDialogOpportunity}
          onDelete={(op) => {
            setOpportunityToDelete(op);
            setDeleteDialogOpen(true);
          }}
        />

        {filteredOpportunities.length === 0 && (
          <OpportunitiesEmptyState
            hasFilters={!!(searchTerm || statusFilter !== 'all' || sourceFilter !== 'all')}
            onNewOpportunity={() => setIsDialogOpen(true)}
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
          onConfirm={handleDeleteConfirm}
          isDeleting={isDeleting}
        />
      </div>
    </TooltipProvider>
  );
};
