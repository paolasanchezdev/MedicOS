// =========================================================================
// ARCHIVO: apps/web/src/portals/medico/pages/dashboard/resumen/components/ResumenConsultasCard.tsx
// DESCRIPCIÓN: Tarjetas KPI de consultas rediseñadas idénticas al Panel Admin con desglose y links.
// =========================================================================

import React from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronRight,
  UserCheck,
  FileText,
  Activity,
  AlertCircle,
} from 'lucide-react';

interface ResumenConsultasProps {
  data?: {
    total: number;
    atendidas: number;
    pendientes: number;
    canceladas: number;
  };
  onVerDetalle?: (tipo: 'TOTAL' | 'ATENDIDAS' | 'PENDIENTES' | 'CANCELADAS') => void;
}

export const ResumenConsultasCard: React.FC<ResumenConsultasProps> = ({
  data,
  onVerDetalle,
}) => {
  const total = data?.total ?? 0;
  const atendidas = data?.atendidas ?? 0;
  const pendientes = data?.pendientes ?? 0;
  const canceladas = data?.canceladas ?? 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* TARJETA 1: TOTAL CONSULTAS */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
        <div>
          {/* Cabecera con Icono y Badge */}
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0 text-teal-700">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-50 text-teal-700 border border-teal-200/60">
              • En Jornada
            </span>
          </div>

          {/* Título y Número Grande KPI */}
          <p className="text-xs font-bold text-slate-400 tracking-wider uppercase">
            Total Consultas
          </p>
          <h3 className="text-3xl font-black text-slate-900 tracking-tight mt-0.5 mb-4">
            {total}
          </h3>

          {/* Desglose Interno en bloque gris (Igual a Admin Panel) */}
          <div className="bg-slate-50/80 border border-slate-200/60 rounded-xl p-2.5 space-y-1.5 text-xs font-medium">
            <div className="flex items-center justify-between text-slate-600">
              <span>Atendidas</span>
              <span className="font-bold text-slate-800">{atendidas}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>En Espera</span>
              <span className="font-bold text-slate-800">{pendientes}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Canceladas</span>
              <span className="font-bold text-slate-800">{canceladas}</span>
            </div>
          </div>
        </div>

        {/* Link Interactivo Inferior */}
        <button
          type="button"
          onClick={() => onVerDetalle?.('TOTAL')}
          className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between w-full text-xs font-bold text-teal-700 hover:text-teal-800 transition-colors group cursor-pointer"
        >
          <span>Ver agenda del día</span>
          <ChevronRight className="w-4 h-4 text-teal-600 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* TARJETA 2: ATENDIDAS */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
        <div>
          {/* Cabecera con Icono y Badge */}
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              • Completadas
            </span>
          </div>

          {/* Título y Número Grande KPI */}
          <p className="text-xs font-bold text-slate-400 tracking-wider uppercase">
            Pacientes Atendidos
          </p>
          <h3 className="text-3xl font-black text-slate-900 tracking-tight mt-0.5 mb-4">
            {atendidas}
          </h3>

          {/* Desglose Interno */}
          <div className="bg-slate-50/80 border border-slate-200/60 rounded-xl p-2.5 space-y-1.5 text-xs font-medium">
            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-emerald-600" /> Recetas emitidas
              </span>
              <span className="font-bold text-slate-800">{atendidas}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-600" /> Diagnósticos
              </span>
              <span className="font-bold text-slate-800">{atendidas}</span>
            </div>
          </div>
        </div>

        {/* Link Interactivo Inferior */}
        <button
          type="button"
          onClick={() => onVerDetalle?.('ATENDIDAS')}
          className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between w-full text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors group cursor-pointer"
        >
          <span>Ver consultas finalizadas</span>
          <ChevronRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* TARJETA 3: PENDIENTES */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
        <div>
          {/* Cabecera con Icono y Badge */}
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0 text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200/60">
              • En Espera
            </span>
          </div>

          {/* Título y Número Grande KPI */}
          <p className="text-xs font-bold text-slate-400 tracking-wider uppercase">
            Consultas Pendientes
          </p>
          <h3 className="text-3xl font-black text-slate-900 tracking-tight mt-0.5 mb-4">
            {pendientes}
          </h3>

          {/* Desglose Interno */}
          <div className="bg-slate-50/80 border border-slate-200/60 rounded-xl p-2.5 space-y-1.5 text-xs font-medium">
            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-amber-600" /> Triaje completado
              </span>
              <span className="font-bold text-slate-800">{pendientes}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-600" /> Aguardando turno
              </span>
              <span className="font-bold text-slate-800">{pendientes}</span>
            </div>
          </div>
        </div>

        {/* Link Interactivo Inferior */}
        <button
          type="button"
          onClick={() => onVerDetalle?.('PENDIENTES')}
          className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between w-full text-xs font-bold text-amber-700 hover:text-amber-800 transition-colors group cursor-pointer"
        >
          <span>Ver pacientes en espera</span>
          <ChevronRight className="w-4 h-4 text-amber-600 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* TARJETA 4: CANCELADAS */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
        <div>
          {/* Cabecera con Icono y Badge */}
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0 text-rose-600">
              <XCircle className="w-5 h-5" />
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200/60">
              • Anuladas
            </span>
          </div>

          {/* Título y Número Grande KPI */}
          <p className="text-xs font-bold text-slate-400 tracking-wider uppercase">
            Consultas Canceladas
          </p>
          <h3 className="text-3xl font-black text-slate-900 tracking-tight mt-0.5 mb-4">
            {canceladas}
          </h3>

          {/* Desglose Interno */}
          <div className="bg-slate-50/80 border border-slate-200/60 rounded-xl p-2.5 space-y-1.5 text-xs font-medium">
            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-rose-600" /> Canceladas por médico
              </span>
              <span className="font-bold text-slate-800">0</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-1.5">
                <XCircle className="w-3.5 h-3.5 text-rose-600" /> Inasistencias
              </span>
              <span className="font-bold text-slate-800">{canceladas}</span>
            </div>
          </div>
        </div>

        {/* Link Interactivo Inferior */}
        <button
          type="button"
          onClick={() => onVerDetalle?.('CANCELADAS')}
          className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between w-full text-xs font-bold text-rose-700 hover:text-rose-800 transition-colors group cursor-pointer"
        >
          <span>Ver historial de anulación</span>
          <ChevronRight className="w-4 h-4 text-rose-600 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};