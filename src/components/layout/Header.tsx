
import React from 'react';
import { User, Bell, Settings } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-card border-b border-border px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">CRM Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Gestiona tus oportunidades de venta</p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-3 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
            <Bell size={20} />
            <span className="sr-only">Notificaciones</span>
          </button>
          <button className="p-3 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
            <Settings size={20} />
            <span className="sr-only">Configuración</span>
          </button>
          <button className="p-3 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
            <User size={20} />
            <span className="sr-only">Perfil de usuario</span>
          </button>
        </div>
      </div>
    </header>
  );
};
