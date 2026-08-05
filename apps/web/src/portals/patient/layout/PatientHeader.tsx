// apps/web/src/portals/patient/layout/PatientHeader.tsx
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  Bell, 
  User, 
  LogOut, 
  ShieldCheck, 
  ChevronDown,
  Sparkles
} from 'lucide-react';

interface PatientHeaderProps {
  onOpenSidebar: () => void;
}

export const PatientHeader: React.FC<PatientHeaderProps> = ({ onOpenSidebar }) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Aquí puedes invocar la lógica de cierre de sesión de AuthContext
    navigate('/login');
  };

  return (
    <header className="h-16 shrink-0 z-30 bg-medicos-surface/90 backdrop-blur-md border-b border-medicos-soft-border shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Izquierda: Botón Menú Móvil + Isotipo / Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenSidebar}
              className="p-2 rounded-xl text-medicos-muted hover:text-medicos-dark-blue hover:bg-medicos-light-bg md:hidden transition-colors"
              aria-label="Abrir menú"
            >
              <Menu className="w-5 h-5" />
            </button>

            <NavLink to="/paciente/dashboard/resumen" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-linear-to-br from-medicos-teal to-medicos-cyan flex items-center justify-center text-white font-bold shadow-xs transition-transform duration-200 group-hover:scale-105">
                M
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-medicos-dark-blue text-base leading-tight tracking-tight">
                  MedicOS
                </span>
                <span className="text-[10px] text-medicos-teal font-medium tracking-wide">
                  PORTAL PACIENTE
                </span>
              </div>
            </NavLink>
          </div>

          {/* Centro: Badge de Estado / Asistente IA */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-medicos-light-bg border border-medicos-soft-border/70 text-xs font-medium text-medicos-teal">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-medicos-cyan opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-medicos-teal" />
            </span>
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Sistema Activo & Normal</span>
          </div>

          {/* Derecha: Notificaciones + Acceso Rápido IA + Menú de Usuario */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Acceso Rápido al Chat de IA */}
            <NavLink
              to="/paciente/asistente-ia/chat"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-medicos-teal/10 hover:bg-medicos-teal/20 text-medicos-teal text-xs font-semibold transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Asistente IA</span>
            </NavLink>

            {/* Botón Notificaciones */}
            <NavLink
              to="/paciente/notificaciones/bandeja"
              className="relative p-2 rounded-xl text-medicos-muted hover:text-medicos-dark-blue hover:bg-medicos-light-bg transition-colors"
              aria-label="Notificaciones"
            >
              <Bell className="w-5 h-5" />
              {/* Indicador de notificación pendiente */}
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-medicos-teal rounded-full ring-2 ring-white" />
            </NavLink>

            {/* Perfil del Paciente con Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-medicos-light-bg transition-colors border border-transparent hover:border-medicos-soft-border"
              >
                <div className="w-8 h-8 rounded-lg bg-medicos-light-bg border border-medicos-soft-border flex items-center justify-center text-medicos-teal font-semibold text-sm">
                  P
                </div>
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-xs font-semibold text-medicos-dark-blue leading-none">
                    Paola
                  </span>
                  <span className="text-[10px] text-medicos-muted mt-0.5">
                    Paciente
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-medicos-muted transition-transform duration-200 hidden lg:block ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Menú Desplegable de Perfil */}
              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-medicos-surface rounded-xl shadow-lg border border-medicos-soft-border py-1.5 z-20 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-2 border-b border-medicos-soft-border mb-1">
                      <p className="text-xs font-semibold text-medicos-dark-blue truncate">Paola</p>
                      <p className="text-[10px] text-medicos-muted truncate">paciente@medicos.sv</p>
                    </div>

                    <NavLink
                      to="/paciente/perfil/datos-personales"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-medicos-muted hover:text-medicos-dark-blue hover:bg-medicos-light-bg transition-colors"
                    >
                      <User className="w-4 h-4 text-medicos-teal" />
                      <span>Mi Perfil</span>
                    </NavLink>

                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                </>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};

export default PatientHeader;