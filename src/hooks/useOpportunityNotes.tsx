
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
  profiles?: {
    name: string | null;
    email: string | null;
  };
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
        .select(`
          id,
          opportunity_id,
          title,
          content,
          user_id,
          created_at,
          updated_at,
          profiles (
            name,
            email
          )
        `)
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

  return {
    notes,
    isLoading,
    error,
    addNote: addNote.mutate,
    isAdding: addNote.isPending,
  };
};
