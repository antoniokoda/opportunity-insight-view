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
    <div className="card-apple py-6 px-6 pr-5 group hover:scale-[1.02] transition-all duration-300 h-full min-h-[172px] flex flex-col justify-between">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          {/* Título KPI - más pequeño y con tracking */}
          <p className="text-xs font-semibold text-zinc-600 mb-2 uppercase tracking-wider">{title}</p>
          {/* Valor principal KPI más pequeño */}
          <p className="text-2xl font-bold text-zinc-900 mb-1 tracking-tight leading-tight break-words">{value}</p>
          {/* Subtítulo */}
          {subtitle && (
            <p className="text-xs text-zinc-600 mb-2 font-medium leading-snug">{subtitle}</p>
          )}
          {/* Cambio KPI */}
          {change && (
            <div className={`text-xs font-semibold ${getChangeColor()} flex items-center bg-zinc-50 px-2.5 py-1.5 rounded-lg inline-flex`}>
              {change}
            </div>
          )}
        </div>
        {/* Icono alineado */}
        <div className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-full ml-4 mr-1 bg-blue-500/10">
          <span className="text-blue-500 opacity-70 group-hover:opacity-90 transition-opacity block">
            {icon}
          </span>
        </div>
      </div>
    </div>
  );
};
