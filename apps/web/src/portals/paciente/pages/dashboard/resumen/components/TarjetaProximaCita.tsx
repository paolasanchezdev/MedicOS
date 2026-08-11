import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, User, CalendarPlus, ChevronRight, Stethoscope } from 'lucide-react';

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
      <div className="bg-medicos-surface rounded-2xl border border-medicos-soft-border p-5 shadow-xs flex flex-col justify-between h-full space-y-4">
        <div className="flex items-center justify-between border-b border-medicos-soft-border pb-3">
          <span className="text-xs font-bold text-medicos-muted uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-medicos-teal" /> Próxima Consulta Programada
          </span>
          <span className="text-[10px] font-semibold text-medicos-muted uppercase">Sin citas</span>
        </div>
        <div className="py-6 text-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-medicos-light-bg text-medicos-teal flex items-center justify-center mx-auto">
            <Calendar className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-medicos-dark-blue">No hay citas médicas agendadas</p>
          <p className="text-[11px] text-medicos-muted max-w-xs mx-auto">
            No tienes consultas pendientes programadas en el sistema de salud.
          </p>
        </div>
        <div className="pt-2">
          <Link
            to="/paciente/citas/agendar"
            className="w-full px-3.5 py-2 rounded-xl bg-medicos-teal text-white text-xs font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5"
          >
            <CalendarPlus className="w-3.5 h-3.5 text-medicos-cyan" /> Programar Cita Médica
          </Link>
        </div>
      </div>
    );
  }

  const fechaObjeto = new Date(cita.fecha);
  const fechaValida = !isNaN(fechaObjeto.getTime());

  const fechaFormateada = fechaValida
    ? fechaObjeto.toLocaleDateString('es-SV', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : String(cita.fecha);

  const horaFormateada = fechaValida
    ? fechaObjeto.toLocaleTimeString('es-SV', { hour: '2-digit', minute: '2-digit' })
    : '';

  return (
    <div className="bg-medicos-surface rounded-2xl border border-medicos-soft-border p-5 shadow-xs flex flex-col justify-between h-full space-y-4">
      <div className="flex items-center justify-between border-b border-medicos-soft-border pb-3">
        <span className="text-xs font-bold text-medicos-dark-blue uppercase tracking-wider flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-medicos-teal" /> Próxima Consulta
        </span>
        <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-medicos-light-bg text-medicos-teal border border-medicos-soft-border">
          {cita.estado || 'PROGRAMADA'}
        </span>
      </div>

      <div className="space-y-3">
        <div className="bg-medicos-light-bg p-3 rounded-xl border border-medicos-soft-border space-y-2">
          <div className="flex items-start gap-2">
            <Stethoscope className="w-4 h-4 text-medicos-teal shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-medicos-dark-blue">{cita.doctorNombre}</p>
              {cita.especialidad && (
                <p className="text-[11px] text-medicos-muted">{cita.especialidad}</p>
              )}
            </div>
          </div>

          <div className="pt-2 border-t border-medicos-soft-border space-y-1">
            <p className="text-xs text-medicos-dark-blue flex items-center gap-1.5 font-medium">
              <MapPin className="w-3.5 h-3.5 text-medicos-teal shrink-0" />
              <span>{cita.establecimiento} {cita.municipio ? `(${cita.municipio})` : ''}</span>
            </p>
            {cita.motivo && (
              <p className="text-[11px] text-medicos-muted pl-5 italic">
                Motivo: &quot;{cita.motivo}&quot;
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs font-semibold text-medicos-dark-blue bg-medicos-surface border border-medicos-soft-border p-2.5 rounded-xl">
          <span className="flex items-center gap-1.5 capitalize text-medicos-teal">
            <Calendar className="w-3.5 h-3.5 text-medicos-cyan" /> {fechaFormateada}
          </span>
          {horaFormateada && (
            <span className="flex items-center gap-1 text-medicos-dark-blue border-l border-medicos-soft-border pl-2.5">
              <Clock className="w-3.5 h-3.5 text-medicos-teal" /> {horaFormateada}
            </span>
          )}
        </div>
      </div>

      <div className="pt-2 border-t border-medicos-soft-border flex items-center justify-between">
        <span className="text-[11px] text-medicos-muted flex items-center gap-1">
          <User className="w-3 h-3" /> Asistencia obligatoria
        </span>
        <Link
          to="/paciente/citas"
          className="px-3 py-1.5 rounded-lg text-medicos-teal text-xs font-semibold hover:bg-medicos-light-bg transition-colors flex items-center gap-1"
        >
          Detalles de cita <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default TarjetaProximaCita;