import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  QrCode, 
  ClipboardList, 
  Shield 
} from 'lucide-react';

export const BrigadistBottomNav: React.FC = () => {
  const navItems = [
    { to: '.', label: 'Inicio', icon: LayoutDashboard, end: true },
    { to: 'pacientes', label: 'Pacientes', icon: Users },
    { to: 'escanear', label: 'QR', icon: QrCode, isAction: true },
    { to: 'consultas', label: 'Consultas', icon: ClipboardList },
    { to: 'brigada', label: 'Brigada', icon: Shield },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-2 flex items-center justify-around z-50 shadow-lg xl:hidden select-none">
      {navItems.map((item) => {
        const Icon = item.icon;

        // Botón especial destacado pero plano (dentro de la misma barra)
        if (item.isAction) {
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                  isActive ? 'text-teal-800 font-bold' : 'text-teal-700 font-semibold'
                }`
              }
            >
              <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center mb-0.5 shadow-xs transition-transform active:scale-95">
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </NavLink>
          );
        }

        // Elementos de navegación normales
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                isActive
                  ? 'text-teal-700 font-bold'
                  : 'text-slate-500 hover:text-slate-900 font-medium'
              }`
            }
          >
            <Icon className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight">{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};

export default BrigadistBottomNav;