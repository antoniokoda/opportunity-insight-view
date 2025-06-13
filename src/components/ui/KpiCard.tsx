
import React from 'react';
import { Card } from './card';

interface KpiCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  subtitle?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  subtitle
}) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-500';
      default:
        return 'text-apple-gray-500';
    }
  };

  return (
    <div className="card-apple p-8 group hover:scale-[1.02] transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-semibold text-apple-gray-600 mb-3 uppercase tracking-wider">{title}</p>
          <p className="text-4xl font-bold text-apple-gray-900 mb-2 tracking-tight leading-none">{value}</p>
          {subtitle && (
            <p className="text-sm text-apple-gray-600 mb-3 font-medium">{subtitle}</p>
          )}
          {change && (
            <div className={`text-sm font-semibold ${getChangeColor()} flex items-center bg-apple-gray-50 px-3 py-1.5 rounded-lg inline-flex`}>
              {change}
            </div>
          )}
        </div>
        <div className="text-apple-blue ml-8 opacity-60 group-hover:opacity-80 transition-opacity">
          {icon}
        </div>
      </div>
    </div>
  );
};
