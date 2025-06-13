
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
    /* Borde inferior sutil añadido para separar del contenido - Tarea 2.2 */
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-zinc-200/50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-12">
            <div>
              {/* Título principal con color primario para máximo contraste - Tarea 1.1 */}
              <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">SalesTracker</h1>
              {/* Subtítulo con color secundario de alto contraste - Tarea 1.1 */}
              <p className="text-sm text-zinc-600 mt-0.5 font-medium">Gestiona tus oportunidades de venta</p>
            </div>
            
            <nav className="flex items-center space-x-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium transition-apple focus-ring ${
                      isActive
                        ? 'bg-blue-500 text-white shadow-sm'
                        : 'text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100'
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
            {/* Botón de notificaciones con mejor contraste */}
            <button className="p-2.5 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-apple focus-ring">
              <Bell size={20} />
              <span className="sr-only">Notificaciones</span>
            </button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-2.5 hover:bg-zinc-100 rounded-xl">
                  <User size={20} />
                  <span className="sr-only">Perfil de usuario</span>
                </Button>
              </DropdownMenuTrigger>
              {/* Dropdown con fondo sólido y z-index alto */}
              <DropdownMenuContent align="end" className="w-56 bg-white/95 backdrop-blur-md border-zinc-200/50 z-50">
                <DropdownMenuLabel>
                  <div>
                    {/* Texto con colores de alto contraste */}
                    <p className="font-semibold text-zinc-900">Mi Cuenta</p>
                    <p className="text-xs text-zinc-600 font-medium">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="hover:bg-zinc-100">
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
