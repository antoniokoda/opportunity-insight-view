
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

// Simple security monitoring/log utility
const logError = (context: string, error: any) => {
  // This could be extended to external monitoring
  console.warn(`[SecurityMonitor] ${context}:`, error?.message || error);
};

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

const validateContactInput = (contact: {
  name: string;
  position?: string;
  email?: string;
  phone?: string;
  linkedin_url?: string;
}) => {
  if (!contact.name?.trim()) return 'El nombre del contacto es obligatorio.';
  // Basic sanitization for email and phone could be added here.
  return null;
};

export const useOpportunityContacts = (opportunityId: number) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: contacts = [], isLoading, error } = useQuery({
    queryKey: ['opportunity-contacts', opportunityId],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('opportunity_contacts')
        .select('*')
        .eq('opportunity_id', opportunityId)
        .order('created_at', { ascending: false });

      if (error) {
        logError('Fetch opportunity contacts', error);
        throw new Error('No se pudieron obtener los contactos.');
      }
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
      if (!user) throw new Error('Usuario no autenticado');
      const validationError = validateContactInput(newContact);
      if (validationError) throw new Error(validationError);

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
        logError('Add contact', error);
        throw new Error('No se pudo agregar el contacto.');
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunity-contacts', opportunityId] });
      toast({
        title: 'Contacto agregado',
        description: 'El contacto ha sido agregado exitosamente.',
      });
    },
    onError: (error: any) => {
      logError('Add contact', error);
      toast({
        title: 'Error',
        description: error?.message || 'No se pudo agregar el contacto.',
        variant: 'destructive',
      });
    },
  });

  const updateContact = useMutation({
    mutationFn: async ({ id, updates }: { 
      id: string; 
      updates: Partial<Omit<OpportunityContact, 'id' | 'opportunity_id' | 'user_id' | 'created_at' | 'updated_at'>>
    }) => {
      if (!updates || !id) throw new Error('Datos incompletos para la actualización.');

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
        logError('Update contact', error);
        throw new Error('No se pudo actualizar el contacto.');
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunity-contacts', opportunityId] });
      toast({
        title: 'Contacto actualizado',
        description: 'El contacto ha sido actualizado exitosamente.',
      });
    },
    onError: (error: any) => {
      logError('Update contact', error);
      toast({
        title: 'Error',
        description: error?.message || 'No se pudo actualizar el contacto.',
        variant: 'destructive',
      });
    },
  });

  const deleteContact = useMutation({
    mutationFn: async (id: string) => {
      if (!id) throw new Error('ID inválido.');
      const { error } = await supabase
        .from('opportunity_contacts')
        .delete()
        .eq('id', id);

      if (error) {
        logError('Delete contact', error);
        throw new Error('No se pudo eliminar el contacto.');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunity-contacts', opportunityId] });
      toast({
        title: 'Contacto eliminado',
        description: 'El contacto ha sido eliminado exitosamente.',
      });
    },
    onError: (error: any) => {
      logError('Delete contact', error);
      toast({
        title: 'Error',
        description: error?.message || 'No se pudo eliminar el contacto.',
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
