
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, X } from 'lucide-react';
import { CallType } from '@/hooks/useCalls';

interface AddCallFormProps {
  showAddCall: boolean;
  setShowAddCall: (show: boolean) => void;
  newCall: {
    type: CallType;
    date: string;
    duration: string;
    attended: boolean | null;
    link: string;
  };
  setNewCall: React.Dispatch<React.SetStateAction<{
    type: CallType;
    date: string;
    duration: string;
    attended: boolean | null;
    link: string;
  }>>;
  handleAddCall: () => void;
  isAdding: boolean;
}

export const AddCallForm: React.FC<AddCallFormProps> = ({
  showAddCall,
  setShowAddCall,
  newCall,
  setNewCall,
  handleAddCall,
  isAdding,
}) => {
  if (!showAddCall) return null;

  return (
    <div className="p-4 border rounded-lg bg-muted/50">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium">Nueva Llamada</h4>
        <Button variant="ghost" size="sm" onClick={() => setShowAddCall(false)}>
          <X size={16} />
        </Button>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Tipo</label>
            <Select value={newCall.type} onValueChange={(value: CallType) => setNewCall(prev => ({ ...prev, type: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Discovery 1">Discovery 1</SelectItem>
                <SelectItem value="Discovery 2">Discovery 2</SelectItem>
                <SelectItem value="Discovery 3">Discovery 3</SelectItem>
                <SelectItem value="Closing 1">Closing 1</SelectItem>
                <SelectItem value="Closing 2">Closing 2</SelectItem>
                <SelectItem value="Closing 3">Closing 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Duración (min)</label>
            <Input
              type="number"
              min="1"
              value={newCall.duration}
              onChange={(e) => setNewCall(prev => ({ ...prev, duration: e.target.value }))}
              placeholder="30"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Fecha y Hora</label>
          <Input
            type="datetime-local"
            value={newCall.date}
            onChange={(e) => setNewCall(prev => ({ ...prev, date: e.target.value }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Enlace (opcional)</label>
          <Input
            type="url"
            value={newCall.link}
            onChange={(e) => setNewCall(prev => ({ ...prev, link: e.target.value }))}
            placeholder="https://meet.google.com/xxx-xxxx-xxx"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Asistencia del cliente</label>
          <Select 
            value={newCall.attended === null ? 'pending' : newCall.attended ? 'attended' : 'not-attended'} 
            onValueChange={(value) => {
              let attendedValue: boolean | null = null;
              if (value === 'attended') attendedValue = true;
              else if (value === 'not-attended') attendedValue = false;
              setNewCall(prev => ({ ...prev, attended: attendedValue }));
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pendiente</SelectItem>
              <SelectItem value="attended">Asistió</SelectItem>
              <SelectItem value="not-attended">No asistió</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex gap-2 mt-4">
        <Button 
          onClick={handleAddCall} 
          size="sm" 
          disabled={isAdding || !newCall.duration || isNaN(parseInt(newCall.duration)) || parseInt(newCall.duration) <= 0}
        >
          {isAdding && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Añadir Llamada
        </Button>
        <Button variant="outline" size="sm" onClick={() => setShowAddCall(false)}>
          Cancelar
        </Button>
      </div>
    </div>
  );
};
