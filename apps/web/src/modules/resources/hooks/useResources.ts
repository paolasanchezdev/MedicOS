// apps/web/src/modules/resources/hooks/useResources.ts
import { useState, useEffect, useCallback } from 'react';
import { resourcesService } from '../services/resources.service';
import type {
  ResourceWithMetrics,
  ResourceFilters,
  CreateResourceDto,
  CreateResourceStockDto,
} from '../types/resource.types';

export function useResources(initialFilters?: ResourceFilters) {
  const [resources, setResources] = useState<ResourceWithMetrics[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ResourceFilters>(
    initialFilters || { search: '', category: 'ALL', stockStatus: 'ALL' }
  );
  const [reloadKey, setReloadKey] = useState<number>(0);

  const refetch = useCallback(() => {
    setReloadKey((prev) => prev + 1);
  }, []);

  useEffect(() => {
    let isMounted = true;

    resourcesService
      .getResources(filters)
      .then((data) => {
        if (isMounted) {
          setResources(data);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Error al cargar recursos.');
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

  const createResource = async (dto: CreateResourceDto) => {
    setIsLoading(true);
    try {
      const created = await resourcesService.createResource(dto);
      refetch();
      return created;
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  };

  const updateResource = async (id: string, dto: Partial<CreateResourceDto>) => {
    setIsLoading(true);
    try {
      const updated = await resourcesService.updateResource(id, dto);
      refetch();
      return updated;
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  };

  const deleteResource = async (id: string) => {
    setIsLoading(true);
    try {
      await resourcesService.deleteResource(id);
      refetch();
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  };

  const createStock = async (dto: CreateResourceStockDto) => {
    setIsLoading(true);
    try {
      const stock = await resourcesService.createStock(dto);
      refetch();
      return stock;
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  };

  const handleFilterChange = (newFilters: Partial<ResourceFilters>) => {
    setIsLoading(true);
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setIsLoading(true);
    setFilters({ search: '', category: 'ALL', stockStatus: 'ALL' });
  };

  return {
    resources,
    isLoading,
    error,
    filters,
    handleFilterChange,
    handleResetFilters,
    refetch,
    createResource,
    updateResource,
    deleteResource,
    createStock,
  };
}