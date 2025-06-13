
import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval
} from 'date-fns';

// Import new components
import { CalendarHeader } from '@/components/calendar/CalendarHeader';
import { MonthView } from '@/components/calendar/MonthView';
import { WeekView } from '@/components/calendar/WeekView';
import { DayDetails } from '@/components/calendar/DayDetails';
import { CalendarLoadingState } from '@/components/calendar/CalendarLoadingState';

// Import new hooks
import { useCalendarData } from '@/hooks/useCalendarData';
import { useCalendarNavigation } from '@/hooks/useCalendarNavigation';

export const Calendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  const { currentDate, view, setView, navigate, goToToday } = useCalendarNavigation();
  const { isLoading, getCallsForDay, getCallsForHour, getCallTypeColor } = useCalendarData();

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
    return <CalendarLoadingState />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Calendario</h1>
          <p className="text-muted-foreground">Gestiona tus llamadas y reuniones</p>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <CalendarHeader
          currentDate={currentDate}
          view={view}
          onViewChange={setView}
          onNavigate={navigate}
          onToday={goToToday}
        />

        {view === 'month' ? (
          <MonthView
            monthDays={monthDays}
            currentDate={currentDate}
            getCallsForDay={getCallsForDay}
            onDateSelect={setSelectedDate}
          />
        ) : (
          <WeekView
            weekDays={weekDays}
            hours={hours}
            getCallsForHour={getCallsForHour}
            getCallTypeColor={getCallTypeColor}
          />
        )}
      </Card>

      {/* Selected Day Details - Only show in month view */}
      {view === 'month' && selectedDate && (
        <DayDetails
          selectedDate={selectedDate}
          calls={getCallsForDay(selectedDate)}
          getCallTypeColor={getCallTypeColor}
        />
      )}
    </div>
  );
};
