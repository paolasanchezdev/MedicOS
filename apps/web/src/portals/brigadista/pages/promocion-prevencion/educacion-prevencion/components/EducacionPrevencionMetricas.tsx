// =========================================================================
// ARCHIVO: EducacionPrevencionMetricas.tsx
// DESCRIPCIÓN: 4 paneles métricos reales sin desfaces visuales.
// =========================================================================

import React from 'react';
import { BookOpen, Bug, Users, AlertCircle } from 'lucide-react';
import type { EducacionPrevencionMetricas as MetricasData } from '../../../../../../modules/health-education/types/health-education.types';

export type EducacionTabType = 'todos' | 'educacion' | 'vectores' | 'pendientes';

interface EducacionPrevencionMetricasProps {
  metricas: MetricasData;
  activeTab: EducacionTabType;
  onSelectTab: (tab: EducacionTabType) => void;
}

export const EducacionPrevencionMetricas: React.FC<EducacionPrevencionMetricasProps> = ({
  metricas,
  activeTab,
  onSelectTab,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {/* 1. Actividades Educativas */}
      <div
        onClick={() => onSelectTab('educacion')}
        className={`p-3.5 sm:p-4 rounded-2xl bg-white border transition shadow-2xs cursor-pointer flex flex-col justify-between ${
          activeTab === 'educacion' ? 'border-[#166E7A] ring-1.5 ring-[#166E7A]/20' : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-lg bg-teal-50 text-[#166E7A] border border-teal-200/60">
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200/80">
              Jornada Activa
            </span>
          </div>

          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
            Actividades Educativas
          </span>
          <span className="text-2xl font-black text-slate-900 leading-tight block mt-0.5">
            {metricas.actividadesEducativasTotal}
          </span>

          <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1 text-[11px]">
            <div className="flex items-center justify-between text-slate-600">
              <span>Personas orientadas</span>
              <span className="font-bold text-[#166E7A]">{metricas.personasAlcanzadasTotal}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Registradas hoy</span>
              <span className="font-bold text-slate-900">{metricas.actividadesHoy}</span>
            </div>
          </div>
        </div>

        <span className="mt-2.5 text-[11px] font-bold text-[#166E7A] block">
          Ver censo educativo →
        </span>
      </div>

      {/* 2. Control de Vectores */}
      <div
        onClick={() => onSelectTab('vectores')}
        className={`p-3.5 sm:p-4 rounded-2xl bg-white border transition shadow-2xs cursor-pointer flex flex-col justify-between ${
          activeTab === 'vectores' ? 'border-emerald-600 ring-1.5 ring-emerald-600/20' : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <Bug className="w-4 h-4" />
            </div>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-teal-50 text-[#166E7A] border border-teal-200/80">
              Inspección
            </span>
          </div>

          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
            Acciones de Vectores
          </span>
          <span className="text-2xl font-black text-slate-900 leading-tight block mt-0.5">
            {metricas.accionesVectoresTotal}
          </span>

          <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1 text-[11px]">
            <div className="flex items-center justify-between text-slate-600">
              <span>Viviendas inspeccionadas</span>
              <span className="font-bold text-slate-900">{metricas.viviendasInspeccionadasTotal}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Focos con criaderos</span>
              <span className={metricas.viviendasConCriaderosTotal > 0 ? 'font-bold text-rose-600' : 'font-bold text-slate-900'}>
                {metricas.viviendasConCriaderosTotal}
              </span>
            </div>
          </div>
        </div>

        <span className="mt-2.5 text-[11px] font-bold text-emerald-700 block">
          Ver control de vectores →
        </span>
      </div>

      {/* 3. Población Alcanzada */}
      <div
        onClick={() => onSelectTab('todos')}
        className={`p-3.5 sm:p-4 rounded-2xl bg-white border transition shadow-2xs cursor-pointer flex flex-col justify-between ${
          activeTab === 'todos' ? 'border-[#166E7A] ring-1.5 ring-[#166E7A]/20' : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-lg bg-purple-50 text-purple-700 border border-purple-200/60">
              <Users className="w-4 h-4" />
            </div>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-purple-50 text-purple-700 border border-purple-200/80">
              Comunidad
            </span>
          </div>

          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
            Población Alcanzada
          </span>
          <span className="text-2xl font-black text-purple-700 leading-tight block mt-0.5">
            {metricas.personasAlcanzadasTotal}
          </span>

          <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1 text-[11px]">
            <div className="flex items-center justify-between text-slate-600">
              <span>Participantes en charlas</span>
              <span className="font-bold text-slate-900">{metricas.personasAlcanzadasTotal}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Viviendas abordadas</span>
              <span className="font-bold text-slate-900">{metricas.viviendasInspeccionadasTotal}</span>
            </div>
          </div>
        </div>

        <span className="mt-2.5 text-[11px] font-bold text-purple-700 block">
          Ver resumen general →
        </span>
      </div>

      {/* 4. Pendientes de Reinspección */}
      <div
        onClick={() => onSelectTab('pendientes')}
        className={`p-3.5 sm:p-4 rounded-2xl bg-white border transition shadow-2xs cursor-pointer flex flex-col justify-between ${
          activeTab === 'pendientes' ? 'border-rose-600 ring-1.5 ring-rose-600/20' : 'border-slate-200 hover:border-slate-300'
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
            Pendientes de Control
          </span>
          <span className="text-2xl font-black text-rose-600 leading-tight block mt-0.5">
            {metricas.pendientesSeguimientoTotal}
          </span>

          <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1 text-[11px]">
            <div className="flex items-center justify-between text-slate-600">
              <span>Sectores por reinspeccionar</span>
              <span className={metricas.pendientesSeguimientoTotal > 0 ? 'font-bold text-rose-600' : 'font-bold text-slate-900'}>
                {metricas.pendientesSeguimientoTotal}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Vigilancia ambiental</span>
              <span className="font-bold text-emerald-700">Activa</span>
            </div>
          </div>
        </div>

        <span className="mt-2.5 text-[11px] font-bold text-rose-600 block">
          Revisar alertas →
        </span>
      </div>
    </div>
  );
};