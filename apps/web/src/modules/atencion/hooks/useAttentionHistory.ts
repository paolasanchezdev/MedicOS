// =========================================================================
// ARCHIVO: apps/web/src/modules/atencion/hooks/useAttentionHistory.ts
// DESCRIPCIÓN: Hook gestor de consulta, métricas, filtros y detalle del historial de atenciones.
// =========================================================================

import { useState, useEffect, useCallback, useMemo } from 'react';
import { atencionService } from '../services/atencion.service';
import type {
  AttentionHistoryItem,
  AttentionHistoryFiltersState,
  AttentionHistorySummaryMetrics,
} from '../types/atencion.types';

const INITIAL_FILTERS: AttentionHistoryFiltersState = {
  search: '',
  startDate: '',
  endDate: '',
  motivoCategoria: 'ALL',
  syncStatus: 'ALL',
  page: 1,
  limit: 20,
};

export function useAttentionHistory() {
  const [items, setItems] = useState<AttentionHistoryItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAttention, setSelectedAttention] = useState<AttentionHistoryItem | null>(null);
  const [filters, setFilters] = useState<AttentionHistoryFiltersState>(INITIAL_FILTERS);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  // Carga reactiva de datos al cambiar filtros o disparar refresh
  useEffect(() => {
    let isMounted = true;

    const fetchHistory = async () => {
      try {
        const response = await atencionService.getAttentionHistory(filters);
        if (isMounted) {
          setItems(response.items);
          setTotal(response.total);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError((err as Error).message || 'Error al obtener el historial de atenciones.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void fetchHistory();

    return () => {
      isMounted = false;
    };
  }, [filters, refreshTrigger]);

  const refresh = useCallback(() => {
    setLoading(true);
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const updateFilters = useCallback((newFilters: Partial<AttentionHistoryFiltersState>) => {
    setLoading(true);
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: newFilters.page ?? 1, // Reiniciar a página 1 si cambia un filtro
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setLoading(true);
    setFilters(INITIAL_FILTERS);
  }, []);

  const setPage = useCallback((newPage: number) => {
    setLoading(true);
    setFilters((prev) => ({ ...prev, page: newPage }));
  }, []);

  // Cálculo de Métricas Resumen
  const metrics: AttentionHistorySummaryMetrics = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);

    let atencionesHoy = 0;
    let isAllSynced = true;

    items.forEach((item) => {
      const itemDate = new Date(item.consultationDate).toISOString().slice(0, 10);
      if (itemDate === today) atencionesHoy += 1;
      if (item.syncStatus !== 'SYNCED') isAllSynced = false;
    });

    const latest = items[0];
    const ultimaAtencion = latest
      ? {
          pacienteNombre: `${latest.patient.firstName} ${latest.patient.lastName}`,
          fecha: latest.consultationDate,
        }
      : null;

    return {
      totalRegistradas: total,
      atencionesHoy,
      ultimaAtencion,
      isAllSynced,
    };
  }, [items, total]);

  const hasActiveFilters = Boolean(
    filters.search.trim() ||
    filters.startDate ||
    filters.endDate ||
    filters.motivoCategoria !== 'ALL' ||
    filters.syncStatus !== 'ALL'
  );

  return {
    items,
    total,
    loading,
    error,
    filters,
    hasActiveFilters,
    metrics,
    selectedAttention,
    setSelectedAttention,
    updateFilters,
    resetFilters,
    setPage,
    refresh,
  };
}