// =========================================================================
// ARCHIVO: SeguimientoMetricas.tsx
// DESCRIPCIÓN: 4 paneles métricos de continuidad (Hoy, Vencidos, Próximos, Activos).
// =========================================================================

import React from 'react';
import { CalendarClock, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import type { SeguimientoMetricas as MetricasData } from '../../../../../../modules/continuity/types/continuity.types';

interface SeguimientoMetricasProps {
  metricas: MetricasData;
  temporalidadActual: string;
  onFiltrarTemporalidad: (temp: string) => void;
}

export const SeguimientoMetricas: React.FC<SeguimientoMetricasProps> = ({
  metricas,
  temporalidadActual,
  onFiltrarTemporalidad,
}) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {/* 1. PARA HOY */}
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
            Para Hoy
          </span>
          <div className="p-1.5 rounded-lg bg-teal-50 text-[#166E7A] border border-teal-200">
            <CalendarClock className="w-4 h-4" />
          </div>
        </div>
        <div className="text-3xl font-black text-[#1A282D] leading-none mb-1">
          {metricas.hoy}
        </div>
        <p className="text-[11px] text-medicos-muted font-medium">
          Acciones prioritarias de la jornada
        </p>
      </div>

      {/* 2. VENCIDOS */}
      <div
        onClick={() => onFiltrarTemporalidad(temporalidadActual === 'VENCIDOS' ? 'TODOS' : 'VENCIDOS')}
        className={`p-4 rounded-2xl bg-white border transition shadow-2xs cursor-pointer flex flex-col justify-between ${
          temporalidadActual === 'VENCIDOS'
            ? 'border-rose-600 ring-2 ring-rose-600/20 bg-rose-50/20'
            : 'border-[#D3E8EC] hover:border-rose-300'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-rose-700">
            Vencidos
          </span>
          <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-200">
            <AlertCircle className="w-4 h-4" />
          </div>
        </div>
        <div className="text-3xl font-black text-rose-700 leading-none mb-1">
          {metricas.vencidos}
        </div>
        <p className="text-[11px] text-medicos-muted font-medium">
          Plazo superado sin resolución
        </p>
      </div>

      {/* 3. PRÓXIMOS */}
      <div
        onClick={() => onFiltrarTemporalidad(temporalidadActual === 'PROXIMOS' ? 'TODOS' : 'PROXIMOS')}
        className={`p-4 rounded-2xl bg-white border transition shadow-2xs cursor-pointer flex flex-col justify-between ${
          temporalidadActual === 'PROXIMOS'
            ? 'border-cyan-600 ring-2 ring-cyan-600/20 bg-cyan-50/20'
            : 'border-[#D3E8EC] hover:border-cyan-300'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
            Próximos
          </span>
          <div className="p-1.5 rounded-lg bg-cyan-50 text-cyan-700 border border-cyan-200">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="text-3xl font-black text-[#1A282D] leading-none mb-1">
          {metricas.proximos}
        </div>
        <p className="text-[11px] text-medicos-muted font-medium">
          Programados en próximos días
        </p>
      </div>

      {/* 4. TOTAL ACTIVOS */}
      <div
        onClick={() => onFiltrarTemporalidad(temporalidadActual === 'ACTIVOS' ? 'TODOS' : 'ACTIVOS')}
        className={`p-4 rounded-2xl bg-white border transition shadow-2xs cursor-pointer flex flex-col justify-between ${
          temporalidadActual === 'ACTIVOS'
            ? 'border-emerald-600 ring-2 ring-emerald-600/20 bg-emerald-50/20'
            : 'border-[#D3E8EC] hover:border-emerald-300'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800">
            Total Activos
          </span>
          <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="text-3xl font-black text-[#1A282D] leading-none mb-1">
          {metricas.activos}
        </div>
        <p className="text-[11px] text-medicos-muted font-medium">
          Procesos abiertos en comunidad
        </p>
      </div>
    </div>
  );
};