
import React from "react";
import { formatCallDate, getCallTypeColor } from "./opportunityHelpers";
import { Badge } from '@/components/ui/badge';
import { Button } from "@/components/ui/button";
import { Edit, Trash, ExternalLink, Link } from "lucide-react";
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

  // Función para validar y mostrar enlace de manera segura
  const renderCallLink = (call: Call) => {
    console.log('=== CallList renderCallLink ===');
    console.log('Call ID:', call.id);
    console.log('Call link value:', call.link);
    console.log('Call link type:', typeof call.link);
    
    if (!call.link || call.link.trim() === '') {
      console.log('No link available for call:', call.id);
      return (
        <Badge variant="outline" className="text-gray-400">
          <Link size={12} className="mr-1" />
          Sin enlace
        </Badge>
      );
    }

    // Validar que sea una URL válida
    let validUrl = '';
    try {
      const url = new URL(call.link);
      validUrl = url.href;
      console.log('Valid URL found:', validUrl);
    } catch (error) {
      console.log('Invalid URL detected:', call.link, error);
      return (
        <Badge variant="outline" className="text-red-500">
          <Link size={12} className="mr-1" />
          URL inválida
        </Badge>
      );
    }

    return (
      <a 
        href={validUrl} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
        onClick={() => {
          console.log('Link clicked:', validUrl);
        }}
      >
        <ExternalLink size={14} />
        <span>Enlace</span>
      </a>
    );
  };

  return (
    <div className="space-y-2">
      {calls.map(call => {
        console.log('=== Rendering call in list ===');
        console.log('Call:', call);
        console.log('Call link:', call.link);
        
        return (
          <div key={call.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3 flex-wrap">
              <Badge variant="outline" className={getCallTypeColor(call.type)}>
                {call.type}
              </Badge>
              <span className="text-sm">{formatCallDate(call.date)}</span>
              {call.attended !== null && (
                <Badge variant={call.attended ? "attended" : "not-attended"}>
                  {call.attended ? "Asistió" : "No asistió"}
                </Badge>
              )}
              {renderCallLink(call)}
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
        );
      })}
    </div>
  );
};
