
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Target, Loader2, Edit, Trash2, X, Check } from 'lucide-react';
import { useLeadSourcesWithPersistence } from '@/hooks/useLeadSourcesWithPersistence';

interface LeadSource {
  id: string;
  name: string;
  user_id: string;
  created_at: string;
}

export const LeadSourceManager: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSource, setEditingSource] = useState<LeadSource | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [newSourceName, setNewSourceName] = useState('');
  const [editName, setEditName] = useState('');

  const {
    leadSources,
    isLoading,
    addLeadSource,
    updateLeadSource,
    deleteLeadSource,
    isAdding,
    isUpdating,
    isDeleting
  } = useLeadSourcesWithPersistence();

  const handleAddSource = () => {
    if (newSourceName.trim()) {
      addLeadSource(newSourceName.trim());
      setNewSourceName('');
      setShowAddForm(false);
    }
  };

  const handleEditStart = (source: LeadSource) => {
    setEditingSource(source);
    setEditName(source.name);
  };

  const handleEditSave = () => {
    if (editingSource && editName.trim()) {
      updateLeadSource({
        id: editingSource.id,
        name: editName.trim()
      });
      setEditingSource(null);
      setEditName('');
    }
  };

  const handleEditCancel = () => {
    setEditingSource(null);
    setEditName('');
  };

  const handleDeleteSource = async (sourceId: string, sourceName: string) => {
    if (confirm(`¿Estás seguro de que quieres eliminar la fuente "${sourceName}"? Esta acción no se puede deshacer y las oportunidades asociadas cambiarán a una fuente genérica.`)) {
      console.log('Deleting lead source with ID:', sourceId);
      setDeletingId(sourceId);
      try {
        await deleteLeadSource(sourceId);
      } catch (error) {
        console.error('Error deleting lead source:', error);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingSource(null);
    setNewSourceName('');
    setEditName('');
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span>Cargando fuentes de lead...</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Fuentes de Lead</h3>
          <Badge variant="secondary">{leadSources.length}</Badge>
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
          <h4 className="font-medium mb-3">Nueva Fuente de Lead</h4>
          <div className="space-y-3">
            <Input
              placeholder="Nombre de la fuente (ej. Website, Referencia, LinkedIn)"
              value={newSourceName}
              onChange={(e) => setNewSourceName(e.target.value)}
            />
            <div className="flex gap-2">
              <Button onClick={handleAddSource} disabled={isAdding} size="sm">
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

      {/* Lead Sources List */}
      <div className="space-y-2">
        {leadSources.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No hay fuentes de lead registradas
          </div>
        ) : (
          leadSources.map((source) => (
            <div key={source.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
              {editingSource?.id === source.id ? (
                // Edit Mode
                <div className="flex-1 flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-medium text-sm">
                    {editName.charAt(0).toUpperCase() || source.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <Input
                      placeholder="Nombre de la fuente"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="h-8"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Creada: {new Date(source.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={handleEditSave}
                      disabled={isUpdating || !editName.trim()}
                    >
                      {isUpdating ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={handleEditCancel}
                      disabled={isUpdating}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                // View Mode
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-medium text-sm">
                      {source.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{source.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Creada: {new Date(source.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEditStart(source)}
                      disabled={editingSource !== null || isUpdating}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteSource(source.id, source.name)}
                      disabled={deletingId === source.id || isDeleting || editingSource !== null}
                    >
                      {(deletingId === source.id) ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
