
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface OpportunityFile {
  id: string;
  opportunity_id: number;
  file_name: string;
  file_size: number;
  file_type: string;
  file_path: string;
  user_id: string;
  created_at: string;
}

export const useOpportunityFiles = (opportunityId: number) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: files = [], isLoading, error } = useQuery({
    queryKey: ['opportunity-files', opportunityId, user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      console.log('Fetching files for opportunity:', opportunityId);
      const { data, error } = await supabase
        .from('opportunity_files')
        .select('*')
        .eq('opportunity_id', opportunityId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching opportunity files:', error);
        throw error;
      }

      console.log('Fetched opportunity files:', data);
      return data as OpportunityFile[];
    },
    enabled: !!user && !!opportunityId,
  });

  const uploadFile = useMutation({
    mutationFn: async (file: File) => {
      if (!user) throw new Error('User not authenticated');

      console.log('Uploading file:', file.name);
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${opportunityId}/${Date.now()}.${fileExt}`;
      
      // Upload file to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('opportunity-files')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        throw uploadError;
      }

      // Save file metadata to database
      const { data, error: dbError } = await supabase
        .from('opportunity_files')
        .insert([{
          opportunity_id: opportunityId,
          file_name: file.name,
          file_size: file.size,
          file_type: file.type,
          file_path: fileName,
          user_id: user.id
        }])
        .select()
        .single();

      if (dbError) {
        console.error('Error saving file metadata:', dbError);
        throw dbError;
      }

      console.log('File uploaded successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunity-files', opportunityId] });
      toast({
        title: 'Archivo subido',
        description: 'El archivo se ha subido exitosamente.',
      });
    },
    onError: (error) => {
      console.error('Error uploading file:', error);
      toast({
        title: 'Error',
        description: 'No se pudo subir el archivo.',
        variant: 'destructive',
      });
    },
  });

  const deleteFile = useMutation({
    mutationFn: async (fileId: string) => {
      console.log('Deleting file:', fileId);
      
      // Get file data first
      const { data: fileData, error: fetchError } = await supabase
        .from('opportunity_files')
        .select('file_path')
        .eq('id', fileId)
        .single();

      if (fetchError) throw fetchError;

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('opportunity-files')
        .remove([fileData.file_path]);

      if (storageError) {
        console.error('Error deleting from storage:', storageError);
        throw storageError;
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('opportunity_files')
        .delete()
        .eq('id', fileId);

      if (dbError) {
        console.error('Error deleting file metadata:', dbError);
        throw dbError;
      }

      console.log('File deleted successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunity-files', opportunityId] });
      toast({
        title: 'Archivo eliminado',
        description: 'El archivo se ha eliminado exitosamente.',
      });
    },
    onError: (error) => {
      console.error('Error deleting file:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el archivo.',
        variant: 'destructive',
      });
    },
  });

  const downloadFile = async (file: OpportunityFile) => {
    try {
      console.log('Downloading file:', file.file_name);
      const { data, error } = await supabase.storage
        .from('opportunity-files')
        .download(file.file_path);

      if (error) throw error;

      // Create download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: 'Descarga iniciada',
        description: `Descargando ${file.file_name}`,
      });
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        title: 'Error',
        description: 'No se pudo descargar el archivo.',
        variant: 'destructive',
      });
    }
  };

  return {
    files,
    isLoading,
    error,
    uploadFile: uploadFile.mutate,
    deleteFile: deleteFile.mutate,
    downloadFile,
    isUploading: uploadFile.isPending,
    isDeleting: deleteFile.isPending,
  };
};
