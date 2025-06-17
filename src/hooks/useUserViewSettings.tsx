
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { sanitizeError } from '@/utils/errorUtils';

export interface UserViewSettings {
  id: string;
  user_id: string;
  view_type: 'pipeline' | 'table';
  selected_pipeline_id: string | null;
  filters: Record<string, any>;
  sort_settings: Record<string, any>;
  column_settings: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export const useUserViewSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['user-view-settings'],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('user_view_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data as UserViewSettings | null;
    },
    enabled: !!user,
  });

  const updateSettings = useMutation({
    mutationFn: async (updates: Partial<Omit<UserViewSettings, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
      if (!user) throw new Error('Usuario no autenticado');

      if (settings) {
        // Update existing settings
        const { data, error } = await supabase
          .from('user_view_settings')
          .update(updates)
          .eq('id', settings.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Create new settings
        const { data, error } = await supabase
          .from('user_view_settings')
          .insert([{
            user_id: user.id,
            ...updates,
          }])
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-view-settings'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: sanitizeError(error),
        variant: 'destructive',
      });
    },
  });

  const setViewType = (viewType: 'pipeline' | 'table') => {
    updateSettings.mutate({ view_type: viewType });
  };

  const setSelectedPipeline = (pipelineId: string | null) => {
    updateSettings.mutate({ selected_pipeline_id: pipelineId });
  };

  const updateFilters = (filters: Record<string, any>) => {
    updateSettings.mutate({ filters });
  };

  const updateSortSettings = (sortSettings: Record<string, any>) => {
    updateSettings.mutate({ sort_settings: sortSettings });
  };

  const updateColumnSettings = (columnSettings: Record<string, any>) => {
    updateSettings.mutate({ column_settings: columnSettings });
  };

  return {
    settings,
    isLoading,
    setViewType,
    setSelectedPipeline,
    updateFilters,
    updateSortSettings,
    updateColumnSettings,
    isUpdating: updateSettings.isPending,
  };
};
