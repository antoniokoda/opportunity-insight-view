
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X } from 'lucide-react';
import { useSalespeople } from '@/hooks/useSalespeople';
import { useLeadSourcesWithPersistence } from '@/hooks/useLeadSourcesWithPersistence';

interface FilterState {
  search: string;
  salesperson: string;
  leadSource: string;
  status: string;
  proposalStatus: string;
  revenueMin: string;
  revenueMax: string;
}

interface AdvancedFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  filters,
  onFiltersChange,
}) => {
  const { salespeople } = useSalespeople();
  const { leadSources } = useLeadSourcesWithPersistence();

  const updateFilter = (key: keyof FilterState, value: string) => {
    // Convert "all" values back to empty strings for filtering logic
    const filterValue = value === 'all' ? '' : value;
    onFiltersChange({ ...filters, [key]: filterValue });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      search: '',
      salesperson: '',
      leadSource: '',
      status: '',
      proposalStatus: '',
      revenueMin: '',
      revenueMax: '',
    });
  };

  const activeFiltersCount = Object.values(filters).filter(value => value !== '').length;

  // Convert empty filter values to "all" for display
  const getSelectValue = (filterValue: string) => filterValue === '' ? 'all' : filterValue;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-zinc-600" />
          <span className="text-sm font-medium text-zinc-900">Filtros</span>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-zinc-600 hover:text-zinc-900"
          >
            <X className="w-4 h-4 mr-1" />
            Limpiar
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
          <Input
            placeholder="Buscar oportunidades..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={getSelectValue(filters.salesperson)} onValueChange={(value) => updateFilter('salesperson', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Vendedor" />
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

        <Select value={getSelectValue(filters.leadSource)} onValueChange={(value) => updateFilter('leadSource', value)}>
          <SelectTrigger>
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

        <Select value={getSelectValue(filters.status)} onValueChange={(value) => updateFilter('status', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="active">Activo</SelectItem>
            <SelectItem value="won">Ganado</SelectItem>
            <SelectItem value="lost">Perdido</SelectItem>
          </SelectContent>
        </Select>

        <Select value={getSelectValue(filters.proposalStatus)} onValueChange={(value) => updateFilter('proposalStatus', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Propuesta" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las propuestas</SelectItem>
            <SelectItem value="n/a">N/A</SelectItem>
            <SelectItem value="created">Creada</SelectItem>
            <SelectItem value="pitched">Presentada</SelectItem>
          </SelectContent>
        </Select>

        <Input
          type="number"
          placeholder="Revenue mínimo"
          value={filters.revenueMin}
          onChange={(e) => updateFilter('revenueMin', e.target.value)}
        />

        <Input
          type="number"
          placeholder="Revenue máximo"
          value={filters.revenueMax}
          onChange={(e) => updateFilter('revenueMax', e.target.value)}
        />
      </div>
    </div>
  );
};
