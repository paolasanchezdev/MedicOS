// =========================================================================
// ARCHIVO: apps/web/src/modules/evaluations/hooks/useEvaluations.ts
// DESCRIPCIÓN: Hook React para interactuar con el dominio de evaluaciones.
// =========================================================================

import { useState, useCallback } from 'react';
import { evaluationsService } from '../services/evaluations.service';
import type {
  CommunityEvaluationRecord,
  CreateCommunityEvaluationDTO,
} from '../types/evaluation.types';

export function useEvaluations(patientId?: string) {
  const [evaluations, setEvaluations] = useState<CommunityEvaluationRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvaluations = useCallback(async (targetPatientId?: string) => {
    const id = targetPatientId || patientId;
    if (!id) return;

    setLoading(true);
    setError(null);
    try {
      const data = await evaluationsService.getEvaluationsByPatient(id);
      setEvaluations(data);
    } catch (err) {
      setError((err as Error).message || 'No fue posible cargar las evaluaciones del paciente.');
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  const submitEvaluation = async (dto: CreateCommunityEvaluationDTO) => {
    setLoading(true);
    setError(null);
    try {
      const result = await evaluationsService.createEvaluation(dto);
      setEvaluations((prev) => [result, ...prev]);
      return result;
    } catch (err) {
      const msg = (err as Error).message || 'Error al registrar la evaluación comunitaria.';
      setError(msg);
      throw new Error(msg, { cause: err });
    } finally {
      setLoading(false);
    }
  };

  return {
    evaluations,
    loading,
    error,
    fetchEvaluations,
    submitEvaluation,
  };
}