import React from 'react';
import { useBrigade } from '@modules/brigades/hooks/useBrigade';
import type { SystemSyncState } from '@modules/brigades/types/brigade.types';

export const SystemStatusBadge: React.FC = () => {
  const { syncStatus } = useBrigade();

  const statusConfig: Record<SystemSyncState, { label: string; color: string; dot: string }> = {
    ONLINE: {
      label: 'En línea (Sincronizado)',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20',
      dot: 'bg-emerald-500',
    },
    OFFLINE: {
      label: 'Modo Offline',
      color: 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20',
      dot: 'bg-amber-500',
    },
    SYNCING: {
      label: 'Sincronizando...',
      color: 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/20',
      dot: 'bg-blue-500 animate-pulse',
    },
    SYNCED: {
      label: 'En línea (Sincronizado)',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20',
      dot: 'bg-emerald-500',
    },
    ERROR: {
      label: 'Error de Sincronización',
      color: 'bg-red-50 text-red-700 border-red-200 ring-red-500/20',
      dot: 'bg-red-500',
    },
  };

  const current = statusConfig[syncStatus] || statusConfig.ONLINE;

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-full border ring-1 ${current.color}`}
    >
      <span className={`w-2 h-2 rounded-full ${current.dot}`} />
      <span>{current.label}</span>
    </div>
  );
};