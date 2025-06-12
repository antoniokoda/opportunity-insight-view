
import React from 'react';
import { FiUser, FiBell, FiSettings } from 'react-icons/fi';

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
            <FiBell size={20} />
          </button>
          <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-full transition-colors">
            <FiSettings size={20} />
          </button>
          <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-full transition-colors">
            <FiUser size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};
