
import { useMemo } from 'react';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { Opportunity } from './useOpportunities';
import { Call } from './useCalls';

export const useDashboardChartData = (filteredOpportunities: Opportunity[], calls: Call[]) => {
  return useMemo(() => {
    const data = [];
    
    // Generate data for the last 7 days
    for (let i = 0; i < 7; i++) {
      const date = subDays(new Date(), 6 - i);
      const dayStart = startOfDay(date);
      const dayEnd = endOfDay(date);
      
      // Get opportunities created on this day
      const dayOpportunities = filteredOpportunities.filter(opp => {
        const oppDate = new Date(opp.created_at);
        return oppDate >= dayStart && oppDate <= dayEnd;
      });
      
      // Get calls made on this day
      const dayCalls = calls.filter(call => {
        const callDate = new Date(call.date);
        return callDate >= dayStart && callDate <= dayEnd;
      });
      
      // Calculate metrics for this day
      const revenue = dayOpportunities.reduce((sum, opp) => sum + opp.revenue, 0);
      const cash = dayOpportunities.reduce((sum, opp) => sum + opp.cash_collected, 0);
      const callsCount = dayCalls.length;
      
      data.push({
        date: format(date, 'MMM d', { locale: es }),
        revenue: revenue,
        cash: cash,
        calls: callsCount,
      });
    }
    
    return data;
  }, [filteredOpportunities, calls]);
};
