
import React from 'react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Filtros</h3>
      <div className="flex flex-wrap gap-4">
        <div className="min-w-[200px]">
          <label className="block text-sm font-medium mb-2">Vendedor</label>
          <Select value={selectedSalesperson} onValueChange={setSelectedSalesperson}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar vendedor" />
            </SelectTrigger>
            <SelectContent>
              {salespeopleOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
          <Select value={selectedLeadSource} onValueChange={setSelectedLeadSource}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar fuente" />
            </SelectTrigger>
            <SelectContent>
              {leadSourceOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
};
