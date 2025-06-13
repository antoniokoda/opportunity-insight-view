
import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Opportunity } from './useOpportunities';
import { Call } from './useCalls';

export const useDashboardFilters = (opportunities: Opportunity[], calls: Call[]) => {
  const [selectedSalesperson, setSelectedSalesperson] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedLeadSource, setSelectedLeadSource] = useState('all');

  // Generate dynamic months based on actual data
  const availableMonths = useMemo(() => {
    const monthsWithData = new Set<string>();
    
    // Add months from opportunities
    opportunities.forEach(opp => {
      const month = format(new Date(opp.created_at), 'yyyy-MM');
      monthsWithData.add(month);
    });
    
    // Add months from calls
    calls.forEach(call => {
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
  }, [opportunities, calls]);

  const filteredOpportunities = useMemo(() => {
    return opportunities.filter(opp => {
      if (selectedSalesperson !== 'all' && opp.salesperson_id !== parseInt(selectedSalesperson)) {
        return false;
      }
      if (selectedLeadSource !== 'all' && opp.lead_source !== selectedLeadSource) {
        return false;
      }
      if (selectedMonth !== 'all') {
        const oppMonth = format(new Date(opp.created_at), 'yyyy-MM');
        if (oppMonth !== selectedMonth) {
          return false;
        }
      }
      return true;
    });
  }, [opportunities, selectedSalesperson, selectedLeadSource, selectedMonth]);

  return {
    selectedSalesperson,
    setSelectedSalesperson,
    selectedMonth,
    setSelectedMonth,
    selectedLeadSource,
    setSelectedLeadSource,
    availableMonths,
    filteredOpportunities,
  };
};
