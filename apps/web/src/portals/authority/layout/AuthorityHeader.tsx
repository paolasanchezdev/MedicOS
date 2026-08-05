// apps/web/src/portals/authority/layout/AuthorityHeader.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Bell,
  Menu,
  LogOut,
  User,
  Settings,
  ChevronDown,
  Search,
} from 'lucide-react';
import { useAuth } from '../../../core/context/useAuth';

export interface AuthorityHeaderProps {
  onMenuClick?: () => void;
}

export const AuthorityHeader: React.FC<AuthorityHeaderProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Cerrar menú desplegable al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      if (logout) {
        await logout();
      } else {
        localStorage.clear();
      }
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      navigate('/login', { replace: true });
    }
  };

  return (
    <header className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between z-30 shrink-0 sticky top-0 transition-all">
      {/* Lado Izquierdo: Menú Móvil + Logo Oficial */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 rounded-lg transition-colors"
          aria-label="Abrir menú lateral"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link to="/autoridad" className="flex items-center gap-3 group">
          <img
            src="/logo-sinNombre.png"
            alt="MedicOS"
            className="h-8 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/logo.png';
            }}
          />
          <div className="hidden sm:block border-l border-slate-200 pl-3">
            <span className="text-sm font-bold tracking-tight text-slate-900 block leading-tight">
              MedicOS
            </span>
            <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider block">
              Vigilancia Epidemiológica
            </span>
          </div>
        </Link>
      </div>

      {/* Centro: Buscador Minimalista */}
      <div className="hidden md:flex items-center max-w-sm w-full mx-4">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar reportes, alertas, brigadas..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-100/70 border border-slate-200/60 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-400/20 focus:border-slate-400 transition-all"
          />
        </div>
      </div>

      {/* Lado Derecho: Notificaciones + Perfil con Dropdown */}
      <div className="flex items-center gap-3">
        {/* Botón de Notificaciones */}
        <Link
          to="/autoridad/configuracion/notificaciones"
          className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 rounded-lg transition-colors"
          title="Bandeja de Notificaciones"
        >
          <Bell className="w-4.5 h-4.5 text-slate-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white" />
        </Link>

        <div className="h-5 w-px bg-slate-200 mx-1 hidden sm:block" />

        {/* Perfil de Usuario con Popover */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-slate-100/80 transition-colors focus:outline-hidden"
          >
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-semibold text-xs ring-2 ring-slate-200/60 shadow-2xs">
              {user?.firstName ? user.firstName.charAt(0) : 'P'}
              {user?.lastName ? user.lastName.charAt(0) : 'S'}
            </div>
            <div className="hidden xl:block text-left">
              <p className="text-xs font-semibold text-slate-900 leading-none">
                {user ? `${user.firstName || ''} ${user.lastName || ''}` : 'Paola Sánchez'}
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5 font-medium">
                {user?.role || 'Autoridad Sanitaria'}
              </p>
            </div>
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                isUserMenuOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Menú Desplegable */}
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200/80 rounded-xl shadow-lg py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3.5 py-2 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-900">
                  {user ? `${user.firstName || ''} ${user.lastName || ''}` : 'Paola Sánchez'}
                </p>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                  {user?.email || 'autoridad@medicos.gob.sv'}
                </p>
              </div>

              <div className="py-1">
                <Link
                  to="/autoridad/configuracion/preferencias"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <User className="w-4 h-4 text-slate-500" />
                  <span>Mi Perfil</span>
                </Link>

                <Link
                  to="/autoridad/configuracion/notificaciones"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Bell className="w-4 h-4 text-slate-500" />
                  <span>Notificaciones</span>
                </Link>

                <Link
                  to="/autoridad/configuracion/accesos"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Settings className="w-4 h-4 text-slate-500" />
                  <span>Configuración</span>
                </Link>
              </div>

              <div className="border-t border-slate-100 pt-1 mt-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors font-medium text-left cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AuthorityHeader;