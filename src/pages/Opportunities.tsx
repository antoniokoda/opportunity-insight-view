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
    setIsDialogOpen(false);
    // Buscar la oportunidad en el array más actualizado (por si la mutación tarda un poco)
    const fullOpportunity = opportunities.find(o => o.id === createdOpportunity.id) || createdOpportunity;
    setEditingOpportunity(fullOpportunity);
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

  // Ahora agrupamos por la fecha de la última llamada (o grupo especial si no hay llamadas)
  const filteredOpportunities = opportunities.filter(opportunity => {
    const matchesSearch = opportunity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getSalespersonName(opportunity.salesperson_id).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || opportunity.opportunity_status === statusFilter;
    const matchesSource = sourceFilter === 'all' || opportunity.lead_source === sourceFilter;
    return matchesSearch && matchesStatus && matchesSource;
  });

  // Agrupar por fecha de última llamada, formato MES/AÑO
  const groupedOpportunities = filteredOpportunities.reduce((groups, opportunity) => {
    const lastCallDate = getLastCallDate(opportunity);
    if (!lastCallDate) {
      // Grupo especial: "Sin llamadas"
      if (!groups['no_calls']) {
        groups['no_calls'] = {
          label: 'Sin llamadas',
          opportunities: []
        };
      }
      groups['no_calls'].opportunities.push(opportunity);
      return groups;
    }
    const monthKey = format(new Date(lastCallDate), 'yyyy-MM', { locale: es });
    const monthLabel = format(new Date(lastCallDate), 'MMMM yyyy', { locale: es });
    if (!groups[monthKey]) {
      groups[monthKey] = {
        label: monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1),
        opportunities: []
      };
    }
    groups[monthKey].opportunities.push(opportunity);
    return groups;
  }, {} as Record<string, { label: string; opportunities: Opportunity[] }>);

  // Ordenar: primero los meses, luego (si existe) el grupo "Sin llamadas" al final
  const sortedMonthKeys = Object.keys(groupedOpportunities)
    .filter(key => key !== 'no_calls')
    .sort((a, b) => b.localeCompare(a));
  if (groupedOpportunities['no_calls']) {
    sortedMonthKeys.push('no_calls');
  }

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

  const getCallTypeColor = (type: string) => {
    if (type.startsWith('Discovery')) {
      return 'bg-blue-100 text-blue-800';
    } else if (type.startsWith('Closing')) {
      return 'bg-success-50 text-success-600';
    }
    return 'bg-gray-100 text-gray-800';
  };

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
        <div className="space-y-8">
          {sortedMonthKeys.map((monthKey, monthIndex) => (
            <div key={monthKey}>
              {/* Month Separator */}
              <div className="flex items-center gap-4 mb-6">
                {/* Título del mes con color primario - Tarea 1.2 */}
                <h2 className="text-xl font-semibold text-zinc-900">
                  {groupedOpportunities[monthKey].label}
                </h2>
                <Separator className="flex-1" />
                {/* Contador con color secundario legible - Tarea 1.2 */}
                <span className="text-sm text-zinc-600">
                  {groupedOpportunities[monthKey].opportunities.length} oportunidad{groupedOpportunities[monthKey].opportunities.length !== 1 ? 'es' : ''}
                </span>
              </div>

              {/* Opportunities Grid for this month */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* Changed lg:grid-cols-3 to md:grid-cols-2 (implicitly covers lg) */}
                {groupedOpportunities[monthKey].opportunities.map((opportunity) => (
                  <Card key={opportunity.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          {/* Nombre de oportunidad con color primario - Tarea 1.2 */}
                          <CardTitle className="text-lg text-zinc-900 line-clamp-2">
                            {opportunity.name}
                          </CardTitle>
                          {/* Nombre del vendedor con color secundario legible - Tarea 1.2 */}
                          <p className="text-sm text-zinc-600 mt-1">
                            {getSalespersonName(opportunity.salesperson_id)}
                          </p>
                        </div>
                        <div className="flex gap-1 ml-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setContactsDialogOpportunity(opportunity)}
                              >
                                <Users className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Contactos</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setFilesDialogOpportunity(opportunity)}
                              >
                                <Folder className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Archivos</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setNotesDialogOpportunity(opportunity)}
                              >
                                <StickyNote className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Notas</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingOpportunity(opportunity)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Editar</TooltipContent>
                          </Tooltip>
                          {/* Botón Eliminar */}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setOpportunityToDelete(opportunity);
                                  setDeleteDialogOpen(true);
                                }}
                              >
                                <Trash className="w-4 h-4 text-red-500" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Eliminar</TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* Status and Financial Info */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          {/* Etiquetas con color secundario - Tarea 1.2 */}
                          <span className="text-sm text-zinc-600">Estado:</span>
                          <Badge variant="outline" className={getStatusBadge(opportunity.opportunity_status)}>
                            {opportunity.opportunity_status === 'active' && 'Activo'}
                            {opportunity.opportunity_status === 'won' && 'Ganado'}
                            {opportunity.opportunity_status === 'lost' && 'Perdido'}
                          </Badge>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-zinc-600">Propuesta:</span>
                          <Badge variant="outline" className={getStatusBadge(opportunity.proposal_status)}>
                            {opportunity.proposal_status === 'n/a' && 'N/A'}
                            {opportunity.proposal_status === 'created' && 'Creada'}
                            {opportunity.proposal_status === 'pitched' && 'Presentada'}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="text-center p-2 bg-zinc-50 rounded">
                            <div className="text-xs text-zinc-600">Revenue</div>
                            {/* Valores monetarios con color primario - Tarea 1.2 */}
                            <div className="font-semibold text-sm text-zinc-900">
                              {formatCurrency(opportunity.revenue)}
                            </div>
                          </div>
                          <div className="text-center p-2 bg-zinc-50 rounded">
                            <div className="text-xs text-zinc-600">Cobrado</div>
                            <div className="font-semibold text-sm text-zinc-900">
                              {formatCurrency(opportunity.cash_collected)}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Calls Section */}
                      {opportunity.calls && opportunity.calls.length > 0 && (
                        <CallSummaryList calls={opportunity.calls} />
                      )}

                      {/* Source and Date */}
                      <div className="pt-2 border-t space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          {/* Etiquetas con color secundario, valores con color primario */}
                          <span className="text-zinc-600">Fuente:</span>
                          <span className="font-medium text-zinc-900">{opportunity.lead_source}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-zinc-600">Creada:</span>
                          <span className="text-zinc-900">{format(new Date(opportunity.created_at), 'dd/MM/yyyy', { locale: es })}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

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
