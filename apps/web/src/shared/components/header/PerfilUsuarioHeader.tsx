// =========================================================================
// ARCHIVO: apps/web/src/shared/components/header/PerfilUsuarioHeader.tsx
// DESCRIPCIÓN: Componente presentacional puro del menú desplegable de perfil.
// =========================================================================

import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  ChevronDown,
  User,
  FileText,
  Settings,
  HelpCircle,
  LogOut,
} from 'lucide-react';

export interface PerfilUsuarioHeaderProps {
  fullName: string;
  email: string;
  initials: string;
  roleName?: string;
  showBadge?: boolean;
  badgeText?: string;
  onNavigateToProfile?: () => void;
  onNavigateToRecords?: () => void;
  onNavigateToSettings?: () => void;
  onNavigateToSupport?: () => void;
  onLogout?: () => void;
  className?: string;
}

export const PerfilUsuarioHeader: React.FC<PerfilUsuarioHeaderProps> = ({
  fullName,
  email,
  initials,
  roleName = 'Usuario',
  showBadge = true,
  badgeText = 'Expediente Encriptado',
  onNavigateToProfile,
  onNavigateToRecords,
  onNavigateToSettings,
  onNavigateToSupport,
  onLogout,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar menú al hacer clic fuera o presionar Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleAction = (callback?: () => void) => {
    setIsOpen(false);
    if (callback) {
      callback();
    }
  };

  return (
    <div
      ref={dropdownRef}
      className={`relative flex items-center gap-3.5 ${className}`}
    >
      {showBadge && (
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#edf6f5] text-[#3f8880] border border-[#3f8880]/20 text-[11px] font-bold shadow-sm select-none">
          <ShieldCheck className="w-4 h-4 text-[#3f8880]" />
          <span>{badgeText}</span>
        </div>
      )}

      {/* Botón activador del perfil */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100/80 transition-colors focus:outline-none focus:ring-2 focus:ring-[#3f8880]/20 select-none"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="relative shrink-0">
          <div className="w-10 h-10 rounded-full bg-[#edf6f5] text-[#3f8880] font-bold text-sm flex items-center justify-center shadow-sm border border-[#3f8880]/10">
            {initials}
          </div>
          <span
            className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"
            title="En línea"
          />
        </div>

        <div className="hidden sm:block text-left min-w-0">
          <p className="text-xs font-bold text-slate-900 truncate leading-snug">
            {fullName}
          </p>
          <p className="text-[10px] text-slate-400 font-semibold truncate">
            {roleName}
          </p>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Menú Desplegable de Perfil */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-white border border-slate-200/80 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header del Menú */}
          <div className="px-4 py-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#edf6f5] text-[#3f8880] font-bold text-xs flex items-center justify-center border border-[#3f8880]/10 shrink-0">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">
                  {fullName}
                </p>
                <p className="text-[11px] text-slate-500 truncate">
                  {email || 'Sin correo registrado'}
                </p>
              </div>
            </div>
            <div className="mt-2.5 inline-block px-2.5 py-0.5 rounded-md bg-slate-100 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
              {roleName}
            </div>
          </div>

          {/* Opciones con Atajos Numéricos (1-5) */}
          <div className="py-1.5 text-xs font-medium text-slate-700">
            <button
              type="button"
              onClick={() => handleAction(onNavigateToProfile)}
              className="w-full px-4 py-2 flex items-center justify-between hover:bg-slate-50 hover:text-[#3f8880] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <User className="w-4 h-4 text-slate-400" />
                <span>Mi Perfil</span>
              </div>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                1
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleAction(onNavigateToRecords)}
              className="w-full px-4 py-2 flex items-center justify-between hover:bg-slate-50 hover:text-[#3f8880] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-slate-400" />
                <span>Expediente / Mis Citas</span>
              </div>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                2
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleAction(onNavigateToSettings)}
              className="w-full px-4 py-2 flex items-center justify-between hover:bg-slate-50 hover:text-[#3f8880] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Settings className="w-4 h-4 text-slate-400" />
                <span>Configuración de Cuenta</span>
              </div>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                3
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleAction(onNavigateToSupport)}
              className="w-full px-4 py-2 flex items-center justify-between hover:bg-slate-50 hover:text-[#3f8880] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <HelpCircle className="w-4 h-4 text-slate-400" />
                <span>Ayuda y Soporte</span>
              </div>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                4
              </span>
            </button>
          </div>

          {/* Separador y Cerrar Sesión */}
          <div className="pt-1 mt-1 border-t border-slate-100">
            <button
              type="button"
              onClick={() => handleAction(onLogout)}
              className="w-full px-4 py-2 flex items-center justify-between text-rose-600 hover:bg-rose-50 font-semibold transition-colors text-xs"
            >
              <div className="flex items-center gap-2.5">
                <LogOut className="w-4 h-4 text-rose-500" />
                <span>Cerrar Sesión</span>
              </div>
              <span className="text-[10px] font-bold text-rose-400 bg-rose-100/60 px-1.5 py-0.5 rounded border border-rose-200/60">
                5
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerfilUsuarioHeader;