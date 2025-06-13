
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
        .order('created_at', { ascending: true });

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
        title: 'Mensaje enviado',
        description: 'Tu mensaje se ha enviado exitosamente.',
      });
    },
    onError: (error) => {
      console.error('Error adding note:', error);
      toast({
        title: 'Error',
        description: 'No se pudo enviar el mensaje.',
        variant: 'destructive',
      });
    },
  });

  const updateNote = useMutation({
    mutationFn: async (noteData: { id: string; title: string; content: string }) => {
      if (!user) throw new Error('User not authenticated');

      console.log('Updating note:', noteData);
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
        console.error('Error updating note:', error);
        throw error;
      }

      console.log('Note updated successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunity-notes', opportunityId] });
      toast({
        title: 'Mensaje actualizado',
        description: 'El mensaje se ha actualizado exitosamente.',
      });
    },
    onError: (error) => {
      console.error('Error updating note:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el mensaje.',
        variant: 'destructive',
      });
    },
  });

  const deleteNote = useMutation({
    mutationFn: async (noteId: string) => {
      if (!user) throw new Error('User not authenticated');

      console.log('Deleting note:', noteId);
      const { error } = await supabase
        .from('opportunity_notes')
        .delete()
        .eq('id', noteId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting note:', error);
        throw error;
      }

      console.log('Note deleted successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunity-notes', opportunityId] });
      toast({
        title: 'Mensaje eliminado',
        description: 'El mensaje se ha eliminado exitosamente.',
      });
    },
    onError: (error) => {
      console.error('Error deleting note:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el mensaje.',
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
