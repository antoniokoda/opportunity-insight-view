
import React from 'react';
import { User, Bell, Settings } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">CRM Dashboard</h1>
          <p className="text-sm text-muted-foreground">Gestiona tus oportunidades de venta</p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-full transition-colors">
            <Bell size={20} />
          </button>
          <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-full transition-colors">
            <Settings size={20} />
          </button>
          <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-full transition-colors">
            <User size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};
