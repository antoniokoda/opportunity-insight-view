
import { useState } from 'react';
import { useToast } from './use-toast';

export const useLeadSources = () => {
  const { toast } = useToast();
  
  // Por ahora manejo las fuentes de lead localmente
  // En una implementación real, esto podría venir de la base de datos
  const [customLeadSources, setCustomLeadSources] = useState([
    'Website',
    'Referral', 
    'Cold Outreach',
    'Social Media',
    'Email Marketing'
  ]);

  const addLeadSource = (source: string) => {
    if (!customLeadSources.includes(source)) {
      setCustomLeadSources(prev => [...prev, source]);
      toast({
        title: 'Fuente agregada',
        description: 'La fuente de lead ha sido agregada exitosamente.',
      });
    }
  };

  const updateLeadSource = (oldSource: string, newSource: string) => {
    if (oldSource !== newSource && !customLeadSources.includes(newSource)) {
      setCustomLeadSources(prev => 
        prev.map(source => source === oldSource ? newSource : source)
      );
      toast({
        title: 'Fuente actualizada',
        description: 'La fuente de lead ha sido actualizada exitosamente.',
      });
    }
  };

  const deleteLeadSource = (source: string) => {
    setCustomLeadSources(prev => prev.filter(s => s !== source));
    toast({
      title: 'Fuente eliminada',
      description: 'La fuente de lead ha sido eliminada exitosamente.',
    });
  };

  return {
    customLeadSources,
    addLeadSource,
    updateLeadSource,
    deleteLeadSource,
  };
};
