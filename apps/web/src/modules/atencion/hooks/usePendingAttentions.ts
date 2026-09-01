// =========================================================================
// ARCHIVO: apps/web/src/modules/atencion/hooks/usePendingAttentions.ts
// DESCRIPCIÓN: Hook gestor de listado, filtrado, estado de red y sincronización de pendientes.
// =========================================================================

import { useState, useEffect, useCallback, useMemo } from 'react';
import { atencionService } from '../services/atencion.service';
import type {
  PendingAttentionItem,
  AttentionFilterStatus,
  AttentionSortOrder,
  PendingAttentionsSummaryCounts,
} from '../types/atencion.types';

export function usePendingAttentions() {
  const [items, setItems] = useState<PendingAttentionItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(() =>
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<AttentionFilterStatus>('ALL');
  const [sortOrder, setSortOrder] = useState<AttentionSortOrder>('RECENT');
  const [refreshIndex, setRefreshIndex] = useState<number>(0);

  // Escucha de conectividad online/offline
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Carga reactiva de atenciones pendientes
  useEffect(() => {
    let isSubscribed = true;

    const fetchPending = async () => {
      try {
        const data = await atencionService.getPendingAttentions();
        if (isSubscribed) {
          setItems(data);
          setError(null);
        }
      } catch (err) {
        if (isSubscribed) {
          setError((err as Error).message || 'No fue posible cargar las atenciones pendientes.');
        }
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    };

    void fetchPending();

    return () => {
      isSubscribed = false;
    };
  }, [refreshIndex]);

  const refresh = useCallback(() => {
    setLoading(true);
    setRefreshIndex((prev) => prev + 1);
  }, []);

  const retrySync = useCallback(
    async (id: string) => {
      if (!isOnline) {
        throw new Error('No es posible sincronizar sin conexión a internet.');
      }

      setSyncingId(id);
      setError(null);

      try {
        await atencionService.retrySyncAttention(id);
        refresh();
      } catch (err) {
        const msg = (err as Error).message || 'Error al intentar sincronizar con el servidor.';
        setError(msg);
        throw err;
      } finally {
        setSyncingId(null);
      }
    },
    [isOnline, refresh]
  );

  const deleteDraft = useCallback(
    async (id: string) => {
      try {
        await atencionService.deleteDraft(id);
        refresh();
      } catch (err) {
        setError((err as Error).message || 'Error al descartar el borrador.');
      }
    },
    [refresh]
  );

  const summaryCounts: PendingAttentionsSummaryCounts = useMemo(() => {
    let totalIncomplete = 0;
    let totalPendingSync = 0;
    let totalSyncError = 0;

    items.forEach((item) => {
      if (item.operationalType === 'INCOMPLETE') {
        totalIncomplete += 1;
      } else if (item.operationalType === 'PENDING_SYNC') {
        if (item.status === 'SYNC_ERROR') {
          totalSyncError += 1;
        } else {
          totalPendingSync += 1;
        }
      }
    });

    return { totalIncomplete, totalPendingSync, totalSyncError };
  }, [items]);

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return items
      .filter((item) => {
        if (q) {
          const nameMatch = item.patient.fullName.toLowerCase().includes(q);
          const duiMatch = (item.patient.dui || '').replace(/\D/g, '').includes(q.replace(/\D/g, ''));
          const reasonMatch = (item.chiefComplaintSummary || '').toLowerCase().includes(q);
          if (!nameMatch && !duiMatch && !reasonMatch) return false;
        }

        if (statusFilter === 'IN_PROGRESS') return item.operationalType === 'INCOMPLETE';
        if (statusFilter === 'PENDING_SYNC')
          return item.operationalType === 'PENDING_SYNC' && item.status !== 'SYNC_ERROR';
        if (statusFilter === 'SYNC_ERROR') return item.status === 'SYNC_ERROR';

        return true;
      })
      .sort((a, b) => {
        if (sortOrder === 'PROGRESS_DESC') {
          const progA = a.stepInfo ? a.stepInfo.currentStep / a.stepInfo.totalSteps : 0;
          const progB = b.stepInfo ? b.stepInfo.currentStep / b.stepInfo.totalSteps : 0;
          return progB - progA;
        }
        if (sortOrder === 'OLDEST') {
          return new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime();
        }
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
  }, [items, searchQuery, statusFilter, sortOrder]);

  const incompleteItems = useMemo(
    () => filteredItems.filter((i) => i.operationalType === 'INCOMPLETE'),
    [filteredItems]
  );

  const pendingSyncItems = useMemo(
    () => filteredItems.filter((i) => i.operationalType === 'PENDING_SYNC'),
    [filteredItems]
  );

  return {
    items: filteredItems,
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
    refresh,
    retrySync,
    deleteDraft,
  };
}