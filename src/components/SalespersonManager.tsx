import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, Loader2, Edit, Trash2, Mail, X, Check } from 'lucide-react';
import { useSalespeople, Salesperson } from '@/hooks/useSalespeople';
export const SalespersonManager: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSalesperson, setEditingSalesperson] = useState<Salesperson | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [newSalesperson, setNewSalesperson] = useState({
    name: '',
    email: ''
  });
  const [editForm, setEditForm] = useState({
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
    isUpdating,
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
  const handleEditStart = (salesperson: Salesperson) => {
    setEditingSalesperson(salesperson);
    setEditForm({
      name: salesperson.name,
      email: salesperson.email
    });
  };
  const handleEditSave = () => {
    if (editingSalesperson && editForm.name && editForm.email) {
      updateSalesperson({
        id: editingSalesperson.id,
        name: editForm.name,
        email: editForm.email
      });
      setEditingSalesperson(null);
      setEditForm({
        name: '',
        email: ''
      });
    }
  };
  const handleEditCancel = () => {
    setEditingSalesperson(null);
    setEditForm({
      name: '',
      email: ''
    });
  };
  const handleDeleteSalesperson = async (salespersonId: number, salespersonName: string) => {
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
    setEditForm({
      name: '',
      email: ''
    });
  };
  if (isLoading) {
    return <Card className="p-6">
        <div className="flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span>Cargando vendedores...</span>
        </div>
      </Card>;
  }
  return <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Vendedores</h3>
          <Badge variant="secondary" className="bg-zinc-800">{salespeople.length}</Badge>
        </div>
        {!showAddForm && <Button onClick={() => setShowAddForm(true)} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Agregar
          </Button>}
      </div>

      {/* Add Form */}
      {showAddForm && <div className="mb-4 p-4 border rounded-lg bg-muted/50">
          <h4 className="font-medium mb-3">Nuevo Vendedor</h4>
          <div className="space-y-3">
            <Input placeholder="Nombre completo" value={newSalesperson.name} onChange={e => setNewSalesperson(prev => ({
          ...prev,
          name: e.target.value
        }))} />
            <Input type="email" placeholder="Email" value={newSalesperson.email} onChange={e => setNewSalesperson(prev => ({
          ...prev,
          email: e.target.value
        }))} />
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
        </div>}

      {/* Salespeople List */}
      <div className="space-y-2">
        {salespeople.length === 0 ? <div className="text-center py-8 text-zinc-700 dark:text-zinc-300">
            No hay vendedores registrados
          </div> : salespeople.map(person => <div key={person.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
              {editingSalesperson?.id === person.id ?
        // Edit Mode
        <div className="flex-1 flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-medium text-sm">
                    {editForm.name.charAt(0).toUpperCase() || person.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 space-y-2">
                    <Input placeholder="Nombre completo" value={editForm.name} onChange={e => setEditForm(prev => ({
              ...prev,
              name: e.target.value
            }))} className="h-8" />
                    <Input type="email" placeholder="Email" value={editForm.email} onChange={e => setEditForm(prev => ({
              ...prev,
              email: e.target.value
            }))} className="h-8" />
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={handleEditSave} disabled={isUpdating || !editForm.name || !editForm.email}>
                      {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleEditCancel} disabled={isUpdating}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div> :
        // View Mode
        <>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-primary-foreground font-medium text-sm bg-zinc-950">
                      {person.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{person.name}</p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Mail className="w-3 h-3" />
                        <span className="text-zinc-950">{person.email}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handleEditStart(person)} disabled={editingSalesperson !== null || isUpdating}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteSalesperson(person.id, person.name)} disabled={deletingId === person.id || isDeleting || editingSalesperson !== null}>
                      {deletingId === person.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </Button>
                  </div>
                </>}
            </div>)}
      </div>
    </Card>;
};