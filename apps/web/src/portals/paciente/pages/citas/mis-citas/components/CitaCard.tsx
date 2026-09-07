// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/citas/mis-citas/components/CitaCard.tsx
// DESCRIPCIÓN: Tarjeta ejecutiva de historial y listado de citas con datos
//              reales de especialidad, médico, sede, modalidad y estado.
// =========================================================================

import React from 'react';
import {
  Clock,
  ChevronRight,
  MapPin,
  Building2,
  Video,
  FileText,
} from 'lucide-react';
import {
  type Appointment,
  CitaEstadoBadge,
} from '../../../../../../modules/appointments/index.js';

interface CitaCardProps {
  appointment: Appointment;
  onViewDetail: (appointment: Appointment) => void;
}

export const CitaCard: React.FC<CitaCardProps> = ({ appointment, onViewDetail }) => {
  const dateObj = new Date(appointment.appointmentDate);

  const dia = dateObj.getDate();
  const mes = dateObj.toLocaleDateString('es-ES', { month: 'short' }).replace('.', '').toUpperCase();
  const horaStr = dateObj.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

  const especialidad = appointment.doctor?.specialty || 'Medicina General';
  const establecimiento = appointment.establishment?.name || 'Unidad de Salud Central MedicOS';
  const isTelemedicine = appointment.modality === 'TELEMEDICINE';

  return (
    <div
      onClick={() => onViewDetail(appointment)}
      className="group bg-white border border-slate-200/80 hover:border-[#2B7A78]/50 rounded-2xl p-3.5 sm:p-4 shadow-2xs hover:shadow-xs transition-all duration-150 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 cursor-pointer select-none"
    >
      {/* BLOQUE IZQUIERDO: FECHA Y DATOS DE ATENCIÓN */}
      <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
        {/* Pastilla de Fecha y Horario */}
        <div className="w-16 sm:w-18 bg-slate-50 border border-slate-200/80 group-hover:border-teal-200 group-hover:bg-teal-50/30 rounded-xl p-2 text-center shrink-0 transition-colors shadow-2xs">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#2B7A78] block">
            {mes}
          </span>
          <span className="text-lg sm:text-xl font-black text-slate-900 leading-none block my-0.5 tabular-nums">
            {dia}
          </span>
          <div className="inline-flex items-center gap-0.5 text-[10px] font-bold text-slate-500 tabular-nums">
            <Clock className="w-2.5 h-2.5 text-slate-400" />
            <span>{horaStr}</span>
          </div>
        </div>

        {/* Información Clínica de la Cita */}
        <div className="space-y-1.5 min-w-0 flex-1">
          {/* Fila Superior: Especialidad, Estado y Modalidad */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-extrabold text-slate-900 tracking-tight">
              {especialidad}
            </span>

            <CitaEstadoBadge status={appointment.status} />

            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10.5px] font-semibold bg-slate-100 text-slate-600 border border-slate-200/60">
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

          {/* Profesional Responsable */}
          <p className="text-xs font-semibold text-slate-700 truncate">
            Dr. {appointment.doctor?.firstName} {appointment.doctor?.lastName}
          </p>

          {/* Establecimiento y extracto de motivo */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
            <div className="flex items-center gap-1 truncate">
              <MapPin className="w-3 h-3 text-[#2B7A78] shrink-0" />
              <span className="truncate">{establecimiento}</span>
            </div>

            {appointment.reason && (
              <div className="flex items-center gap-1 text-slate-500 truncate">
                <FileText className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="truncate max-w-xs">{appointment.reason}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* BLOQUE DERECHO: ACCIÓN */}
      <div className="shrink-0 flex items-center justify-end sm:pl-3 border-t sm:border-t-0 border-slate-100 pt-2 sm:pt-0">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetail(appointment);
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-50 group-hover:bg-[#2B7A78] text-slate-700 group-hover:text-white text-xs font-bold rounded-xl border border-slate-200/80 group-hover:border-[#2B7A78] transition-all duration-150 shadow-2xs cursor-pointer"
        >
          <span>Ver detalle</span>
          <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
};

export default CitaCard;