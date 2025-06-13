
import React from 'react';
import { format, isToday } from 'date-fns';
import { es } from 'date-fns/locale';

interface WeekViewProps {
  weekDays: Date[];
  hours: number[];
  getCallsForHour: (date: Date, hour: number) => any[];
  getCallTypeColor: (type: string) => string;
}

export const WeekView: React.FC<WeekViewProps> = ({
  weekDays,
  hours,
  getCallsForHour,
  getCallTypeColor
}) => {
  return (
    <div className="bg-white">
      {/* Week header with days */}
      <div className="border-b border-gray-200">
        <div className="grid grid-cols-8 h-16">
          {/* GMT indicator */}
          <div className="flex items-center justify-center text-xs text-gray-500 border-r border-gray-200">
            GMT+01
          </div>
          {/* Day headers */}
          {weekDays.map(day => (
            <div key={day.toString()} className="flex flex-col items-center justify-center border-r border-gray-200 last:border-r-0">
              <div className="text-xs text-gray-600 uppercase font-medium">
                {format(day, 'EEE', { locale: es })}
              </div>
              <div className={`text-2xl font-normal ${
                isToday(day) 
                  ? 'bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center' 
                  : 'text-gray-900'
              }`}>
                {format(day, 'd')}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Time grid */}
      <div className="overflow-y-auto max-h-[600px]">
        <div className="relative">
          {hours.map((hour, hourIndex) => (
            <div key={hour} className="grid grid-cols-8 border-b border-gray-100 last:border-b-0">
              {/* Time label */}
              <div className="h-16 flex items-start justify-end pr-2 pt-1 text-xs text-gray-500 border-r border-gray-200">
                {hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
              </div>
              
              {/* Day columns */}
              {weekDays.map((day, dayIndex) => {
                const hourCalls = getCallsForHour(day, hour);
                return (
                  <div 
                    key={`${day.toString()}-${hour}`} 
                    className="h-16 border-r border-gray-100 last:border-r-0 relative hover:bg-gray-50 transition-colors"
                  >
                    {hourCalls.map((call, callIndex) => {
                      const callDate = new Date(call.date);
                      const startMinutes = callDate.getMinutes();
                      const topOffset = (startMinutes / 60) * 64; // 64px = h-16
                      const height = Math.max((call.duration / 60) * 64, 20); // Minimum 20px height
                      
                      return (
                        <div
                          key={call.id}
                          className={`absolute left-1 right-1 rounded text-xs p-1 cursor-pointer shadow-sm ${getCallTypeColor(call.type)}`}
                          style={{
                            top: `${topOffset}px`,
                            height: `${height}px`,
                            zIndex: 10 + callIndex
                          }}
                          title={`${call.opportunity_name} - ${call.salesperson_name} (${call.duration}min)`}
                        >
                          <div className="font-medium text-xs leading-3">
                            {call.type} #{call.number}
                          </div>
                          <div className="text-xs opacity-90 truncate leading-3">
                            {call.opportunity_name}
                          </div>
                          <div className="text-xs opacity-75 leading-3">
                            {format(callDate, 'HH:mm')} ({call.duration}min)
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
