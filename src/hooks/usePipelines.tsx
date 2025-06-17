
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { sanitizeError } from '@/utils/errorUtils';

export interface Pipeline {
  id: string;
  name: string;
  description: string | null;
  user_id: string;
  is_default: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface PipelineStage {
  id: string;
  pipeline_id: string;
  name: string;
  description: string | null;
  color: string;
  display_order: number;
  is_final: boolean;
  created_at: string;
  updated_at: string;
}

export const usePipelines = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: pipelines = [], isLoading: pipelinesLoading } = useQuery({
    queryKey: ['pipelines'],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('pipelines')
        .select('*')
        .order('display_order');

      if (error) throw error;
      return data as Pipeline[];
    },
    enabled: !!user,
  });

  const { data: stages = [], isLoading: stagesLoading } = useQuery({
    queryKey: ['pipeline-stages'],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('pipeline_stages')
        .select('*')
        .order('display_order');

      if (error) throw error;
      return data as PipelineStage[];
    },
    enabled: !!user,
  });

  const createPipeline = useMutation({
    mutationFn: async (newPipeline: {
      name: string;
      description?: string;
      is_default?: boolean;
    }) => {
      if (!user) throw new Error('Usuario no autenticado');

      const { data, error } = await supabase
        .from('pipelines')
        .insert([{
          ...newPipeline,
          user_id: user.id,
          display_order: pipelines.length,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pipelines'] });
      toast({
        title: 'Pipeline creado',
        description: 'El pipeline ha sido creado exitosamente.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: sanitizeError(error),
        variant: 'destructive',
      });
    },
  });

  const updatePipeline = useMutation({
    mutationFn: async ({ id, updates }: { 
      id: string; 
      updates: Partial<Omit<Pipeline, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
    }) => {
      const { data, error } = await supabase
        .from('pipelines')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pipelines'] });
      toast({
        title: 'Pipeline actualizado',
        description: 'El pipeline ha sido actualizado exitosamente.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: sanitizeError(error),
        variant: 'destructive',
      });
    },
  });

  const deletePipeline = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('pipelines')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pipelines'] });
      queryClient.invalidateQueries({ queryKey: ['pipeline-stages'] });
      toast({
        title: 'Pipeline eliminado',
        description: 'El pipeline ha sido eliminado exitosamente.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: sanitizeError(error),
        variant: 'destructive',
      });
    },
  });

  const createStage = useMutation({
    mutationFn: async (newStage: {
      pipeline_id: string;
      name: string;
      description?: string;
      color?: string;
      is_final?: boolean;
    }) => {
      const stagesInPipeline = stages.filter(s => s.pipeline_id === newStage.pipeline_id);
      
      const { data, error } = await supabase
        .from('pipeline_stages')
        .insert([{
          ...newStage,
          display_order: stagesInPipeline.length,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pipeline-stages'] });
      toast({
        title: 'Etapa creada',
        description: 'La etapa ha sido creada exitosamente.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: sanitizeError(error),
        variant: 'destructive',
      });
    },
  });

  const updateStage = useMutation({
    mutationFn: async ({ id, updates }: { 
      id: string; 
      updates: Partial<Omit<PipelineStage, 'id' | 'pipeline_id' | 'created_at' | 'updated_at'>>
    }) => {
      const { data, error } = await supabase
        .from('pipeline_stages')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pipeline-stages'] });
      toast({
        title: 'Etapa actualizada',
        description: 'La etapa ha sido actualizada exitosamente.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: sanitizeError(error),
        variant: 'destructive',
      });
    },
  });

  const deleteStage = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('pipeline_stages')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pipeline-stages'] });
      toast({
        title: 'Etapa eliminada',
        description: 'La etapa ha sido eliminada exitosamente.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: sanitizeError(error),
        variant: 'destructive',
      });
    },
  });

  const getStagesByPipeline = (pipelineId: string) => {
    return stages.filter(stage => stage.pipeline_id === pipelineId)
                 .sort((a, b) => a.display_order - b.display_order);
  };

  const getDefaultPipeline = () => {
    return pipelines.find(p => p.is_default);
  };

  return {
    pipelines,
    stages,
    isLoading: pipelinesLoading || stagesLoading,
    
    // Pipeline mutations
    createPipeline: createPipeline.mutateAsync,
    updatePipeline: updatePipeline.mutate,
    deletePipeline: deletePipeline.mutate,
    isCreatingPipeline: createPipeline.isPending,
    isUpdatingPipeline: updatePipeline.isPending,
    isDeletingPipeline: deletePipeline.isPending,
    
    // Stage mutations
    createStage: createStage.mutateAsync,
    updateStage: updateStage.mutate,
    deleteStage: deleteStage.mutate,
    isCreatingStage: createStage.isPending,
    isUpdatingStage: updateStage.isPending,
    isDeletingStage: deleteStage.isPending,
    
    // Helper functions
    getStagesByPipeline,
    getDefaultPipeline,
  };
};
