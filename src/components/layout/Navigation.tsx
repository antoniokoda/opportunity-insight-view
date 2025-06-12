
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Briefcase, Calendar } from 'lucide-react';

const navItems = [
  { to: '/', label: 'Dashboard', icon: Home },
  { to: '/opportunities', label: 'Oportunidades', icon: Briefcase },
  { to: '/calendar', label: 'Calendario', icon: Calendar },
];

export const Navigation: React.FC = () => {
  return (
    <nav className="bg-card border-r border-border w-64 min-h-screen p-4">
      <div className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`
            }
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
