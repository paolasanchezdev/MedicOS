// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/salud-materna/control-embarazo/components/ProximoControlCard.tsx
// DESCRIPCIÓN: Tarjeta de enlace hacia el módulo exclusivo de Citas Prenatales.
// =========================================================================

import React from 'react';
import { CalendarClock, ChevronRight, Clock, MapPin, CalendarPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { NextPrenatalAppointment } from '../../../../../../modules/maternal-health/types/maternal-health.types.js';

interface ProximoControlCardProps {
  appointment: NextPrenatalAppointment | null;
}

export const ProximoControlCard: React.FC<ProximoControlCardProps> = ({ appointment }) => {
  const navigate = useNavigate();

  if (!appointment) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-4 select-none flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Próximo Control
            </span>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
              Pendiente de agendar
            </span>
          </div>

          <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
            Sin cita prenatal programada
          </h3>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Mantén al día tus controles para vigilar el crecimiento de tu bebé y prevenir complicaciones.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/paciente/salud-materna/citas-prenatales')}
          className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-2xs"
        >
          <CalendarPlus className="w-4 h-4" />
          <span>Ir a Citas Prenatales</span>
        </button>
      </div>
    );
  }

  const appDate = new Date(appointment.appointmentDate);
  const formattedDate = appDate.toLocaleDateString('es-SV', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs hover:border-teal-200 transition select-none flex flex-col justify-between space-y-4">
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 shadow-2xs">
              <CalendarClock className="w-5 h-5 stroke-2" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Agenda Obstétrica
              </span>
              <p className="text-xs font-extrabold text-slate-800">Próximo Control Prenatal</p>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-full text-xs font-black bg-teal-50 text-teal-800 border border-teal-200/70 flex items-center gap-1 tabular-nums">
            <Clock className="w-3.5 h-3.5 text-teal-700" />
            <span>{appointment.timeText}</span>
          </span>
        </div>

        <div>
          <h3 className="text-base font-black text-slate-900 tracking-tight capitalize">
            {formattedDate}
          </h3>
          <p className="text-xs font-semibold text-slate-600 mt-0.5">
            {appointment.doctorName}
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 text-xs space-y-1.5 font-medium">
          <p className="font-bold text-slate-800">{appointment.reason}</p>
          <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-teal-700 shrink-0" />
            <span className="truncate">{appointment.establishmentName || 'Unidad Comunitaria de Salud Familiar'}</span>
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => navigate('/paciente/salud-materna/citas-prenatales')}
        className="pt-3 border-t border-slate-100 w-full inline-flex items-center justify-between text-xs font-bold text-teal-700 hover:text-teal-800 cursor-pointer group/btn"
      >
        <span>Gestionar en Citas Prenatales</span>
        <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" />
      </button>
    </div>
  );
};

export default ProximoControlCard;