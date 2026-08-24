// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/citas/agendar/components/CitaConfirmadaCard.tsx
// DESCRIPCIÓN: Tarjeta de éxito y confirmación con los datos de la cita agendada.
// =========================================================================

import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export interface ConfirmedAppointmentData {
  doctorName: string;
  date: string;
  time: string;
  reason: string;
}

interface CitaConfirmadaCardProps {
  data: ConfirmedAppointmentData;
  onReset: () => void;
}

export const CitaConfirmadaCard: React.FC<CitaConfirmadaCardProps> = ({ data, onReset }) => {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-2xs text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
      <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
        <CheckCircle2 size={36} />
      </div>

      <div className="space-y-2">
        <h2 className="text-lg sm:text-xl font-bold text-slate-800">
          ¡Cita Confirmada Exitosamente!
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          Tu cita ha sido agendada en el sistema. El médico la recibirá automáticamente en su agenda del día.
        </p>
      </div>

      <div className="max-w-md mx-auto p-4 bg-slate-50 border border-slate-200 rounded-xl text-left space-y-2.5 text-xs sm:text-sm">
        <div className="flex justify-between border-b border-slate-200/80 pb-2">
          <span className="font-semibold text-slate-500">Médico:</span>
          <strong className="text-slate-800">{data.doctorName}</strong>
        </div>
        <div className="flex justify-between border-b border-slate-200/80 pb-2">
          <span className="font-semibold text-slate-500">Fecha:</span>
          <strong className="text-slate-800">{data.date}</strong>
        </div>
        <div className="flex justify-between border-b border-slate-200/80 pb-2">
          <span className="font-semibold text-slate-500">Hora de Inicio:</span>
          <strong className="text-teal-700 font-mono font-bold">{data.time}</strong>
        </div>
        <div className="flex justify-between pt-1">
          <span className="font-semibold text-slate-500">Motivo:</span>
          <span className="text-slate-700 italic max-w-60 truncate">{data.reason}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="px-6 py-2.5 bg-[#0e7490] hover:bg-[#0891b2] text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md cursor-pointer"
      >
        Agendar Otra Cita
      </button>
    </div>
  );
};