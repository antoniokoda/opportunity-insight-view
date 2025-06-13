
import React from 'react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Loader2 } from 'lucide-react';
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
  setNewSalesperson: (value: { name: string; email: string }) => void;
  newLeadSource: string;
  setNewLeadSource: (value: string) => void;
  showSalespersonDialog: boolean;
  setShowSalespersonDialog: (value: boolean) => void;
  showLeadSourceDialog: boolean;
  setShowLeadSourceDialog: (value: boolean) => void;
  handleAddSalesperson: () => void;
  handleAddLeadSource: () => void;
  handleDeleteLeadSource: (source: string) => void;
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
  isAdding,
}) => {
  return (
    <Card className="p-6">
      <div className="flex flex-wrap gap-4">
        <div className="min-w-[200px]">
          <label className="block text-sm font-medium mb-2">Vendedor</label>
          <div className="flex gap-2">
            <Select value={selectedSalesperson} onValueChange={setSelectedSalesperson}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Seleccionar vendedor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los vendedores</SelectItem>
                {salespeople.map(person => (
                  <SelectItem key={person.id} value={person.id.toString()}>
                    {person.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            <Select value={selectedLeadSource} onValueChange={setSelectedLeadSource}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Seleccionar fuente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las fuentes</SelectItem>
                {customLeadSources.map(source => (
                  <SelectItem key={source} value={source}>
                    {source}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteLeadSource(source)}
                        >
                          <Trash2 size={16} />
                        </Button>
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
