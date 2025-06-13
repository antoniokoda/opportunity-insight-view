
import { useMemo } from 'react';

export const useDashboardChartData = () => {
  return useMemo(() => {
    const data = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      
      data.push({
        date: date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
        revenue: Math.floor(Math.random() * 20000) + 10000,
        cash: Math.floor(Math.random() * 15000) + 5000,
        calls: Math.floor(Math.random() * 10) + 5,
      });
    }
    return data;
  }, []);
};
