// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/atencion/pendientes/components/AtencionPendienteStatusBadge.tsx
// DESCRIPCIÓN: Micro-insignia de estado operativo con pulsación e indicadores semánticos.
// =========================================================================

import React from 'react';
import { RotateCw, AlertTriangle } from 'lucide-react';
import type { AttentionStatus } from '../../../../../../modules/atencion';

interface AtencionPendienteStatusBadgeProps {
  status: AttentionStatus;
  isSyncing?: boolean;
}

export const AtencionPendienteStatusBadge: React.FC<AtencionPendienteStatusBadgeProps> = ({
  status,
  isSyncing = false,
}) => {
  if (isSyncing || status === 'SYNCING') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200/70 shadow-2xs">
        <RotateCw className="w-3 h-3 animate-spin text-sky-600" />
        Sincronizando...
      </span>
    );
  }

  switch (status) {
    case 'IN_PROGRESS':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200/70 shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          En progreso
        </span>
      );

    case 'PENDING_SYNC':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-teal-50 text-teal-800 border border-teal-200/70 shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full border border-teal-600 bg-transparent" />
          Pendiente de sincronización
        </span>
      );

    case 'SYNC_ERROR':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200/70 shadow-2xs">
          <AlertTriangle className="w-3 h-3 text-rose-600" />
          Error de sincronización
        </span>
      );

    case 'COMPLETED':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70 shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Completada
        </span>
      );

    default:
      return null;
  }
};