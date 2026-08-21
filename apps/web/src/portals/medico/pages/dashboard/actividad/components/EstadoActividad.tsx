// =========================================================================
// ARCHIVO: apps/web/src/portals/medico/pages/dashboard/actividad/components/EstadoActividad.tsx
// DESCRIPCIÓN: Chip o badge parametrizado para visualizar estados clínicos y de red.
// =========================================================================

import React from 'react';
import { CheckCircle2, Clock3, AlertCircle, XCircle, Wifi, WifiOff } from 'lucide-react';

interface EstadoActividadProps {
  status: string;
  isOffline?: boolean;
}

export const EstadoActividad: React.FC<EstadoActividadProps> = ({ status, isOffline }) => {
  const getStatusBadge = () => {
    switch (status.toUpperCase()) {
      case 'COMPLETED':
      case 'COMPLETADA':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Completada
          </span>
        );
      case 'IN_PROGRESS':
      case 'EN_PROGRESO':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Clock3 className="w-3 h-3 text-blue-600 animate-pulse" />
            En Progreso
          </span>
        );
      case 'DRAFT':
      case 'BORRADOR':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertCircle className="w-3 h-3 text-amber-600" />
            Borrador
          </span>
        );
      case 'CANCELLED':
      case 'CANCELADA':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3 h-3 text-rose-600" />
            Cancelada
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="flex items-center gap-2">
      {getStatusBadge()}
      {isOffline ? (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200" title="Almacenado localmente (Offline)">
          <WifiOff className="w-3 h-3 text-amber-500" />
          Outbox
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-50 text-slate-400" title="Sincronizado con servidor central">
          <Wifi className="w-3 h-3 text-emerald-500" />
          Sync
        </span>
      )}
    </div>
  );
};