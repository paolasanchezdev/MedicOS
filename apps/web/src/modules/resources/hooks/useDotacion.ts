// apps/web/src/modules/resources/hooks/useDotacion.ts
import { useState, useEffect, useCallback } from 'react';
import { dotationService } from '../services/dotation.service';
import type {
  BrigadeDotationSummary,
  FullBrigadeDotation,
  DotacionFilters,
  CreateDotationDto,
  LiquidateDotationDto,
} from '../types/resource.types';

export function useDotacion(initialFilters?: DotacionFilters) {
  const [dotations, setDotations] = useState<BrigadeDotationSummary[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<DotacionFilters>(
    initialFilters || { search: '', status: 'ALL', department: 'ALL' }
  );
  const [reloadKey, setReloadKey] = useState<number>(0);

  const refetch = useCallback(() => {
    setReloadKey((prev) => prev + 1);
  }, []);

  useEffect(() => {
    let isMounted = true;

    dotationService
      .getDotations(filters)
      .then((data) => {
        if (isMounted) {
          setDotations(data);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Error al cargar dotaciones de brigadas.');
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

  const getDotationDetails = async (brigadeId: string): Promise<FullBrigadeDotation> => {
    return dotationService.getDotationDetails(brigadeId);
  };

  const createDotation = async (dto: CreateDotationDto) => {
    setIsLoading(true);
    try {
      const result = await dotationService.createDotation(dto);
      refetch();
      return result;
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  };

  const liquidateDotation = async (brigadeId: string, dto: LiquidateDotationDto) => {
    setIsLoading(true);
    try {
      const result = await dotationService.liquidateDotation(brigadeId, dto);
      refetch();
      return result;
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  };

  const handleFilterChange = (newFilters: Partial<DotacionFilters>) => {
    setIsLoading(true);
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setIsLoading(true);
    setFilters({ search: '', status: 'ALL', department: 'ALL' });
  };

  return {
    dotations,
    isLoading,
    error,
    filters,
    handleFilterChange,
    handleResetFilters,
    refetch,
    getDotationDetails,
    createDotation,
    liquidateDotation,
  };
}