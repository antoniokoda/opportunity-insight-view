
import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FiPhone, FiCalendar, FiClock, FiPlus } from 'react-icons/fi';
import { opportunities, upcomingCalls, salespeople } from '@/data/mockData';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';

export const Calendar: React.FC = () => {
  const allCalls = useMemo(() => {
    const existingCalls = opportunities.flatMap(opp => 
      opp.calls.map(call => ({
        ...call,
        opportunity_name: opp.name,
        salesperson_name: salespeople.find(s => s.id === opp.salesperson_id)?.name || 'Unknown'
      }))
    );
    
    const upcoming = upcomingCalls.map(call => {
      const opp = opportunities.find(o => o.id === call.deal_id);
      return {
        ...call,
        opportunity_name: opp?.name || 'Unknown',
        salesperson_name: salespeople.find(s => s.id === opp?.salesperson_id)?.name || 'Unknown'
      };
    });
    
    return [...existingCalls, ...upcoming].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, []);

  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const getCallsForDay = (date: Date) => {
    return allCalls.filter(call => isSameDay(new Date(call.date), date));
  };

  const getCallTypeColor = (type: string) => {
    return type === 'Discovery' ? 'bg-blue-100 text-blue-800' : 'bg-success-50 text-success-600';
  };

  const upcomingCallsList = allCalls
    .filter(call => new Date(call.date) > today)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Calendario</h1>
          <p className="text-muted-foreground">Gestiona tus llamadas y reuniones</p>
        </div>
        <Button className="flex items-center gap-2">
          <FiPlus size={16} />
          Nueva Llamada
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Calendar */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">
                Semana del {format(weekStart, 'dd', { locale: es })} al {format(weekEnd, 'dd MMM yyyy', { locale: es })}
              </h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Anterior</Button>
                <Button variant="outline" size="sm">Siguiente</Button>
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map(day => {
                const calls = getCallsForDay(day);
                const isToday = isSameDay(day, today);
                
                return (
                  <div
                    key={day.toString()}
                    className={`p-3 min-h-[120px] rounded-lg border ${
                      isToday ? 'bg-primary/5 border-primary' : 'bg-card border-border'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm font-medium ${
                        isToday ? 'text-primary' : 'text-foreground'
                      }`}>
                        {format(day, 'EEE', { locale: es })}
                      </span>
                      <span className={`text-lg font-bold ${
                        isToday ? 'text-primary' : 'text-foreground'
                      }`}>
                        {format(day, 'dd')}
                      </span>
                    </div>
                    
                    <div className="space-y-1">
                      {calls.map(call => (
                        <div
                          key={call.id}
                          className="text-xs p-2 rounded bg-muted hover:bg-accent cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-1 mb-1">
                            <FiPhone size={12} />
                            <span className="font-medium truncate">
                              {call.type} #{call.number}
                            </span>
                          </div>
                          <div className="text-muted-foreground">
                            {format(new Date(call.date), 'HH:mm')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Upcoming Calls Sidebar */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FiCalendar size={20} />
              Próximas Llamadas
            </h3>
            
            {upcomingCallsList.length > 0 ? (
              <div className="space-y-4">
                {upcomingCallsList.map(call => (
                  <div key={call.id} className="p-4 bg-muted rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <Badge className={getCallTypeColor(call.type)}>
                        {call.type} #{call.number}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {call.duration}min
                      </span>
                    </div>
                    
                    <h4 className="font-medium text-sm mb-1">
                      {call.opportunity_name}
                    </h4>
                    <p className="text-xs text-muted-foreground mb-2">
                      con {call.salesperson_name}
                    </p>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <FiCalendar size={12} />
                      {format(new Date(call.date), 'dd MMM', { locale: es })}
                      <FiClock size={12} />
                      {format(new Date(call.date), 'HH:mm')}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No hay llamadas próximas programadas
              </p>
            )}
          </Card>

          {/* Quick Stats */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Estadísticas</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Esta semana</span>
                <span className="font-semibold">
                  {allCalls.filter(call => {
                    const callDate = new Date(call.date);
                    return callDate >= weekStart && callDate <= weekEnd;
                  }).length} llamadas
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Discovery</span>
                <span className="font-semibold text-blue-600">
                  {allCalls.filter(call => call.type === 'Discovery').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Closing</span>
                <span className="font-semibold text-success-600">
                  {allCalls.filter(call => call.type === 'Closing').length}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
