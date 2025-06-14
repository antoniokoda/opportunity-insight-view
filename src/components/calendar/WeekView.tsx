
import React from 'react';
import { format, isToday } from 'date-fns';
import { es } from 'date-fns/locale';
import { ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  // Map colors to Google Calendar-like strong backgrounds
  const googleTypeColor = (type: string) => {
    if (type.startsWith('Discovery')) {
      return 'bg-blue-500 hover:bg-blue-600 text-white';
    } else if (type.startsWith('Closing')) {
      // Cambiamos a verde explícito para "Closing"
      return 'bg-green-500 hover:bg-green-600 text-white';
    }
    return 'bg-gray-500 hover:bg-gray-600 text-white';
  };

  return (
    <div className="bg-gray-light border rounded-2xl overflow-hidden">
      {/* Week header with days */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="grid grid-cols-[60px_repeat(7,1fr)] h-14">
          {/* GMT indicator */}
          <div className="flex items-center justify-center text-xs text-gray-500 border-r border-gray-200 bg-white">
            GMT+01
          </div>
          {/* Day headers */}
          {weekDays.map(day => (
            <div key={day.toString()} className="flex flex-col items-center justify-center border-r border-gray-100 last:border-r-0 relative">
              <div className="text-xs text-gray-600 uppercase font-medium tracking-wide">
                {format(day, 'EEE', { locale: es })}
              </div>
              <div className={`mt-1 flex items-center justify-center text-base font-semibold w-8 h-8 
                ${isToday(day) 
                  ? 'bg-blue-600 text-white rounded-full shadow-lg' 
                  : 'text-gray-900'
                }`}>
                {format(day, 'd')}
              </div>
              {/* Hoy abajo de la fecha si es el día actual */}
              {isToday(day) && (
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-blue-600 font-bold">HOY</span>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Time grid */}
      <div className="overflow-y-auto max-h-[600px] scroll-smooth">
        <div className="relative">
          {hours.map((hour) => (
            <div key={hour} className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-gray-100 last:border-b-0 min-h-16 relative">
              {/* Time label */}
              <div className="h-16 flex items-start justify-end pr-2 pt-1 text-xs text-gray-400 border-r border-gray-50 bg-gray-light select-none">
                {hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
              </div>
              {/* Day columns */}
              {weekDays.map((day) => {
                const hourCalls = getCallsForHour(day, hour);
                return (
                  <div 
                    key={`${day.toString()}-${hour}`} 
                    className="h-16 border-r border-gray-100 last:border-r-0 relative bg-white group transition-colors min-h-16"
                  >
                    {/* Bloques de llamadas = eventos calendar */}
                    {hourCalls.map((call, callIndex) => {
                      const callDate = new Date(call.date);
                      const startMinutes = callDate.getMinutes();
                      // En Google Calendar: el evento se coloca acorde a los minutos en el bloque (top=proporcional)
                      const topOffset = (startMinutes / 60) * 64; // 64px = h-16
                      // Altura fija para 30' (sencillez), igual que antes
                      const eventHeight = 32;

                      return (
                        <div
                          key={call.id}
                          className={`
                            absolute left-1.5 right-1.5 px-3 py-2 flex flex-col gap-0.5 rounded-lg shadow-md cursor-pointer z-20
                            ${googleTypeColor(call.type)}
                            transition-transform duration-150 group-hover:scale-[1.015] hover:ring-2 hover:ring-black/10
                            animate-fade-in
                          `}
                          style={{
                            top: `${topOffset}px`,
                            height: `${eventHeight}px`
                          }}
                          title={`${call.type} #${call.number} - ${call.opportunity_name} (${format(callDate, "HH:mm")} / ${call.duration}min)`}
                        >
                          {/* Primera línea: Tipo y Número, muy visible */}
                          <div className="font-bold text-[15px] leading-snug truncate text-white drop-shadow-sm">
                            {call.type} <span className="font-semibold">#{call.number}</span>
                          </div>
                          {/* Nombre de oportunidad */}
                          <div className="text-xs truncate text-white/90 font-medium leading-[1.15]">
                            {call.opportunity_name}
                          </div>
                          {/* Hora y duración, más chico */}
                          <div className="text-[11px] text-white/70 font-medium leading-tight">
                            {format(callDate, 'HH:mm')} &middot; {call.duration}min
                          </div>
                          {/* Nuevo botón: Ver oportunidad de venta */}
                          <button
                            onClick={() => navigate(`/opportunities/${call.opportunity_id}`)}
                            className="flex items-center gap-1 mt-1 text-xs underline text-white/90 hover:text-white font-medium transition cursor-pointer"
                            type="button"
                            tabIndex={0}
                          >
                            <ExternalLink className="w-3 h-3" />
                            Ver oportunidad de venta
                          </button>
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
