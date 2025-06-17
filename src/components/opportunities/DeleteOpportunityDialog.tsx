
import React from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import type { Opportunity } from '@/types/opportunity';

interface DeleteOpportunityDialogProps {
  opportunity: Opportunity | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onConfirm: (opportunityId: number) => void;
  isDeleting: boolean;
}

export const DeleteOpportunityDialog: React.FC<DeleteOpportunityDialogProps> = ({
  opportunity,
  isOpen,
  onOpenChange,
  onConfirm,
  isDeleting,
}) => {
  const handleConfirm = () => {
    if (opportunity) {
      onConfirm(opportunity.id);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Eliminar oportunidad</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Seguro que quieres eliminar la oportunidad <span className="font-semibold">{opportunity?.name}</span>? Esta acción no se puede deshacer y también eliminará sus llamadas, archivos, notas y contactos asociados.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isDeleting}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            {isDeleting ? 'Eliminando...' : 'Eliminar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
