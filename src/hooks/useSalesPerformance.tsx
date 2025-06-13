
import { useMemo } from 'react';
import { Opportunity } from './useOpportunities';
import { Salesperson } from './useSalespeople';

export const useSalesPerformance = (salespeople: Salesperson[], opportunities: Opportunity[]) => {
  return useMemo(() => {
    return salespeople.map(salesperson => {
      const salesPersonOpps = opportunities.filter(opp => opp.salesperson_id === salesperson.id);
      const revenue = salesPersonOpps.reduce((sum, opp) => sum + opp.revenue, 0);
      const cash = salesPersonOpps.reduce((sum, opp) => sum + opp.cash_collected, 0);
      return {
        name: salesperson.name,
        revenue,
        cash,
        deals: salesPersonOpps.length,
      };
    });
  }, [salespeople, opportunities]);
};
