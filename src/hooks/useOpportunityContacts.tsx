
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface OpportunityContact {
  id: string;
  opportunity_id: number;
  user_id: string;
  name: string;
  position?: string;
  email?: string;
  phone?: string;
  linkedin_url?: string;
  created_at: string;
  updated_at: string;
}

export const useOpportunityContacts = (opportunityId: number) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: contacts = [], isLoading, error } = useQuery({
    queryKey: ['opportunity-contacts', opportunityId],
    queryFn: async () => {
      if (!user) return [];
      
      console.log('Fetching contacts for opportunity:', opportunityId);
      const { data, error } = await supabase
        .from('opportunity_contacts')
        .select('*')
        .eq('opportunity_id', opportunityId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching opportunity contacts:', error);
        throw error;
      }

      console.log('Fetched contacts:', data);
      return data as OpportunityContact[];
    },
    enabled: !!user && !!opportunityId,
  });

  const addContact = useMutation({
    mutationFn: async (newContact: {
      name: string;
      position?: string;
      email?: string;
      phone?: string;
      linkedin_url?: string;
    }) => {
      if (!user) throw new Error('User not authenticated');

      console.log('Adding contact:', newContact);
      const { data, error } = await supabase
        .from('opportunity_contacts')
        .insert([{
          ...newContact,
          opportunity_id: opportunityId,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) {
        console.error('Error adding contact:', error);
        throw error;
      }

      console.log('Added contact:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunity-contacts', opportunityId] });
      toast({
        title: 'Contacto agregado',
        description: 'El contacto ha sido agregado exitosamente.',
      });
    },
    onError: (error) => {
      console.error('Error adding contact:', error);
      toast({
        title: 'Error',
        description: 'No se pudo agregar el contacto.',
        variant: 'destructive',
      });
    },
  });

  const updateContact = useMutation({
    mutationFn: async ({ id, updates }: { 
      id: string; 
      updates: Partial<Omit<OpportunityContact, 'id' | 'opportunity_id' | 'user_id' | 'created_at' | 'updated_at'>>
    }) => {
      console.log('Updating contact:', id, updates);
      const { data, error } = await supabase
        .from('opportunity_contacts')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating contact:', error);
        throw error;
      }

      console.log('Updated contact:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunity-contacts', opportunityId] });
      toast({
        title: 'Contacto actualizado',
        description: 'El contacto ha sido actualizado exitosamente.',
      });
    },
    onError: (error) => {
      console.error('Error updating contact:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el contacto.',
        variant: 'destructive',
      });
    },
  });

  const deleteContact = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting contact:', id);
      const { error } = await supabase
        .from('opportunity_contacts')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting contact:', error);
        throw error;
      }

      console.log('Deleted contact:', id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunity-contacts', opportunityId] });
      toast({
        title: 'Contacto eliminado',
        description: 'El contacto ha sido eliminado exitosamente.',
      });
    },
    onError: (error) => {
      console.error('Error deleting contact:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el contacto.',
        variant: 'destructive',
      });
    },
  });

  return {
    contacts,
    isLoading,
    error,
    addContact: addContact.mutate,
    updateContact: updateContact.mutate,
    deleteContact: deleteContact.mutate,
    isAdding: addContact.isPending,
    isUpdating: updateContact.isPending,
    isDeleting: deleteContact.isPending,
  };
};
