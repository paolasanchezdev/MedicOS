// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/dashboard/resumen/components/TarjetaAccionesPendientes.tsx
// DESCRIPCIÓN: Tarjeta de avisos, recordatorios y tareas pendientes estilo MedicOS.
// =========================================================================

import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, CheckCircle2, ChevronRight, ArrowUpRight, AlertCircle } from 'lucide-react';

export interface AccionPendienteItem {
  id: string;
  titulo: string;
  descripcion: string;
  tipo?: 'CITA_CONFIRMACION' | 'FORMULARIO_PREVIO' | 'RESULTADOS_LAB' | 'ACTUALIZACION_DATOS' | 'CITA' | 'TRATAMIENTO' | 'PERFIL' | string;
  ruta?: string;
  fecha?: string;
}

interface Props {
  acciones?: AccionPendienteItem[] | null;
}

export const TarjetaAccionesPendientes: React.FC<Props> = ({ acciones }) => {
  const listaAcciones = acciones ?? [];
  const tienePendientes = listaAcciones.length > 0;

  if (!tienePendientes) {
    return (
      <div className="group bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between h-full">
        <div>
          {/* Cabecera */}
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-xs">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Al día
            </span>
          </div>

          {/* Métrica / Título */}
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Avisos y Pendientes
            </p>
            <p className="text-base font-bold text-slate-800 tracking-tight mt-1">
              Sin tareas ni trámites pendientes
            </p>
            <p className="text-xs text-slate-500 font-normal leading-relaxed mt-1">
              Tu expediente se encuentra al día y no tienes confirmaciones de citas ni requerimientos pendientes en el sistema.
            </p>
          </div>
        </div>

        {/* Acción inferior */}
        <Link
          to="/paciente/notificaciones/centro"
          className="mt-5 pt-3 border-t border-slate-100 w-full inline-flex items-center justify-between text-xs font-semibold text-[#2a726d] hover:text-[#23605c] transition-colors group/btn"
        >
          <span>Centro de notificaciones</span>
          <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between h-full">
      <div>
        {/* Cabecera */}
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shadow-xs">
            <Bell className="w-5 h-5" />
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
            <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
            {listaAcciones.length} {listaAcciones.length === 1 ? 'Pendiente' : 'Pendientes'}
          </span>
        </div>

        {/* Título */}
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Avisos y Tareas Pendientes
          </p>
          <p className="text-base font-bold text-slate-900 tracking-tight mt-1">
            Acciones Requeridas
          </p>
        </div>

        {/* Listado de Tareas */}
        <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
          {listaAcciones.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="p-2.5 rounded-lg bg-slate-50/70 border border-slate-100 text-xs flex items-start justify-between gap-2.5 hover:bg-slate-100/60 transition-colors"
            >
              <div className="min-w-0">
                <p className="font-bold text-slate-900 truncate">{item.titulo}</p>
                <p className="text-[11px] text-slate-500 font-medium leading-snug mt-0.5">
                  {item.descripcion}
                </p>
              </div>
              {item.ruta ? (
                <Link
                  to={item.ruta}
                  className="p-1 rounded-md bg-white border border-slate-200/60 text-slate-600 hover:text-[#2a726d] hover:border-[#2a726d]/40 shadow-2xs shrink-0 transition-colors"
                  aria-label={`Ir a ${item.titulo}`}
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      {/* Acción inferior */}
      <Link
        to="/paciente/notificaciones/centro"
        className="mt-5 pt-3 border-t border-slate-100 w-full inline-flex items-center justify-between text-xs font-semibold text-[#2a726d] hover:text-[#23605c] transition-colors group/btn"
      >
        <span>Ver todas las notificaciones</span>
        <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" />
      </Link>
    </div>
  );
};

export default TarjetaAccionesPendientes;