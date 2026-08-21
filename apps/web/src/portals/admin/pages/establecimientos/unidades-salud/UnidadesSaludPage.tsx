// apps/web/src/portals/admin/pages/establecimientos/unidades-salud/UnidadesSaludPage.tsx
import React, { useState, useMemo } from 'react';
import {
  useHospitals,
  CreateEstablishmentModal,
  EditEstablishmentModal,
  EstablishmentDetailModal,
  DeleteEstablishmentModal,
} from '../../../../../modules/establishments';
import type {
  Establishment,
  CreateEstablishmentInput,
  UpdateEstablishmentInput,
  EstablishmentStatus,
} from '../../../../../modules/establishments/types/establishment.types';
import { HealthUnitMetrics } from './components/HealthUnitMetrics';
import { HealthUnitFilters } from './components/HealthUnitFilters';
import { HealthUnitTable } from './components/HealthUnitTable';
import { HealthUnitMap } from './components/HealthUnitMap';

export const UnidadesSaludPage: React.FC = () => {
  const {
    hospitals: healthUnits,
    loading,
    error,
    selectedHospitalId: selectedUnitId,
    setSelectedHospitalId: setSelectedUnitId,
    createHospital: createUnit,
    updateHospital: updateUnit,
    updateStatus,
  } = useHospitals({ type: 'HEALTH_CENTER' });

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');

  // Modales modulares centralizados
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewingUnit, setViewingUnit] = useState<Establishment | null>(null);
  const [editingUnit, setEditingUnit] = useState<Establishment | null>(null);
  const [deletingUnit, setDeletingUnit] = useState<Establishment | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const metrics = useMemo(() => {
    const total = healthUnits.length;
    const operativas = healthUnits.filter((u) => u.status === 'OPERATIONAL').length;
    const departamentosCubiertos = new Set(healthUnits.map((u) => u.department)).size;
    const conEmergencia = healthUnits.filter((u) => u.hasEmergency).length;

    return {
      total,
      operativas,
      departamentosCubiertos,
      conEmergencia,
    };
  }, [healthUnits]);

  const filteredHealthUnits = useMemo(() => {
    return healthUnits.filter((unit) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        unit.name.toLowerCase().includes(q) ||
        unit.code.toLowerCase().includes(q) ||
        unit.municipality.toLowerCase().includes(q) ||
        unit.department.toLowerCase().includes(q) ||
        unit.address.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === 'ALL' || unit.status === statusFilter;

      const matchesDepartment =
        departmentFilter === 'ALL' ||
        unit.department.toLowerCase() === departmentFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesDepartment;
    });
  }, [healthUnits, searchTerm, statusFilter, departmentFilter]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('ALL');
    setDepartmentFilter('ALL');
  };

  // 1. Crear
  const handleCreateUnit = async (input: CreateEstablishmentInput) => {
    setActionLoading(true);
    try {
      await createUnit({
        ...input,
        type: 'HEALTH_CENTER',
        totalBeds: 0,
        availableBeds: 0,
      });
      setIsCreateModalOpen(false);
    } finally {
      setActionLoading(false);
    }
  };

  // 2. Editar
  const handleSaveEdit = async (payload: UpdateEstablishmentInput) => {
    setActionLoading(true);
    try {
      await updateUnit(payload);
      setEditingUnit(null);
    } finally {
      setActionLoading(false);
    }
  };

  // 3. Dar de baja
  const handleConfirmDelete = async () => {
    if (!deletingUnit) return;

    setActionLoading(true);
    try {
      await updateStatus(deletingUnit.id, 'INACTIVE' as EstablishmentStatus);
      if (selectedUnitId === deletingUnit.id) {
        setSelectedUnitId(undefined);
      }
      setDeletingUnit(null);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-[1700px] mx-auto">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Gestión de Unidades Médicas
          </h1>
          <p className="text-sm text-slate-500">
            Directorio y monitoreo de las Unidades Médicas del ISSS en El Salvador y servicios de emergencias.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-sm rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Nueva Unidad Médica
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm flex items-center justify-between">
          <span>{error}</span>
        </div>
      )}

      {/* 1. Métricas */}
      <HealthUnitMetrics metrics={metrics} />

      {/* 2. Filtros */}
      <HealthUnitFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        departmentFilter={departmentFilter}
        onDepartmentFilterChange={setDepartmentFilter}
        onResetFilters={handleResetFilters}
      />

      {/* 3. Mapa Geoespacial */}
      <HealthUnitMap
        healthUnits={filteredHealthUnits}
        selectedUnitId={selectedUnitId}
        onSelectUnit={(u) => setSelectedUnitId(u.id)}
      />

      {/* 4. Tabla */}
      {loading ? (
        <div className="bg-white p-12 rounded-xl shadow-xs border border-slate-200 text-center text-slate-400">
          Cargando catálogo de Unidades Médicas...
        </div>
      ) : (
        <HealthUnitTable
          healthUnits={filteredHealthUnits}
          onViewDetail={(u) => setViewingUnit(u)}
          onEdit={(u) => setEditingUnit(u)}
          onDelete={(u) => setDeletingUnit(u)}
        />
      )}

      {/* 5. Modales */}
      <CreateEstablishmentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateUnit}
        defaultType="HEALTH_CENTER"
        loading={actionLoading}
      />

      {viewingUnit && (
        <EstablishmentDetailModal
          establishment={viewingUnit}
          onClose={() => setViewingUnit(null)}
        />
      )}

      {editingUnit && (
        <EditEstablishmentModal
          establishment={editingUnit}
          onClose={() => setEditingUnit(null)}
          onSave={handleSaveEdit}
          loading={actionLoading}
        />
      )}

      {deletingUnit && (
        <DeleteEstablishmentModal
          establishment={deletingUnit}
          onClose={() => setDeletingUnit(null)}
          onConfirm={handleConfirmDelete}
          loading={actionLoading}
        />
      )}
    </div>
  );
};