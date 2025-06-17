
import { Call } from '@/hooks/useCalls';

export type PeriodType = 'days' | 'weeks' | 'months';

export interface DateRange {
  start: Date;
  end: Date;
}

export interface DashboardKpis {
  totalRevenue: number;
  potentialRevenue: number;
  totalCash: number;
  totalCalls: number;
  activeOpportunities: number;
  averageDealSize: number;
  closingRate: number;
  proposalsPitched: number;
  overallShowUpRate: number;
  firstDiscoveryShowUpRate: number;
}

export interface KpiChanges {
  revenueChange: number | null;
  cashChange: number | null;
  callsChange: number | null;
  averageDealSizeChange: number | null;
  closingRateChange: number | null;
  showUpRateChange: number | null;
  firstDiscoveryShowUpRateChange: number | null;
}

export interface ChartDataPoint {
  date: string;
  revenue: number;
  cash: number;
  calls: number;
}

export interface CallMetrics {
  callCounts: {
    discovery1: number;
    discovery2: number;
    discovery3: number;
    closing1: number;
    closing2: number;
    closing3: number;
  };
  averageDurations: {
    discovery1: number;
    discovery2: number;
    discovery3: number;
    closing1: number;
    closing2: number;
    closing3: number;
  };
  showUpRates: {
    discovery1: number;
    discovery2: number;
    discovery3: number;
    closing1: number;
    closing2: number;
    closing3: number;
  };
}

export interface DashboardFilters {
  selectedSalesperson: string;
  selectedMonth: string;
  selectedLeadSource: string;
  periodType: PeriodType;
  dateRange: DateRange;
}
