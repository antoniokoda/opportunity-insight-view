
import React from 'react';
import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { PeriodSelector } from './PeriodSelector';
import { PeriodType } from '@/hooks/usePeriodFilter';

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'];

interface DashboardChartsProps {
  chartData: Array<{
    date: string;
    revenue: number;
    cash: number;
    calls: number;
  }>;
  leadSourceData: Array<{
    source: string;
    count: number;
    revenue: number;
  }>;
  visibleMetrics: {
    revenue: boolean;
    cash: boolean;
    calls: boolean;
  };
  setVisibleMetrics: React.Dispatch<React.SetStateAction<{
    revenue: boolean;
    cash: boolean;
    calls: boolean;
  }>>;
  // Nuevas props para el selector de período
  selectedPeriod: PeriodType;
  onPeriodChange: (period: PeriodType) => void;
}

export const DashboardCharts: React.FC<DashboardChartsProps> = ({
  chartData,
  leadSourceData,
  visibleMetrics,
  setVisibleMetrics,
  selectedPeriod,
  onPeriodChange,
}) => {
  // Filter lead sources to only show those with data
  const filteredLeadSourceData = leadSourceData.filter(item => item.count > 0);

  return (
    <div className="space-y-6">
      {/* Tendencias - Ancho completo */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Tendencias</h3>
          <div className="flex items-center gap-4">
            {/* Selector de período */}
            <PeriodSelector 
              selectedPeriod={selectedPeriod}
              onPeriodChange={onPeriodChange}
            />
            
            {/* Controles de métricas */}
            <div className="flex gap-2">
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={visibleMetrics.revenue}
                  onChange={(e) => setVisibleMetrics(prev => ({ ...prev, revenue: e.target.checked }))}
                  className="mr-1"
                />
                Revenue
              </label>
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={visibleMetrics.cash}
                  onChange={(e) => setVisibleMetrics(prev => ({ ...prev, cash: e.target.checked }))}
                  className="mr-1"
                />
                Cash
              </label>
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={visibleMetrics.calls}
                  onChange={(e) => setVisibleMetrics(prev => ({ ...prev, calls: e.target.checked }))}
                  className="mr-1"
                />
                Calls
              </label>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              angle={selectedPeriod === 'days' ? -45 : 0}
              textAnchor={selectedPeriod === 'days' ? 'end' : 'middle'}
              height={selectedPeriod === 'days' ? 80 : 60}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            {visibleMetrics.revenue && (
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
            )}
            {visibleMetrics.cash && (
              <Line type="monotone" dataKey="cash" stroke="#22c55e" strokeWidth={2} />
            )}
            {visibleMetrics.calls && (
              <Line type="monotone" dataKey="calls" stroke="#f59e0b" strokeWidth={2} />
            )}
          </LineChart>
        </ResponsiveContainer>
      </Card>

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
                    label={({ source, percent }) => `${source} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
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
                  <div key={item.source} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="font-medium text-sm">{item.source}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{item.count}</div>
                      <div className="text-xs text-muted-foreground">
                        ${item.revenue.toLocaleString()}
                      </div>
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
