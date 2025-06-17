
import React from 'react';
import { Card } from '@/components/ui/card';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'];

interface DashboardChartsProps {
  leadSourceData: Array<{
    name: string;
    value: number;
    fill: string;
  }>;
}

export const DashboardCharts: React.FC<DashboardChartsProps> = ({
  leadSourceData,
}) => {
  // Filter lead sources to only show those with data
  const filteredLeadSourceData = leadSourceData.filter(item => item.value > 0);

  return (
    <div className="space-y-6">
      {/* Distribución de Fuentes */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Distribución de Fuentes</h3>
        {filteredLeadSourceData.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de pastel */}
            <div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={filteredLeadSourceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {filteredLeadSourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Lista de fuentes y cantidades */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground mb-3">Desglose por fuente</h4>
              <div className="space-y-3">
                {filteredLeadSourceData.map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="font-medium text-sm">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No hay datos de fuentes de leads para mostrar
          </div>
        )}
      </Card>
    </div>
  );
};
