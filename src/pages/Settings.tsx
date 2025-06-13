
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SalespersonManager } from '@/components/SalespersonManager';
import { LeadSourceManager } from '@/components/LeadSourceManager';
import { Settings as SettingsIcon, Users, Target } from 'lucide-react';

export const Settings = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <SettingsIcon className="w-6 h-6" />
          <h1 className="text-3xl font-bold text-zinc-900">Configuración</h1>
        </div>
        <p className="text-zinc-600">Gestiona tus vendedores y fuentes de lead</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalespersonManager />
        <LeadSourceManager />
      </div>
    </div>
  );
};
