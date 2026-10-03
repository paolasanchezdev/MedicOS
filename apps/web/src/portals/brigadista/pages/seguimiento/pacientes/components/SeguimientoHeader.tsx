// =========================================================================
// ARCHIVO: SeguimientoHeader.tsx
// DESCRIPCIÓN: Encabezado institucional de Continuidad Territorial.
// =========================================================================

import React from 'react';
import { ClipboardList, Calendar, RefreshCw, Plus, UserSearch } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SeguimientoHeaderProps {
  onActualizar: () => void;
  onNuevoSeguimiento: () => void;
  loading?: boolean;
}

export const SeguimientoHeader: React.FC<SeguimientoHeaderProps> = ({
  onActualizar,
  onNuevoSeguimiento,
  loading = false,
}) => {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#166E7A] p-4 sm:p-5 text-white shadow-md">
      <div className="absolute right-0 top-0 bottom-0 w-1/4 opacity-15 pointer-events-none flex items-center justify-end pr-4">
        <svg width="200" height="60" viewBox="0 0 240 80" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M0 40 L60 40 L75 10 L95 70 L115 25 L130 55 L145 40 L240 40" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3.5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-teal-100 text-[11px] font-semibold">
            <ClipboardList className="w-3.5 h-3.5 text-teal-200" />
            <span>Continuidad Asistencial y Seguimiento Comunitario • MINSAL El Salvador</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
            Pacientes en Seguimiento Activo
          </h1>

          <div className="flex items-center gap-1.5 text-[11px] font-medium text-teal-100/90">
            <Calendar className="w-3.5 h-3.5 text-teal-200" />
            <span>Jueves, 1 de octubre de 2026 • Bandeja Operativa de Campo</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onActualizar}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-bold transition active:scale-95 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Actualizar</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/brigadista/pacientes/buscar')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-bold transition active:scale-95 cursor-pointer"
          >
            <UserSearch className="w-3.5 h-3.5" />
            <span>Buscar Paciente</span>
          </button>

          <button
            type="button"
            onClick={onNuevoSeguimiento}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-teal-50 text-[#166E7A] text-xs font-black shadow-xs transition active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>+ Nuevo Seguimiento</span>
          </button>
        </div>
      </div>
    </div>
  );
};