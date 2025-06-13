
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SelectWithActions } from '@/components/ui/select-with-actions';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Plus, Loader2 } from 'lucide-react';
import { Salesperson } from '@/hooks/useSalespeople';

interface DashboardFiltersProps {
  selectedSalesperson: string;
  setSelectedSalesperson: (value: string) => void;
  selectedMonth: string;
  setSelectedMonth: (value: string) => void;
  selectedLeadSource: string;
  setSelectedLeadSource: (value: string) => void;
  availableMonths: Array<{ value: string; label: string }>;
  salespeople: Salesperson[];
  customLeadSources: string[];
  newSalesperson: { name: string; email: string };
  setNewSalesperson: (value: { name: string; email: string } | ((prev: { name: string; email: string }) => { name: string; email: string })) => void;
  newLeadSource: string;
  setNewLeadSource: (value: string) => void;
  showSalespersonDialog: boolean;
  setShowSalespersonDialog: (value: boolean) => void;
  showLeadSourceDialog: boolean;
  setShowLeadSourceDialog: (value: boolean) => void;
  handleAddSalesperson: () => void;
  handleAddLeadSource: () => void;
  handleDeleteLeadSource: (source: string) => void;
  handleUpdateSalesperson: (id: string, name: string) => void;
  handleDeleteSalesperson: (id: string) => void;
  handleUpdateLeadSource: (oldSource: string, newSource: string) => void;
  isAdding: boolean;
}

export const DashboardFilters: React.FC<DashboardFiltersProps> = ({
  selectedSalesperson,
  setSelectedSalesperson,
  selectedMonth,
  setSelectedMonth,
  selectedLeadSource,
  setSelectedLeadSource,
  availableMonths,
  salespeople,
  customLeadSources,
  newSalesperson,
  setNewSalesperson,
  newLeadSource,
  setNewLeadSource,
  showSalespersonDialog,
  setShowSalespersonDialog,
  showLeadSourceDialog,
  setShowLeadSourceDialog,
  handleAddSalesperson,
  handleAddLeadSource,
  handleDeleteLeadSource,
  handleUpdateSalesperson,
  handleDeleteSalesperson,
  handleUpdateLeadSource,
  isAdding,
}) => {
  const salespeopleOptions = [
    { value: 'all', label: 'Todos los vendedores' },
    ...salespeople.map(person => ({
      value: person.id.toString(),
      label: person.name
    }))
  ];

  const leadSourceOptions = [
    { value: 'all', label: 'Todas las fuentes' },
    ...customLeadSources.map(source => ({
      value: source,
      label: source
    }))
  ];

  const handleSalespersonEdit = (oldValue: string, newValue: string) => {
    handleUpdateSalesperson(oldValue, newValue);
  };

  const handleSalespersonDelete = (value: string) => {
    handleDeleteSalesperson(value);
  };

  return (
    <Card className="p-6">
      <div className="flex flex-wrap gap-4">
        <div className="min-w-[200px]">
          <label className="block text-sm font-medium mb-2">Vendedor</label>
          <div className="flex gap-2">
            <SelectWithActions
              value={selectedSalesperson}
              onValueChange={setSelectedSalesperson}
              placeholder="Seleccionar vendedor"
              options={salespeopleOptions}
              onEdit={handleSalespersonEdit}
              onDelete={handleSalespersonDelete}
              allowEdit={true}
              allowDelete={true}
              className="flex-1"
            />
            <Dialog open={showSalespersonDialog} onOpenChange={setShowSalespersonDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus size={16} />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Gestionar Vendedores</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="Nombre"
                      value={newSalesperson.name}
                      onChange={(e) => setNewSalesperson(prev => ({ ...prev, name: e.target.value }))}
                    />
                    <Input
                      placeholder="Email"
                      value={newSalesperson.email}
                      onChange={(e) => setNewSalesperson(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <Button onClick={handleAddSalesperson} disabled={isAdding} className="w-full">
                    {isAdding && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Agregar Vendedor
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <div className="min-w-[200px]">
          <label className="block text-sm font-medium mb-2">Mes</label>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar mes" />
            </SelectTrigger>
            <SelectContent>
              {availableMonths.map(month => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="min-w-[200px]">
          <label className="block text-sm font-medium mb-2">Fuente de Lead</label>
          <div className="flex gap-2">
            <SelectWithActions
              value={selectedLeadSource}
              onValueChange={setSelectedLeadSource}
              placeholder="Seleccionar fuente"
              options={leadSourceOptions}
              onEdit={handleUpdateLeadSource}
              onDelete={handleDeleteLeadSource}
              allowEdit={true}
              allowDelete={true}
              className="flex-1"
            />
            <Dialog open={showLeadSourceDialog} onOpenChange={setShowLeadSourceDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus size={16} />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Gestionar Fuentes de Lead</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Nueva fuente de lead"
                      value={newLeadSource}
                      onChange={(e) => setNewLeadSource(e.target.value)}
                    />
                    <Button onClick={handleAddLeadSource}>
                      Agregar
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Fuentes existentes:</h4>
                    {customLeadSources.map(source => (
                      <div key={source} className="flex items-center justify-between p-2 bg-muted rounded">
                        <span>{source}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </Card>
  );
};
