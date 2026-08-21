// apps/web/src/modules/resources/hooks/useDevices.ts
import { useState, useEffect, useCallback } from 'react';
import { devicesService } from '../services/devices.service';
import type {
  DeviceItem,
  DeviceFilters,
  CreateDeviceDto,
  DeviceStatus,
} from '../types/resource.types';

export function useDevices(initialFilters?: DeviceFilters) {
  const [devices, setDevices] = useState<DeviceItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<DeviceFilters>(
    initialFilters || { search: '', status: 'ALL' }
  );
  const [reloadKey, setReloadKey] = useState<number>(0);

  const refetch = useCallback(() => {
    setReloadKey((prev) => prev + 1);
  }, []);

  useEffect(() => {
    let isMounted = true;

    devicesService
      .getDevices(filters)
      .then((data) => {
        if (isMounted) {
          setDevices(data);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Error al cargar dispositivos.');
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

  const createDevice = async (dto: CreateDeviceDto) => {
    setIsLoading(true);
    try {
      const created = await devicesService.createDevice(dto);
      refetch();
      return created;
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  };

  const updateDevice = async (id: string, dto: Partial<CreateDeviceDto>) => {
    setIsLoading(true);
    try {
      const updated = await devicesService.updateDevice(id, dto);
      refetch();
      return updated;
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  };

  const updateDeviceStatus = async (id: string, status: DeviceStatus) => {
    setIsLoading(true);
    try {
      const updated = await devicesService.updateDeviceStatus(id, status);
      refetch();
      return updated;
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  };

  const deleteDevice = async (id: string) => {
    setIsLoading(true);
    try {
      await devicesService.deleteDevice(id);
      refetch();
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  };

  const handleFilterChange = (newFilters: Partial<DeviceFilters>) => {
    setIsLoading(true);
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setIsLoading(true);
    setFilters({ search: '', status: 'ALL' });
  };

  return {
    devices,
    isLoading,
    error,
    filters,
    handleFilterChange,
    handleResetFilters,
    refetch,
    createDevice,
    updateDevice,
    updateDeviceStatus,
    deleteDevice,
  };
}