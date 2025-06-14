import React, { useState, useEffect } from 'react';
import { Plus, Phone, Edit, Trash2, Search, Filter, Folder, StickyNote, Users, ExternalLink, Link as LinkIcon, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { useOpportunities } from '@/hooks/useOpportunities';
import { useSalespeople } from '@/hooks/useSalespeople';
import { useLeadSourcesWithPersistence } from '@/hooks/useLeadSourcesWithPersistence';
import { OpportunityDialog } from '@/components/opportunities/OpportunityDialog';
import { OpportunityEditSheet } from '@/components/opportunities/OpportunityEditSheet';
import { OpportunityFilesDialog } from '@/components/opportunities/OpportunityFilesDialog';
import { OpportunityNotesDialog } from '@/components/opportunities/OpportunityNotesDialog';
import { OpportunityContactsDialog } from '@/components/opportunities/OpportunityContactsDialog';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { formatCurrency } from '@/config/currency';
import { useCalls } from '@/hooks/useCalls';
import type { Opportunity } from '@/hooks/useOpportunities';
import { OpportunitiesFilters } from '@/components/opportunities/OpportunitiesFilters';
import { CallSummaryList } from '@/components/opportunities/CallSummaryList';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';

import { OpportunitiesGroupList } from '@/components/opportunities/OpportunitiesGroupList';
import { useGroupedOpportunities } from '@/components/opportunities/useGroupedOpportunities';

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

  // Add missing state for delete dialog logic
  const [opportunityToDelete, setOpportunityToDelete] = useState<Opportunity | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Manejar apertura automática de la edición después de crear una nueva oportunidad
  const handleOpportunityCreated = (createdOpportunity: Opportunity) => {
    // Cierra el diálogo inmediatamente
    setIsDialogOpen(false);

    // Abre el edit sheet inmediatamente con el objeto recien creado.
    // No depende de "opportunities" para evitar retrasos de react-query.
    setEditingOpportunity({
      ...createdOpportunity,
      // Si la mutación aún no retorna "calls", inicialízalo como []
      calls: createdOpportunity.calls ?? [],
    });

    // DEBUG: Ver en consola si everthing va bien
    console.log('handleOpportunityCreated', createdOpportunity);
    // Opcional: abrir el edit sheet tras un pequeño delay para asegurar cierre de dialog antes de abrir edit sheet
    // setTimeout(() => setEditingOpportunity({...createdOpportunity, calls: createdOpportunity.calls ?? []}), 100);
  };

  // Para manejo individual de eliminación de llamadas
  const [isDeletingCallId, setIsDeletingCallId] = useState<number | null>(null);

  // Fix duplicate isDeleting import from useCalls
  const { deleteCall, isDeleting: isDeletingCall } = useCalls();

  useEffect(() => {
    if (editingOpportunity) {
      const updatedOpportunity = opportunities.find(o => o.id === editingOpportunity.id);
      if (updatedOpportunity) {
        // Compare to prevent re-render loops
        if (JSON.stringify(updatedOpportunity) !== JSON.stringify(editingOpportunity)) {
          setEditingOpportunity(updatedOpportunity);
        }
      } else {
        // Opportunity was deleted, so close the sheet
        setEditingOpportunity(null);
      }
    }
  }, [opportunities, editingOpportunity]);

  // Nueva función: obtiene la fecha de la última llamada de una oportunidad o undefined si no tiene
  const getLastCallDate = (opportunity) => {
    if (opportunity.calls && opportunity.calls.length > 0) {
      // ordenamos las llamadas en orden descendente y tomamos la fecha más reciente
      const lastCall = [...opportunity.calls].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
      return lastCall.date;
    }
    return undefined;
  };

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

  // Nuevo: agrupación custom hook
  const { groupedOpportunities, sortedMonthKeys, filteredOpportunities } = useGroupedOpportunities(
    opportunities, searchTerm, statusFilter, sourceFilter, getSalespersonName
  );

  // Añadimos esta función para saber si una llamada es pasada
  const isCallInThePast = (callDate: string) => {
    return new Date(callDate) < new Date(); // compara con la fecha actual
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                {/* Loading skeleton mejorado */}
                <div className="h-4 bg-zinc-200 rounded w-3/4"></div>
                <div className="h-3 bg-zinc-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-zinc-200 rounded"></div>
                  <div className="h-3 bg-zinc-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            {/* Título principal con color primario para máximo contraste - Tarea 1.2 */}
            <h1 className="text-3xl font-bold text-zinc-900">Oportunidades</h1>
            {/* Subtítulo con color secundario legible - Tarea 1.2 */}
            <p className="text-zinc-600">Gestiona tus oportunidades de venta</p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)} className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Nueva Oportunidad
          </Button>
        </div>
        <OpportunitiesFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          sourceFilter={sourceFilter}
          setSourceFilter={setSourceFilter}
          leadSources={leadSources}
        />
        {/* Grouped Opportunities */}
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
          <div className="text-center py-12">
            {/* Mensaje de estado vacío con color secundario legible */}
            <div className="text-zinc-600 mb-4">
              {searchTerm || statusFilter !== 'all' || sourceFilter !== 'all' 
                ? 'No se encontraron oportunidades con los filtros aplicados'
                : 'No hay oportunidades aún'}
            </div>
            {(!searchTerm && statusFilter === 'all' && sourceFilter === 'all') && (
              <Button onClick={() => setIsDialogOpen(true)} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Crear primera oportunidad
              </Button>
            )}
          </div>
        )}

        <OpportunityDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onCreated={handleOpportunityCreated} // Usa el callback corregido que abre el edit sheet
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

        {/* Alert Dialog: Confirmar eliminación */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Eliminar oportunidad</AlertDialogTitle>
              <AlertDialogDescription>
                ¿Seguro que quieres eliminar la oportunidad <span className="font-semibold">{opportunityToDelete?.name}</span>? Esta acción no se puede deshacer y también eliminará sus llamadas, archivos, notas y contactos asociados.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (opportunityToDelete) {
                    deleteOpportunity(opportunityToDelete.id);
                    setDeleteDialogOpen(false);
                    setOpportunityToDelete(null);
                  }
                }}
                disabled={isDeleting}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                {isDeleting ? 'Eliminando...' : 'Eliminar'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  );
};
