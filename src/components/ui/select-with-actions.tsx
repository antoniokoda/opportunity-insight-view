
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Edit, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectWithActionsProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  options: SelectOption[];
  onEdit?: (oldValue: string, newValue: string) => void;
  onDelete?: (value: string) => void;
  className?: string;
  allowEdit?: boolean;
  allowDelete?: boolean;
  children?: React.ReactNode;
}

export const SelectWithActions: React.FC<SelectWithActionsProps> = ({
  value,
  onValueChange,
  placeholder,
  options,
  onEdit,
  onDelete,
  className,
  allowEdit = false,
  allowDelete = false,
  children,
}) => {
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [deletingItem, setDeletingItem] = useState<string | null>(null);

  const handleEdit = (itemValue: string, currentLabel: string) => {
    setEditingItem(itemValue);
    setEditValue(currentLabel);
  };

  const handleSaveEdit = () => {
    if (editingItem && editValue.trim() && onEdit) {
      onEdit(editingItem, editValue.trim());
      setEditingItem(null);
      setEditValue('');
    }
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setEditValue('');
  };

  const handleDelete = (itemValue: string) => {
    setDeletingItem(itemValue);
  };

  const handleConfirmDelete = () => {
    if (deletingItem && onDelete) {
      onDelete(deletingItem);
      setDeletingItem(null);
    }
  };

  const handleCancelDelete = () => {
    setDeletingItem(null);
  };

  return (
    <>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className={className}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {children}
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value} className="group">
              <div className="flex items-center justify-between w-full">
                <span className="flex-1">{option.label}</span>
                {(allowEdit || allowDelete) && option.value !== 'all' && (
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                    {allowEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-muted"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleEdit(option.value, option.label);
                        }}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    )}
                    {allowDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleDelete(option.value);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Edit Dialog */}
      <Dialog open={!!editingItem} onOpenChange={() => handleCancelEdit()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar elemento</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              placeholder="Nuevo nombre"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSaveEdit();
                } else if (e.key === 'Escape') {
                  handleCancelEdit();
                }
              }}
            />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={handleCancelEdit}>
                Cancelar
              </Button>
              <Button onClick={handleSaveEdit} disabled={!editValue.trim()}>
                Guardar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingItem} onOpenChange={() => handleCancelDelete()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El elemento será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
