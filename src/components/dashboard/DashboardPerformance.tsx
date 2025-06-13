import React from 'react';
import { Card } from '@/components/ui/card';
import { SalespersonManager } from '@/components/SalespersonManager';
import { formatCurrency } from '@/config/currency';
interface DashboardPerformanceProps {
  salesPerformance: Array<{
    name: string;
    revenue: number;
    cash: number;
    deals: number;
  }>;
}
export const DashboardPerformance: React.FC<DashboardPerformanceProps> = ({
  salesPerformance
}) => {
  return;
};