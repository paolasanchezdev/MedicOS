// apps/web/src/portals/admin/pages/recursos/equipos/EquiposMedicosPage.tsx
import React, { useState, useMemo } from 'react';
import { EquiposHeader } from './components/EquiposHeader';
import { EquiposMetrics, type EquiposMetricsData } from './components/EquiposMetrics';
import { EquiposFilters } from './components/EquiposFilters';
import { EquiposTable } from './components/EquiposTable';
import {
  useMedicalEquipment,
  CreateEquipmentModal,
  EquipmentMaintenanceModal,
  DeleteEquipmentModal,
} from '../../../../../modules/resources';
import type {
  MedicalEquipment,
  CreateMedicalEquipmentDto,
  EquipmentStatus,
} from '../../../../../modules/resources';

export const EquiposMedicosPage: React.FC = () => {
  const {
    equipments,
    isLoading,
    filters,
    handleFilterChange,
    handleResetFilters,
    createEquipment,
    updateEquipment,
    updateEquipmentStatus,
    deleteEquipment,
  } = useMedicalEquipment();

  // Estados de Modales
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [equipmentToEdit, setEquipmentToEdit] = useState<MedicalEquipment | null>(null);

  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [equipmentForMaintenance, setEquipmentForMaintenance] = useState<MedicalEquipment | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [equipmentToDelete, setEquipmentToDelete] = useState<MedicalEquipment | null>(null);

  // Métricas calculadas
  const metrics: EquiposMetricsData = useMemo(() => {
    const totalEquipment = equipments.length;
    const operationalCount = equipments.filter((e) => e.status === 'OPERATIONAL').length;
    const maintenanceCount = equipments.filter((e) => e.status === 'IN_MAINTENANCE').length;
    const damagedCount = equipments.filter(
      (e) => e.status === 'DAMAGED' || e.status === 'DECOMMISSIONED'
    ).length;

    return {
      totalEquipment,
      operationalCount,
      maintenanceCount,
      damagedCount,
    };
  }, [equipments]);

  // Handlers
  const handleOpenCreate = () => {
    setEquipmentToEdit(null);
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (equipment: MedicalEquipment) => {
    setEquipmentToEdit(equipment);
    setIsCreateModalOpen(true);
  };

  const handleSaveEquipment = async (dto: CreateMedicalEquipmentDto) => {
    if (equipmentToEdit) {
      await updateEquipment(equipmentToEdit.id, dto);
    } else {
      await createEquipment(dto);
    }
  };

  const handleOpenMaintenance = (equipment: MedicalEquipment) => {
    setEquipmentForMaintenance(equipment);
    setIsMaintenanceModalOpen(true);
  };

  const handleSaveStatus = async (id: string, status: EquipmentStatus) => {
    await updateEquipmentStatus(id, status);
  };

  const handleOpenDelete = (equipment: MedicalEquipment) => {
    setEquipmentToDelete(equipment);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (equipmentToDelete) {
      await deleteEquipment(equipmentToDelete.id);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-[1700px] mx-auto">
      {/* Encabezado con acción */}
      <EquiposHeader onNewEquipment={handleOpenCreate} />

      {/* Tarjetas KPI de Estado */}
      <EquiposMetrics metrics={metrics} />

      {/* Barra de Filtros */}
      <EquiposFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Tabla de Equipamiento */}
      <EquiposTable
        equipments={equipments}
        isLoading={isLoading}
        onEdit={handleOpenEdit}
        onMaintenance={handleOpenMaintenance}
        onDelete={handleOpenDelete}
      />

      {/* Modales */}
      <CreateEquipmentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleSaveEquipment}
        equipmentToEdit={equipmentToEdit}
      />

      <EquipmentMaintenanceModal
        isOpen={isMaintenanceModalOpen}
        onClose={() => setIsMaintenanceModalOpen(false)}
        onUpdateStatus={handleSaveStatus}
        equipment={equipmentForMaintenance}
      />

      <DeleteEquipmentModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        equipment={equipmentToDelete}
      />
    </div>
  );
};