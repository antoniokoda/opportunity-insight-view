
import React from "react";
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, X } from "lucide-react";
import type { CallType, Call } from "@/hooks/useCalls";

interface CallFormProps {
  callValues: {
    type: CallType;
    date: string;
    duration: string;
    attended: boolean;
    link: string;
  };
  setCallValues: (setter: (prev: any) => any) => void;
  loading: boolean;
  isEditing: boolean;
  onCancel: () => void;
  onSave: () => void;
}

export const CallForm: React.FC<CallFormProps> = ({
  callValues,
  setCallValues,
  loading,
  isEditing,
  onCancel,
  onSave
}) => (
  <div className="p-4 border rounded-lg bg-white">
    <div className="flex items-center justify-between mb-4">
      <h4 className="font-medium">{isEditing ? 'Editar Llamada' : 'Nueva Llamada'}</h4>
      <Button variant="ghost" size="sm" onClick={onCancel}>
        <X size={16} />
      </Button>
    </div>
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Tipo</label>
          <Select value={callValues.type} onValueChange={(value: CallType) => setCallValues(prev => ({ ...prev, type: value }))}>
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
            min="0"
            value={callValues.duration}
            onChange={(e) => setCallValues(prev => ({ ...prev, duration: e.target.value }))}
            placeholder="30"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Fecha y Hora</label>
        <Input
          type="datetime-local"
          value={callValues.date}
          onChange={(e) => setCallValues(prev => ({ ...prev, date: e.target.value }))}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Enlace (opcional)</label>
        <Input
          type="url"
          value={callValues.link}
          onChange={(e) => setCallValues(prev => ({ ...prev, link: e.target.value }))}
          placeholder="https://meet.google.com/xxx-xxxx-xxx"
        />
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="attendance"
          checked={callValues.attended}
          onCheckedChange={(checked) => setCallValues(prev => ({ ...prev, attended: !!checked }))}
        />
        <label htmlFor="attendance" className="text-sm font-medium">
          Asistencia
        </label>
      </div>
    </div>
    <div className="flex gap-2 mt-4">
      <Button
        onClick={onSave}
        size="sm"
        disabled={loading}
      >
        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {isEditing ? 'Guardar Cambios' : 'Añadir Llamada'}
      </Button>
      <Button variant="outline" size="sm" onClick={onCancel}>
        Cancelar
      </Button>
    </div>
  </div>
);

