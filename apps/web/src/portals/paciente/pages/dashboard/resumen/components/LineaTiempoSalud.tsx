// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/dashboard/resumen/components/LineaTiempoSalud.tsx
// DESCRIPCIÓN: Cronología e historial de atenciones médicas estilo Admin / iOS.
// =========================================================================

import React from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  Stethoscope,
  Pill,
  CalendarCheck,
  FileSpreadsheet,
  ArrowRight,
  History,
  Clock,
} from 'lucide-react';

export interface EventoSaludItem {
  id: string;
  fecha: string | Date;
  titulo: string;
  descripcion: string;
  tipo: 'CONSULTA' | 'SIGNOS_VITALES' | 'PRESCRIPCION' | 'CITA_PROGRAMADA' | string;
}

interface Props {
  eventos?: EventoSaludItem[] | null;
}

export const LineaTiempoSalud: React.FC<Props> = ({ eventos }) => {
  const listaEventos = eventos ?? [];
  const tieneEventos = listaEventos.length > 0;

  const obtenerConfiguracionTipo = (tipo: EventoSaludItem['tipo']) => {
    switch (tipo) {
      case 'CONSULTA':
        return {
          icono: Stethoscope,
          label: 'Consulta',
          badgeClass: 'bg-teal-50 text-teal-700 border-teal-200/50',
          iconBg: 'bg-teal-50 border-teal-100 text-teal-700',
        };
      case 'SIGNOS_VITALES':
        return {
          icono: Activity,
          label: 'Signos Vitales',
          badgeClass: 'bg-rose-50 text-rose-700 border-rose-200/50',
          iconBg: 'bg-rose-50 border-rose-100 text-rose-600',
        };
      case 'PRESCRIPCION':
        return {
          icono: Pill,
          label: 'Receta',
          badgeClass: 'bg-amber-50 text-amber-800 border-amber-200/50',
          iconBg: 'bg-amber-50 border-amber-100 text-amber-600',
        };
      case 'CITA_PROGRAMADA':
        return {
          icono: CalendarCheck,
          label: 'Cita',
          badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200/50',
          iconBg: 'bg-indigo-50 border-indigo-100 text-indigo-600',
        };
      default:
        return {
          icono: FileSpreadsheet,
          label: 'Registro',
          badgeClass: 'bg-slate-100 text-slate-600 border-slate-200/60',
          iconBg: 'bg-slate-100 border-slate-200/70 text-slate-500',
        };
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Cabecera */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-100/80 flex items-center justify-center text-[#2a726d] shadow-2xs">
              <Clock className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-800 tracking-tight">
                Historial y Actividad Clínica
              </h3>
              <p className="text-[11px] font-normal text-slate-400">
                Trazabilidad cronológica de atenciones y registros
              </p>
            </div>
          </div>

          <Link
            to="/paciente/expediente/consultas"
            className="group flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors py-1 px-2.5 rounded-lg hover:bg-slate-100/60"
          >
            <span>Ver historial</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 text-slate-400 group-hover:text-slate-900" />
          </Link>
        </div>

        {/* Lista de Eventos */}
        <div className="mt-3">
          {!tieneEventos ? (
            <div className="py-10 text-center flex flex-col items-center justify-center bg-slate-50/40 rounded-xl border border-dashed border-slate-200/60 my-2">
              <div className="w-9 h-9 rounded-full bg-slate-100/80 flex items-center justify-center text-slate-400 mb-2">
                <History className="w-4 h-4 stroke-[1.8]" />
              </div>
              <p className="text-xs font-medium text-slate-600">Sin historial cronológico registrado</p>
              <p className="text-[11px] text-slate-400 mt-0.5 max-w-sm">
                A medida que asistas a consultas en brigadas o registres tus signos vitales, se mostrará aquí la cronología médica.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {listaEventos.slice(0, 6).map((ev) => {
                const config = obtenerConfiguracionTipo(ev.tipo);
                const IconComponent = config.icono;

                const fechaObj = new Date(ev.fecha);
                const fechaFormateada = !isNaN(fechaObj.getTime())
                  ? fechaObj.toLocaleDateString('es-SV', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })
                  : String(ev.fecha);

                return (
                  <div
                    key={ev.id}
                    className="py-2.5 px-2 rounded-xl hover:bg-slate-50/70 transition-colors duration-150 flex items-center justify-between gap-3 group/item"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${config.iconBg}`}
                      >
                        <IconComponent className="w-3.5 h-3.5 stroke-2" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-800 truncate">
                            {ev.titulo}
                          </span>
                          <span
                            className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full uppercase tracking-wider border ${config.badgeClass}`}
                          >
                            {config.label}
                          </span>
                        </div>

                        <p className="text-[12px] text-slate-500 mt-0.5 truncate">
                          {ev.descripcion}
                        </p>
                      </div>
                    </div>

                    <span className="text-[11px] font-normal text-slate-400 whitespace-nowrap shrink-0 group-hover/item:text-slate-600 transition-colors">
                      {fechaFormateada}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LineaTiempoSalud;