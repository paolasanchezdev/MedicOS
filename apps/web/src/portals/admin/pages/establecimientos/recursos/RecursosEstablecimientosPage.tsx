// apps/web/src/portals/admin/pages/establecimientos/recursos/RecursosEstablecimientosPage.tsx
import React, { useState, useMemo } from 'react';
import {
  useHospitals,
  UpdateEstablishmentResourceModal,
  type EstablishmentResourceData,
} from '../../../../../modules/establishments';
import { RecursosMetrics } from './components/RecursosMetrics';
import { RecursosFilters } from './components/RecursosFilters';
import { RecursosTable } from './components/RecursosTable';

export const RecursosEstablecimientosPage: React.FC = () => {
  const { hospitals: establishments, loading, error } = useHospitals({
    type: undefined,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [stockStatusFilter, setStockStatusFilter] = useState('ALL');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [editingResource, setEditingResource] = useState<EstablishmentResourceData | null>(null);
  const [customResources, setCustomResources] = useState<Record<string, Partial<EstablishmentResourceData>>>({});

  const resourceDataList = useMemo<EstablishmentResourceData[]>(() => {
    return establishments.map((est) => {
      const overrides = customResources[est.id] || {};
      
      const isHospital = est.type === 'HOSPITAL';
      const isHealthCenter = est.type === 'HEALTH_CENTER';

      const defaultAmbulanciasTotales = isHospital ? 4 : isHealthCenter && est.hasEmergency ? 2 : 1;
      const defaultAmbulanciasDisponibles = isHospital ? 3 : isHealthCenter && est.hasEmergency ? 1 : 1;
      const defaultCamasUCI = isHospital && est.level === 'SPECIALIZED' ? 24 : isHospital && est.level === 'REGIONAL' ? 12 : 0;
      const defaultCamasUCILibres = defaultCamasUCI > 0 ? Math.floor(defaultCamasUCI * 0.3) : 0;
      const defaultOxigeno = isHospital ? 60 : isHealthCenter ? 25 : 8;
      const defaultVentiladores = defaultCamasUCI;

      const ambulanciasTotales = overrides.ambulanciasTotales ?? defaultAmbulanciasTotales;
      const ambulanciasDisponibles = overrides.ambulanciasDisponibles ?? defaultAmbulanciasDisponibles;
      const camasUCITotales = overrides.camasUCITotales ?? defaultCamasUCI;
      const camasUCIDisponibles = overrides.camasUCIDisponibles ?? defaultCamasUCILibres;
      const cilindrosOxigeno = overrides.cilindrosOxigeno ?? defaultOxigeno;
      const ventiladoresMecanicos = overrides.ventiladoresMecanicos ?? defaultVentiladores;

      let stockStatus: 'OPTIMAL' | 'MODERATE' | 'CRITICAL' = 'OPTIMAL';
      if (ambulanciasDisponibles === 0 || cilindrosOxigeno < 5) {
        stockStatus = 'CRITICAL';
      } else if (camasUCITotales > 0 && camasUCIDisponibles < 3) {
        stockStatus = 'MODERATE';
      }

      return {
        establishment: est,
        ambulanciasTotales,
        ambulanciasDisponibles,
        camasUCITotales,
        camasUCIDisponibles,
        cilindrosOxigeno,
        ventiladoresMecanicos,
        stockStatus,
      };
    });
  }, [establishments, customResources]);

  const metrics = useMemo(() => {
    return {
      totalAmbulancias: resourceDataList.reduce((acc, r) => acc + r.ambulanciasTotales, 0),
      ambulanciasDisponibles: resourceDataList.reduce((acc, r) => acc + r.ambulanciasDisponibles, 0),
      totalCamasUCI: resourceDataList.reduce((acc, r) => acc + r.camasUCITotales, 0),
      camasUCIDisponibles: resourceDataList.reduce((acc, r) => acc + r.camasUCIDisponibles, 0),
      tanquesOxigenoTotal: resourceDataList.reduce((acc, r) => acc + r.cilindrosOxigeno, 0),
      centrosEnAlertaCritica: resourceDataList.filter((r) => r.stockStatus === 'CRITICAL').length,
    };
  }, [resourceDataList]);

  const filteredResources = useMemo(() => {
    return resourceDataList.filter((item) => {
      const q = searchTerm.toLowerCase();
      const est = item.establishment;

      const matchesSearch =
        est.name.toLowerCase().includes(q) ||
        est.code.toLowerCase().includes(q) ||
        est.municipality.toLowerCase().includes(q) ||
        est.department.toLowerCase().includes(q);

      const matchesType = typeFilter === 'ALL' || est.type === typeFilter;
      const matchesStatus = stockStatusFilter === 'ALL' || item.stockStatus === stockStatusFilter;
      const matchesDepartment = departmentFilter === 'ALL' || est.department.toLowerCase() === departmentFilter.toLowerCase();

      return matchesSearch && matchesType && matchesStatus && matchesDepartment;
    });
  }, [resourceDataList, searchTerm, typeFilter, stockStatusFilter, departmentFilter]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setTypeFilter('ALL');
    setStockStatusFilter('ALL');
    setDepartmentFilter('ALL');
  };

  const handleSaveResource = (updated: EstablishmentResourceData) => {
    setCustomResources((prev) => ({
      ...prev,
      [updated.establishment.id]: {
        ambulanciasTotales: updated.ambulanciasTotales,
        ambulanciasDisponibles: updated.ambulanciasDisponibles,
        camasUCITotales: updated.camasUCITotales,
        camasUCIDisponibles: updated.camasUCIDisponibles,
        cilindrosOxigeno: updated.cilindrosOxigeno,
        ventiladoresMecanicos: updated.ventiladoresMecanicos,
      },
    }));
    setEditingResource(null);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1700px] mx-auto">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Control de Recursos de Establecimientos
          </h1>
          <p className="text-sm text-slate-500">
            Monitoreo en tiempo real de insumos críticos, ambulancias, oxígeno y camas UCI por establecimiento.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm flex items-center justify-between">
          <span>{error}</span>
        </div>
      )}

      {/* 1. Métricas */}
      <RecursosMetrics metrics={metrics} />

      {/* 2. Filtros */}
      <RecursosFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        stockStatusFilter={stockStatusFilter}
        onStockStatusFilterChange={setStockStatusFilter}
        departmentFilter={departmentFilter}
        onDepartmentFilterChange={setDepartmentFilter}
        onResetFilters={handleResetFilters}
      />

      {/* 3. Tabla */}
      {loading ? (
        <div className="bg-white p-12 rounded-xl shadow-xs border border-slate-200 text-center text-slate-400">
          Cargando inventario de recursos de la red...
        </div>
      ) : (
        <RecursosTable
          resources={filteredResources}
          onUpdateResource={(item) => setEditingResource(item)}
        />
      )}

      {/* 4. Modal Modular de Recursos */}
      {editingResource && (
        <UpdateEstablishmentResourceModal
          item={editingResource}
          onClose={() => setEditingResource(null)}
          onSave={handleSaveResource}
        />
      )}
    </div>
  );
};