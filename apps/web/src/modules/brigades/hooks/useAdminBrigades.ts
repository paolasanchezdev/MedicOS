// apps/web/src/modules/brigades/hooks/useAdminBrigades.ts
import { useState, useEffect, useCallback } from 'react';
import { brigadesApiService } from '../services/brigades.service';
import type {
  BrigadeItem,
  CreateBrigadeDto,
  UpdateBrigadeDto,
  BrigadeStatus,
  EligiblePersonnel,
  BrigadeFiltersState,
} from '../types/brigade.types';

export const useAdminBrigades = () => {
  const [brigades, setBrigades] = useState<BrigadeItem[]>([]);
  const [personnel, setPersonnel] = useState<EligiblePersonnel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<BrigadeFiltersState>({
    search: '',
    department: 'ALL',
    status: 'ALL',
  });

  const fetchBrigades = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [brigadesData, personnelData] = await Promise.all([
        brigadesApiService.getBrigades(filters),
        brigadesApiService.getEligiblePersonnel(),
      ]);
      setBrigades(brigadesData);
      setPersonnel(personnelData);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al cargar las brigadas';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    let active = true;

    const executeFetch = async () => {
      try {
        setError(null);
        const [brigadesData, personnelData] = await Promise.all([
          brigadesApiService.getBrigades(filters),
          brigadesApiService.getEligiblePersonnel(),
        ]);
        if (active) {
          setBrigades(brigadesData);
          setPersonnel(personnelData);
        }
      } catch (err: unknown) {
        if (active) {
          const msg = err instanceof Error ? err.message : 'Error al cargar las brigadas';
          setError(msg);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void executeFetch();

    return () => {
      active = false;
    };
  }, [filters]);

  const handleFilterChange = (key: keyof BrigadeFiltersState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      department: 'ALL',
      status: 'ALL',
    });
  };

  const createBrigade = async (dto: CreateBrigadeDto) => {
    await brigadesApiService.createBrigade(dto);
    await fetchBrigades();
  };

  const updateBrigade = async (id: string, dto: UpdateBrigadeDto) => {
    await brigadesApiService.updateBrigade(id, dto);
    await fetchBrigades();
  };

  const updateBrigadeStatus = async (id: string, status: BrigadeStatus) => {
    await brigadesApiService.updateBrigadeStatus(id, status);
    await fetchBrigades();
  };

  const assignLeader = async (brigadeId: string, leaderId: string | null) => {
    await brigadesApiService.assignLeader(brigadeId, leaderId);
    await fetchBrigades();
  };

  const addMembers = async (brigadeId: string, userIds: string[]) => {
    await brigadesApiService.addMembers(brigadeId, userIds);
    await fetchBrigades();
  };

  const removeMember = async (brigadeId: string, userId: string) => {
    await brigadesApiService.removeMember(brigadeId, userId);
    await fetchBrigades();
  };

  const deleteBrigade = async (id: string) => {
    await brigadesApiService.deleteBrigade(id);
    await fetchBrigades();
  };

  return {
    brigades,
    personnel,
    isLoading,
    error,
    filters,
    handleFilterChange,
    handleResetFilters,
    createBrigade,
    updateBrigade,
    updateBrigadeStatus,
    assignLeader,
    addMembers,
    removeMember,
    deleteBrigade,
    refetch: fetchBrigades,
  };
};