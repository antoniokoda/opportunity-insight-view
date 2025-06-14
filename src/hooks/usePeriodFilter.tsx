
import { useState, useMemo } from 'react';

export type PeriodType = 'days' | 'weeks' | 'months';

export interface DateRange {
  start: Date;
  end: Date;
}

export const usePeriodFilter = () => {
  const [periodType, setPeriodType] = useState<PeriodType>('months');
  
  // Calcular rango por defecto según el período
  const defaultDateRange = useMemo(() => {
    const end = new Date();
    const start = new Date();
    
    switch (periodType) {
      case 'days':
        start.setDate(end.getDate() - 30); // Últimos 30 días
        break;
      case 'weeks':
        start.setDate(end.getDate() - (12 * 7)); // Últimas 12 semanas
        break;
      case 'months':
        start.setMonth(end.getMonth() - 12); // Últimos 12 meses
        break;
    }
    
    return { start, end };
  }, [periodType]);

  const [dateRange, setDateRange] = useState<DateRange>(defaultDateRange);

  // Actualizar rango cuando cambia el período
  const handlePeriodChange = (newPeriod: PeriodType) => {
    setPeriodType(newPeriod);
    setDateRange(defaultDateRange);
  };

  return {
    periodType,
    setPeriodType: handlePeriodChange,
    dateRange,
    setDateRange,
  };
};
