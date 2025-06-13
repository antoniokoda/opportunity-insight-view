
import { useMemo } from 'react';
import { useSalespeople } from '@/hooks/useSalespeople';
import { useOpportunities } from '@/hooks/useOpportunities';
import { useCalls } from '@/hooks/useCalls';
import { isSameDay } from 'date-fns';

export const useCalendarData = () => {
  const { salespeople, isLoading: salesLoading } = useSalespeople();
  const { opportunities, isLoading: oppsLoading } = useOpportunities();
  const { calls, isLoading: callsLoading } = useCalls();

  const isLoading = salesLoading || oppsLoading || callsLoading;

  const allCalls = useMemo(() => {
    return calls.map(call => {
      const opp = opportunities.find(o => o.id === call.opportunity_id);
      const salesperson = salespeople.find(s => s.id === opp?.salesperson_id);
      return {
        ...call,
        opportunity_name: opp?.name || 'Unknown Opportunity',
        salesperson_name: salesperson?.name || 'Unknown Salesperson'
      };
    }).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [calls, opportunities, salespeople]);

  const getCallsForDay = (date: Date) => {
    return allCalls.filter(call => isSameDay(new Date(call.date), date));
  };

  const getCallsForHour = (date: Date, hour: number) => {
    return allCalls.filter(call => {
      const callDate = new Date(call.date);
      return isSameDay(callDate, date) && callDate.getHours() === hour;
    });
  };

  const getCallTypeColor = (type: string) => {
    if (type.startsWith('Discovery')) {
      return 'bg-blue-500 text-white border-blue-600';
    } else if (type.startsWith('Closing')) {
      return 'bg-green-500 text-white border-green-600';
    }
    return 'bg-gray-500 text-white border-gray-600';
  };

  return {
    isLoading,
    allCalls,
    getCallsForDay,
    getCallsForHour,
    getCallTypeColor
  };
};
