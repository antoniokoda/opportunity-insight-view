
import { useMemo } from 'react';
import { format, startOfDay, endOfDay, startOfMonth, endOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import { Opportunity } from './useOpportunities';
import { Call } from './useCalls';

export const useDashboardChartData = (
  filteredOpportunities: Opportunity[], 
  calls: Call[], 
  selectedMonth: string
) => {
  return useMemo(() => {
    const data = [];
    
    if (selectedMonth === 'all') {
      // When showing all months, group by month and only show months with data
      const monthsWithData = new Map<string, { revenue: number; cash: number; calls: number }>();
      
      // Process opportunities
      filteredOpportunities.forEach(opp => {
        const monthKey = format(new Date(opp.created_at), 'yyyy-MM');
        const monthLabel = format(new Date(opp.created_at), 'MMM yyyy', { locale: es });
        
        if (!monthsWithData.has(monthKey)) {
          monthsWithData.set(monthKey, { revenue: 0, cash: 0, calls: 0 });
        }
        
        const monthData = monthsWithData.get(monthKey)!;
        monthData.revenue += opp.revenue;
        monthData.cash += opp.cash_collected;
      });
      
      // Process calls
      calls.forEach(call => {
        const monthKey = format(new Date(call.date), 'yyyy-MM');
        
        if (!monthsWithData.has(monthKey)) {
          monthsWithData.set(monthKey, { revenue: 0, cash: 0, calls: 0 });
        }
        
        const monthData = monthsWithData.get(monthKey)!;
        monthData.calls += 1;
      });
      
      // Convert to array and sort by date
      const sortedMonths = Array.from(monthsWithData.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([monthKey, metrics]) => ({
          date: format(new Date(monthKey + '-01'), 'MMM yyyy', { locale: es }),
          revenue: metrics.revenue,
          cash: metrics.cash,
          calls: metrics.calls,
        }));
      
      data.push(...sortedMonths);
    } else {
      // When a specific month is selected, group by day and only show days with data
      const daysWithData = new Map<string, { revenue: number; cash: number; calls: number }>();
      
      // Process opportunities for the selected month
      filteredOpportunities.forEach(opp => {
        const oppDate = new Date(opp.created_at);
        const dayKey = format(oppDate, 'yyyy-MM-dd');
        
        if (!daysWithData.has(dayKey)) {
          daysWithData.set(dayKey, { revenue: 0, cash: 0, calls: 0 });
        }
        
        const dayData = daysWithData.get(dayKey)!;
        dayData.revenue += opp.revenue;
        dayData.cash += opp.cash_collected;
      });
      
      // Process calls for the selected month
      calls.forEach(call => {
        const callDate = new Date(call.date);
        const dayKey = format(callDate, 'yyyy-MM-dd');
        
        if (!daysWithData.has(dayKey)) {
          daysWithData.set(dayKey, { revenue: 0, cash: 0, calls: 0 });
        }
        
        const dayData = daysWithData.get(dayKey)!;
        dayData.calls += 1;
      });
      
      // Convert to array and sort by date
      const sortedDays = Array.from(daysWithData.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([dayKey, metrics]) => ({
          date: format(new Date(dayKey), 'MMM d', { locale: es }),
          revenue: metrics.revenue,
          cash: metrics.cash,
          calls: metrics.calls,
        }));
      
      data.push(...sortedDays);
    }
    
    return data;
  }, [filteredOpportunities, calls, selectedMonth]);
};
