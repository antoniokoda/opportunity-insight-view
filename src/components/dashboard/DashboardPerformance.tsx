
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
        <CardTitle>Rendimiento de Ventas</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vendedor</TableHead>
              <TableHead>Revenue</TableHead>
              <TableHead>Cash</TableHead>
              <TableHead>Tratos</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {salesPerformance.map((person, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{person.name}</TableCell>
                <TableCell>{formatCurrency(person.revenue)}</TableCell>
                <TableCell>{formatCurrency(person.cash)}</TableCell>
                <TableCell>{person.deals}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
