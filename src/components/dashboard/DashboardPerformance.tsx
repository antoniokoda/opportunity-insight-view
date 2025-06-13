
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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Rendimiento por Vendedor</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vendedor</TableHead>
              <TableHead className="text-right">Revenue</TableHead>
              <TableHead className="text-right">Cobrado</TableHead>
              <TableHead className="text-right">Deals</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {salesPerformance.map((person) => (
              <TableRow key={person.name}>
                <TableCell className="font-medium">{person.name}</TableCell>
                <TableCell className="text-right">{formatCurrency(person.revenue)}</TableCell>
                <TableCell className="text-right">{formatCurrency(person.cash)}</TableCell>
                <TableCell className="text-right">{person.deals}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
