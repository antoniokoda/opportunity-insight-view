
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send, StickyNote } from 'lucide-react';
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
  const { notes, isLoading, addNote, isAdding } = useOpportunityNotes(opportunityId);
  const [noteForm, setNoteForm] = useState({
    title: '',
    content: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteForm.title.trim()) return;

    addNote({
      title: noteForm.title,
      content: noteForm.content
    });

    setNoteForm({ title: '', content: '' });
  };

  // Ordenar notas por fecha de creación (más antiguas primero, como WhatsApp)
  const sortedNotes = [...notes].sort((a, b) => 
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <StickyNote className="w-5 h-5" />
            Notas - {opportunityName}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col min-h-0">
          {/* Chat Messages Area */}
          <div className="flex-1 overflow-y-auto mb-4 space-y-3 p-4 bg-muted/20 rounded-lg min-h-[300px] max-h-[400px]">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                <span>Cargando notas...</span>
              </div>
            ) : sortedNotes.length === 0 ? (
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                No hay mensajes aún
              </div>
            ) : (
              sortedNotes.map((note) => (
                <div key={note.id} className="bg-background p-3 rounded-lg shadow-sm border">
                  <div className="mb-2">
                    <h4 className="font-medium text-sm">{note.title}</h4>
                    <div className="text-xs text-muted-foreground mt-1">
                      {format(new Date(note.created_at), 'dd/MM/yyyy HH:mm', { locale: es })}
                    </div>
                  </div>
                  {note.content && (
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {note.content}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Message Input Form */}
          <div className="border-t pt-4">
            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                value={noteForm.title}
                onChange={(e) => setNoteForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Título del mensaje..."
                required
              />
              <div className="flex gap-2">
                <Textarea
                  value={noteForm.content}
                  onChange={(e) => setNoteForm(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Escribe tu mensaje..."
                  rows={2}
                  className="flex-1 resize-none"
                />
                <Button 
                  type="submit" 
                  disabled={isAdding || !noteForm.title.trim()}
                  size="sm"
                  className="self-end"
                >
                  {isAdding ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
