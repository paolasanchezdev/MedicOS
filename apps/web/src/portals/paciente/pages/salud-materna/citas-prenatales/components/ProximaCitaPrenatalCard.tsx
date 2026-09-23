// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/salud-materna/citas-prenatales/components/ProximaCitaPrenatalCard.tsx
// DESCRIPCIÓN: Tarjeta destacada de próxima cita prenatal con estética ejecutiva,
//              barra superior institucional, bloque horario nítido y acciones laterales.
// =========================================================================

import React from 'react';
import {
  Clock,
  MapPin,
  ChevronRight,
  RefreshCw,
  XCircle,
  Video,
  Building2,
  Baby,
  FileText,
  Stethoscope,
} from 'lucide-react';
import {
  type Appointment,
  CitaEstadoBadge,
} from '../../../../../../modules/appointments/index.js';

interface ProximaCitaPrenatalCardProps {
  appointment: Appointment;
  gestationalAgeText?: string | null;
  onViewDetail: (appointment: Appointment) => void;
  onReschedule: (appointment: Appointment) => void;
  onCancel: (appointment: Appointment) => void;
}

export const ProximaCitaPrenatalCard: React.FC<ProximaCitaPrenatalCardProps> = ({
  appointment,
  gestationalAgeText,
  onViewDetail,
  onReschedule,
  onCancel,
}) => {
  const dateObj = new Date(appointment.appointmentDate);

  const diaSemana = dateObj.toLocaleDateString('es-ES', { weekday: 'long' });
  const anio = dateObj.getFullYear();
  const horaFormateada = dateObj.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const canModify = appointment.status === 'CONFIRMED' || appointment.status === 'PENDING';
  const isTelemedicine = appointment.modality === 'TELEMEDICINE';
  const especialidad = appointment.doctor?.specialty || 'Ginecología y Obstetricia';
  const establecimiento = appointment.establishment?.name || 'Unidad Comunitaria de Salud Familiar';

  return (
    <div className="relative bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden select-none">
      {/* Acento decorativo institucional superior */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-[#2B7A78] via-[#236866] to-[#1B5250]" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-1">
        {/* BLOQUE PRINCIPAL: FECHA + DATOS OBSTÉTRICOS */}
        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5 min-w-0 flex-1">
          {/* Bloque de Calendario / Fecha */}
          <div className="w-full sm:w-28 bg-slate-50 border border-slate-200/80 rounded-2xl p-3 text-center shrink-0 flex sm:flex-col justify-between items-center sm:justify-center shadow-2xs">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#2B7A78]">
              {diaSemana}
            </span>
            <div className="my-0.5 sm:my-1">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight block">
                {dateObj.getDate()}
              </span>
              <span className="text-[11px] font-bold text-slate-500 uppercase block">
                {dateObj.toLocaleDateString('es-ES', { month: 'short' })} {anio}
              </span>
            </div>
            <div className="inline-flex items-center gap-1 text-xs font-black text-[#2B7A78] bg-teal-50 px-2 py-0.5 rounded-lg border border-teal-200/60 tabular-nums">
              <Clock className="w-3 h-3 text-[#2B7A78]" />
              <span>{horaFormateada}</span>
            </div>
          </div>

          {/* Información Obstétrica y Profesional */}
          <div className="space-y-2 min-w-0 flex-1">
            {/* Etiquetas Superiores */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-black uppercase tracking-wider bg-teal-50 text-[#2B7A78] border border-teal-200/70">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2B7A78] animate-pulse" />
                Próximo Control Prenatal
              </span>

              {gestationalAgeText && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-amber-50 text-amber-900 border border-amber-200/70">
                  <Baby className="w-3 h-3 text-amber-700" />
                  <span>{gestationalAgeText}</span>
                </span>
              )}

              <CitaEstadoBadge status={appointment.status} />

              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200/60">
                {isTelemedicine ? (
                  <>
                    <Video className="w-3 h-3 text-sky-600" />
                    <span>Telemedicina</span>
                  </>
                ) : (
                  <>
                    <Building2 className="w-3 h-3 text-slate-500" />
                    <span>Presencial</span>
                  </>
                )}
              </span>
            </div>

            {/* Especialidad y Profesional */}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2B7A78] bg-teal-50/80 px-2 py-0.5 rounded-md border border-teal-100">
                  {especialidad}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight mt-1 truncate flex items-center gap-1.5">
                <Stethoscope className="w-4 h-4 text-[#2B7A78] shrink-0" />
                <span>Dr. {appointment.doctor?.firstName} {appointment.doctor?.lastName}</span>
              </h3>
            </div>

            {/* Sede y Hito Obstétrico Destacado */}
            <div className="space-y-1.5 text-xs text-slate-500 pt-0.5">
              <div className="flex items-center gap-1.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-[#2B7A78] shrink-0" />
                <span className="truncate">{establecimiento}</span>
              </div>

              {appointment.reason && (
                <div className="flex items-start gap-1.5 text-slate-700 bg-teal-50/40 p-2.5 rounded-xl border border-teal-100 text-xs">
                  <FileText className="w-3.5 h-3.5 text-[#2B7A78] shrink-0 mt-0.5" />
                  <span className="leading-relaxed font-medium">
                    Hito Clínico: <strong className="font-extrabold text-slate-900">{appointment.reason}</strong>
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BOTONERA LATERAL DERECHA (ESTILO EJECUTIVO) */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-2 justify-center shrink-0 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6 lg:min-w-44">
          <button
            type="button"
            onClick={() => onViewDetail(appointment)}
            className="w-full px-4 py-2.5 bg-[#2B7A78] hover:bg-[#236866] active:scale-[0.98] text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Ver Detalle</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          {canModify && (
            <>
              <button
                type="button"
                onClick={() => onReschedule(appointment)}
                className="w-full px-4 py-2 bg-white hover:bg-slate-50 active:scale-[0.98] text-slate-700 text-xs font-semibold rounded-xl border border-slate-200/90 shadow-2xs transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                <span>Reprogramar</span>
              </button>

              <button
                type="button"
                onClick={() => onCancel(appointment)}
                className="w-full px-4 py-2 bg-white hover:bg-rose-50/80 active:scale-[0.98] text-rose-600 hover:text-rose-700 text-xs font-semibold rounded-xl border border-transparent hover:border-rose-200 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <XCircle className="w-3.5 h-3.5 text-rose-500" />
                <span>Cancelar Cita</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProximaCitaPrenatalCard;