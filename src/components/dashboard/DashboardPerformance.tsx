
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

export const DashboardPerformance: React.FC<DashboardPerformanceProps> = ({ salesPerformance }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Rendimiento por Vendedor</h3>
        <div className="space-y-4">
          {salesPerformance.length > 0 ? (
            salesPerformance.map(person => (
              <div key={person.name} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">{person.name}</p>
                  <p className="text-sm text-muted-foreground">{person.deals} deals</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatCurrency(person.revenue)}</p>
                  <p className="text-sm text-success-600">{formatCurrency(person.cash)}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-8">
              Agrega vendedores para ver su rendimiento
            </p>
          )}
        </div>
      </Card>

      {/* Salespeople Manager */}
      <div>
        <SalespersonManager />
      </div>
    </div>
  );
};
