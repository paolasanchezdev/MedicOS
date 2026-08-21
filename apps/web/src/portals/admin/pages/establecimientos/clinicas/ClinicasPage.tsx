// apps/web/src/portals/admin/pages/establecimientos/clinicas/ClinicasPage.tsx
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
import { ClinicMetrics } from './components/ClinicMetrics';
import { ClinicFilters } from './components/ClinicFilters';
import { ClinicTable } from './components/ClinicTable';
import { ClinicMap } from './components/ClinicMap';

export const ClinicasPage: React.FC = () => {
  const {
    hospitals: clinics,
    loading,
    error,
    selectedHospitalId: selectedClinicId,
    setSelectedHospitalId: setSelectedClinicId,
    createHospital: createClinic,
    updateHospital: updateClinic,
    updateStatus,
  } = useHospitals({ type: 'CLINIC' });

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');

  // Modales modulares centralizados
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewingClinic, setViewingClinic] = useState<Establishment | null>(null);
  const [editingClinic, setEditingClinic] = useState<Establishment | null>(null);
  const [deletingClinic, setDeletingClinic] = useState<Establishment | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const metrics = useMemo(() => {
    const total = clinics.length;
    const operativas = clinics.filter((c) => c.status === 'OPERATIONAL').length;
    const departamentosCubiertos = new Set(clinics.map((c) => c.department)).size;
    const nivelBasico = clinics.filter((c) => c.level === 'BASIC').length;

    return {
      total,
      operativas,
      departamentosCubiertos,
      nivelBasico,
    };
  }, [clinics]);

  const filteredClinics = useMemo(() => {
    return clinics.filter((clinic) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        clinic.name.toLowerCase().includes(q) ||
        clinic.code.toLowerCase().includes(q) ||
        clinic.municipality.toLowerCase().includes(q) ||
        clinic.department.toLowerCase().includes(q) ||
        clinic.address.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === 'ALL' || clinic.status === statusFilter;

      const matchesDepartment =
        departmentFilter === 'ALL' ||
        clinic.department.toLowerCase() === departmentFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesDepartment;
    });
  }, [clinics, searchTerm, statusFilter, departmentFilter]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('ALL');
    setDepartmentFilter('ALL');
  };

  // 1. Crear
  const handleCreateClinic = async (input: CreateEstablishmentInput) => {
    setActionLoading(true);
    try {
      await createClinic({
        ...input,
        type: 'CLINIC',
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
      await updateClinic(payload);
      setEditingClinic(null);
    } finally {
      setActionLoading(false);
    }
  };

  // 3. Dar de baja
  const handleConfirmDelete = async () => {
    if (!deletingClinic) return;

    setActionLoading(true);
    try {
      await updateStatus(deletingClinic.id, 'INACTIVE' as EstablishmentStatus);
      if (selectedClinicId === deletingClinic.id) {
        setSelectedClinicId(undefined);
      }
      setDeletingClinic(null);
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
            Gestión de Clínicas Comunales
          </h1>
          <p className="text-sm text-slate-500">
            Directorio y monitoreo operativo de la red de Clínicas Comunales del ISSS en El Salvador.
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
          Nueva Clínica
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm flex items-center justify-between">
          <span>{error}</span>
        </div>
      )}

      {/* 1. Métricas */}
      <ClinicMetrics metrics={metrics} />

      {/* 2. Filtros */}
      <ClinicFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        departmentFilter={departmentFilter}
        onDepartmentFilterChange={setDepartmentFilter}
        onResetFilters={handleResetFilters}
      />

      {/* 3. Mapa Geoespacial de Clínicas */}
      <ClinicMap
        clinics={filteredClinics}
        selectedClinicId={selectedClinicId}
        onSelectClinic={(c) => setSelectedClinicId(c.id)}
      />

      {/* 4. Tabla de Clínicas */}
      {loading ? (
        <div className="bg-white p-12 rounded-xl shadow-xs border border-slate-200 text-center text-slate-400">
          Cargando catálogo de Clínicas Comunales...
        </div>
      ) : (
        <ClinicTable
          clinics={filteredClinics}
          onViewDetail={(c) => setViewingClinic(c)}
          onEdit={(c) => setEditingClinic(c)}
          onDelete={(c) => setDeletingClinic(c)}
        />
      )}

      {/* 5. Modal Crear */}
      <CreateEstablishmentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateClinic}
        defaultType="CLINIC"
        loading={actionLoading}
      />

      {/* 6. Modal Ver Detalle */}
      {viewingClinic && (
        <EstablishmentDetailModal
          establishment={viewingClinic}
          onClose={() => setViewingClinic(null)}
        />
      )}

      {/* 7. Modal Editar */}
      {editingClinic && (
        <EditEstablishmentModal
          establishment={editingClinic}
          onClose={() => setEditingClinic(null)}
          onSave={handleSaveEdit}
          loading={actionLoading}
        />
      )}

      {/* 8. Modal Dar de Baja */}
      {deletingClinic && (
        <DeleteEstablishmentModal
          establishment={deletingClinic}
          onClose={() => setDeletingClinic(null)}
          onConfirm={handleConfirmDelete}
          loading={actionLoading}
        />
      )}
    </div>
  );
};