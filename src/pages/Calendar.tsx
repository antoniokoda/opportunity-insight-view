
import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Separator } from '@/components/ui/separator';
import { Phone, Calendar as CalendarIcon, Clock, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSalespeople } from '@/hooks/useSalespeople';
import { useOpportunities } from '@/hooks/useOpportunities';
import { useCalls } from '@/hooks/useCalls';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  eachHourOfInterval,
  isSameDay, 
  isSameMonth,
  addDays,
  startOfDay,
  setHours,
  isToday,
  getDay,
  parseISO,
  addHours,
  differenceInMinutes
} from 'date-fns';
import { es } from 'date-fns/locale';

type ViewType = 'month' | 'week';

export const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 1)); // January 2025
  const [view, setView] = useState<ViewType>('week'); // Default to week view
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const { salespeople, isLoading: salesLoading } = useSalespeople();
  const { opportunities, isLoading: oppsLoading } = useOpportunities();
  const { calls, isLoading: callsLoading } = useCalls();

  const isLoading = salesLoading || oppsLoading || callsLoading;

  const allCalls = useMemo(() => {
    return calls.map(call => {
      const opp = opportunities.find(o => o.id === call.opportunity_id);
      const salesperson = salespeople.find(s => s.id === opp?.salesperson_id);
      return {
        ...call,
        opportunity_name: opp?.name || 'Unknown Opportunity',
        salesperson_name: salesperson?.name || 'Unknown Salesperson'
      };
    }).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [calls, opportunities, salespeople]);

  const getCallsForDay = (date: Date) => {
    return allCalls.filter(call => isSameDay(new Date(call.date), date));
  };

  const getCallsForHour = (date: Date, hour: number) => {
    return allCalls.filter(call => {
      const callDate = new Date(call.date);
      return isSameDay(callDate, date) && callDate.getHours() === hour;
    });
  };

  const getCallTypeColor = (type: string) => {
    if (type.startsWith('Discovery')) {
      return 'bg-blue-500 text-white border-blue-600';
    } else if (type.startsWith('Closing')) {
      return 'bg-green-500 text-white border-green-600';
    }
    return 'bg-gray-500 text-white border-gray-600';
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentDate(subMonths(currentDate, 1));
    } else {
      setCurrentDate(addMonths(currentDate, 1));
    }
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentDate(addDays(currentDate, -7));
    } else {
      setCurrentDate(addDays(currentDate, 7));
    }
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const monthDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Hours from 8 AM to 10 PM like Google Calendar
  const hours = Array.from({ length: 15 }, (_, i) => i + 8);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando calendario...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Calendario</h1>
          <p className="text-muted-foreground">Gestiona tus llamadas y reuniones</p>
        </div>
        <div className="flex rounded-lg border">
          <Button
            variant={view === 'month' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setView('month')}
            className="rounded-r-none"
          >
            Mes
          </Button>
          <Button
            variant={view === 'week' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setView('week')}
            className="rounded-l-none"
          >
            Semana
          </Button>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        {/* Calendar Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold">
              {view === 'month' 
                ? format(currentDate, 'MMMM yyyy', { locale: es })
                : `${format(weekStart, 'dd MMM', { locale: es })} - ${format(weekEnd, 'dd MMM yyyy', { locale: es })}`
              }
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(new Date())}
            >
              Hoy
            </Button>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => view === 'month' ? navigateMonth('prev') : navigateWeek('prev')}
            >
              <ChevronLeft size={16} />
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => view === 'month' ? navigateMonth('next') : navigateWeek('next')}
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>

        {view === 'month' ? (
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
                
                return (
                  <div
                    key={day.toString()}
                    className={`min-h-[70px] p-1.5 border rounded-lg ${
                      isDayToday ? 'bg-primary/10 border-primary' : 
                      isCurrentMonth ? 'bg-card border-border hover:bg-accent' : 
                      'bg-muted/30 border-border'
                    } cursor-pointer transition-colors`}
                    onClick={() => setSelectedDate(day)}
                  >
                    <div className={`text-xs font-medium mb-1 ${
                      isDayToday ? 'text-primary' : 
                      isCurrentMonth ? 'text-foreground' : 
                      'text-muted-foreground'
                    }`}>
                      {format(day, 'd')}
                    </div>
                    
                    <div className="space-y-0.5">
                      {calls.slice(0, 2).map(call => (
                        <div
                          key={call.id}
                          className="text-[10px] p-0.5 rounded bg-primary/10 text-primary truncate"
                          title={`${call.type} #${call.number} - ${call.opportunity_name}`}
                        >
                          {format(new Date(call.date), 'HH:mm')} {call.type}
                        </div>
                      ))}
                      {calls.length > 2 && (
                        <div className="text-[10px] text-muted-foreground">
                          +{calls.length - 2} más
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Week View - Google Calendar Style */
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
        )}
      </Card>

      {/* Selected Day Details - Only show in month view */}
      {view === 'month' && selectedDate && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            {format(selectedDate, 'EEEE, dd MMMM yyyy', { locale: es })}
          </h3>
          
          {(() => {
            const daysCalls = getCallsForDay(selectedDate);
            return daysCalls.length > 0 ? (
              <div className="space-y-3">
                {daysCalls.map(call => (
                  <div key={call.id} className="p-4 bg-muted rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <Badge className={getCallTypeColor(call.type)}>
                        {call.type} #{call.number}
                      </Badge>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <span>{call.duration}min</span>
                        {call.attended !== null && (
                          <Badge variant={call.attended ? "default" : "destructive"}>
                            {call.attended ? "Asistió" : "No asistió"}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <h4 className="font-medium mb-1">
                      {call.opportunity_name}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      con {call.salesperson_name}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        {format(new Date(call.date), 'HH:mm')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No hay llamadas programadas para este día.</p>
            );
          })()}
        </Card>
      )}
    </div>
  );
};
