
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, Loader2 } from 'lucide-react';
import { useSalespeople } from '@/hooks/useSalespeople';

export const SalespersonManager: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSalesperson, setNewSalesperson] = useState({
    name: '',
    email: '',
  });

  const { salespeople, isLoading, addSalesperson, isAdding } = useSalespeople();

  const handleAddSalesperson = () => {
    if (newSalesperson.name && newSalesperson.email) {
      addSalesperson(newSalesperson);
      setNewSalesperson({ name: '', email: '' });
      setShowAddForm(false);
    }
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
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Users size={20} />
          Vendedores ({salespeople.length})
        </h3>
        <Button onClick={() => setShowAddForm(!showAddForm)} size="sm">
          <Plus size={16} className="mr-2" />
          Agregar Vendedor
        </Button>
      </div>

      {showAddForm && (
        <div className="mb-6 p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-3">Nuevo Vendedor</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nombre</label>
              <Input
                value={newSalesperson.name}
                onChange={(e) => setNewSalesperson(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ej: Juan Pérez"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                type="email"
                value={newSalesperson.email}
                onChange={(e) => setNewSalesperson(prev => ({ ...prev, email: e.target.value }))}
                placeholder="juan@empresa.com"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={handleAddSalesperson} disabled={isAdding}>
              {isAdding && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Agregar
            </Button>
            <Button variant="outline" onClick={() => setShowAddForm(false)}>
              Cancelar
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {salespeople.length > 0 ? (
          salespeople.map(salesperson => (
            <div key={salesperson.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <p className="font-medium">{salesperson.name}</p>
                <p className="text-sm text-muted-foreground">{salesperson.email}</p>
              </div>
              <Badge variant="secondary">Activo</Badge>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">
              No hay vendedores registrados
            </p>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus size={16} className="mr-2" />
              Agregar Primer Vendedor
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};
