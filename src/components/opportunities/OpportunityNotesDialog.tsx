
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Plus, Edit, Trash2, StickyNote } from 'lucide-react';
import { useOpportunityNotes } from '@/hooks/useOpportunityNotes';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface OpportunityNotesDialogProps {
  opportunityId: number;
  opportunityName: string;
  isOpen: boolean;
  onClose: () => void;
}

export const OpportunityNotesDialog: React.FC<OpportunityNotesDialogProps> = ({
  opportunityId,
  opportunityName,
  isOpen,
  onClose,
}) => {
  const { notes, isLoading, addNote, updateNote, deleteNote, isAdding, isUpdating, isDeleting } = useOpportunityNotes(opportunityId);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteForm, setNoteForm] = useState({
    title: '',
    content: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteForm.title.trim()) return;

    if (editingNoteId) {
      updateNote({
        noteId: editingNoteId,
        updates: {
          title: noteForm.title,
          content: noteForm.content
        }
      });
      setEditingNoteId(null);
    } else {
      addNote({
        title: noteForm.title,
        content: noteForm.content
      });
      setShowAddForm(false);
    }

    setNoteForm({ title: '', content: '' });
  };

  const handleEdit = (note: any) => {
    setNoteForm({
      title: note.title,
      content: note.content || ''
    });
    setEditingNoteId(note.id);
    setShowAddForm(true);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingNoteId(null);
    setNoteForm({ title: '', content: '' });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <StickyNote className="w-5 h-5" />
            Notas - {opportunityName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Add Note Button */}
          {!showAddForm && (
            <Button onClick={() => setShowAddForm(true)} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Agregar nota
            </Button>
          )}

          {/* Add/Edit Note Form */}
          {showAddForm && (
            <div className="p-4 border rounded-lg bg-muted/50">
              <h3 className="font-medium mb-4">
                {editingNoteId ? 'Editar nota' : 'Nueva nota'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Título</label>
                  <Input
                    value={noteForm.title}
                    onChange={(e) => setNoteForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Título de la nota"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Contenido</label>
                  <Textarea
                    value={noteForm.content}
                    onChange={(e) => setNoteForm(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Contenido de la nota..."
                    rows={4}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={isAdding || isUpdating}>
                    {(isAdding || isUpdating) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {editingNoteId ? 'Actualizar' : 'Agregar'}
                  </Button>
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Notes List */}
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              <span>Cargando notas...</span>
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay notas aún
            </div>
          ) : (
            <div className="space-y-3">
              <h3 className="font-semibold">Notas ({notes.length})</h3>
              {notes.map((note) => (
                <div key={note.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium mb-2">{note.title}</h4>
                      {note.content && (
                        <p className="text-muted-foreground whitespace-pre-wrap mb-2">
                          {note.content}
                        </p>
                      )}
                      <div className="text-xs text-muted-foreground">
                        Creada: {format(new Date(note.created_at), 'dd/MM/yyyy HH:mm', { locale: es })}
                        {note.updated_at !== note.created_at && (
                          <span> • Editada: {format(new Date(note.updated_at), 'dd/MM/yyyy HH:mm', { locale: es })}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(note)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteNote(note.id)}
                        disabled={isDeleting}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
