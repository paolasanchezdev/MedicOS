// =========================================================================
// ARCHIVO: apps/web/src/modules/visits/hooks/useVisits.ts
// DESCRIPCIÓN: Hook React para gestionar el estado y operaciones de Visitas.
// =========================================================================

import { useState, useCallback, useEffect } from 'react';
import { visitsService } from '../services/visits.service';
import type {
  CommunityVisitRecord,
  CreateCommunityVisitDTO,
  CompleteCommunityVisitDTO,
  VisitFilters,
} from '../types/visit.types';

export function useVisits(initialFilters?: VisitFilters, autoFetch = true) {
  const [visits, setVisits] = useState<CommunityVisitRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(autoFetch);
  const [error, setError] = useState<string | null>(null);

  const fetchVisits = useCallback(async (customFilters?: VisitFilters) => {
    setLoading(true);
    setError(null);
    try {
      const data = await visitsService.getVisits(customFilters || initialFilters);
      setVisits(data);
    } catch (err) {
      setError((err as Error).message || 'No fue posible cargar el listado de visitas.');
    } finally {
      setLoading(false);
    }
  }, [initialFilters]);

  useEffect(() => {
    if (!autoFetch) return;

    let isSubscribed = true;

    const loadVisits = async () => {
      try {
        const data = await visitsService.getVisits(initialFilters);
        if (isSubscribed) {
          setVisits(data);
          setError(null);
        }
      } catch (err) {
        if (isSubscribed) {
          setError((err as Error).message || 'No fue posible cargar el listado de visitas.');
        }
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    };

    loadVisits();

    return () => {
      isSubscribed = false;
    };
  }, [autoFetch, initialFilters]);

  const scheduleVisit = async (dto: CreateCommunityVisitDTO) => {
    setLoading(true);
    setError(null);
    try {
      const newVisit = await visitsService.createVisit(dto);
      setVisits((prev) => [newVisit, ...prev]);
      return newVisit;
    } catch (err) {
      const msg = (err as Error).message || 'Error al programar la visita territorial.';
      setError(msg);
      throw new Error(msg, { cause: err });
    } finally {
      setLoading(false);
    }
  };

  const markVisitCompleted = async (dto: CompleteCommunityVisitDTO) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await visitsService.completeVisit(dto);
      setVisits((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
      return updated;
    } catch (err) {
      const msg = (err as Error).message || 'Error al completar la visita.';
      setError(msg);
      throw new Error(msg, { cause: err });
    } finally {
      setLoading(false);
    }
  };

  return {
    visits,
    loading,
    error,
    fetchVisits,
    scheduleVisit,
    markVisitCompleted,
  };
}