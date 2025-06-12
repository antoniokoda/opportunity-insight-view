
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
        return 'text-success-600';
      case 'negative':
        return 'text-error-600';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <Card className="p-6 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200 border bg-card">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wide">{title}</p>
          <p className="text-3xl font-bold text-foreground mb-1 tracking-tight">{value}</p>
          {subtitle && (
            <p className="text-sm text-muted-foreground mb-2">{subtitle}</p>
          )}
          {change && (
            <p className={`text-sm font-medium ${getChangeColor()} flex items-center`}>
              {change}
            </p>
          )}
        </div>
        <div className="text-primary ml-6 opacity-80">
          {icon}
        </div>
      </div>
    </Card>
  );
};
