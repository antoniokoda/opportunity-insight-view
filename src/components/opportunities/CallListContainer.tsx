
import React, { useState } from 'react';
import { useCalls } from '@/hooks/useCalls';
import { CallList } from './CallList';
import { CallForm } from './CallForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import type { Call } from '@/hooks/useCalls';

interface CallListContainerProps {
  opportunityId: number;
}

export const CallListContainer: React.FC<CallListContainerProps> = ({
  opportunityId
}) => {
  const { calls, addCall, updateCall, deleteCall, isAdding, isUpdating, isDeleting } = useCalls(opportunityId);
  const [isAddingCall, setIsAddingCall] = useState(false);
  const [editingCall, setEditingCall] = useState<Call | null>(null);

  const handleAddCall = (callData: any) => {
    addCall({
      ...callData,
      opportunity_id: opportunityId,
    });
    setIsAddingCall(false);
  };

  const handleEditCall = (callData: any) => {
    if (editingCall) {
      updateCall({
        id: editingCall.id,
        updates: callData,
      });
      setEditingCall(null);
    }
  };

  const handleEdit = (call: Call) => {
    setEditingCall(call);
  };

  const handleDelete = (id: number) => {
    deleteCall(id);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Llamadas ({calls.length})</h3>
        <Button
          onClick={() => setIsAddingCall(true)}
          size="sm"
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Agregar llamada
        </Button>
      </div>

      <CallList
        calls={calls}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isDeleting={isDeleting}
      />

      {isAddingCall && (
        <CallForm
          onSubmit={handleAddCall}
          onCancel={() => setIsAddingCall(false)}
          isSubmitting={isAdding}
        />
      )}

      {editingCall && (
        <CallForm
          call={editingCall}
          onSubmit={handleEditCall}
          onCancel={() => setEditingCall(null)}
          isSubmitting={isUpdating}
        />
      )}
    </div>
  );
};
