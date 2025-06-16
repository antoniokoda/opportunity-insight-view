
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

// Minimal "security monitoring" util for errors
const logError = (context: string, error: any) => {
  // Extend here with external Sentry, analytics, etc. 
  // Only outputs safe info to console for now.
  console.warn(`[SecurityMonitor] ${context}:`, error?.message || error);
};

export interface OpportunityNote {
  id: string;
  opportunity_id: number;
  title: string;
  content: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
  user_name: string | null;
  user_email: string | null;
}

const validateNoteInput = (note: { title: string; content: string }) => {
  if (!note.title?.trim()) return 'El título del mensaje es obligatorio.';
  // Content can be empty (?)
  return null;
};

export const useOpportunityNotes = (opportunityId: number) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: notes = [], isLoading, error } = useQuery({
    queryKey: ['opportunity-notes', opportunityId],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('opportunity_notes_with_users')
        .select('*')
        .eq('opportunity_id', opportunityId)
        .order('created_at', { ascending: true });

      if (error) {
        logError('Fetch opportunity notes', error);
        throw new Error('No se pudieron obtener los mensajes.');
      }

      return data as OpportunityNote[];
    },
    enabled: !!user && !!opportunityId,
  });

  const addNote = useMutation({
    mutationFn: async (noteData: { title: string; content: string }) => {
      if (!user) throw new Error('Usuario no autenticado');
      const validationError = validateNoteInput(noteData);
      if (validationError) throw new Error(validationError);

      const { data, error } = await supabase
        .from('opportunity_notes')
        .insert([{
          opportunity_id: opportunityId,
          title: noteData.title,
          content: noteData.content,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) {
        logError('Add note', error);
        throw new Error('No se pudo enviar el mensaje.');
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunity-notes', opportunityId] });
      toast({
        title: 'Mensaje enviado',
        description: 'Tu mensaje se ha enviado exitosamente.',
      });
    },
    onError: (error: any) => {
      logError('Add note', error);
      toast({
        title: 'Error',
        description: error?.message || 'No se pudo enviar el mensaje.',
        variant: 'destructive',
      });
    },
  });

  const updateNote = useMutation({
    mutationFn: async (noteData: { id: string; title: string; content: string }) => {
      if (!user) throw new Error('Usuario no autenticado');
      const validationError = validateNoteInput(noteData);
      if (validationError) throw new Error(validationError);

      const { data, error } = await supabase
        .from('opportunity_notes')
        .update({
          title: noteData.title,
          content: noteData.content,
          updated_at: new Date().toISOString()
        })
        .eq('id', noteData.id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        logError('Update note', error);
        throw new Error('No se pudo actualizar el mensaje.');
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunity-notes', opportunityId] });
      toast({
        title: 'Mensaje actualizado',
        description: 'El mensaje se ha actualizado exitosamente.',
      });
    },
    onError: (error: any) => {
      logError('Update note', error);
      toast({
        title: 'Error',
        description: error?.message || 'No se pudo actualizar el mensaje.',
        variant: 'destructive',
      });
    },
  });

  const deleteNote = useMutation({
    mutationFn: async (noteId: string) => {
      if (!user) throw new Error('Usuario no autenticado');
      if (!noteId) throw new Error('ID de mensaje inválido.');

      const { error } = await supabase
        .from('opportunity_notes')
        .delete()
        .eq('id', noteId)
        .eq('user_id', user.id);

      if (error) {
        logError('Delete note', error);
        throw new Error('No se pudo eliminar el mensaje.');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunity-notes', opportunityId] });
      toast({
        title: 'Mensaje eliminado',
        description: 'El mensaje se ha eliminado exitosamente.',
      });
    },
    onError: (error: any) => {
      logError('Delete note', error);
      toast({
        title: 'Error',
        description: error?.message || 'No se pudo eliminar el mensaje.',
        variant: 'destructive',
      });
    },
  });

  return {
    notes,
    isLoading,
    error,
    addNote: addNote.mutate,
    isAdding: addNote.isPending,
    updateNote: updateNote.mutate,
    isUpdating: updateNote.isPending,
    deleteNote: deleteNote.mutate,
    isDeleting: deleteNote.isPending,
  };
};
