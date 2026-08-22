// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/dashboard/resumen/components/TarjetaProximaCita.tsx
// DESCRIPCIÓN: Tarjeta de próxima cita médica con diseño unificado MedicOS.
// =========================================================================

import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, CalendarPlus, ChevronRight, Stethoscope } from 'lucide-react';

export interface ProximaCitaData {
  id: string;
  fecha: string | Date;
  doctorNombre: string;
  esEspecialista?: boolean;
  especialidad?: string;
  establecimiento: string;
  municipio?: string;
  motivo?: string;
  estado?: string;
}

interface Props {
  cita: ProximaCitaData | null;
}

export const TarjetaProximaCita: React.FC<Props> = ({ cita }) => {
  if (!cita) {
    return (
      <div className="group bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between h-full">
        <div>
          {/* Cabecera */}
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200/70 flex items-center justify-center text-slate-500 shadow-2xs">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200/60">
              Sin citas
            </span>
          </div>

          {/* Métrica / Título */}
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Próxima Consulta
            </p>
            <p className="text-base font-bold text-slate-800 tracking-tight mt-1">
              No tienes citas médicas agendadas
            </p>
            <p className="text-xs text-slate-500 font-normal leading-relaxed mt-1">
              No registras consultas pendientes en el sistema. Puedes solicitar atención en brigadas o telemedicina cuando lo requieras.
            </p>
          </div>
        </div>

        {/* Acción inferior */}
        <Link
          to="/paciente/citas/agendar"
          className="mt-5 pt-3 border-t border-slate-100 w-full inline-flex items-center justify-between text-xs font-semibold text-[#2a726d] hover:text-[#23605c] transition-colors group/btn"
        >
          <span className="inline-flex items-center gap-1.5">
            <CalendarPlus className="w-3.5 h-3.5" />
            <span>Programar Cita Médica</span>
          </span>
          <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" />
        </Link>
      </div>
    );
  }

  const fechaObjeto = new Date(cita.fecha);
  const fechaValida = !isNaN(fechaObjeto.getTime());

  const fechaFormateada = fechaValida
    ? fechaObjeto.toLocaleDateString('es-SV', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : String(cita.fecha);

  const horaFormateada = fechaValida
    ? fechaObjeto.toLocaleTimeString('es-SV', { hour: '2-digit', minute: '2-digit' })
    : '';

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between h-full">
      <div>
        {/* Cabecera */}
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 shadow-xs">
            <Calendar className="w-5 h-5" />
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {cita.estado || 'PROGRAMADA'}
          </span>
        </div>

        {/* Título / Doctor */}
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Próxima Consulta
          </p>
          <p className="text-base font-bold text-slate-900 tracking-tight mt-1 flex items-center gap-1.5 truncate">
            <Stethoscope className="w-4 h-4 text-[#2a726d] shrink-0" />
            <span className="truncate">{cita.doctorNombre}</span>
          </p>
        </div>

        {/* Desglose de Datos */}
        <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-50/70 border border-slate-100 text-slate-600">
            <span className="font-medium flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Fecha</span>
            </span>
            <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200/60 shadow-2xs capitalize">
              {fechaFormateada}
            </span>
          </div>

          {horaFormateada && (
            <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-50/70 border border-slate-100 text-slate-600">
              <span className="font-medium flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Horario</span>
              </span>
              <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200/60 shadow-2xs">
                {horaFormateada}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-50/70 border border-slate-100 text-slate-600">
            <span className="font-medium flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>Sede</span>
            </span>
            <span className="font-semibold text-slate-800 truncate max-w-42.5 text-right">
              {cita.establecimiento}
            </span>
          </div>
        </div>
      </div>

      {/* Acción inferior */}
      <Link
        to="/paciente/citas/mis-citas"
        className="mt-5 pt-3 border-t border-slate-100 w-full inline-flex items-center justify-between text-xs font-semibold text-[#2a726d] hover:text-[#23605c] transition-colors group/btn"
      >
        <span>Ver todas mis citas</span>
        <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" />
      </Link>
    </div>
  );
};

export default TarjetaProximaCita;