// apps/web/src/modules/resources/hooks/useMedicalEquipment.ts
import { useState, useEffect, useCallback } from 'react';
import { resourcesService } from '../services/resources.service';
import type {
  MedicalEquipment,
  MedicalEquipmentFilters,
  CreateMedicalEquipmentDto,
  EquipmentStatus,
} from '../types/resource.types';

export function useMedicalEquipment(initialFilters?: MedicalEquipmentFilters) {
  const [equipments, setEquipments] = useState<MedicalEquipment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<MedicalEquipmentFilters>(
    initialFilters || { search: '', status: 'ALL' }
  );
  const [reloadKey, setReloadKey] = useState<number>(0);

  const refetch = useCallback(() => {
    setReloadKey((prev) => prev + 1);
  }, []);

  useEffect(() => {
    let isMounted = true;

    resourcesService
      .getEquipments(filters)
      .then((data) => {
        if (isMounted) {
          setEquipments(data);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Error al cargar equipos médicos.');
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [filters, reloadKey]);

  const createEquipment = async (dto: CreateMedicalEquipmentDto) => {
    setIsLoading(true);
    try {
      const created = await resourcesService.createEquipment(dto);
      refetch();
      return created;
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  };

  const updateEquipment = async (id: string, dto: Partial<CreateMedicalEquipmentDto>) => {
    setIsLoading(true);
    try {
      const updated = await resourcesService.updateEquipment(id, dto);
      refetch();
      return updated;
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  };

  const updateEquipmentStatus = async (id: string, status: EquipmentStatus) => {
    setIsLoading(true);
    try {
      const updated = await resourcesService.updateEquipmentStatus(id, status);
      refetch();
      return updated;
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  };

  const deleteEquipment = async (id: string) => {
    setIsLoading(true);
    try {
      await resourcesService.deleteEquipment(id);
      refetch();
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  };

  const handleFilterChange = (newFilters: Partial<MedicalEquipmentFilters>) => {
    setIsLoading(true);
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setIsLoading(true);
    setFilters({ search: '', status: 'ALL' });
  };

  return {
    equipments,
    isLoading,
    error,
    filters,
    handleFilterChange,
    handleResetFilters,
    refetch,
    createEquipment,
    updateEquipment,
    updateEquipmentStatus,
    deleteEquipment,
  };
}