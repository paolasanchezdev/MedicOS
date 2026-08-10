import { useState, useEffect, useCallback } from 'react';
import { reportsService } from '../services/reports.service';
import type { EpidemiologicalReport, ReportFilterState } from '../types/reports.types';

export const useReports = () => {
  const [data, setData] = useState<EpidemiologicalReport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filters, setFiltersState] = useState<ReportFilterState>({
    startDate: '',
    endDate: '',
    category: 'ALL',
  });

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const reports = await reportsService.getEpidemiologicalReports(filters);
      setData(reports);
    } catch (error) {
      console.error('Error al obtener reportes:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const setFilters = (newFilters: ReportFilterState) => {
    setLoading(true);
    setFiltersState(newFilters);
  };

  useEffect(() => {
    let ignore = false;

    const loadData = async () => {
      try {
        const reports = await reportsService.getEpidemiologicalReports(filters);
        if (!ignore) {
          setData(reports);
        }
      } catch (error) {
        if (!ignore) {
          console.error('Error al obtener reportes:', error);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      ignore = true;
    };
  }, [filters]);

  const exportData = async () => {
    try {
      await reportsService.exportReports(filters);
    } catch (error) {
      console.error('Error al exportar datos:', error);
    }
  };

  return {
    data,
    loading,
    filters,
    setFilters,
    exportData,
    refetch: fetchReports,
  };
};