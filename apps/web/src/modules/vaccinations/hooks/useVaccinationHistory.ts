// =========================================================================
// ARCHIVO: apps/web/src/modules/vaccinations/hooks/useVaccinationHistory.ts
// DESCRIPCIÓN: Hook gestor de catálogo, resumen operativo, filtros e historial de vacunación.
// =========================================================================

import { useState, useEffect, useCallback, useMemo } from 'react';
import { vaccinationsService } from '../services/vaccinations.service';
import type {
  VaccineCatalogItem,
  VaccinationRecord,
  VaccinationSummaryDTO,
  VaccinationHistoryFiltersState,
  PendingVaccinationItem,
} from '../types/vaccination.types';

const INITIAL_FILTERS: VaccinationHistoryFiltersState = {
  patientId: '',
  vaccineCode: 'ALL',
  brigadeId: 'ALL',
  startDate: '',
  endDate: '',
  search: '',
  page: 1,
  limit: 20,
};

export function useVaccinationHistory(brigadeId?: string) {
  const [catalog, setCatalog] = useState<VaccineCatalogItem[]>([]);
  const [items, setItems] = useState<VaccinationRecord[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [summary, setSummary] = useState<VaccinationSummaryDTO | null>(null);
  const [pendingQueue, setPendingQueue] = useState<PendingVaccinationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<VaccinationRecord | null>(null);
  const [filters, setFilters] = useState<VaccinationHistoryFiltersState>(INITIAL_FILTERS);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  // 1. Carga inicial del catálogo MINSAL
  useEffect(() => {
    let isSubscribed = true;

    const fetchCatalog = async () => {
      try {
        const cat = await vaccinationsService.getCatalog();
        if (isSubscribed) {
          setCatalog(cat);
        }
      } catch (err) {
        console.error('Error al cargar catálogo de vacunas:', err);
      }
    };

    void fetchCatalog();

    return () => {
      isSubscribed = false;
    };
  }, []);

  // 2. Carga reactiva de registros, resumen operativo y cola local
  useEffect(() => {
    let isSubscribed = true;

    const fetchData = async () => {
      try {
        const [historyRes, summaryRes] = await Promise.all([
          vaccinationsService.getVaccinationsHistory(filters),
          vaccinationsService.getVaccinationSummary(brigadeId),
        ]);

        const localPending = vaccinationsService.getPendingSyncVaccinations();

        if (isSubscribed) {
          setItems(historyRes.items);
          setTotal(historyRes.total);
          setSummary(summaryRes);
          setPendingQueue(localPending);
          setError(null);
        }
      } catch (err) {
        if (isSubscribed) {
          setError((err as Error).message || 'Error al obtener registros de vacunación.');
        }
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    };

    void fetchData();

    return () => {
      isSubscribed = false;
    };
  }, [filters, brigadeId, refreshTrigger]);

  const refresh = useCallback(() => {
    setLoading(true);
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const updateFilters = useCallback((newFilters: Partial<VaccinationHistoryFiltersState>) => {
    setLoading(true);
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: newFilters.page ?? 1,
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

  const retrySync = useCallback(async (id: string) => {
    try {
      await vaccinationsService.retrySyncVaccination(id);
      const updatedQueue = vaccinationsService.getPendingSyncVaccinations();
      setPendingQueue(updatedQueue);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      setError((err as Error).message || 'Error al reintentar sincronización.');
      throw err;
    }
  }, []);

  const deletePending = useCallback((id: string) => {
    vaccinationsService.deletePendingVaccination(id);
    const updatedQueue = vaccinationsService.getPendingSyncVaccinations();
    setPendingQueue(updatedQueue);
  }, []);

  const hasActiveFilters = useMemo(
    () =>
      Boolean(
        filters.search.trim() ||
          filters.startDate ||
          filters.endDate ||
          filters.vaccineCode !== 'ALL' ||
          filters.brigadeId !== 'ALL'
      ),
    [filters]
  );

  return {
    catalog,
    items,
    total,
    summary,
    pendingQueue,
    loading,
    error,
    filters,
    hasActiveFilters,
    selectedRecord,
    setSelectedRecord,
    updateFilters,
    resetFilters,
    setPage,
    refresh,
    retrySync,
    deletePending,
  };
}