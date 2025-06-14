
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Link as LinkIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { getCallTypeColor, isCallInThePast } from "./opportunityHelpers";
import type { Call } from "@/hooks/useCalls";

interface CallSummaryListProps {
  calls: Call[];
}

export const CallSummaryList: React.FC<CallSummaryListProps> = ({ calls }) => {
  if (!calls || calls.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-zinc-900">Llamadas ({calls.length})</span>
      </div>
      <div className="space-y-1 max-h-20 overflow-y-auto">
        {calls.slice(0, 3).map((call) => (
          <div key={call.id} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={getCallTypeColor(call.type)}>
                {call.type}
              </Badge>
              {call.attended === false && isCallInThePast(call.date) && (
                <Badge variant="not-attended">No asistió</Badge>
              )}
              {call.attended === true && (
                <Badge variant="attended">Asistió</Badge>
              )}
              {call.link && !!call.link.trim() && (
                <>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a
                        href={call.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center"
                      >
                        <ExternalLink className="w-3 h-3 text-zinc-500 hover:text-zinc-800" />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Abrir enlace</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-6 h-6 p-0"
                        onClick={(e) => {
                          e.preventDefault();
                          window.open(call.link!, "_blank", "noopener,noreferrer");
                        }}
                        aria-label="Ir al enlace de la reunión"
                      >
                        <LinkIcon className="w-4 h-4 text-blue-500" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Ir a la reunión</p>
                    </TooltipContent>
                  </Tooltip>
                </>
              )}
            </div>
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">
                {format(new Date(call.date), "dd/MM", { locale: es })}
              </span>
            </div>
          </div>
        ))}
        {calls.length > 3 && (
          <div className="text-xs text-muted-foreground text-center">
            +{calls.length - 3} más
          </div>
        )}
      </div>
    </div>
  );
};
