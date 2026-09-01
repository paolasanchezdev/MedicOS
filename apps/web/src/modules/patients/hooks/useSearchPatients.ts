// =========================================================================
// ARCHIVO: apps/web/src/modules/patients/hooks/useSearchPatients.ts
// DESCRIPCIÓN: Hook reactivo con búsqueda en vivo (Live Search / Debounce) en PostgreSQL
//              cumpliendo las reglas estrictas de ciclo de vida y efectos de React.
// =========================================================================

import { useState, useCallback, useEffect } from 'react';
import { patientsService } from '../services/patients.service';
import type { PatientRecord } from '../types/patient.types';

export function useSearchPatients() {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<PatientRecord[]>([]);
  const [initialPatients, setInitialPatients] = useState<PatientRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [isOffline, setIsOffline] = useState<boolean>(() => !navigator.onLine);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  // 1. Monitor de conectividad de red
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // 2. Carga inicial y refresco desde la base de datos PostgreSQL
  useEffect(() => {
    let isSubscribed = true;

    async function fetchInitial() {
      try {
        const data = await patientsService.getAllPatients();
        if (isSubscribed) {
          setInitialPatients(data);
          setResults(data);
          setError(null);
          setLoading(false);
        }
      } catch (err: unknown) {
        if (isSubscribed) {
          const message = err instanceof Error ? err.message : 'Error al conectar con la base de datos';
          setError(message);
          setLoading(false);
        }
      }
    }

    void fetchInitial();

    return () => {
      isSubscribed = false;
    };
  }, [refreshTrigger]);

  // 3. Búsqueda en vivo automática mientras el brigadista escribe (Debounce 250ms)
  useEffect(() => {
    let isCurrent = true;

    const timer = setTimeout(async () => {
      const cleanQuery = query.trim();

      // Si el campo está vacío, restaurar lista completa
      if (!cleanQuery) {
        if (isCurrent) {
          setResults(initialPatients);
          setHasSearched(false);
          setError(null);
          setLoading(false);
        }
        return;
      }

      if (isCurrent) {
        setLoading(true);
        setError(null);
        setHasSearched(true);
      }

      try {
        const data = await patientsService.searchPatients(cleanQuery);
        if (isCurrent) {
          setResults(data);
          setLoading(false);
        }
      } catch (err: unknown) {
        if (isCurrent) {
          const message = err instanceof Error ? err.message : 'No fue posible completar la búsqueda';
          setError(message);
          setResults([]);
          setLoading(false);
        }
      }
    }, 250);

    return () => {
      isCurrent = false;
      clearTimeout(timer);
    };
  }, [query, initialPatients]);

  // 4. Búsqueda manual inmediata (Enter o botón Buscar)
  const executeSearch = useCallback(async (searchQuery: string) => {
    const clean = searchQuery.trim();
    if (!clean) {
      setResults(initialPatients);
      setHasSearched(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const data = await patientsService.searchPatients(clean);
      setResults(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'No fue posible completar la búsqueda';
      setError(message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [initialPatients]);

  // 5. Limpieza de campo y restauración de padrón
  const clearSearch = useCallback(() => {
    setQuery('');
    setResults(initialPatients);
    setHasSearched(false);
    setError(null);
  }, [initialPatients]);

  const refresh = useCallback(() => {
    setLoading(true);
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    hasSearched,
    isOffline,
    executeSearch,
    clearSearch,
    refresh,
  };
}