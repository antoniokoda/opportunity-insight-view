import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, Loader2 } from 'lucide-react';
import { useSalespeople } from '@/hooks/useSalespeople';
export const SalespersonManager: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSalesperson, setNewSalesperson] = useState({
    name: '',
    email: ''
  });
  const {
    salespeople,
    isLoading,
    addSalesperson,
    isAdding
  } = useSalespeople();
  const handleAddSalesperson = () => {
    if (newSalesperson.name && newSalesperson.email) {
      addSalesperson(newSalesperson);
      setNewSalesperson({
        name: '',
        email: ''
      });
      setShowAddForm(false);
    }
  };
  if (isLoading) {
    return <Card className="p-6">
        <div className="flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span>Cargando vendedores...</span>
        </div>
      </Card>;
  }
  return;
};