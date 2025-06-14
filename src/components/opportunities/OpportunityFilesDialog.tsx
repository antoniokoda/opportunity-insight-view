
import React, { useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Upload, Download, Trash2, FileText, Image, File } from 'lucide-react';
import { useOpportunityFiles } from '@/hooks/useOpportunityFiles';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
interface OpportunityFilesDialogProps {
  opportunityId: number;
  opportunityName: string;
  isOpen: boolean;
  onClose: () => void;
}
export const OpportunityFilesDialog: React.FC<OpportunityFilesDialogProps> = ({
  opportunityId,
  opportunityName,
  isOpen,
  onClose
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    files,
    isLoading,
    uploadFile,
    deleteFile,
    downloadFile,
    isUploading,
    isDeleting
  } = useOpportunityFiles(opportunityId);
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadFile(file);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <Image className="w-4 h-4" />;
    } else if (fileType.includes('pdf') || fileType.includes('document')) {
      return <FileText className="w-4 h-4" />;
    }
    return <File className="w-4 h-4" />;
  };
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  return <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-slate-50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <File className="w-5 h-5" />
            Archivos - {opportunityName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Upload Section */}
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
            <input ref={fileInputRef} type="file" onChange={handleFileSelect} className="hidden" accept="*/*" />
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Subir archivo</h3>
            <p className="mb-4 text-zinc-950">
              Haz clic para seleccionar un archivo
            </p>
            <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
              {isUploading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Seleccionar archivo
            </Button>
          </div>

          {/* Files List */}
          {isLoading ? <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              <span>Cargando archivos...</span>
            </div> : files.length === 0 ? <div className="text-center py-8 text-black">
              No hay archivos subidos aún
            </div> : <div className="space-y-2">
              <h3 className="font-semibold">Archivos ({files.length})</h3>
              {files.map(file => <div key={file.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {getFileIcon(file.file_type)}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{file.file_name}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{formatFileSize(file.file_size)}</span>
                        <span>•</span>
                        <span>{format(new Date(file.created_at), 'dd/MM/yyyy HH:mm', {
                      locale: es
                    })}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => downloadFile(file)}>
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteFile(file.id)} disabled={isDeleting}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>)}
            </div>}
        </div>
      </DialogContent>
    </Dialog>;
};
