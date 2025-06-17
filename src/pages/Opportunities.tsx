
import React, { useState, useEffect, useCallback } from 'react';
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
  
  // PASO 2: Sistema de estado intermedio para manejar timing
  const [pendingEditOpportunity, setPendingEditOpportunity] = useState<number | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [filesDialogOpportunity, setFilesDialogOpportunity] = useState<Opportunity | null>(null);
  const [notesDialogOpportunity, setNotesDialogOpportunity] = useState<Opportunity | null>(null);
  const [contactsDialogOpportunity, setContactsDialogOpportunity] = useState<Opportunity | null>(null);
  const [opportunityToDelete, setOpportunityToDelete] = useState<Opportunity | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // PASO 3: Refactorizar el callback de creación usando useCallback
  const handleOpportunityCreated = useCallback((createdOpportunity: Opportunity) => {
    console.log('=== PASO 3: handleOpportunityCreated EJECUTADO ===');
    console.log('createdOpportunity recibida:', createdOpportunity);
    console.log('createdOpportunity.id:', createdOpportunity.id);
    
    // En lugar de abrir directamente, establecer pendingEditOpportunity
    console.log('Estableciendo pendingEditOpportunity a:', createdOpportunity.id);
    setPendingEditOpportunity(createdOpportunity.id);
    
    // Cerrar el diálogo inmediatamente
    console.log('Cerrando diálogo...');
    setIsDialogOpen(false);
  }, []);

  // PASO 2: useEffect para manejar la apertura del sheet cuando el diálogo esté cerrado
  useEffect(() => {
    console.log('=== PASO 2: useEffect TIMING CONTROL ===');
    console.log('pendingEditOpportunity:', pendingEditOpportunity);
    console.log('isDialogOpen:', isDialogOpen);
    console.log('opportunities.length:', opportunities.length);
    
    // Solo proceder si hay una oportunidad pendiente y el diálogo está cerrado
    if (pendingEditOpportunity && !isDialogOpen) {
      console.log('Condiciones cumplidas, buscando oportunidad...');
      
      // Usar requestAnimationFrame para mejor sincronización con React
      requestAnimationFrame(() => {
        console.log('RequestAnimationFrame ejecutado, buscando oportunidad ID:', pendingEditOpportunity);
        
        const foundOpportunity = opportunities.find(o => o.id === pendingEditOpportunity);
        console.log('Oportunidad encontrada:', foundOpportunity);
        
        if (foundOpportunity) {
          console.log('=== ABRIENDO EDIT SHEET ===');
          
          // Asegurar que la oportunidad tiene el array de calls
          const opportunityWithCalls = {
            ...foundOpportunity,
            calls: foundOpportunity.calls ?? [],
          };
          
          console.log('Setting editingOpportunity to:', opportunityWithCalls);
          setEditingOpportunity(opportunityWithCalls);
          
          // Limpiar el estado pendiente
          console.log('Limpiando pendingEditOpportunity...');
          setPendingEditOpportunity(null);
        } else {
          console.log('Oportunidad no encontrada aún, esperando...');
          // Si no se encuentra, podemos intentar de nuevo en el próximo render
          // o implementar un timeout para evitar bucles infinitos
        }
      });
    }
  }, [pendingEditOpportunity, isDialogOpen, opportunities]);

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
          onClose={() => {
            console.log('=== OpportunityDialog onClose ===');
            setIsDialogOpen(false);
          }}
          onCreated={handleOpportunityCreated}
        />
        <OpportunityEditSheet
          opportunity={editingOpportunity}
          isOpen={!!editingOpportunity}
          onClose={() => {
            console.log('=== OpportunityEditSheet onClose ===');
            setEditingOpportunity(null);
          }}
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
