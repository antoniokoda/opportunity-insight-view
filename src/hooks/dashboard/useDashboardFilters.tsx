
import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Opportunity } from '@/types/opportunity';
import type { Call } from '@/hooks/useCalls';
import type { DashboardFilters, PeriodType, DateRange } from './types';

export const useDashboardFilters = (opportunities: Opportunity[], allCalls: Call[]) => {
  const [selectedSalesperson, setSelectedSalesperson] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedLeadSource, setSelectedLeadSource] = useState('all');
  const [periodType, setPeriodType] = useState<PeriodType>('days');
  const [dateRange, setDateRange] = useState<DateRange>({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    end: new Date()
  });

  // Available months for filter
  const availableMonths = useMemo(() => {
    if (!opportunities.length && !allCalls.length) return [{ value: 'all', label: 'Todos los meses' }];

    const monthsWithData = new Set<string>();
    
    opportunities.forEach(opp => {
      const month = format(new Date(opp.created_at), 'yyyy-MM');
      monthsWithData.add(month);
    });
    
    allCalls.forEach(call => {
      const month = format(new Date(call.date), 'yyyy-MM');
      monthsWithData.add(month);
    });

    const sortedMonths = Array.from(monthsWithData).sort().reverse();
    
    return [
      { value: 'all', label: 'Todos los meses' },
      ...sortedMonths.map(month => ({
        value: month,
        label: format(new Date(month + '-01'), 'MMMM yyyy', { locale: es })
      }))
    ];
  }, [opportunities, allCalls]);

  const filters: DashboardFilters = {
    selectedSalesperson,
    selectedMonth,
    selectedLeadSource,
    periodType,
    dateRange,
  };

  return {
    filters,
    availableMonths,
    setSelectedSalesperson,
    setSelectedMonth,
    setSelectedLeadSource,
    setPeriodType,
    setDateRange,
  };
};
