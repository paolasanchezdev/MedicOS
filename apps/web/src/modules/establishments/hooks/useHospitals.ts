// apps/web/src/modules/establishments/hooks/useHospitals.ts
import { useState, useEffect, useCallback, useMemo } from 'react';
import { establishmentsService } from '../services/establishments.service';
import type {
  Establishment,
  EstablishmentFilters,
  CreateEstablishmentInput,
  UpdateEstablishmentInput,
  EstablishmentStatus,
} from '../types/establishment.types';

export interface HospitalMetricsData {
  totalHospitales: number;
  camasTotales: number;
  camasDisponibles: number;
  emergenciasActivas: number;
  hospitalesOperativos: number;
}

export function useHospitals(initialFilters?: EstablishmentFilters) {
  const [hospitals, setHospitals] = useState<Establishment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<EstablishmentFilters>(initialFilters || {});
  const [selectedHospitalId, setSelectedHospitalId] = useState<string | undefined>();

  // Sincronización asíncrona de datos protegida contra efectos en cascada
  useEffect(() => {
    let isCancelled = false;

    const loadHospitals = async () => {
      try {
        const data = await establishmentsService.getHospitals(filters);
        if (!isCancelled) {
          setHospitals(data);
          setError(null);
        }
      } catch (err: unknown) {
        if (!isCancelled) {
          const message = err instanceof Error ? err.message : 'Error al cargar los hospitales';
          setError(message);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    loadHospitals();

    return () => {
      isCancelled = true;
    };
  }, [filters]);

  // Recarga manual disparada por acciones de usuario
  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await establishmentsService.getHospitals(filters);
      setHospitals(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al cargar los hospitales';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const createHospital = useCallback(
    async (input: CreateEstablishmentInput) => {
      try {
        const newHospital = await establishmentsService.createHospital(input);
        setHospitals((prev) => [newHospital, ...prev]);
        return newHospital;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Error al crear el hospital';
        setError(message);
        throw err;
      }
    },
    []
  );

  const updateHospital = useCallback(
    async (input: UpdateEstablishmentInput) => {
      try {
        const updated = await establishmentsService.updateHospital(input);
        setHospitals((prev) => prev.map((h) => (h.id === updated.id ? updated : h)));
        return updated;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Error al actualizar el hospital';
        setError(message);
        throw err;
      }
    },
    []
  );

  const updateStatus = useCallback(
    async (id: string, status: EstablishmentStatus) => {
      try {
        const updated = await establishmentsService.updateHospitalStatus(id, status);
        setHospitals((prev) => prev.map((h) => (h.id === updated.id ? updated : h)));
        return updated;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Error al cambiar estado del hospital';
        setError(message);
        throw err;
      }
    },
    []
  );

  const selectedHospital = useMemo(() => {
    return hospitals.find((h) => h.id === selectedHospitalId);
  }, [hospitals, selectedHospitalId]);

  const metrics = useMemo<HospitalMetricsData>(() => {
    const totalHospitales = hospitals.length;
    const camasTotales = hospitals.reduce((acc, h) => acc + (h.totalBeds || 0), 0);
    const camasDisponibles = hospitals.reduce((acc, h) => acc + (h.availableBeds || 0), 0);
    const emergenciasActivas = hospitals.filter(
      (h) => h.status === 'FULL_CAPACITY' || h.status === 'MAINTENANCE'
    ).length;
    const hospitalesOperativos = hospitals.filter((h) => h.status === 'OPERATIONAL').length;

    return {
      totalHospitales,
      camasTotales,
      camasDisponibles,
      emergenciasActivas,
      hospitalesOperativos,
    };
  }, [hospitals]);

  return {
    hospitals,
    loading,
    error,
    filters,
    setFilters,
    metrics,
    selectedHospitalId,
    setSelectedHospitalId,
    selectedHospital,
    refetch,
    createHospital,
    updateHospital,
    updateStatus,
  };
}