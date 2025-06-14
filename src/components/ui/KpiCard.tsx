
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
        return 'text-zinc-500';
    }
  };

  return (
    <div className="card-apple py-8 px-8 pr-6 group hover:scale-[1.02] transition-all duration-300 h-full min-h-[186px] flex flex-col justify-between">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-zinc-600 mb-3 uppercase tracking-wider">{title}</p>
          <p className="text-4xl font-bold text-zinc-900 mb-2 tracking-tight leading-none break-words">{value}</p>
          {subtitle && (
            <p className="text-sm text-zinc-600 mb-3 font-medium">{subtitle}</p>
          )}
          {change && (
            <div className={`text-sm font-semibold ${getChangeColor()} flex items-center bg-zinc-50 px-3 py-1.5 rounded-lg inline-flex`}>
              {change}
            </div>
          )}
        </div>
        {/* Icono bien alineado y nunca cortado */}
        <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full ml-6 mr-1 bg-blue-500/10">
          <span className="text-blue-500 opacity-70 group-hover:opacity-90 transition-opacity block">
            {icon}
          </span>
        </div>
      </div>
    </div>
  );
};
