import React, { useState } from 'react';
import { Plus, Phone, Edit, Trash2, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useOpportunities } from '@/hooks/useOpportunities';
import { useSalespeople } from '@/hooks/useSalespeople';
import { OpportunityDialog } from '@/components/opportunities/OpportunityDialog';
import { OpportunityEditSheet } from '@/components/opportunities/OpportunityEditSheet';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { formatCurrency } from '@/config/currency';
import type { Opportunity } from '@/hooks/useOpportunities';

export const Opportunities = () => {
  const { opportunities, isLoading, deleteOpportunity } = useOpportunities();
  const { salespeople } = useSalespeople();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState<Opportunity | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');

  const filteredOpportunities = opportunities.filter(opportunity => {
    const matchesSearch = opportunity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getSalespersonName(opportunity.salesperson_id).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || opportunity.opportunity_status === statusFilter;
    const matchesSource = sourceFilter === 'all' || opportunity.lead_source === sourceFilter;
    
    return matchesSearch && matchesStatus && matchesSource;
  });

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
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
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
            <h1 className="text-3xl font-bold text-foreground">Oportunidades</h1>
            <p className="text-muted-foreground">Gestiona tus oportunidades de venta</p>
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
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
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
              <SelectItem value="Website">Website</SelectItem>
              <SelectItem value="Referral">Referencia</SelectItem>
              <SelectItem value="Cold Outreach">Prospección</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Opportunities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOpportunities.map((opportunity) => (
            <Card key={opportunity.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg text-foreground line-clamp-2">
                      {opportunity.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {getSalespersonName(opportunity.salesperson_id)}
                    </p>
                  </div>
                  <div className="flex gap-1 ml-2">
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
                    <span className="text-sm text-muted-foreground">Estado:</span>
                    <Badge className={getStatusBadge(opportunity.opportunity_status)}>
                      {opportunity.opportunity_status === 'active' && 'Activo'}
                      {opportunity.opportunity_status === 'won' && 'Ganado'}
                      {opportunity.opportunity_status === 'lost' && 'Perdido'}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Propuesta:</span>
                    <Badge className={getStatusBadge(opportunity.proposal_status)}>
                      {opportunity.proposal_status === 'created' && 'Creada'}
                      {opportunity.proposal_status === 'pitched' && 'Presentada'}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-center p-2 bg-muted rounded">
                      <div className="text-xs text-muted-foreground">Revenue</div>
                      <div className="font-semibold text-sm">
                        {formatCurrency(opportunity.revenue)}
                      </div>
                    </div>
                    <div className="text-center p-2 bg-muted rounded">
                      <div className="text-xs text-muted-foreground">Cobrado</div>
                      <div className="font-semibold text-sm">
                        {formatCurrency(opportunity.cash_collected)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Calls Section */}
                {opportunity.calls && opportunity.calls.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Llamadas ({opportunity.calls.length})</span>
                    </div>
                    <div className="space-y-1 max-h-20 overflow-y-auto">
                      {opportunity.calls.slice(0, 3).map((call) => (
                        <div key={call.id} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <Badge size="sm" className={getCallTypeColor(call.type)}>
                              {call.type} #{call.number}
                            </Badge>
                            {call.attended !== null && (
                              <Badge 
                                size="sm" 
                                variant={call.attended ? "default" : "destructive"}
                              >
                                {call.attended ? "✓" : "✗"}
                              </Badge>
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
                    <span className="text-muted-foreground">Fuente:</span>
                    <span className="font-medium">{opportunity.lead_source}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Creada:</span>
                    <span>{format(new Date(opportunity.created_at), 'dd/MM/yyyy', { locale: es })}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredOpportunities.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
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
      </div>
    </TooltipProvider>
  );
};
