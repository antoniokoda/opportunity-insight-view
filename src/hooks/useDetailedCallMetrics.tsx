
import { useMemo } from 'react';
import { Call } from './useCalls';

export const useDetailedCallMetrics = (calls: Call[]) => {
  return useMemo(() => {
    // Helper function to get calls by type
    const getCallsByType = (type: string) => calls.filter(call => call.type === type);
    
    // Helper function to calculate average duration
    const getAverageDuration = (callsOfType: Call[]) => {
      if (callsOfType.length === 0) return 0;
      const totalDuration = callsOfType.reduce((sum, call) => sum + call.duration, 0);
      return Math.round(totalDuration / callsOfType.length);
    };
    
    // Helper function to calculate show-up rate
    const getShowUpRate = (callsOfType: Call[]) => {
      const callsWithAttendance = callsOfType.filter(call => call.attended !== null);
      if (callsWithAttendance.length === 0) return 0;
      const attendedCalls = callsWithAttendance.filter(call => call.attended === true);
      return (attendedCalls.length / callsWithAttendance.length) * 100;
    };

    // Get calls by type
    const discovery1Calls = getCallsByType('Discovery 1');
    const discovery2Calls = getCallsByType('Discovery 2');
    const discovery3Calls = getCallsByType('Discovery 3');
    const closing1Calls = getCallsByType('Closing 1');
    const closing2Calls = getCallsByType('Closing 2');
    const closing3Calls = getCallsByType('Closing 3');

    return {
      callCounts: {
        discovery1: discovery1Calls.length,
        discovery2: discovery2Calls.length,
        discovery3: discovery3Calls.length,
        closing1: closing1Calls.length,
        closing2: closing2Calls.length,
        closing3: closing3Calls.length,
      },
      averageDurations: {
        discovery1: getAverageDuration(discovery1Calls),
        discovery2: getAverageDuration(discovery2Calls),
        discovery3: getAverageDuration(discovery3Calls),
        closing1: getAverageDuration(closing1Calls),
        closing2: getAverageDuration(closing2Calls),
        closing3: getAverageDuration(closing3Calls),
      },
      showUpRates: {
        discovery1: getShowUpRate(discovery1Calls),
        discovery2: getShowUpRate(discovery2Calls),
        discovery3: getShowUpRate(discovery3Calls),
        closing1: getShowUpRate(closing1Calls),
        closing2: getShowUpRate(closing2Calls),
        closing3: getShowUpRate(closing3Calls),
      }
    };
  }, [calls]);
};
