
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Call } from '@/hooks/useCalls';

interface CallsListProps {
  calls: Call[];
}

export const CallsList: React.FC<CallsListProps> = ({ calls }) => {
  const getCallTypeColor = (type: string) => {
    if (type.startsWith('Discovery')) {
      return 'bg-blue-100 text-blue-800';
    } else if (type.startsWith('Closing')) {
      return 'bg-success-50 text-success-600';
    }
    return 'bg-gray-100 text-gray-800';
  };

  if (calls.length === 0) {
    return <p className="text-sm text-muted-foreground">No hay llamadas registradas</p>;
  }

  return (
    <div className="space-y-2">
      {calls.map(call => (
        <div key={call.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <div className="flex items-center gap-3">
            <Badge className={getCallTypeColor(call.type)}>
              {call.type} #{call.number}
            </Badge>
            <span className="text-sm">
              {format(new Date(call.date), 'dd/MM/yyyy HH:mm', { locale: es })}
            </span>
            {call.attended !== null && (
              <Badge variant={call.attended ? "default" : "destructive"}>
                {call.attended ? "Asistió" : "No asistió"}
              </Badge>
            )}
            {call.link && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(call.link, '_blank')}
                className="h-6 w-6 p-0"
              >
                <ExternalLink className="h-3 w-3" />
              </Button>
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            {call.duration} min
          </div>
        </div>
      ))}
    </div>
  );
};
