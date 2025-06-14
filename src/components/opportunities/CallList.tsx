
import React from "react";
import { formatCallDate, getCallTypeColor } from "./opportunityHelpers";
import { Badge } from '@/components/ui/badge';
import { Button } from "@/components/ui/button";
import { Edit, Trash, ExternalLink } from "lucide-react";
import type { Call } from "@/hooks/useCalls";

interface CallListProps {
  calls: Call[];
  onEdit: (call: Call) => void;
  onDelete: (id: number) => void;
  isDeleting: boolean;
}

export const CallList: React.FC<CallListProps> = ({
  calls,
  onEdit,
  onDelete,
  isDeleting
}) => {
  if (calls.length === 0) {
    return <p className="text-sm text-muted-foreground">No hay llamadas registradas</p>;
  }
  return (
    <div className="space-y-2">
      {calls.map(call => (
        <div key={call.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3 flex-wrap">
            <Badge variant="outline" className={getCallTypeColor(call.type)}>
              {call.type} #{call.number}
            </Badge>
            <span className="text-sm">{formatCallDate(call.date)}</span>
            {call.attended !== null && (
              <Badge variant={call.attended ? "attended" : "not-attended"}>
                {call.attended ? "Asistió" : "No asistió"}
              </Badge>
            )}
            {call.link && (
              <a href={call.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-blue-600 hover:underline">
                <ExternalLink size={14} />
                <span>Enlace</span>
              </a>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge>{call.duration} min</Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(call)}
              className="h-8 w-8 p-0"
              aria-label="Editar llamada"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              aria-label="Eliminar llamada"
              className="h-8 w-8 p-0"
              onClick={() => onDelete(call.id)}
              disabled={isDeleting}
            >
              <Trash className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

