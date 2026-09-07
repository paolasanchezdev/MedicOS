// =========================================================================
// ARCHIVO: apps/web/src/modules/appointments/components/CitaEstadoBadge.tsx
// DESCRIPCIÓN: Indicador visual centralizado de estados para citas médicas
//              reutilizable en Paciente, Médico y Brigadista.
// =========================================================================

import React from 'react';
import { Check, X, AlertCircle, RefreshCw } from 'lucide-react';
import type { AppointmentStatus } from '../types/appointment.types';

interface CitaEstadoBadgeProps {
  status: AppointmentStatus;
}

export const CitaEstadoBadge: React.FC<CitaEstadoBadgeProps> = ({ status }) => {
  const configs: Record<
    AppointmentStatus,
    { label: string; className: string; icon: React.ReactNode }
  > = {
    PENDING: {
      label: 'Pendiente',
      className: 'bg-amber-50 text-amber-800 border-amber-200/80',
      icon: (
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500" />
        </span>
      ),
    },
    CONFIRMED: {
      label: 'Confirmada',
      className: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
      icon: <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block" />,
    },
    RESCHEDULED: {
      label: 'Reprogramada',
      className: 'bg-cyan-50 text-cyan-800 border-cyan-200/80',
      icon: <RefreshCw className="w-2.5 h-2.5 text-cyan-700 stroke-[2.5]" />,
    },
    COMPLETED: {
      label: 'Atendida',
      className: 'bg-teal-50 text-teal-800 border-teal-200/80',
      icon: <Check className="w-2.5 h-2.5 text-teal-700 stroke-3" />,
    },
    CANCELLED: {
      label: 'Cancelada',
      className: 'bg-rose-50 text-rose-700 border-rose-200/80',
      icon: <X className="w-2.5 h-2.5 text-rose-600 stroke-3" />,
    },
    NO_SHOW: {
      label: 'No asistió',
      className: 'bg-slate-100 text-slate-600 border-slate-200/80',
      icon: <AlertCircle className="w-2.5 h-2.5 text-slate-500 stroke-[2.5]" />,
    },
  };

  const current = configs[status] || configs.PENDING;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border transition-colors ${current.className}`}
    >
      {current.icon}
      <span>{current.label}</span>
    </span>
  );
};

export default CitaEstadoBadge;