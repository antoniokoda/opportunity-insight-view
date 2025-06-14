
import { useMemo } from 'react';
import { Call } from './useCalls';

export const useDetailedCallMetrics = (calls: Call[]) => {
  return useMemo(() => {
    // Helper to get past calls by type
    const getPastCallsByType = (type: string) => {
      const now = new Date();
      return calls.filter(call => call.type === type && new Date(call.date) <= now);
    };

    // Helper to calculate avg duration
    const getAverageDuration = (callsOfType: Call[]) => {
      if (callsOfType.length === 0) return 0;
      const totalDuration = callsOfType.reduce((sum, call) => sum + call.duration, 0);
      return Math.round(totalDuration / callsOfType.length);
    };

    // Tasa de asistencia real sobre llamadas PASADAS (de cada tipo)
    const getShowUpRate = (pastCallsOfType: Call[]) => {
      if (pastCallsOfType.length === 0) return 0;
      const attended = pastCallsOfType.filter(call => call.attended === true).length;
      return (attended / pastCallsOfType.length) * 100;
    };

    const types = [
      'Discovery 1',
      'Discovery 2',
      'Discovery 3',
      'Closing 1',
      'Closing 2',
      'Closing 3',
    ] as const;

    // Collect metrics por tipo usando SOLO llamadas pasadas
    const callCounts: Record<string, number> = {};
    const averageDurations: Record<string, number> = {};
    const showUpRates: Record<string, number> = {};

    types.forEach(type => {
      const pastCalls = getPastCallsByType(type);
      callCounts[
        type.toLowerCase().replace(' ', '')
      ] = pastCalls.length;
      averageDurations[
        type.toLowerCase().replace(' ', '')
      ] = getAverageDuration(pastCalls);
      showUpRates[
        type.toLowerCase().replace(' ', '')
      ] = getShowUpRate(pastCalls);
    });

    // Renombrar las keys para mantener la compatibilidad con el resto del dashboard
    return {
      callCounts: {
        discovery1: callCounts['discovery1'] || 0,
        discovery2: callCounts['discovery2'] || 0,
        discovery3: callCounts['discovery3'] || 0,
        closing1: callCounts['closing1'] || 0,
        closing2: callCounts['closing2'] || 0,
        closing3: callCounts['closing3'] || 0,
      },
      averageDurations: {
        discovery1: averageDurations['discovery1'] || 0,
        discovery2: averageDurations['discovery2'] || 0,
        discovery3: averageDurations['discovery3'] || 0,
        closing1: averageDurations['closing1'] || 0,
        closing2: averageDurations['closing2'] || 0,
        closing3: averageDurations['closing3'] || 0,
      },
      showUpRates: {
        discovery1: showUpRates['discovery1'] || 0,
        discovery2: showUpRates['discovery2'] || 0,
        discovery3: showUpRates['discovery3'] || 0,
        closing1: showUpRates['closing1'] || 0,
        closing2: showUpRates['closing2'] || 0,
        closing3: showUpRates['closing3'] || 0,
      }
    };
  }, [calls]);
};
