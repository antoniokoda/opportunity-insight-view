
import React from 'react';
import { format, isSameMonth, isToday } from 'date-fns';
import type { Call } from '@/hooks/useCalls';

interface MonthViewProps {
  monthDays: Date[];
  currentDate: Date;
  getCallsForDay: (date: Date) => any[];
  onDateSelect: (date: Date) => void;
}

export const MonthView: React.FC<MonthViewProps> = ({
  monthDays,
  currentDate,
  getCallsForDay,
  onDateSelect
}) => {
  return (
    <div className="px-6 pb-6">
      {/* Days of week header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
          <div key={day} className="p-1 text-center text-xs font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {monthDays.map(day => {
          const calls = getCallsForDay(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isDayToday = isToday(day);

          // Decide base styles (no yellow, gray as default, white-on-hover)
          let baseBg = 'bg-zinc-100'; // very light gray base
          let border = 'border-zinc-200'; // light gray border
          let textColor = isDayToday
            ? 'text-primary'
            : isCurrentMonth
              ? 'text-foreground'
              : 'text-muted-foreground';
          if (!isCurrentMonth) {
            baseBg = 'bg-muted/30'; // slightly muted for days outside month
            textColor = 'text-muted-foreground';
          }

          return (
            <div
              key={day.toString()}
              className={
                `min-h-[70px] p-1.5 border rounded-lg cursor-pointer transition-colors 
                ${baseBg} ${border} 
                hover:bg-white hover:border-zinc-200
                `
              }
              onClick={() => onDateSelect(day)}
            >
              <div className={`text-xs font-medium mb-1 ${textColor}`}>
                {format(day, 'd')}
              </div>
              
              <div className="space-y-0.5">
                {calls.slice(0, 2).map(call => (
                  <div
                    key={call.id}
                    className="text-[10px] p-0.5 rounded bg-primary/10 text-primary truncate overflow-hidden"
                    title={`${call.type} #${call.number} - ${call.opportunity_name}`}
                  >
                    <span className="block truncate">
                      {format(new Date(call.date), 'HH:mm')} {call.type}
                    </span>
                  </div>
                ))}
                {calls.length > 2 && (
                  <div className="text-[10px] text-muted-foreground truncate">
                    +{calls.length - 2} más
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
