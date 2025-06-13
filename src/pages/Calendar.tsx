
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
  getDay
} from 'date-fns';
import { es } from 'date-fns/locale';

type ViewType = 'month' | 'week';

export const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 1)); // January 2025
  const [view, setView] = useState<ViewType>('month');
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
      return 'bg-blue-100 text-blue-800';
    } else if (type.startsWith('Closing')) {
      return 'bg-success-50 text-success-600';
    }
    return 'bg-gray-100 text-gray-800';
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

  const hours = Array.from({ length: 24 }, (_, i) => i);

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

      <Card className="p-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold">
              {view === 'month' 
                ? format(currentDate, 'MMMM yyyy', { locale: es })
                : `Semana del ${format(weekStart, 'dd', { locale: es })} al ${format(weekEnd, 'dd MMM yyyy', { locale: es })}`
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
          /* Month View - Made smaller */
          <>
            {/* Days of week header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
                <div key={day} className="p-1 text-center text-xs font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar Grid - Made smaller */}
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
          </>
        ) : (
          /* Week View - Added separators between days */
          <div className="space-y-4">
            {/* Week days header */}
            <div className="grid grid-cols-8 gap-0">
              <div className="p-2"></div>
              {weekDays.map((day, index) => (
                <React.Fragment key={day.toString()}>
                  <div className="p-2 text-center">
                    <div className={`text-sm font-medium ${isToday(day) ? 'text-primary' : 'text-foreground'}`}>
                      {format(day, 'EEE', { locale: es })}
                    </div>
                    <div className={`text-lg font-bold ${
                      isToday(day) ? 'text-primary bg-primary/10 rounded-full w-8 h-8 flex items-center justify-center mx-auto' : 'text-foreground'
                    }`}>
                      {format(day, 'd')}
                    </div>
                  </div>
                  {index < weekDays.length - 1 && (
                    <div className="flex justify-center items-center">
                      <Separator orientation="vertical" className="h-12" />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
            
            {/* Hour grid with separators */}
            <div className="max-h-[600px] overflow-y-auto">
              <div className="grid grid-cols-8 gap-0">
                {hours.map(hour => (
                  <React.Fragment key={hour}>
                    {/* Hour label */}
                    <div className="p-2 text-xs text-muted-foreground text-right border-r">
                      {format(setHours(new Date(), hour), 'HH:mm')}
                    </div>
                    {/* Day columns with separators */}
                    {weekDays.map((day, dayIndex) => {
                      const hourCalls = getCallsForHour(day, hour);
                      return (
                        <React.Fragment key={`${day.toString()}-${hour}`}>
                          <div className="min-h-[40px] p-1 border-b border-border hover:bg-accent/50 transition-colors">
                            {hourCalls.map(call => (
                              <div
                                key={call.id}
                                className={`text-xs p-1 rounded mb-1 ${getCallTypeColor(call.type)} cursor-pointer`}
                                title={`${call.opportunity_name} - ${call.salesperson_name}`}
                              >
                                <div className="font-medium">{call.type} #{call.number}</div>
                                <div className="truncate">{call.opportunity_name}</div>
                              </div>
                            ))}
                          </div>
                          {dayIndex < weekDays.length - 1 && (
                            <div className="border-b border-border">
                              <Separator orientation="vertical" className="h-full min-h-[40px]" />
                            </div>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </React.Fragment>
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
