// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/atencion/nueva/components/AtencionEstadoBadge.tsx
// DESCRIPCIÓN: Insignia visual para el estado operativo y de sincronización de la atención.
// =========================================================================

import React from 'react';
import { Clock, CheckCircle2, CloudOff, RefreshCw, AlertTriangle } from 'lucide-react';

export type AtencionEstado =
  | 'EN_PROGRESO'
  | 'GUARDADA'
  | 'PENDIENTE_SYNC'
  | 'SINCRONIZADA'
  | 'ERROR_SYNC';

interface AtencionEstadoBadgeProps {
  estado: AtencionEstado;
  className?: string;
}

export const AtencionEstadoBadge: React.FC<AtencionEstadoBadgeProps> = ({
  estado,
  className = '',
}) => {
  const configMap: Record<
    AtencionEstado,
    { label: string; bg: string; text: string; border: string; icon: React.ReactNode }
  > = {
    EN_PROGRESO: {
      label: 'En progreso',
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200/80',
      icon: <Clock className="w-3 h-3 text-blue-600" />,
    },
    GUARDADA: {
      label: 'Guardada',
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200/80',
      icon: <CheckCircle2 className="w-3 h-3 text-emerald-600" />,
    },
    PENDIENTE_SYNC: {
      label: 'Pendiente de sincronización',
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200/80',
      icon: <CloudOff className="w-3 h-3 text-amber-600" />,
    },
    SINCRONIZADA: {
      label: 'Sincronizada',
      bg: 'bg-teal-50',
      text: 'text-teal-700',
      border: 'border-teal-200/80',
      icon: <RefreshCw className="w-3 h-3 text-teal-600" />,
    },
    ERROR_SYNC: {
      label: 'Error de sincronización',
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200/80',
      icon: <AlertTriangle className="w-3 h-3 text-red-600" />,
    },
  };

  const { label, bg, text, border, icon } = configMap[estado] || configMap.EN_PROGRESO;

  return (
    <span
      className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-bold ${bg} ${text} ${border} ${className}`}
    >
      {icon}
      <span>{label}</span>
    </span>
  );
};