// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/salud-materna/citas-prenatales/components/CitaPrenatalCard.tsx
// DESCRIPCIÓN: Tarjeta clínica ligera, aireada y ejecutiva para el listado
//              de citas prenatales. Sin párrafos densos ni bloques pesados.
// =========================================================================

import React from 'react';
import {
  Clock,
  MapPin,
  ChevronRight,
  Stethoscope,
  Video,
  Building2,
  Activity,
} from 'lucide-react';
import { type Appointment, CitaEstadoBadge } from '../../../../../../modules/appointments/index.js';

export interface PrenatalAppointmentItem extends Appointment {
  gestationalAgeText?: string;
  vitalSigns?: {
    bloodPressure?: string | null;
    weightKg?: number | null;
    heartRate?: number | null;
  };
  clinicalNotes?: string;
  observations?: string | null;
}

interface CitaPrenatalCardProps {
  appointment: PrenatalAppointmentItem;
  onViewDetail: (appointment: PrenatalAppointmentItem) => void;
}

export const CitaPrenatalCard: React.FC<CitaPrenatalCardProps> = ({
  appointment,
  onViewDetail,
}) => {
  const dateObj = new Date(appointment.appointmentDate);

  const dia = dateObj.getDate();
  const mes = dateObj.toLocaleDateString('es-ES', { month: 'short' }).replace('.', '').toUpperCase();
  const anio = dateObj.getFullYear();
  const horaStr = dateObj.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

  const especialidad = appointment.doctor?.specialty || 'Ginecología y Obstetricia';
  const establecimiento = appointment.establishment?.name || 'Unidad Comunitaria de Salud Familiar';
  const isTelemedicine = appointment.modality === 'TELEMEDICINE';
  const isCompleted = appointment.status === 'COMPLETED';

  return (
    <div
      onClick={() => onViewDetail(appointment)}
      className="group bg-white border border-slate-200/85 hover:border-[#2B7A78]/50 hover:shadow-xs rounded-2xl p-3.5 sm:p-4 transition-all duration-150 cursor-pointer select-none"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* BLOQUE PRINCIPAL: FECHA + METADATOS CLÍNICOS */}
        <div className="flex items-center gap-3.5 min-w-0 flex-1">
          {/* Bloque Calendario Compacto */}
          <div className="w-13 sm:w-14 bg-slate-50 border border-slate-200/80 group-hover:bg-teal-50/40 group-hover:border-teal-200 rounded-xl py-1.5 px-1 text-center shrink-0 transition-colors shadow-2xs">
            <span className="text-[9.5px] font-black uppercase tracking-wider text-[#2B7A78] block leading-tight">
              {mes}
            </span>
            <span className="text-base sm:text-lg font-black text-slate-900 leading-none block my-0.5 tabular-nums">
              {dia}
            </span>
            <span className="text-[9px] font-bold text-slate-400 block tabular-nums">
              {anio}
            </span>
          </div>

          {/* Información de la Consulta */}
          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10.5px] font-extrabold text-[#2B7A78] bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200/60 uppercase tracking-wide">
                {especialidad}
              </span>

              {appointment.gestationalAgeText && (
                <span className="text-[10.5px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/70">
                  {appointment.gestationalAgeText}
                </span>
              )}

              <CitaEstadoBadge status={appointment.status} />
            </div>

            {/* Hito o Motivo */}
            <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 group-hover:text-[#2B7A78] transition-colors truncate">
              {appointment.reason}
            </h4>

            {/* Fila Inferior: Profesional, Sede y Signos Vitales resumidos */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500 pt-0.5">
              <span className="font-semibold text-slate-700 flex items-center gap-1 truncate">
                <Stethoscope className="w-3.5 h-3.5 text-[#2B7A78] shrink-0" />
                Dr. {appointment.doctor?.firstName} {appointment.doctor?.lastName}
              </span>

              <span className="flex items-center gap-1 tabular-nums text-slate-500">
                <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                <span>{horaStr} hrs</span>
              </span>

              <span className="hidden md:flex items-center gap-1 truncate text-slate-400 max-w-xs">
                <MapPin className="w-3 h-3 shrink-0" />
                <span className="truncate">{establecimiento}</span>
              </span>

              {/* Indicadores Sutiles de Signos Vitales (Solo en consultas completadas) */}
              {isCompleted && appointment.vitalSigns && (
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200/60 text-[10.5px] font-bold tabular-nums text-slate-700">
                  <Activity className="w-3 h-3 text-teal-600 shrink-0" />
                  {appointment.vitalSigns.bloodPressure && (
                    <span>PA: {appointment.vitalSigns.bloodPressure}</span>
                  )}
                  {appointment.vitalSigns.weightKg && (
                    <span>• {appointment.vitalSigns.weightKg} kg</span>
                  )}
                  {appointment.vitalSigns.heartRate && (
                    <span>• {appointment.vitalSigns.heartRate} lpm</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BLOQUE DERECHO: MODALIDAD Y ACCIÓN */}
        <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 sm:pl-3 border-t sm:border-t-0 border-slate-100 pt-2 sm:pt-0">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10.5px] font-semibold bg-slate-50 text-slate-600 border border-slate-200/60">
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

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetail(appointment);
            }}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-50 group-hover:bg-[#2B7A78] text-slate-700 group-hover:text-white text-xs font-bold rounded-xl border border-slate-200/80 group-hover:border-[#2B7A78] transition-all shadow-2xs cursor-pointer"
          >
            <span>Ver detalle</span>
            <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CitaPrenatalCard;