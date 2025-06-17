
import { useMemo } from 'react';
import type { Call } from '@/hooks/useCalls';
import type { CallMetrics } from './types';

export const useCallMetrics = (filteredCalls: Call[]) => {
  return useMemo(() => {
    const callTypes = ['Discovery 1', 'Discovery 2', 'Discovery 3', 'Closing 1', 'Closing 2', 'Closing 3'];
    const rawCallCounts: Record<string, number> = {};
    const rawTotalDurations: Record<string, number> = {};
    const rawAttendedCounts: Record<string, number> = {};
    const rawTotalCounts: Record<string, number> = {};

    // Initialize
    callTypes.forEach(type => {
      rawCallCounts[type] = 0;
      rawTotalDurations[type] = 0;
      rawAttendedCounts[type] = 0;
      rawTotalCounts[type] = 0;
    });

    // Process calls
    const now = new Date();
    const pastCalls = filteredCalls.filter(call => new Date(call.date) <= now);

    pastCalls.forEach(call => {
      if (callTypes.includes(call.type)) {
        rawCallCounts[call.type]++;
        rawTotalDurations[call.type] += call.duration;
        rawTotalCounts[call.type]++;
        
        if (call.attended === true) {
          rawAttendedCounts[call.type]++;
        }
      }
    });

    // Transform to expected format
    const callCounts = {
      discovery1: rawCallCounts['Discovery 1'],
      discovery2: rawCallCounts['Discovery 2'],
      discovery3: rawCallCounts['Discovery 3'],
      closing1: rawCallCounts['Closing 1'],
      closing2: rawCallCounts['Closing 2'],
      closing3: rawCallCounts['Closing 3'],
    };

    const averageDurations = {
      discovery1: rawCallCounts['Discovery 1'] > 0 ? rawTotalDurations['Discovery 1'] / rawCallCounts['Discovery 1'] : 0,
      discovery2: rawCallCounts['Discovery 2'] > 0 ? rawTotalDurations['Discovery 2'] / rawCallCounts['Discovery 2'] : 0,
      discovery3: rawCallCounts['Discovery 3'] > 0 ? rawTotalDurations['Discovery 3'] / rawCallCounts['Discovery 3'] : 0,
      closing1: rawCallCounts['Closing 1'] > 0 ? rawTotalDurations['Closing 1'] / rawCallCounts['Closing 1'] : 0,
      closing2: rawCallCounts['Closing 2'] > 0 ? rawTotalDurations['Closing 2'] / rawCallCounts['Closing 2'] : 0,
      closing3: rawCallCounts['Closing 3'] > 0 ? rawTotalDurations['Closing 3'] / rawCallCounts['Closing 3'] : 0,
    };

    const showUpRates = {
      discovery1: rawTotalCounts['Discovery 1'] > 0 ? (rawAttendedCounts['Discovery 1'] / rawTotalCounts['Discovery 1']) * 100 : 0,
      discovery2: rawTotalCounts['Discovery 2'] > 0 ? (rawAttendedCounts['Discovery 2'] / rawTotalCounts['Discovery 2']) * 100 : 0,
      discovery3: rawTotalCounts['Discovery 3'] > 0 ? (rawAttendedCounts['Discovery 3'] / rawTotalCounts['Discovery 3']) * 100 : 0,
      closing1: rawTotalCounts['Closing 1'] > 0 ? (rawAttendedCounts['Closing 1'] / rawTotalCounts['Closing 1']) * 100 : 0,
      closing2: rawTotalCounts['Closing 2'] > 0 ? (rawAttendedCounts['Closing 2'] / rawTotalCounts['Closing 2']) * 100 : 0,
      closing3: rawTotalCounts['Closing 3'] > 0 ? (rawAttendedCounts['Closing 3'] / rawTotalCounts['Closing 3']) * 100 : 0,
    };

    return { callCounts, averageDurations, showUpRates };
  }, [filteredCalls]);
};
