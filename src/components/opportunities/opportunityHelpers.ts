
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Call } from "@/hooks/useCalls";

// Retorna variantes css para badges de estado de oportunidad/propuesta
export const getStatusBadge = (status: string) => {
  const variants = {
    active: 'bg-blue-100 text-blue-800',
    won: 'bg-success-50 text-success-600',
    lost: 'bg-red-100 text-red-800',
    created: 'bg-gray-100 text-gray-800',
    pitched: 'bg-yellow-100 text-yellow-800',
    "n/a": 'bg-gray-100 text-gray-800',
  };
  return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800';
};

export const getCallTypeColor = (type: string) => {
  if (type.startsWith('Discovery')) {
    return 'bg-blue-100 text-blue-800';
  } else if (type.startsWith('Closing')) {
    return 'bg-success-50 text-success-600';
  }
  return 'bg-gray-100 text-gray-800';
};

export const isCallInThePast = (callDate: string) => {
  return new Date(callDate) < new Date();
};

// Formatea fecha a string legible
export const formatCallDate = (date: string) => (
  format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: es })
);

