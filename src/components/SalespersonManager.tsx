
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, Loader2, Edit, Trash2, Mail } from 'lucide-react';
import { useSalespeople } from '@/hooks/useSalespeople';

export const SalespersonManager: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSalesperson, setEditingSalesperson] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [newSalesperson, setNewSalesperson] = useState({
    name: '',
    email: ''
  });

  const {
    salespeople,
    isLoading,
    addSalesperson,
    updateSalesperson,
    deleteSalesperson,
    isAdding,
    isDeleting
  } = useSalespeople();

  const handleAddSalesperson = () => {
    if (newSalesperson.name && newSalesperson.email) {
      addSalesperson(newSalesperson);
      setNewSalesperson({
        name: '',
        email: ''
      });
      setShowAddForm(false);
    }
  };

  const handleDeleteSalesperson = async (salespersonId: number, salespersonName: string) => {
    // Diálogo de confirmación crítico con información sobre las consecuencias
    const confirmMessage = `¿Estás seguro de que quieres eliminar a "${salespersonName}"?\n\nEsta acción no se puede deshacer y se realizarán los siguientes cambios:\n• El vendedor será eliminado permanentemente\n• Las oportunidades asignadas a este vendedor quedarán sin asignar\n• Esta operación puede afectar tus reportes y estadísticas\n\n¿Continuar con la eliminación?`;
    
    if (confirm(confirmMessage)) {
      console.log('Deleting salesperson with ID:', salespersonId);
      setDeletingId(salespersonId);
      try {
        await deleteSalesperson(salespersonId);
      } catch (error) {
        console.error('Error deleting salesperson:', error);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingSalesperson(null);
    setNewSalesperson({
      name: '',
      email: ''
    });
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span>Cargando vendedores...</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Vendedores</h3>
          <Badge variant="secondary">{salespeople.length}</Badge>
        </div>
        {!showAddForm && (
          <Button onClick={() => setShowAddForm(true)} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Agregar
          </Button>
        )}
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="mb-4 p-4 border rounded-lg bg-muted/50">
          <h4 className="font-medium mb-3">Nuevo Vendedor</h4>
          <div className="space-y-3">
            <Input
              placeholder="Nombre completo"
              value={newSalesperson.name}
              onChange={(e) => setNewSalesperson(prev => ({ ...prev, name: e.target.value }))}
            />
            <Input
              type="email"
              placeholder="Email"
              value={newSalesperson.email}
              onChange={(e) => setNewSalesperson(prev => ({ ...prev, email: e.target.value }))}
            />
            <div className="flex gap-2">
              <Button onClick={handleAddSalesperson} disabled={isAdding} size="sm">
                {isAdding && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Agregar
              </Button>
              <Button variant="outline" onClick={handleCancel} size="sm">
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Salespeople List */}
      <div className="space-y-2">
        {salespeople.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No hay vendedores registrados
          </div>
        ) : (
          salespeople.map((person) => (
            <div key={person.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-medium text-sm">
                  {person.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium">{person.name}</p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Mail className="w-3 h-3" />
                    <span>{person.email}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleDeleteSalesperson(person.id, person.name)}
                  disabled={deletingId === person.id || isDeleting}
                >
                  {(deletingId === person.id || isDeleting) ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
