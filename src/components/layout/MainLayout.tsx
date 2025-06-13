
import React from 'react';
import { Header } from './Header';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    /* Fondo global zinc-50 aplicado - Tarea 2.1 */
    <div className="min-h-screen bg-zinc-50">
      <Header />
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  );
};
