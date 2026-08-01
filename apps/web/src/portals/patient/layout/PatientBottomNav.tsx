// apps/web/src/portals/patient/layout/PatientBottomNav.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Sparkles, 
  QrCode, 
  Stethoscope, 
  HeartPulse 
} from 'lucide-react';

const QUICK_NAV_ITEMS = [
  { name: 'Inicio', path: '/paciente/dashboard/resumen', icon: LayoutDashboard },
  { name: 'IA Assist', path: '/paciente/asistente-ia/chat', icon: Sparkles },
  { name: 'Credencial', path: '/paciente/qr/credencial', icon: QrCode, highlight: true },
  { name: 'Consultas', path: '/paciente/consultas/historial', icon: Stethoscope },
  { name: 'Mi Salud', path: '/paciente/salud/resumen', icon: HeartPulse },
];

export const PatientBottomNav: React.FC = () => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-medicos-surface/90 backdrop-blur-md border-t border-medicos-soft-border px-2 py-1.5 shadow-lg">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {QUICK_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'text-medicos-teal font-semibold'
                    : 'text-medicos-muted hover:text-medicos-dark-blue'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {item.highlight ? (
                    /* Botón flotante destacado para el QR */
                    <div className={`p-2 rounded-full transition-transform ${
                      isActive 
                        ? 'bg-medicos-teal text-white shadow-md scale-105' 
                        : 'bg-medicos-light-bg text-medicos-teal border border-medicos-soft-border'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="relative">
                      <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} />
                      {isActive && (
                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-medicos-teal rounded-full" />
                      )}
                    </div>
                  )}
                  <span className={`text-[10px] mt-0.5 tracking-tight ${item.highlight ? 'font-medium text-medicos-teal' : ''}`}>
                    {item.name}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default PatientBottomNav;