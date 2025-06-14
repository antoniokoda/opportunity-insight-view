
import React from "react";
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, Search } from 'lucide-react';
import type { LeadSource } from "@/hooks/useLeadSourcesWithPersistence";

interface OpportunitiesFiltersProps {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  statusFilter: string;
  setStatusFilter: (v: string) => void;
  sourceFilter: string;
  setSourceFilter: (v: string) => void;
  leadSources: LeadSource[];
}

export const OpportunitiesFilters: React.FC<OpportunitiesFiltersProps> = ({
  searchTerm, setSearchTerm,
  statusFilter, setStatusFilter,
  sourceFilter, setSourceFilter,
  leadSources
}) => (
  <div className="flex flex-col sm:flex-row gap-4 mb-6">
    <div className="flex-1">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
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
        {leadSources.map(source => (
          <SelectItem key={source.id} value={source.name}>
            {source.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

