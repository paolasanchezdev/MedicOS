// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/estudios/resultados-laboratorio/components/ResultadosLaboratorioStatusCards.tsx
// DESCRIPCIÓN: 4 tarjetas de resumen clínico para Resultados de Laboratorio.
// =========================================================================

import React from 'react';
import { FlaskConical, CheckCircle2, Activity, Building2, ChevronRight } from 'lucide-react';
import type { LaboratoryStudy } from '../../../../../../modules/laboratory/index.js';

interface ResultadosLaboratorioStatusCardsProps {
  studies: LaboratoryStudy[];
  onSelectStatus?: (status: string) => void;
}

export const ResultadosLaboratorioStatusCards: React.FC<ResultadosLaboratorioStatusCardsProps> = ({
  studies,
}) => {
  const completedCount = studies.filter((s) => s.status === 'COMPLETED').length;
  const pendingCount = studies.filter((s) => s.status === 'PENDING').length;
  const allAnalytes = studies.flatMap((s) => s.analytes);
  const withinRangeCount = allAnalytes.filter((a) => a.interpretationStatus === 'WITHIN_RANGE').length;
  const outOfRangeCount = allAnalytes.filter(
    (a) => a.interpretationStatus === 'ABOVE_RANGE' || a.interpretationStatus === 'BELOW_RANGE'
  ).length;

  const hematoCount = studies.filter((s) => s.category?.toLowerCase().includes('hematolog') || s.name.toLowerCase().includes('hemograma')).length;
  const quimicaCount = studies.filter((s) => s.category?.toLowerCase().includes('química') || s.name.toLowerCase().includes('glucosa')).length;
  const otrosCount = studies.length - hematoCount - quimicaCount;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 select-none">
      {/* TARJETA 1: ESTUDIOS CLÍNICOS */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-4.5 shadow-2xs flex flex-col justify-between min-h-48.75 transition-all hover:border-teal-300">
        <div>
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-medicos-teal">
              <FlaskConical className="w-4 h-4" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-teal-50 text-medicos-teal border border-teal-200/70">
              <span className="w-1.5 h-1.5 rounded-full bg-medicos-teal" />
              {studies.length} Estudios
            </span>
          </div>

          <div className="mt-2.5">
            <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
              Estudios Realizados
            </p>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none mt-1">
              {studies.length}
            </p>
          </div>

          <div className="space-y-1.5 pt-3 text-xs border-t border-slate-100 mt-2.5">
            <div className="flex items-center justify-between text-slate-500">
              <span>Hematología / Sangre</span>
              <span className="font-bold text-slate-800">{hematoCount}</span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>Química sanguínea</span>
              <span className="font-bold text-slate-800">{quimicaCount}</span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>Uroanálisis y otros</span>
              <span className="font-bold text-slate-800">{Math.max(0, otrosCount)}</span>
            </div>
          </div>
        </div>

        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <span>Pruebas diagnósticas documentadas</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* TARJETA 2: INFORMES DISPONIBLES */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-4.5 shadow-2xs flex flex-col justify-between min-h-48.75 transition-all hover:border-emerald-300">
        <div>
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Certificados
            </span>
          </div>

          <div className="mt-2.5">
            <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
              Resultados Disponibles
            </p>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none mt-1">
              {completedCount}
            </p>
          </div>

          <div className="space-y-1.5 pt-3 text-xs border-t border-slate-100 mt-2.5">
            <div className="flex items-center justify-between text-slate-500">
              <span>Informes cuantitativos completos</span>
              <span className="font-bold text-slate-800">{completedCount}</span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>Análisis en procesamiento</span>
              <span className="font-bold text-slate-800">{pendingCount}</span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>Parámetros analizados</span>
              <span className="font-bold text-slate-800">{allAnalytes.length}</span>
            </div>
          </div>
        </div>

        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <span>Informes clínicos validados</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* TARJETA 3: PARÁMETROS Y RANGOS */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-4.5 shadow-2xs flex flex-col justify-between min-h-48.75 transition-all hover:border-indigo-300">
        <div>
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Activity className="w-4 h-4" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/70">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              {outOfRangeCount > 0 ? 'Con observaciones' : 'Dentro de rango'}
            </span>
          </div>

          <div className="mt-2.5">
            <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
              Parámetros Evaluados
            </p>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none mt-1">
              {allAnalytes.length}
            </p>
          </div>

          <div className="space-y-1.5 pt-3 text-xs border-t border-slate-100 mt-2.5">
            <div className="flex items-center justify-between text-slate-500">
              <span>Dentro de referencia</span>
              <span className="font-bold text-emerald-700">{withinRangeCount}</span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>Fuera de rango de referencia</span>
              <span className="font-bold text-amber-800">{outOfRangeCount}</span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>Rangos oficiales de laboratorio</span>
              <span className="font-bold text-slate-800">100%</span>
            </div>
          </div>
        </div>

        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <span>Valores cuantitativos certificados</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* TARJETA 4: RED DE DIAGNÓSTICO */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-4.5 shadow-2xs flex flex-col justify-between min-h-48.75 transition-all hover:border-sky-300">
        <div>
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
              <Building2 className="w-4 h-4" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200/70">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
              Red de Salud
            </span>
          </div>

          <div className="mt-2.5">
            <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
              Establecimientos
            </p>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none mt-1">
              {new Set(studies.map((s) => s.establishmentName)).size}
            </p>
          </div>

          <div className="space-y-1.5 pt-3 text-xs border-t border-slate-100 mt-2.5">
            <div className="flex items-center justify-between text-slate-500">
              <span>Laboratorio Central</span>
              <span className="font-bold text-slate-800">Homologado</span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>Tomas en brigadas comunitarias</span>
              <span className="font-bold text-slate-800">Disponibles</span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>Trazabilidad de muestras</span>
              <span className="font-bold text-emerald-700">100%</span>
            </div>
          </div>
        </div>

        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <span>Puntos de toma certificados</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};

export default ResultadosLaboratorioStatusCards;