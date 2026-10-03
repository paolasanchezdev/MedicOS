// =========================================================================
// ARCHIVO: VisitasProgramadasMetricas.tsx
// DESCRIPCIÓN: 4 paneles operativos de visitas domiciliarias (Hoy, Próximas, Vencidas, Programadas).
// =========================================================================

import React from 'react';
import { CalendarClock, Clock3, AlertCircle, Home } from 'lucide-react';
import type { VisitasMetricas } from '../../../../../../modules/visits/types/visit.types';

interface VisitasProgramadasMetricasProps {
  metricas: VisitasMetricas;
  temporalidadActual: string;
  onFiltrarTemporalidad: (temp: string) => void;
}

export const VisitasProgramadasMetricas: React.FC<VisitasProgramadasMetricasProps> = ({
  metricas,
  temporalidadActual,
  onFiltrarTemporalidad,
}) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {/* 1. HOY */}
      <div
        onClick={() => onFiltrarTemporalidad(temporalidadActual === 'HOY' ? 'TODOS' : 'HOY')}
        className={`p-4 rounded-2xl bg-white border transition shadow-2xs cursor-pointer flex flex-col justify-between ${
          temporalidadActual === 'HOY'
            ? 'border-[#166E7A] ring-2 ring-[#166E7A]/20 bg-teal-50/20'
            : 'border-[#D3E8EC] hover:border-[#166E7A]/40'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
            Hoy
          </span>
          <div className="p-1.5 rounded-lg bg-teal-50 text-[#166E7A] border border-teal-200">
            <CalendarClock className="w-4 h-4" />
          </div>
        </div>
        <div className="text-3xl font-black text-[#1A282D] leading-none mb-1">
          {metricas.hoy}
        </div>
        <p className="text-[11px] text-[#52656C] font-medium">
          Visitas programadas para hoy
        </p>
      </div>

      {/* 2. PRÓXIMAS */}
      <div
        onClick={() => onFiltrarTemporalidad(temporalidadActual === 'PROXIMAS' ? 'TODOS' : 'PROXIMAS')}
        className={`p-4 rounded-2xl bg-white border transition shadow-2xs cursor-pointer flex flex-col justify-between ${
          temporalidadActual === 'PROXIMAS'
            ? 'border-cyan-600 ring-2 ring-cyan-600/20 bg-cyan-50/20'
            : 'border-[#D3E8EC] hover:border-cyan-300'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
            Próximas
          </span>
          <div className="p-1.5 rounded-lg bg-cyan-50 text-cyan-700 border border-cyan-200">
            <Clock3 className="w-4 h-4" />
          </div>
        </div>
        <div className="text-3xl font-black text-[#1A282D] leading-none mb-1">
          {metricas.proximas}
        </div>
        <p className="text-[11px] text-[#52656C] font-medium">
          Visitas en agenda para días futuros
        </p>
      </div>

      {/* 3. VENCIDAS */}
      <div
        onClick={() => onFiltrarTemporalidad(temporalidadActual === 'VENCIDAS' ? 'TODOS' : 'VENCIDAS')}
        className={`p-4 rounded-2xl bg-white border transition shadow-2xs cursor-pointer flex flex-col justify-between ${
          temporalidadActual === 'VENCIDAS'
            ? 'border-rose-600 ring-2 ring-rose-600/20 bg-rose-50/20'
            : 'border-[#D3E8EC] hover:border-rose-300'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-rose-700">
            Vencidas
          </span>
          <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-200">
            <AlertCircle className="w-4 h-4" />
          </div>
        </div>
        <div className="text-3xl font-black text-rose-700 leading-none mb-1">
          {metricas.vencidas}
        </div>
        <p className="text-[11px] text-[#52656C] font-medium">
          Fecha superada sin resolución
        </p>
      </div>

      {/* 4. TOTAL PROGRAMADAS */}
      <div
        onClick={() => onFiltrarTemporalidad(temporalidadActual === 'PROGRAMADAS' ? 'TODOS' : 'PROGRAMADAS')}
        className={`p-4 rounded-2xl bg-white border transition shadow-2xs cursor-pointer flex flex-col justify-between ${
          temporalidadActual === 'PROGRAMADAS'
            ? 'border-emerald-600 ring-2 ring-emerald-600/20 bg-emerald-50/20'
            : 'border-[#D3E8EC] hover:border-emerald-300'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800">
            Programadas
          </span>
          <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Home className="w-4 h-4" />
          </div>
        </div>
        <div className="text-3xl font-black text-[#1A282D] leading-none mb-1">
          {metricas.programadas}
        </div>
        <p className="text-[11px] text-[#52656C] font-medium">
          Total de visitas activas en territorio
        </p>
      </div>
    </div>
  );
};