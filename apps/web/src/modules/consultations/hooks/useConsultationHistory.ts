// =========================================================================
// ARCHIVO: apps/web/src/modules/consultations/hooks/useConsultationHistory.ts
// DESCRIPCIÓN: Hook para cargar, filtrar por período/texto y agrupar por año
//              las consultas médicas sin mutaciones de estado síncronas en el efecto.
// =========================================================================

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Consultation, ConsultationFilterPeriod } from '../types/consultation.types.js';
import { consultationsService } from '../services/consultations.service.js';

export interface YearGroupedConsultations {
  year: number;
  items: Consultation[];
}

export const useConsultationHistory = () => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [triggerCount, setTriggerCount] = useState<number>(0);

  // Estados de filtrado interactivo
  const [search, setSearch] = useState<string>('');
  const [period, setPeriod] = useState<ConsultationFilterPeriod>('ALL');

  const refetch = useCallback(() => {
    setLoading(true);
    setTriggerCount((prev) => prev + 1);
  }, []);

  useEffect(() => {
    let isMounted = true;

    consultationsService
      .getMyConsultations()
      .then((data) => {
        if (!isMounted) return;
        setConsultations(data);
        setError(null);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : 'Error al sincronizar tu expediente clínico.');
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [triggerCount]);

  // Filtrado reactivo en memoria
  const filteredConsultations = useMemo(() => {
    const now = new Date();
    const query = search.trim().toLowerCase();

    return consultations.filter((item) => {
      const itemDate = new Date(item.consultationDate);

      if (period === '3_MONTHS') {
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(now.getMonth() - 3);
        if (itemDate < threeMonthsAgo) return false;
      } else if (period === '1_YEAR') {
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(now.getFullYear() - 1);
        if (itemDate < oneYearAgo) return false;
      }

      if (query) {
        const doctorName = `${item.doctor?.firstName ?? ''} ${item.doctor?.lastName ?? ''}`.toLowerCase();
        const specialty = (item.doctor?.specialty ?? '').toLowerCase();
        const diagnosis = (item.diagnosisDesc ?? '').toLowerCase();
        const code = (item.diagnosisCode ?? '').toLowerCase();
        const complaint = (item.chiefComplaint ?? '').toLowerCase();

        const matches =
          doctorName.includes(query) ||
          specialty.includes(query) ||
          diagnosis.includes(query) ||
          code.includes(query) ||
          complaint.includes(query);

        if (!matches) return false;
      }

      return true;
    });
  }, [consultations, search, period]);

  // Agrupación cronológica por año para el expediente
  const groupedByYear = useMemo((): YearGroupedConsultations[] => {
    const map = new Map<number, Consultation[]>();

    filteredConsultations.forEach((item) => {
      const year = new Date(item.consultationDate).getFullYear();
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
          (a, b) => new Date(b.consultationDate).getTime() - new Date(a.consultationDate).getTime()
        ),
      }));
  }, [filteredConsultations]);

  return {
    consultations,
    filteredConsultations,
    groupedByYear,
    loading,
    error,
    refetch,
    search,
    setSearch,
    period,
    setPeriod,
  };
};