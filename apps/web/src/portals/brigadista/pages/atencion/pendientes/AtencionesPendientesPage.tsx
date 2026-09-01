// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/atencion/pendientes/AtencionesPendientesPage.tsx
// DESCRIPCIÓN: Vista principal de Atenciones Pendientes para el portal brigadista.
// =========================================================================

import React, { useState } from 'react';
import { usePendingAttentions, type PendingAttentionItem } from '../../../../../modules/atencion';
import {
  AtencionesPendientesHeader,
  AtencionesPendientesSummary,
  AtencionesPendientesFilters,
  AtencionesPendientesList,
  AtencionPendienteDetailModal,
} from './components';
import { AlertCircle } from 'lucide-react';

export const AtencionesPendientesPage: React.FC = () => {
  const {
    incompleteItems,
    pendingSyncItems,
    summaryCounts,
    loading,
    error,
    isOnline,
    syncingId,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    sortOrder,
    setSortOrder,
    retrySync,
    deleteDraft,
  } = usePendingAttentions();

  const [selectedAttention, setSelectedAttention] = useState<PendingAttentionItem | null>(null);

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200 max-w-[1700px] mx-auto">
      {/* 1. Cabecera Contextual */}
      <AtencionesPendientesHeader isOnline={isOnline} />

      {/* 2. Mensaje de Alerta / Error */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-semibold flex items-center gap-2.5 shadow-2xs">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 3. Resumen Superior */}
      <AtencionesPendientesSummary counts={summaryCounts} />

      {/* 4. Filtros y Buscador */}
      <AtencionesPendientesFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
      />

      {/* 5. Lista Categorizada */}
      <AtencionesPendientesList
        incompleteItems={incompleteItems}
        pendingSyncItems={pendingSyncItems}
        loading={loading}
        isOnline={isOnline}
        syncingId={syncingId}
        onRetrySync={retrySync}
        onOpenDetail={setSelectedAttention}
        onDeleteDraft={deleteDraft}
      />

      {/* 6. Modal de Resumen Rápido */}
      <AtencionPendienteDetailModal
        attention={selectedAttention}
        isOpen={Boolean(selectedAttention)}
        isOnline={isOnline}
        isSyncing={syncingId === selectedAttention?.id}
        onClose={() => setSelectedAttention(null)}
        onRetrySync={retrySync}
      />
    </div>
  );
};

export default AtencionesPendientesPage;