
import { useMemo } from 'react';
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval } from 'date-fns';
import { es } from 'date-fns/locale';
import { Opportunity } from './useOpportunities';
import { Call } from './useCalls';
import { PeriodType, DateRange } from './usePeriodFilter';

interface ChartDataParams {
  filteredOpportunities: Opportunity[];
  calls: Call[];
  periodType: PeriodType;
  dateRange: DateRange;
  selectedMonth?: string; // Mantener para compatibilidad
}

export const useDashboardChartData = ({
  filteredOpportunities,
  calls,
  periodType,
  dateRange,
  selectedMonth
}: ChartDataParams) => {
  return useMemo(() => {
    const data = [];
    
    // Si se está usando el filtro legacy de mes, mantener comportamiento anterior
    if (selectedMonth && selectedMonth !== 'all') {
      return getLegacyMonthData(filteredOpportunities, calls, selectedMonth);
    }

    // Filtrar datos por rango de fechas
    const filteredOpportunities2 = filteredOpportunities.filter(opp => {
      const oppDate = new Date(opp.created_at);
      return isWithinInterval(oppDate, { start: dateRange.start, end: dateRange.end });
    });

    const filteredCalls = calls.filter(call => {
      const callDate = new Date(call.date);
      return isWithinInterval(callDate, { start: dateRange.start, end: dateRange.end });
    });

    // Generar intervalos según el tipo de período
    let intervals: Date[] = [];
    
    switch (periodType) {
      case 'days':
        intervals = eachDayOfInterval({ start: dateRange.start, end: dateRange.end });
        break;
      case 'weeks':
        intervals = eachWeekOfInterval({ start: dateRange.start, end: dateRange.end }, { locale: es });
        break;
      case 'months':
        intervals = eachMonthOfInterval({ start: dateRange.start, end: dateRange.end });
        break;
    }

    // Agrupar datos según el tipo de período
    const dataMap = new Map<string, { revenue: number; cash: number; calls: number }>();

    // Inicializar todos los intervalos con valores 0
    intervals.forEach(interval => {
      const key = getIntervalKey(interval, periodType);
      dataMap.set(key, { revenue: 0, cash: 0, calls: 0 });
    });

    // Procesar oportunidades
    filteredOpportunities2.forEach(opp => {
      const oppDate = new Date(opp.created_at);
      const key = getIntervalKey(oppDate, periodType);
      
      if (dataMap.has(key)) {
        const existing = dataMap.get(key)!;
        existing.revenue += opp.revenue;
        existing.cash += opp.cash_collected;
      }
    });

    // Procesar llamadas
    filteredCalls.forEach(call => {
      const callDate = new Date(call.date);
      const key = getIntervalKey(callDate, periodType);
      
      if (dataMap.has(key)) {
        const existing = dataMap.get(key)!;
        existing.calls += 1;
      }
    });

    // Convertir a array y formatear
    const sortedData = Array.from(dataMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, metrics]) => ({
        date: formatIntervalLabel(key, periodType),
        revenue: metrics.revenue,
        cash: metrics.cash,
        calls: metrics.calls,
      }));

    data.push(...sortedData);
    
    return data;
  }, [filteredOpportunities, calls, periodType, dateRange, selectedMonth]);
};

// Función para obtener la clave del intervalo según el tipo de período
function getIntervalKey(date: Date, periodType: PeriodType): string {
  switch (periodType) {
    case 'days':
      return format(date, 'yyyy-MM-dd');
    case 'weeks':
      return format(startOfWeek(date, { locale: es }), 'yyyy-MM-dd');
    case 'months':
      return format(date, 'yyyy-MM');
    default:
      return format(date, 'yyyy-MM-dd');
  }
}

// Función para formatear las etiquetas según el tipo de período
function formatIntervalLabel(key: string, periodType: PeriodType): string {
  const date = new Date(key);
  
  switch (periodType) {
    case 'days':
      return format(date, 'MMM d', { locale: es });
    case 'weeks':
      const weekEnd = endOfWeek(date, { locale: es });
      return `${format(date, 'MMM d', { locale: es })}-${format(weekEnd, 'd', { locale: es })}`;
    case 'months':
      return format(date, 'MMM yyyy', { locale: es });
    default:
      return format(date, 'MMM d', { locale: es });
  }
}

// Función legacy para mantener compatibilidad con el comportamiento anterior
function getLegacyMonthData(filteredOpportunities: Opportunity[], calls: Call[], selectedMonth: string) {
  const data = [];
  
  if (selectedMonth === 'all') {
    // Lógica original para mostrar todos los meses
    const monthsWithData = new Map<string, { revenue: number; cash: number; calls: number }>();
    
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
    
    calls.forEach(call => {
      const monthKey = format(new Date(call.date), 'yyyy-MM');
      
      if (!monthsWithData.has(monthKey)) {
        monthsWithData.set(monthKey, { revenue: 0, cash: 0, calls: 0 });
      }
      
      const monthData = monthsWithData.get(monthKey)!;
      monthData.calls += 1;
    });
    
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
    // Lógica original para mes específico (días)
    const daysWithData = new Map<string, { revenue: number; cash: number; calls: number }>();
    
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
    
    calls.forEach(call => {
      const callDate = new Date(call.date);
      const dayKey = format(callDate, 'yyyy-MM-dd');
      
      if (!daysWithData.has(dayKey)) {
        daysWithData.set(dayKey, { revenue: 0, cash: 0, calls: 0 });
      }
      
      const dayData = daysWithData.get(dayKey)!;
      dayData.calls += 1;
    });
    
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
}
