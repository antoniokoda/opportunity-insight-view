
import React from 'react';
import { Loader2 } from 'lucide-react';

export const CalendarLoadingState: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Cargando calendario...</p>
      </div>
    </div>
  );
};
