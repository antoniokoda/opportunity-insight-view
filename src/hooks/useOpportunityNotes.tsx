
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface OpportunityNote {
  id: string;
  opportunity_id: number;
  title: string;
  content: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export const useOpportunityNotes = (opportunityId: number) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: notes = [], isLoading, error } = useQuery({
    queryKey: ['opportunity-notes', opportunityId, user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      console.log('Fetching notes for opportunity:', opportunityId);
      const { data, error } = await supabase
        .from('opportunity_notes')
        .select('*')
        .eq('opportunity_id', opportunityId)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching opportunity notes:', error);
        throw error;
      }

      console.log('Fetched opportunity notes:', data);
      return data as OpportunityNote[];
    },
    enabled: !!user && !!opportunityId,
  });

  const addNote = useMutation({
    mutationFn: async (noteData: { title: string; content: string }) => {
      if (!user) throw new Error('User not authenticated');

      console.log('Adding note:', noteData);
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
        console.error('Error adding note:', error);
        throw error;
      }

      console.log('Note added successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunity-notes', opportunityId] });
      toast({
        title: 'Nota agregada',
        description: 'La nota se ha agregado exitosamente.',
      });
    },
    onError: (error) => {
      console.error('Error adding note:', error);
      toast({
        title: 'Error',
        description: 'No se pudo agregar la nota.',
        variant: 'destructive',
      });
    },
  });

  const updateNote = useMutation({
    mutationFn: async ({ noteId, updates }: { 
      noteId: string; 
      updates: { title?: string; content?: string }
    }) => {
      console.log('Updating note:', noteId, updates);
      const { data, error } = await supabase
        .from('opportunity_notes')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', noteId)
        .select()
        .single();

      if (error) {
        console.error('Error updating note:', error);
        throw error;
      }

      console.log('Note updated successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunity-notes', opportunityId] });
      toast({
        title: 'Nota actualizada',
        description: 'La nota se ha actualizado exitosamente.',
      });
    },
    onError: (error) => {
      console.error('Error updating note:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar la nota.',
        variant: 'destructive',
      });
    },
  });

  const deleteNote = useMutation({
    mutationFn: async (noteId: string) => {
      console.log('Deleting note:', noteId);
      const { error } = await supabase
        .from('opportunity_notes')
        .delete()
        .eq('id', noteId);

      if (error) {
        console.error('Error deleting note:', error);
        throw error;
      }

      console.log('Note deleted successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunity-notes', opportunityId] });
      toast({
        title: 'Nota eliminada',
        description: 'La nota se ha eliminado exitosamente.',
      });
    },
    onError: (error) => {
      console.error('Error deleting note:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar la nota.',
        variant: 'destructive',
      });
    },
  });

  return {
    notes,
    isLoading,
    error,
    addNote: addNote.mutate,
    updateNote: updateNote.mutate,
    deleteNote: deleteNote.mutate,
    isAdding: addNote.isPending,
    isUpdating: updateNote.isPending,
    isDeleting: deleteNote.isPending,
  };
};
