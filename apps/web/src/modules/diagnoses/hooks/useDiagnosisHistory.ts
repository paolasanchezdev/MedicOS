// =========================================================================
// ARCHIVO: apps/web/src/modules/diagnoses/hooks/useDiagnosisHistory.ts
// DESCRIPCIÓN: Hook reactivo para consultar y filtrar diagnósticos en memoria.
// =========================================================================

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Diagnosis, DiagnosisFilterStatus } from '../types/diagnosis.types.js';
import { diagnosesService } from '../services/diagnoses.service.js';

export interface YearGroupedDiagnoses {
  year: number;
  items: Diagnosis[];
}

export const useDiagnosisHistory = () => {
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [triggerCount, setTriggerCount] = useState<number>(0);

  // Estados de filtrado interactivo
  const [search, setSearch] = useState<string>('');
  const [status, setStatus] = useState<DiagnosisFilterStatus>('ALL');

  const refetch = useCallback(() => {
    setLoading(true);
    setTriggerCount((prev) => prev + 1);
  }, []);

  useEffect(() => {
    let isMounted = true;

    diagnosesService
      .getMyDiagnoses()
      .then((data) => {
        if (!isMounted) return;
        setDiagnoses(data);
        setError(null);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : 'Error al sincronizar tus diagnósticos.');
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [triggerCount]);

  // Filtrado reactivo en memoria
  const filteredDiagnoses = useMemo(() => {
    const query = search.trim().toLowerCase();

    return diagnoses.filter((diag) => {
      // Filtro por estado
      if (status !== 'ALL' && diag.status !== status) {
        return false;
      }

      // Filtro por texto (descripción, código CIE-10, notas o médico)
      if (query) {
        const desc = diag.description.toLowerCase();
        const code = (diag.code ?? '').toLowerCase();
        const notes = (diag.notes ?? '').toLowerCase();
        const doctorName = `${diag.consultation?.doctor?.firstName ?? ''} ${diag.consultation?.doctor?.lastName ?? ''}`.toLowerCase();

        const matches =
          desc.includes(query) ||
          code.includes(query) ||
          notes.includes(query) ||
          doctorName.includes(query);

        if (!matches) return false;
      }

      return true;
    });
  }, [diagnoses, search, status]);

  // Agrupación cronológica por año
  const groupedByYear = useMemo((): YearGroupedDiagnoses[] => {
    const map = new Map<number, Diagnosis[]>();

    filteredDiagnoses.forEach((item) => {
      const year = new Date(item.diagnosedAt).getFullYear();
      if (!map.has(year)) {
        map.set(year, []);
      }
      map.get(year)!.push(item);
    });

    return Array.from(map.entries())
      .sort(([yearA], [yearB]) => yearB - yearA)
      .map(([year, items]) => ({
        year,
        items: items.sort(
          (a, b) => new Date(b.diagnosedAt).getTime() - new Date(a.diagnosedAt).getTime()
        ),
      }));
  }, [filteredDiagnoses]);

  return {
    diagnoses,
    filteredDiagnoses,
    groupedByYear,
    loading,
    error,
    refetch,
    search,
    setSearch,
    status,
    setStatus,
  };
};