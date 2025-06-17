
import React from 'react';
import { Button } from '@/components/ui/button';
import { LayoutGrid, Table } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ViewSelectorProps {
  currentView: 'pipeline' | 'table';
  onViewChange: (view: 'pipeline' | 'table') => void;
}

export const ViewSelector: React.FC<ViewSelectorProps> = ({
  currentView,
  onViewChange,
}) => {
  return (
    <div className="flex items-center bg-zinc-100 rounded-lg p-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewChange('pipeline')}
        className={cn(
          "flex items-center gap-2 transition-colors",
          currentView === 'pipeline' 
            ? "bg-white text-zinc-900 shadow-sm" 
            : "text-zinc-600 hover:text-zinc-900"
        )}
      >
        <LayoutGrid className="w-4 h-4" />
        Pipeline
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewChange('table')}
        className={cn(
          "flex items-center gap-2 transition-colors",
          currentView === 'table' 
            ? "bg-white text-zinc-900 shadow-sm" 
            : "text-zinc-600 hover:text-zinc-900"
        )}
      >
        <Table className="w-4 h-4" />
        Tabla
      </Button>
    </div>
  );
};
