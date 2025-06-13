
import React from 'react';
import { NavLink } from 'react-router-dom';
import { User, Bell, LogOut, Home, Briefcase, Calendar } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

const navItems = [
  { to: '/', label: 'Dashboard', icon: Home },
  { to: '/opportunities', label: 'Oportunidades', icon: Briefcase },
  { to: '/calendar', label: 'Calendario', icon: Calendar },
];

export const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: 'Sesión cerrada',
        description: 'Has cerrado sesión exitosamente',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo cerrar la sesión',
        variant: 'destructive',
      });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-apple-gray-200/50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-12">
            <div>
              <h1 className="text-2xl font-bold text-apple-gray-900 tracking-tight">SalesTracker</h1>
              <p className="text-sm text-apple-gray-600 mt-0.5 font-medium">Gestiona tus oportunidades de venta</p>
            </div>
            
            <nav className="flex items-center space-x-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium transition-apple focus-ring ${
                      isActive
                        ? 'bg-apple-blue text-white shadow-sm'
                        : 'text-apple-gray-700 hover:text-apple-gray-900 hover:bg-apple-gray-100'
                    }`
                  }
                >
                  <item.icon size={18} className="flex-shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="p-2.5 text-apple-gray-600 hover:text-apple-gray-900 hover:bg-apple-gray-100 rounded-xl transition-apple focus-ring">
              <Bell size={20} />
              <span className="sr-only">Notificaciones</span>
            </button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-2.5 hover:bg-apple-gray-100 rounded-xl">
                  <User size={20} />
                  <span className="sr-only">Perfil de usuario</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white/90 backdrop-blur-md border-apple-gray-200/50">
                <DropdownMenuLabel>
                  <div>
                    <p className="font-semibold text-apple-gray-900">Mi Cuenta</p>
                    <p className="text-xs text-apple-gray-600 font-medium">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="hover:bg-apple-gray-100">
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};
