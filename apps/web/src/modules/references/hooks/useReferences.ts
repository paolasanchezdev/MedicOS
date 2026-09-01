// =========================================================================
// ARCHIVO: apps/web/src/modules/references/hooks/useReferences.ts
// DESCRIPCIÓN: Hook React para gestionar el estado y operaciones de Referencias.
// =========================================================================

import { useState, useCallback, useEffect } from 'react';
import { referencesService } from '../services/references.service';
import type {
  CommunityReferenceRecord,
  CreateCommunityReferenceDTO,
  UpdateReferenceStatusDTO,
  ReferenceFilters,
} from '../types/reference.types';

export function useReferences(initialFilters?: ReferenceFilters, autoFetch = true) {
  const [references, setReferences] = useState<CommunityReferenceRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(autoFetch);
  const [error, setError] = useState<string | null>(null);

  const fetchReferences = useCallback(async (customFilters?: ReferenceFilters) => {
    setLoading(true);
    setError(null);
    try {
      const data = await referencesService.getReferences(customFilters || initialFilters);
      setReferences(data);
    } catch (err) {
      setError((err as Error).message || 'No fue posible cargar el listado de referencias.');
    } finally {
      setLoading(false);
    }
  }, [initialFilters]);

  useEffect(() => {
    if (!autoFetch) return;

    let isSubscribed = true;

    const loadReferences = async () => {
      try {
        const data = await referencesService.getReferences(initialFilters);
        if (isSubscribed) {
          setReferences(data);
          setError(null);
        }
      } catch (err) {
        if (isSubscribed) {
          setError((err as Error).message || 'No fue posible cargar las referencias.');
        }
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    };

    loadReferences();

    return () => {
      isSubscribed = false;
    };
  }, [autoFetch, initialFilters]);

  const createReference = async (dto: CreateCommunityReferenceDTO) => {
    setLoading(true);
    setError(null);
    try {
      const newRef = await referencesService.createReference(dto);
      setReferences((prev) => [newRef, ...prev]);
      return newRef;
    } catch (err) {
      const msg = (err as Error).message || 'Error al generar la referencia médica.';
      setError(msg);
      throw new Error(msg, { cause: err });
    } finally {
      setLoading(false);
    }
  };

  const changeStatus = async (dto: UpdateReferenceStatusDTO) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await referencesService.updateReferenceStatus(dto);
      setReferences((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      return updated;
    } catch (err) {
      const msg = (err as Error).message || 'Error al actualizar el estado de la referencia.';
      setError(msg);
      throw new Error(msg, { cause: err });
    } finally {
      setLoading(false);
    }
  };

  return {
    references,
    loading,
    error,
    fetchReferences,
    createReference,
    changeStatus,
  };
}