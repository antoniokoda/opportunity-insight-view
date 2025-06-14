import React, { useState, useEffect } from 'react';
import { Plus, Phone, Edit, Trash2, Search, Filter, Folder, StickyNote, Users, ExternalLink, Link as LinkIcon } from 'lucide-react';
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
import type { Opportunity } from '@/hooks/useOpportunities';

export const Opportunities = () => {
  const { opportunities, isLoading, deleteOpportunity } = useOpportunities();
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

  const filteredOpportunities = opportunities.filter(opportunity => {
    const matchesSearch = opportunity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getSalespersonName(opportunity.salesperson_id).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || opportunity.opportunity_status === statusFilter;
    const matchesSource = sourceFilter === 'all' || opportunity.lead_source === sourceFilter;
    
    return matchesSearch && matchesStatus && matchesSource;
  });

  // Group opportunities by month
  const groupedOpportunities = filteredOpportunities.reduce((groups, opportunity) => {
    const monthKey = format(new Date(opportunity.created_at), 'yyyy-MM', { locale: es });
    const monthLabel = format(new Date(opportunity.created_at), 'MMMM yyyy', { locale: es });
    
    if (!groups[monthKey]) {
      groups[monthKey] = {
        label: monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1),
        opportunities: []
      };
    }
    
    groups[monthKey].opportunities.push(opportunity);
    return groups;
  }, {} as Record<string, { label: string; opportunities: Opportunity[] }>);

  // Sort months in descending order (newest first)
  const sortedMonthKeys = Object.keys(groupedOpportunities).sort((a, b) => b.localeCompare(a));

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

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              {/* Icono de búsqueda con mejor contraste */}
              <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
              <Input
                placeholder="Buscar oportunidades..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="active">Activo</SelectItem>
              <SelectItem value="won">Ganado</SelectItem>
              <SelectItem value="lost">Perdido</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Fuente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las fuentes</SelectItem>
              {leadSources.map(source => (
                <SelectItem key={source.id} value={source.name}>
                  {source.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

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
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteOpportunity(opportunity.id)}
                              >
                                <Trash2 className="w-4 h-4" />
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
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            {/* Icono con color secundario */}
                            <Phone className="w-4 h-4 text-zinc-600" />
                            {/* Título de sección con color primario */}
                            <span className="text-sm font-medium text-zinc-900">Llamadas ({opportunity.calls.length})</span>
                          </div>
                          <div className="space-y-1 max-h-20 overflow-y-auto">
                            {opportunity.calls.slice(0, 3).map((call) => (
                              <div key={call.id} className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className={getCallTypeColor(call.type)}>
                                    {call.type} #{call.number}
                                  </Badge>
                                  {call.attended !== null && (
                                    <Badge 
                                      variant={call.attended ? "attended" : "not-attended"}
                                    >
                                      {call.attended ? "Asistió" : "No asistió"}
                                    </Badge>
                                  )}
                                  {call.link && (
                                    <>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <a href={call.link} target="_blank" rel="noopener noreferrer" className="flex items-center">
                                            <ExternalLink className="w-3 h-3 text-zinc-500 hover:text-zinc-800" />
                                          </a>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Abrir enlace</p>
                                        </TooltipContent>
                                      </Tooltip>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="w-6 h-6 p-0"
                                            onClick={(e) => {
                                              e.preventDefault();
                                              window.open(call.link!, "_blank", "noopener,noreferrer");
                                            }}
                                            aria-label="Ir al enlace de la reunión"
                                          >
                                            <LinkIcon className="w-4 h-4 text-blue-500" />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Ir a la reunión</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </>
                                  )}
                                </div>
                                <span className="text-muted-foreground">
                                  {format(new Date(call.date), 'dd/MM', { locale: es })}
                                </span>
                              </div>
                            ))}
                            {opportunity.calls.length > 3 && (
                              <div className="text-xs text-muted-foreground text-center">
                                +{opportunity.calls.length - 3} más
                              </div>
                            )}
                          </div>
                        </div>
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
      </div>
    </TooltipProvider>
  );
};
