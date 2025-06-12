
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
    <nav className="bg-card border-r border-border w-64 min-h-screen p-4 shadow-sm">
      <div className="space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-foreground hover:text-foreground hover:bg-accent'
              }`
            }
          >
            <item.icon size={20} className="flex-shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
