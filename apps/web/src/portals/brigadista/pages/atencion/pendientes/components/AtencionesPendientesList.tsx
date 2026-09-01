// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/atencion/pendientes/components/AtencionesPendientesList.tsx
// DESCRIPCIÓN: Renderizado categorizado de atenciones por completar y por sincronizar.
// =========================================================================

import React from 'react';
import { Clock, RefreshCw } from 'lucide-react';
import type { PendingAttentionItem } from '../../../../../../modules/atencion';
import { AtencionPendienteCard } from './AtencionPendienteCard';
import { AtencionSincronizacionCard } from './AtencionSincronizacionCard';
import { AtencionesPendientesEmpty } from './AtencionesPendientesEmpty';

interface AtencionesPendientesListProps {
  incompleteItems: PendingAttentionItem[];
  pendingSyncItems: PendingAttentionItem[];
  loading: boolean;
  isOnline: boolean;
  syncingId: string | null;
  onRetrySync: (id: string) => void;
  onOpenDetail: (item: PendingAttentionItem) => void;
  onDeleteDraft: (id: string) => void;
}

export const AtencionesPendientesList: React.FC<AtencionesPendientesListProps> = ({
  incompleteItems,
  pendingSyncItems,
  loading,
  isOnline,
  syncingId,
  onRetrySync,
  onOpenDetail,
  onDeleteDraft,
}) => {
  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-6 w-48 bg-slate-200 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-48 bg-slate-200 rounded-2xl" />
          <div className="h-48 bg-slate-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  const totalItems = incompleteItems.length + pendingSyncItems.length;
  if (totalItems === 0) {
    return <AtencionesPendientesEmpty />;
  }

  return (
    <div className="space-y-8">
      {/* SECCIÓN A: ATENCIONES POR COMPLETAR */}
      {incompleteItems.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <Clock className="w-4 h-4 text-amber-600" />
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
              Atenciones por Completar ({incompleteItems.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {incompleteItems.map((item) => (
              <AtencionPendienteCard
                key={item.id}
                attention={item}
                onOpenDetail={onOpenDetail}
                onDeleteDraft={onDeleteDraft}
              />
            ))}
          </div>
        </div>
      )}

      {/* SECCIÓN B: ATENCIONES PENDIENTES DE SINCRONIZACIÓN */}
      {pendingSyncItems.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <RefreshCw className="w-4 h-4 text-teal-600" />
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
              Atenciones Pendientes de Sincronización ({pendingSyncItems.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingSyncItems.map((item) => (
              <AtencionSincronizacionCard
                key={item.id}
                attention={item}
                isOnline={isOnline}
                isSyncing={syncingId === item.id}
                onRetrySync={onRetrySync}
                onOpenDetail={onOpenDetail}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};