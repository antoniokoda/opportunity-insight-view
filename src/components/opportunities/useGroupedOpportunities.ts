
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Opportunity } from '@/hooks/useOpportunities';

// Devuelve fecha de última llamada (o undefined)
const getLastCallDate = (opportunity: Opportunity) => {
  if (opportunity.calls && opportunity.calls.length > 0) {
    const lastCall = [...opportunity.calls].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];
    return lastCall.date;
  }
  return undefined;
};

export const useGroupedOpportunities = (
  opportunities: Opportunity[],
  searchTerm: string,
  statusFilter: string,
  sourceFilter: string,
  getSalespersonName: (id: number) => string
) => {
  // Filtrado
  const filteredOpportunities = opportunities.filter(opportunity => {
    const matchesSearch =
      opportunity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getSalespersonName(opportunity.salesperson_id).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || opportunity.opportunity_status === statusFilter;
    const matchesSource = sourceFilter === 'all' || opportunity.lead_source === sourceFilter;
    return matchesSearch && matchesStatus && matchesSource;
  });

  // Agrupación
  const groupedOpportunities = filteredOpportunities.reduce((groups, opportunity) => {
    const lastCallDate = getLastCallDate(opportunity);
    if (!lastCallDate) {
      if (!groups['no_calls']) {
        groups['no_calls'] = {
          label: 'Sin llamadas',
          opportunities: []
        };
      }
      groups['no_calls'].opportunities.push(opportunity);
      return groups;
    }
    const monthKey = format(new Date(lastCallDate), 'yyyy-MM', { locale: es });
    const monthLabel = format(new Date(lastCallDate), 'MMMM yyyy', { locale: es });
    if (!groups[monthKey]) {
      groups[monthKey] = {
        label: monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1),
        opportunities: []
      };
    }
    groups[monthKey].opportunities.push(opportunity);
    return groups;
  }, {} as Record<string, { label: string; opportunities: Opportunity[] }>);

  // Orden: meses descendente, "Sin llamadas" al final
  const sortedMonthKeys = Object.keys(groupedOpportunities)
    .filter(key => key !== 'no_calls')
    .sort((a, b) => b.localeCompare(a));
  if (groupedOpportunities['no_calls']) {
    sortedMonthKeys.push('no_calls');
  }

  return { groupedOpportunities, sortedMonthKeys, filteredOpportunities };
};
