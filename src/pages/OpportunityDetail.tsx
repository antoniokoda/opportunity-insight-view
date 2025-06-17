
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, FileText, Users, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useOpportunitiesWithPipeline } from '@/hooks/useOpportunitiesWithPipeline';
import { useSalespeople } from '@/hooks/useSalespeople';
import { formatCurrency } from '@/config/currency';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { OpportunityFilesDialog } from '@/components/opportunities/OpportunityFilesDialog';
import { OpportunityNotesDialog } from '@/components/opportunities/OpportunityNotesDialog';
import { OpportunityContactsDialog } from '@/components/opportunities/OpportunityContactsDialog';
import { OpportunityEditSheet } from '@/components/opportunities/OpportunityEditSheet';
import { CallList } from '@/components/opportunities/CallList';

export const OpportunityDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { opportunities, isLoading } = useOpportunitiesWithPipeline();
  const { salespeople } = useSalespeople();

  const [editingOpportunity, setEditingOpportunity] = React.useState(false);
  const [filesDialogOpen, setFilesDialogOpen] = React.useState(false);
  const [notesDialogOpen, setNotesDialogOpen] = React.useState(false);
  const [contactsDialogOpen, setContactsDialogOpen] = React.useState(false);

  const opportunity = opportunities.find(opp => opp.id === parseInt(id || '0'));

  const getSalespersonName = (id: number | null) => {
    if (!id) return 'Sin asignar';
    const salesperson = salespeople.find(s => s.id === id);
    return salesperson ? salesperson.name : 'Sin asignar';
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'won': return 'default';
      case 'lost': return 'secondary';
      default: return 'outline';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'won': return 'Ganado';
      case 'lost': return 'Perdido';
      default: return status;
    }
  };

  const getProposalStatusLabel = (status: string) => {
    switch (status) {
      case 'n/a': return 'N/A';
      case 'created': return 'Creada';
      case 'pitched': return 'Presentada';
      default: return status;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-zinc-900"></div>
          <p className="mt-4 text-zinc-600">Cargando oportunidad...</p>
        </div>
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-zinc-900 mb-2">Oportunidad no encontrada</h1>
          <p className="text-zinc-600 mb-4">La oportunidad que buscas no existe o no tienes permisos para verla.</p>
          <Button onClick={() => navigate('/opportunities')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Oportunidades
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/opportunities')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-zinc-900">{opportunity.name}</h1>
                <p className="text-zinc-600">
                  {opportunity.pipeline_name} • {opportunity.stage_name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setEditingOpportunity(true)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview Card */}
            <Card>
              <CardHeader>
                <CardTitle>Información General</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-zinc-700">Revenue</label>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(opportunity.revenue)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-zinc-700">Cobrado</label>
                    <p className="text-2xl font-bold text-zinc-900">
                      {formatCurrency(opportunity.cash_collected)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-zinc-700">Vendedor</label>
                    <p className="text-lg">{getSalespersonName(opportunity.salesperson_id)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-zinc-700">Fuente</label>
                    <p className="text-lg">{opportunity.lead_source}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-zinc-700">Estado</label>
                    <Badge variant={getStatusBadgeVariant(opportunity.opportunity_status)}>
                      {getStatusLabel(opportunity.opportunity_status)}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-zinc-700">Propuesta</label>
                    <Badge variant="outline">
                      {getProposalStatusLabel(opportunity.proposal_status)}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-zinc-700">Creada</label>
                    <p className="text-lg">
                      {format(new Date(opportunity.created_at), 'dd/MM/yyyy HH:mm', { locale: es })}
                    </p>
                  </div>
                  {opportunity.last_interaction_at && (
                    <div>
                      <label className="text-sm font-medium text-zinc-700">Última interacción</label>
                      <p className="text-lg">
                        {format(new Date(opportunity.last_interaction_at), 'dd/MM/yyyy HH:mm', { locale: es })}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Pipeline Status */}
            <Card>
              <CardHeader>
                <CardTitle>Estado del Pipeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  {opportunity.stage_color && (
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: opportunity.stage_color }}
                    />
                  )}
                  <div>
                    <p className="font-medium">{opportunity.stage_name}</p>
                    <p className="text-sm text-zinc-600">{opportunity.pipeline_name}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Calls Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Llamadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CallList opportunityId={opportunity.id} />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setFilesDialogOpen(true)}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Gestionar Archivos
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setNotesDialogOpen(true)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Ver Notas
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setContactsDialogOpen(true)}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Gestionar Contactos
                </Button>
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Estadísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-zinc-700">Total de llamadas</label>
                  <p className="text-xl font-semibold">{opportunity.calls?.length || 0}</p>
                </div>
                <Separator />
                <div>
                  <label className="text-sm font-medium text-zinc-700">Porcentaje cobrado</label>
                  <p className="text-xl font-semibold">
                    {opportunity.revenue > 0 ? Math.round((opportunity.cash_collected / opportunity.revenue) * 100) : 0}%
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modals */}
      <OpportunityEditSheet
        opportunity={opportunity}
        isOpen={editingOpportunity}
        onClose={() => setEditingOpportunity(false)}
      />

      <OpportunityFilesDialog
        opportunityId={opportunity.id}
        opportunityName={opportunity.name}
        isOpen={filesDialogOpen}
        onClose={() => setFilesDialogOpen(false)}
      />

      <OpportunityNotesDialog
        opportunityId={opportunity.id}
        opportunityName={opportunity.name}
        isOpen={notesDialogOpen}
        onClose={() => setNotesDialogOpen(false)}
      />

      <OpportunityContactsDialog
        opportunityId={opportunity.id}
        opportunityName={opportunity.name}
        isOpen={contactsDialogOpen}
        onClose={() => setContactsDialogOpen(false)}
      />
    </div>
  );
};
