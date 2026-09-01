// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/atencion/nueva/components/AtencionHeader.tsx
// DESCRIPCIÓN: Encabezado oficial y compacto (Estilo Apple Health / Microsoft).
// =========================================================================

import React from 'react';
import { ArrowLeft, FileText, User, Calendar, Clock, Wifi, XCircle } from 'lucide-react';

interface AtencionHeaderProps {
  pacienteNombre?: string;
  pacienteDui?: string;
  fechaTexto?: string;
  pasoActual: number;
  totalPasos: number;
  onRegresar: () => void;
  onCancelar: () => void;
}

export const AtencionHeader: React.FC<AtencionHeaderProps> = ({
  pacienteNombre,
  pacienteDui,
  fechaTexto,
  pasoActual,
  totalPasos,
  onRegresar,
  onCancelar,
}) => {
  const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
  const fechaHoy = fechaTexto || new Date().toLocaleDateString('es-SV', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#1d5c5d] p-4 text-white shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-4">
      {/* Patrón Decorativo de Fondo */}
      <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none hidden md:block">
        <svg width="300" height="100%" viewBox="0 0 400 100" preserveAspectRatio="none" fill="none">
          <path d="M0 50 Q 100 0, 200 50 T 400 50" stroke="white" strokeWidth="8" fill="none" />
        </svg>
      </div>

      {/* Lado Izquierdo: Botón Regresar y Título */}
      <div className="relative z-10 flex items-center gap-3">
        <button
          type="button"
          onClick={onRegresar}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-colors cursor-pointer shrink-0"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/10 text-[11px] font-medium text-teal-50 mb-1">
            <FileText className="w-3 h-3" />
            <span>Registro de Atención Comunitaria</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-none">
            Nueva Atención
          </h1>
        </div>
      </div>

      {/* Lado Derecho: Píldoras de Información y Acciones */}
      <div className="relative z-10 flex flex-wrap items-center gap-2">
        {pacienteNombre && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/20 text-xs text-white">
            <User className="w-3.5 h-3.5 opacity-70" />
            <span className="font-medium text-white/80">Paciente:</span>
            <span className="font-bold">{pacienteNombre}</span>
            {pacienteDui && <span className="opacity-70 font-mono text-[10px] ml-1">DUI: {pacienteDui}</span>}
          </div>
        )}

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/20 text-xs font-medium text-white">
          <Calendar className="w-3.5 h-3.5 opacity-70" />
          <span>Fecha: {fechaHoy}</span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-[#1d5c5d] text-xs font-bold shadow-sm">
          <Clock className="w-3.5 h-3.5" />
          <span>En progreso</span>
        </div>

        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold ${isOnline ? 'border-emerald-400/50 text-emerald-100' : 'border-amber-400/50 text-amber-100'}`}>
          <Wifi className="w-3.5 h-3.5" />
          <span>{isOnline ? 'En línea' : 'Sin conexión'}</span>
        </div>

        <div className="px-3 py-1.5 bg-white rounded-full text-xs font-bold text-slate-800 shadow-sm">
          Paso {pasoActual} de {totalPasos}
        </div>

        <button
          type="button"
          onClick={onCancelar}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500/20 hover:bg-rose-500/40 border border-rose-400/30 text-rose-100 text-xs font-bold transition-colors cursor-pointer"
        >
          <XCircle className="w-3.5 h-3.5" />
          <span>Cancelar</span>
        </button>
      </div>
    </div>
  );
};