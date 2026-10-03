// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/promocion-prevencion/nutricion/components/NutricionMetricas.tsx
// DESCRIPCIÓN: 4 paneles métricos de alta densidad con desglose nutricional.
// =========================================================================

import React from 'react';
import { Scale, Users, AlertCircle, ShieldCheck } from 'lucide-react';
import type { NutricionMetricas as MetricasData } from '../../../../../../modules/nutrition/types/nutrition.types';

export type NutricionTabType = 'todos' | 'seguimiento' | 'alertas';

interface NutricionMetricasProps {
  metricas: MetricasData;
  activeTab: NutricionTabType;
  onSelectTab: (tab: NutricionTabType) => void;
}

export const NutricionMetricas: React.FC<NutricionMetricasProps> = ({
  metricas,
  activeTab,
  onSelectTab,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {/* 1. Personas Evaluadas */}
      <div
        onClick={() => onSelectTab('todos')}
        className={`p-3.5 sm:p-4 rounded-2xl bg-white border transition shadow-2xs cursor-pointer flex flex-col justify-between ${
          activeTab === 'todos' ? 'border-[#166E7A] ring-1.5 ring-[#166E7A]/20' : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-lg bg-teal-50 text-[#166E7A] border border-teal-200/60">
              <Scale className="w-4 h-4" />
            </div>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200/80">
              Jornada Activa
            </span>
          </div>

          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
            Personas Evaluadas
          </span>
          <span className="text-2xl font-black text-slate-900 leading-tight block mt-0.5">
            {metricas.evaluadosTotal}
          </span>

          <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1 text-[11px]">
            <div className="flex items-center justify-between text-slate-600">
              <span>Niñez (&lt; 12 años)</span>
              <span className="font-bold text-slate-900">{metricas.ninosEvaluados}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Población Adulta</span>
              <span className="font-bold text-slate-900">{metricas.adultosEvaluados}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Gestantes</span>
              <span className="font-bold text-slate-900">{metricas.gestantesEvaluadas}</span>
            </div>
          </div>
        </div>

        <span className="mt-2.5 text-[11px] font-bold text-[#166E7A] block">
          Ver censo general →
        </span>
      </div>

      {/* 2. En Seguimiento Activo */}
      <div
        onClick={() => onSelectTab('seguimiento')}
        className={`p-3.5 sm:p-4 rounded-2xl bg-white border transition shadow-2xs cursor-pointer flex flex-col justify-between ${
          activeTab === 'seguimiento' ? 'border-emerald-600 ring-1.5 ring-emerald-600/20' : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <Users className="w-4 h-4" />
            </div>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-teal-50 text-[#166E7A] border border-teal-200/80">
              Padrón al día
            </span>
          </div>

          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
            En Seguimiento Activo
          </span>
          <span className="text-2xl font-black text-slate-900 leading-tight block mt-0.5">
            {metricas.enSeguimientoTotal}
          </span>

          <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1 text-[11px]">
            <div className="flex items-center justify-between text-slate-600">
              <span>Bajo peso bajo control</span>
              <span className="font-bold text-slate-900">{metricas.bajoPesoAlerta}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Sobrepeso / Obesidad</span>
              <span className="font-bold text-slate-900">{metricas.sobrepesoAlerta}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Próximos seguimientos</span>
              <span className="font-bold text-emerald-700">{metricas.seguimientosProximos}</span>
            </div>
          </div>
        </div>

        <span className="mt-2.5 text-[11px] font-bold text-emerald-700 block">
          Explorar casos en seguimiento →
        </span>
      </div>

      {/* 3. Alertas Nutricionales */}
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
            Alertas y Casos en Riesgo
          </span>
          <span className="text-2xl font-black text-rose-600 leading-tight block mt-0.5">
            {metricas.alertasTotal}
          </span>

          <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1 text-[11px]">
            <div className="flex items-center justify-between text-slate-600">
              <span>Bajo peso o desnutrición</span>
              <span className="font-bold text-rose-600">{metricas.bajoPesoAlerta}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Pérdida acelerada peso</span>
              <span className="font-bold text-slate-900">{metricas.alertasTotal > 0 ? 1 : 0}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Evaluación inicial pendiente</span>
              <span className="font-bold text-amber-600">{metricas.alertasTotal}</span>
            </div>
          </div>
        </div>

        <span className="mt-2.5 text-[11px] font-bold text-rose-600 block">
          Revisar alertas accionables →
        </span>
      </div>

      {/* 4. Vigilancia y Continuidad */}
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
            Vigilancia Comunitaria
          </span>
          <span className="text-2xl font-black text-[#166E7A] leading-tight block mt-0.5">
            Intervención
          </span>

          <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1 text-[11px]">
            <div className="flex items-center justify-between text-slate-600">
              <span>Orientaciones brindadas</span>
              <span className="font-bold text-slate-900">{metricas.orientacionesEntregadas}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Referencias a la Red</span>
              <span className="font-bold text-slate-900">{metricas.referenciasEmitidas}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Seguimientos próximos</span>
              <span className="font-bold text-slate-900">{metricas.seguimientosProximos}</span>
            </div>
          </div>
        </div>

        <span className="mt-2.5 text-[11px] font-bold text-[#166E7A] block">
          Ver resumen completo →
        </span>
      </div>
    </div>
  );
};