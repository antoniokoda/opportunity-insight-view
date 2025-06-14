
import { useState } from 'react';
import { addMonths, subMonths, addDays } from 'date-fns';

type ViewType = 'month' | 'week';

export const useCalendarNavigation = () => {
  // Cambiamos aquí para que por defecto sea la fecha de hoy
  const [currentDate, setCurrentDate] = useState(new Date()); // Fecha actual por defecto
  const [view, setView] = useState<ViewType>('week'); // Default to week view

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

  const navigate = (direction: 'prev' | 'next') => {
    if (view === 'month') {
      navigateMonth(direction);
    } else {
      navigateWeek(direction);
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  return {
    currentDate,
    view,
    setView,
    navigate,
    goToToday
  };
};
