// =========================================================================
// ARCHIVO: apps/web/src/modules/consultations/hooks/useConsultationDetail.ts
// DESCRIPCIÓN: Hook bajo demanda para cargar la ficha clínica completa de una
//              consulta cuando el usuario abre el modal de detalle.
// =========================================================================

import { useState, useEffect, useCallback } from 'react';
import type { Consultation } from '../types/consultation.types.js';
import { consultationsService } from '../services/consultations.service.js';

export const useConsultationDetail = (consultationId: string | null) => {
  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [triggerCount, setTriggerCount] = useState<number>(0);

  const refetch = useCallback(() => {
    if (consultationId) {
      setLoading(true);
      setTriggerCount((prev) => prev + 1);
    }
  }, [consultationId]);

  useEffect(() => {
    if (!consultationId) {
      return;
    }

    let isMounted = true;

    consultationsService
      .getConsultationById(consultationId)
      .then((data) => {
        if (!isMounted) return;
        setConsultation(data);
        setError(null);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : 'No se pudo cargar la consulta clínica.');
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [consultationId, triggerCount]);

  // Si no hay ID seleccionado, exponer valores vacíos limpios derivados
  const activeConsultation = consultationId ? consultation : null;
  const activeError = consultationId ? error : null;

  return {
    consultation: activeConsultation,
    loading,
    error: activeError,
    refetch,
  };
};