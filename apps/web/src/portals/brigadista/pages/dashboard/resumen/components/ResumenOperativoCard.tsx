// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/dashboard/resumen/components/ResumenOperativoCard.tsx
// DESCRIPCIÓN: Tarjetas de métricas operativas con el estilo exacto de TarjetaUsuarios del Admin.
// =========================================================================

import React from 'react';
import { Users, HeartPulse, Clock, AlertTriangle, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ResumenOperativoCardProps {
  personasRegistradas: number;
  evaluacionesRealizadas: number;
  pendientesEvaluacion: number;
  riesgosDetectados: number;
}

export const ResumenOperativoCard: React.FC<ResumenOperativoCardProps> = ({
  personasRegistradas,
  evaluacionesRealizadas,
  pendientesEvaluacion,
  riesgosDetectados,
}) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Personas Registradas */}
      <div className="group bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-xs">
              <Users className="w-5 h-5" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              Hoy
            </span>
          </div>

          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Personas Registradas
            </p>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              {personasRegistradas}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
            <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-50/70 border border-slate-100 text-slate-600">
              <span className="font-medium">Padrón de campo</span>
              <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200/60 shadow-2xs">
                {personasRegistradas}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate('/brigadista/pacientes/buscar')}
          className="mt-5 pt-3 border-t border-slate-100 w-full inline-flex items-center justify-between text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors group/btn cursor-pointer"
        >
          <span>Ver padrón</span>
          <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" />
        </button>
      </div>

      {/* 2. Evaluaciones Realizadas */}
      <div className="group bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#2B7A78] shadow-xs">
              <HeartPulse className="w-5 h-5" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Signos
            </span>
          </div>

          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Evaluaciones Realizadas
            </p>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              {evaluacionesRealizadas}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
            <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-50/70 border border-slate-100 text-slate-600">
              <span className="font-medium">Constantes capturadas</span>
              <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200/60 shadow-2xs">
                {evaluacionesRealizadas}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate('/brigadista/evaluacion/signos-vitales')}
          className="mt-5 pt-3 border-t border-slate-100 w-full inline-flex items-center justify-between text-xs font-semibold text-[#2B7A78] hover:text-[#236866] transition-colors group/btn cursor-pointer"
        >
          <span>Ver evaluaciones</span>
          <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" />
        </button>
      </div>

      {/* 3. Pendientes de Evaluación */}
      <div className="group bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shadow-xs">
              <Clock className="w-5 h-5" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              En espera
            </span>
          </div>

          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Pendientes de Evaluación
            </p>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              {pendientesEvaluacion}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
            <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-50/70 border border-slate-100 text-slate-600">
              <span className="font-medium">Requieren valoración</span>
              <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200/60 shadow-2xs">
                {pendientesEvaluacion}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate('/brigadista/evaluacion/signos-vitales')}
          className="mt-5 pt-3 border-t border-slate-100 w-full inline-flex items-center justify-between text-xs font-semibold text-amber-700 hover:text-amber-800 transition-colors group/btn cursor-pointer"
        >
          <span>Realizar evaluaciones</span>
          <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" />
        </button>
      </div>

      {/* 4. Riesgos Detectados */}
      <div className="group bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shadow-xs">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              Atención
            </span>
          </div>

          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Riesgos Detectados
            </p>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              {riesgosDetectados}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
            <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-50/70 border border-slate-100 text-slate-600">
              <span className="font-medium">Signos fuera de rango</span>
              <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200/60 shadow-2xs">
                {riesgosDetectados}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate('/brigadista/evaluacion/signos-vitales')}
          className="mt-5 pt-3 border-t border-slate-100 w-full inline-flex items-center justify-between text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors group/btn cursor-pointer"
        >
          <span>Ver señales de riesgo</span>
          <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
};