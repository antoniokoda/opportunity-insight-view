
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

interface LeadSource {
  id: string;
  name: string;
  user_id: string;
  created_at: string;
}

export const useLeadSourcesWithPersistence = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query para obtener fuentes de lead
  const { data: leadSources = [], isLoading, error } = useQuery({
    queryKey: ['lead_sources', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      console.log('Fetching lead sources for user:', user.id);
      const { data, error } = await supabase
        .from('lead_sources' as any)
        .select('*')
        .eq('user_id', user.id)
        .order('name');

      if (error) {
        console.error('Error fetching lead sources:', error);
        throw error;
      }

      console.log('Fetched lead sources:', data);
      return data as LeadSource[];
    },
    enabled: !!user,
  });

  // Mutation para agregar fuente de lead
  const addLeadSource = useMutation({
    mutationFn: async (name: string) => {
      if (!user) throw new Error('User not authenticated');

      console.log('Adding lead source:', name);
      const { data, error } = await supabase
        .from('lead_sources' as any)
        .insert([{
          name,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) {
        console.error('Error adding lead source:', error);
        throw error;
      }

      console.log('Added lead source:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead_sources'] });
      toast({
        title: 'Fuente agregada',
        description: 'La fuente de lead ha sido agregada exitosamente.',
      });
    },
    onError: (error) => {
      console.error('Error adding lead source:', error);
      toast({
        title: 'Error',
        description: 'No se pudo agregar la fuente de lead.',
        variant: 'destructive',
      });
    },
  });

  // Mutation para actualizar fuente de lead
  const updateLeadSource = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      if (!user) throw new Error('User not authenticated');

      console.log('Updating lead source:', { id, name });
      const { data, error } = await supabase
        .from('lead_sources' as any)
        .update({ name })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating lead source:', error);
        throw error;
      }

      console.log('Updated lead source:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead_sources'] });
      toast({
        title: 'Fuente actualizada',
        description: 'La fuente de lead ha sido actualizada exitosamente.',
      });
    },
    onError: (error) => {
      console.error('Error updating lead source:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar la fuente de lead.',
        variant: 'destructive',
      });
    },
  });

  // Mutation para eliminar fuente de lead
  const deleteLeadSource = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error('User not authenticated');

      console.log('Deleting lead source with ID:', id, 'for user:', user.id);
      
      // Verificar si hay oportunidades que usan esta fuente
      const { data: opportunities, error: checkError } = await supabase
        .from('opportunities')
        .select('id, name')
        .eq('lead_source', id)
        .eq('user_id', user.id);

      if (checkError) {
        console.error('Error checking opportunities:', checkError);
        throw new Error('No se pudo verificar si hay oportunidades asociadas');
      }

      if (opportunities && opportunities.length > 0) {
        // Actualizar oportunidades para usar fuente genérica
        const { error: updateError } = await supabase
          .from('opportunities')
          .update({ lead_source: 'Unknown' })
          .eq('lead_source', id)
          .eq('user_id', user.id);

        if (updateError) {
          console.error('Error updating opportunities:', updateError);
          throw new Error('No se pudieron actualizar las oportunidades asociadas');
        }

        console.log(`Updated ${opportunities.length} opportunities to use generic lead source`);
      }

      // Ahora eliminar la fuente de lead
      const { error } = await supabase
        .from('lead_sources' as any)
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting lead source:', error);
        throw error;
      }

      console.log('Successfully deleted lead source:', id);
      return id;
    },
    onSuccess: (deletedId) => {
      queryClient.invalidateQueries({ queryKey: ['lead_sources'] });
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      toast({
        title: 'Fuente eliminada',
        description: 'La fuente de lead ha sido eliminada exitosamente.',
      });
      console.log('Lead source deletion completed for ID:', deletedId);
    },
    onError: (error) => {
      console.error('Error deleting lead source:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar la fuente de lead.',
        variant: 'destructive',
      });
    },
  });

  return {
    leadSources,
    isLoading,
    error,
    addLeadSource: addLeadSource.mutate,
    updateLeadSource: updateLeadSource.mutate,
    deleteLeadSource: deleteLeadSource.mutateAsync,
    isAdding: addLeadSource.isPending,
    isUpdating: updateLeadSource.isPending,
    isDeleting: deleteLeadSource.isPending,
  };
};
