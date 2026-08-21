// apps/web/src/portals/admin/pages/establecimientos/hospitales/HospitalesPage.tsx
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
import { HospitalMetrics } from './components/HospitalMetrics';
import { HospitalFilters } from './components/HospitalFilters';
import { HospitalTable } from './components/HospitalTable';
import { HospitalMap } from './components/HospitalMap';

export const HospitalesPage: React.FC = () => {
  const {
    hospitals,
    loading,
    error,
    metrics,
    selectedHospitalId,
    setSelectedHospitalId,
    createHospital,
    updateHospital,
    updateStatus,
  } = useHospitals({ type: 'HOSPITAL' });

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [regionFilter, setRegionFilter] = useState('ALL');

  // Estados de control de modales modulares
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewingHospital, setViewingHospital] = useState<Establishment | null>(null);
  const [editingHospital, setEditingHospital] = useState<Establishment | null>(null);
  const [deletingHospital, setDeletingHospital] = useState<Establishment | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Filtrado reactivo en tiempo real
  const filteredHospitals = useMemo(() => {
    return hospitals.filter((hospital) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        hospital.name.toLowerCase().includes(q) ||
        hospital.code.toLowerCase().includes(q) ||
        hospital.municipality.toLowerCase().includes(q) ||
        hospital.department.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === 'ALL' || hospital.status === statusFilter;

      const matchesDepartment =
        regionFilter === 'ALL' ||
        hospital.department.toLowerCase() === regionFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesDepartment;
    });
  }, [hospitals, searchTerm, statusFilter, regionFilter]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('ALL');
    setRegionFilter('ALL');
  };

  // 1. Crear Hospital
  const handleCreateHospital = async (input: CreateEstablishmentInput) => {
    setActionLoading(true);
    try {
      await createHospital({
        ...input,
        type: 'HOSPITAL',
      });
      setIsCreateModalOpen(false);
    } finally {
      setActionLoading(false);
    }
  };

  // 2. Guardar Edición
  const handleSaveEdit = async (payload: UpdateEstablishmentInput) => {
    setActionLoading(true);
    try {
      await updateHospital(payload);
      setEditingHospital(null);
    } finally {
      setActionLoading(false);
    }
  };

  // 3. Confirmar Baja / Inactivación
  const handleConfirmDelete = async () => {
    if (!deletingHospital) return;

    setActionLoading(true);
    try {
      await updateStatus(deletingHospital.id, 'INACTIVE' as EstablishmentStatus);
      if (selectedHospitalId === deletingHospital.id) {
        setSelectedHospitalId(undefined);
      }
      setDeletingHospital(null);
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
            Gestión de Hospitales
          </h1>
          <p className="text-sm text-slate-500">
            Administración de la red hospitalaria nacional de El Salvador y monitoreo geoespacial.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Hospital
        </button>
      </div>

      {/* Manejo de estados de error */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm flex items-center justify-between">
          <span>{error}</span>
        </div>
      )}

      {/* Métricas */}
      <HospitalMetrics metrics={metrics} />

      {/* Filtros */}
      <HospitalFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        regionFilter={regionFilter}
        onRegionFilterChange={setRegionFilter}
        onResetFilters={handleResetFilters}
      />

      {/* Mapa Geoespacial */}
      <HospitalMap
        hospitals={filteredHospitals}
        selectedHospitalId={selectedHospitalId}
        onSelectHospital={(h) => setSelectedHospitalId(h.id)}
      />

      {/* Tabla de Establecimientos */}
      {loading ? (
        <div className="bg-white p-12 rounded-xl shadow-xs border border-slate-200 text-center text-slate-400">
          Cargando datos de la red hospitalaria...
        </div>
      ) : (
        <HospitalTable
          hospitals={filteredHospitals}
          onViewDetail={(h) => setViewingHospital(h)}
          onEdit={(h) => setEditingHospital(h)}
          onDelete={(id) => {
            const target = hospitals.find((h) => h.id === id);
            if (target) setDeletingHospital(target);
          }}
        />
      )}

      {/* Modal Modular de Creación */}
      <CreateEstablishmentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateHospital}
        defaultType="HOSPITAL"
        loading={actionLoading}
      />

      {/* Modal Modular de Detalle */}
      {viewingHospital && (
        <EstablishmentDetailModal
          establishment={viewingHospital}
          onClose={() => setViewingHospital(null)}
        />
      )}

      {/* Modal Modular de Edición */}
      {editingHospital && (
        <EditEstablishmentModal
          establishment={editingHospital}
          onClose={() => setEditingHospital(null)}
          onSave={handleSaveEdit}
          loading={actionLoading}
        />
      )}

      {/* Modal Modular de Eliminación / Baja */}
      {deletingHospital && (
        <DeleteEstablishmentModal
          establishment={deletingHospital}
          onClose={() => setDeletingHospital(null)}
          onConfirm={handleConfirmDelete}
          loading={actionLoading}
        />
      )}
    </div>
  );
};