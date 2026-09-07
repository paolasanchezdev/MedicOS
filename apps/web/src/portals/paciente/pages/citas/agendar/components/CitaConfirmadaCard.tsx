// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/citas/agendar/components/CitaConfirmadaCard.tsx
// DESCRIPCIÓN: Modal de alerta de confirmación con diseño estilo iOS/Apple:
//              overlay con backdrop-blur sobre el último paso, tarjeta glassmorphism,
//              detalles agrupados y botones de acción rápida.
// =========================================================================

import React from 'react';
import { Check, Calendar, Clock, Stethoscope, FileText, CalendarDays, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface ConfirmedAppointmentData {
  doctorName: string;
  date: string;
  time: string;
  reason: string;
}

interface CitaConfirmadaCardProps {
  data: ConfirmedAppointmentData;
  onReset: () => void;
  onGoToAppointments?: () => void;
}

export const CitaConfirmadaCard: React.FC<CitaConfirmadaCardProps> = ({
  data,
  onReset,
  onGoToAppointments,
}) => {
  const navigate = useNavigate();

  const handleGoToAppointments = () => {
    if (onGoToAppointments) {
      onGoToAppointments();
    } else {
      navigate('/paciente/citas/mis-citas');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white/95 backdrop-blur-xl border border-white/60 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] rounded-3xl p-6 sm:p-7 text-center space-y-5 animate-in zoom-in-95 duration-200">
        {/* Icono de Confirmación Estilo iOS */}
        <div className="relative mx-auto w-14 h-14 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping opacity-75" />
          <div className="relative w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
            <Check className="w-7 h-7 stroke-[2.75]" />
          </div>
        </div>

        {/* Título y Subtítulo */}
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Cita Confirmada
          </h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
            Tu cita ha sido agendada con éxito y sincronizada con la agenda médica de MedicOS.
          </p>
        </div>

        {/* Lista Inset Grouped (Apple iOS Style) */}
        <div className="bg-slate-50/80 border border-slate-200/70 rounded-2xl p-1 text-left divide-y divide-slate-200/60">
          <div className="flex items-center justify-between px-3.5 py-2.5 text-xs">
            <span className="text-slate-500 font-medium flex items-center gap-2">
              <Stethoscope className="w-3.5 h-3.5 text-[#2B7A78]" />
              Profesional
            </span>
            <span className="font-bold text-slate-900 text-right truncate max-w-50">
              {data.doctorName}
            </span>
          </div>

          <div className="flex items-center justify-between px-3.5 py-2.5 text-xs">
            <span className="text-slate-500 font-medium flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Fecha
            </span>
            <span className="font-semibold text-slate-800 text-right">
              {data.date}
            </span>
          </div>

          <div className="flex items-center justify-between px-3.5 py-2.5 text-xs">
            <span className="text-slate-500 font-medium flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#2B7A78]" />
              Horario
            </span>
            <span className="font-bold text-[#2B7A78] tabular-nums text-right bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200/60">
              {data.time} hrs
            </span>
          </div>

          <div className="flex items-start justify-between px-3.5 py-2.5 text-xs gap-3">
            <span className="text-slate-500 font-medium flex items-center gap-2 shrink-0">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              Motivo
            </span>
            <span className="font-medium text-slate-700 text-right leading-snug line-clamp-2 max-w-55">
              {data.reason}
            </span>
          </div>
        </div>

        {/* Botones de Acción Estilo iOS */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={handleGoToAppointments}
            className="w-full py-2.5 px-4 bg-[#2B7A78] hover:bg-[#236866] active:scale-[0.98] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <CalendarDays className="w-4 h-4" />
            <span>Ver Mis Citas</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={onReset}
            className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200/80 active:scale-[0.98] text-slate-700 text-xs sm:text-sm font-semibold rounded-xl border border-slate-200/70 transition-all cursor-pointer"
          >
            Agendar Otra Cita
          </button>
        </div>
      </div>
    </div>
  );
};

export default CitaConfirmadaCard;