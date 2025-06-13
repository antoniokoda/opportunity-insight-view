
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
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Sales Performance */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Rendimiento por Vendedor</h3>
        <div className="space-y-3">
          {salesPerformance.map((person, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <p className="font-medium">{person.name}</p>
                <p className="text-sm text-muted-foreground">{person.deals} deals</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatCurrency(person.revenue)}</p>
                <p className="text-sm text-muted-foreground">Cash: {formatCurrency(person.cash)}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Salespeople Manager */}
      <div>
        <SalespersonManager />
      </div>
    </div>
  );
};
