
import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

interface DayDetailsProps {
  selectedDate: Date;
  calls: any[];
  getCallTypeColor: (type: string) => string;
}

export const DayDetails: React.FC<DayDetailsProps> = ({
  selectedDate,
  calls,
  getCallTypeColor
}) => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">
        {format(selectedDate, 'EEEE, dd MMMM yyyy', { locale: es })}
      </h3>
      
      {calls.length > 0 ? (
        <div className="space-y-3">
          {calls.map(call => (
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
      )}
    </Card>
  );
};
