import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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