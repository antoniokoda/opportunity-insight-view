
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calendar, BarChart3, TrendingUp } from 'lucide-react';
import { PeriodType } from '@/hooks/usePeriodFilter';

interface PeriodSelectorProps {
  selectedPeriod: PeriodType;
  onPeriodChange: (period: PeriodType) => void;
}

export const PeriodSelector: React.FC<PeriodSelectorProps> = ({
  selectedPeriod,
  onPeriodChange,
}) => {
  const periods: Array<{ type: PeriodType; label: string; icon: React.ReactNode }> = [
    { type: 'days', label: 'Días', icon: <Calendar className="w-4 h-4" /> },
    { type: 'weeks', label: 'Semanas', icon: <BarChart3 className="w-4 h-4" /> },
    { type: 'months', label: 'Meses', icon: <TrendingUp className="w-4 h-4" /> },
  ];

  return (
    <Card className="p-3 w-fit">
      <div className="flex gap-1">
        {periods.map((period) => (
          <Button
            key={period.type}
            variant={selectedPeriod === period.type ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onPeriodChange(period.type)}
            className="flex items-center gap-2"
          >
            {period.icon}
            {period.label}
          </Button>
        ))}
      </div>
    </Card>
  );
};
