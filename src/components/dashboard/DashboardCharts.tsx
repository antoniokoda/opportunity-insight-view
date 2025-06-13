
import React from 'react';
import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';

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
}

export const DashboardCharts: React.FC<DashboardChartsProps> = ({
  chartData,
  leadSourceData,
  visibleMetrics,
  setVisibleMetrics,
}) => {
  return (
    <div className="space-y-6">
      {/* Tendencias - Ancho completo */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Tendencias</h3>
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
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
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
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={leadSourceData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ source, percent }) => `${source} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="count"
            >
              {leadSourceData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};
