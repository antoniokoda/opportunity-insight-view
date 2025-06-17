
import React, { useState } from 'react';
import { useCalls } from '@/hooks/useCalls';
import { CallList } from './CallList';
import { CallForm } from './CallForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import type { Call, CallType } from '@/hooks/useCalls';

interface CallListContainerProps {
  opportunityId: number;
}

export const CallListContainer: React.FC<CallListContainerProps> = ({
  opportunityId
}) => {
  const { calls, addCall, updateCall, deleteCall, isAdding, isUpdating, isDeleting } = useCalls(opportunityId);
  const [isAddingCall, setIsAddingCall] = useState(false);
  const [editingCall, setEditingCall] = useState<Call | null>(null);
  
  // State for new call form
  const [newCallValues, setNewCallValues] = useState({
    type: 'Discovery 1' as CallType,
    date: '',
    duration: '',
    attended: false,
    link: ''
  });

  // State for edit call form
  const [editCallValues, setEditCallValues] = useState({
    type: 'Discovery 1' as CallType,
    date: '',
    duration: '',
    attended: false,
    link: ''
  });

  const handleAddCall = () => {
    addCall({
      opportunity_id: opportunityId,
      type: newCallValues.type,
      date: newCallValues.date,
      duration: parseInt(newCallValues.duration) || 0,
      attended: newCallValues.attended,
      link: newCallValues.link || null,
    });
    setIsAddingCall(false);
    setNewCallValues({
      type: 'Discovery 1' as CallType,
      date: '',
      duration: '',
      attended: false,
      link: ''
    });
  };

  const handleEditCall = () => {
    if (editingCall) {
      updateCall({
        id: editingCall.id,
        updates: {
          type: editCallValues.type,
          date: editCallValues.date,
          duration: parseInt(editCallValues.duration) || 0,
          attended: editCallValues.attended,
          link: editCallValues.link || null,
        },
      });
      setEditingCall(null);
    }
  };

  const handleEdit = (call: Call) => {
    setEditingCall(call);
    setEditCallValues({
      type: call.type,
      date: call.date,
      duration: call.duration.toString(),
      attended: call.attended || false,
      link: call.link || ''
    });
  };

  const handleDelete = (id: number) => {
    deleteCall(id);
  };

  const handleCancelAdd = () => {
    setIsAddingCall(false);
    setNewCallValues({
      type: 'Discovery 1' as CallType,
      date: '',
      duration: '',
      attended: false,
      link: ''
    });
  };

  const handleCancelEdit = () => {
    setEditingCall(null);
    setEditCallValues({
      type: 'Discovery 1' as CallType,
      date: '',
      duration: '',
      attended: false,
      link: ''
    });
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
          callValues={newCallValues}
          setCallValues={setNewCallValues}
          loading={isAdding}
          isEditing={false}
          onCancel={handleCancelAdd}
          onSave={handleAddCall}
        />
      )}

      {editingCall && (
        <CallForm
          callValues={editCallValues}
          setCallValues={setEditCallValues}
          loading={isUpdating}
          isEditing={true}
          onCancel={handleCancelEdit}
          onSave={handleEditCall}
        />
      )}
    </div>
  );
};
