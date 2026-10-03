// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/promocion-prevencion/materno-infantil/components/MaternoInfantilMetricas.tsx
// DESCRIPCIÓN: 4 paneles compactos con métricas reales sin espacio desperdiciado.
// =========================================================================

import React from 'react';
import { Users, Baby, AlertCircle, ShieldCheck } from 'lucide-react';
import type { MaternoInfantilMetricas as MetricasData } from '../../../../../../modules/maternal-health/types/materno-infantil.types';

export type TabType = 'todos' | 'materno' | 'infantil' | 'alertas';

interface MaternoInfantilMetricasProps {
  metricas: MetricasData;
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const MaternoInfantilMetricas: React.FC<MaternoInfantilMetricasProps> = ({
  metricas,
  activeTab,
  onSelectTab,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {/* 1. Gestantes Activas */}
      <div
        onClick={() => onSelectTab('materno')}
        className={`p-3.5 sm:p-4 rounded-2xl bg-white border transition shadow-2xs cursor-pointer flex flex-col justify-between ${
          activeTab === 'materno' ? 'border-[#166E7A] ring-1.5 ring-[#166E7A]/20' : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-lg bg-teal-50 text-[#166E7A] border border-teal-200/60">
              <Users className="w-4 h-4" />
            </div>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200/80">
              Jornada Activa
            </span>
          </div>

          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
            Gestantes en Seguimiento
          </span>
          <span className="text-2xl font-black text-slate-900 leading-tight block mt-0.5">
            {metricas.gestantesTotal}
          </span>

          <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1 text-[11px]">
            <div className="flex items-center justify-between text-slate-600">
              <span>Primer Trimestre</span>
              <span className="font-bold text-slate-900">{metricas.primerTrimestre}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Segundo Trimestre</span>
              <span className="font-bold text-slate-900">{metricas.segundoTrimestre}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Tercer Trimestre</span>
              <span className="font-bold text-slate-900">{metricas.tercerTrimestre}</span>
            </div>
          </div>
        </div>

        <span className="mt-2.5 text-[11px] font-bold text-[#166E7A] block">
          Ver censo materno →
        </span>
      </div>

      {/* 2. Niños en Seguimiento */}
      <div
        onClick={() => onSelectTab('infantil')}
        className={`p-3.5 sm:p-4 rounded-2xl bg-white border transition shadow-2xs cursor-pointer flex flex-col justify-between ${
          activeTab === 'infantil' ? 'border-emerald-600 ring-1.5 ring-emerald-600/20' : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <Baby className="w-4 h-4" />
            </div>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-teal-50 text-[#166E7A] border border-teal-200/80">
              Padrón al día
            </span>
          </div>

          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
            Niños en Seguimiento
          </span>
          <span className="text-2xl font-black text-slate-900 leading-tight block mt-0.5">
            {metricas.ninosTotal}
          </span>

          <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1 text-[11px]">
            <div className="flex items-center justify-between text-slate-600">
              <span>Lactantes (&lt; 1 año)</span>
              <span className="font-bold text-slate-900">{metricas.lactantes}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Primera Infancia (1-4 a)</span>
              <span className="font-bold text-slate-900">{metricas.primeraInfancia}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Escolares (5-11 a)</span>
              <span className="font-bold text-slate-900">{metricas.escolares}</span>
            </div>
          </div>
        </div>

        <span className="mt-2.5 text-[11px] font-bold text-emerald-700 block">
          Ver censo infantil →
        </span>
      </div>

      {/* 3. Controles Pendientes */}
      <div
        onClick={() => onSelectTab('alertas')}
        className={`p-3.5 sm:p-4 rounded-2xl bg-white border transition shadow-2xs cursor-pointer flex flex-col justify-between ${
          activeTab === 'alertas' ? 'border-rose-600 ring-1.5 ring-rose-600/20' : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-lg bg-rose-50 text-rose-600 border border-rose-200/60">
              <AlertCircle className="w-4 h-4" />
            </div>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-rose-50 text-rose-700 border border-rose-200/80">
              Prioridad
            </span>
          </div>

          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
            Controles Pendientes
          </span>
          <span className="text-2xl font-black text-rose-600 leading-tight block mt-0.5">
            {metricas.controlesPendientes}
          </span>

          <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1 text-[11px]">
            <div className="flex items-center justify-between text-slate-600">
              <span>Gestantes en fecha</span>
              <span className="font-bold text-slate-900">{metricas.gestantesPendientes}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Niños pendientes visita</span>
              <span className="font-bold text-rose-600">{metricas.ninosPendientes}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Alertas activas</span>
              <span className="font-bold text-amber-600">{metricas.controlesPendientes}</span>
            </div>
          </div>
        </div>

        <span className="mt-2.5 text-[11px] font-bold text-rose-600 block">
          Revisar alertas →
        </span>
      </div>

      {/* 4. Vigilancia y Prevención Comunitaria */}
      <div
        onClick={() => onSelectTab('todos')}
        className={`p-3.5 sm:p-4 rounded-2xl bg-white border transition shadow-2xs cursor-pointer flex flex-col justify-between ${
          activeTab === 'todos' ? 'border-[#166E7A] ring-1.5 ring-[#166E7A]/20' : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-lg bg-teal-50 text-[#166E7A] border border-teal-200/60">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200/80">
              Activo
            </span>
          </div>

          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
            Vigilancia y Prevención
          </span>
          <span className="text-2xl font-black text-[#166E7A] leading-tight block mt-0.5">
            Comunitaria
          </span>

          <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1 text-[11px]">
            <div className="flex items-center justify-between text-slate-600">
              <span>Atenciones registradas</span>
              <span className="font-bold text-slate-900">{metricas.totalAtencionesRegistradas}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Orientaciones brindadas</span>
              <span className="font-bold text-slate-900">{metricas.orientacionesEntregadas}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Referencias emitidas</span>
              <span className="font-bold text-slate-900">{metricas.referenciasEmitidas}</span>
            </div>
          </div>
        </div>

        <span className="mt-2.5 text-[11px] font-bold text-[#166E7A] block">
          Ver resumen general →
        </span>
      </div>
    </div>
  );
};