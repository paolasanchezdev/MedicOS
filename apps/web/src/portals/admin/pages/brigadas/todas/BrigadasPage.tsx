// apps/web/src/portals/admin/pages/brigadas/todas/BrigadasPage.tsx
import React, { useState, useMemo } from 'react';
import { BrigadasHeader } from './components/BrigadasHeader';
import { BrigadasMetrics, type BrigadasMetricsData } from './components/BrigadasMetrics';
import { BrigadasFilters } from './components/BrigadasFilters';
import { BrigadasTable } from './components/BrigadasTable';
import {
  useAdminBrigades,
  CreateBrigadeModal,
  AssignLeaderModal,
  BrigadeStatusModal,
  DeleteBrigadeModal,
  type BrigadeItem,
  type CreateBrigadeDto,
} from '../../../../../modules/brigades';

export const BrigadasPage: React.FC = () => {
  const {
    brigades,
    personnel,
    isLoading,
    filters,
    handleFilterChange,
    handleResetFilters,
    createBrigade,
    updateBrigade,
    updateBrigadeStatus,
    assignLeader,
    deleteBrigade,
    refetch,
  } = useAdminBrigades();

  // Estados para modales
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [brigadeToEdit, setBrigadeToEdit] = useState<BrigadeItem | null>(null);

  const [isLeaderModalOpen, setIsLeaderModalOpen] = useState(false);
  const [selectedBrigadeForLeader, setSelectedBrigadeForLeader] = useState<BrigadeItem | null>(null);

  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedBrigadeForStatus, setSelectedBrigadeForStatus] = useState<BrigadeItem | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBrigadeForDelete, setSelectedBrigadeForDelete] = useState<BrigadeItem | null>(null);

  // Métricas calculadas basadas en los registros reales
  const metrics: BrigadasMetricsData = useMemo(() => {
    return {
      total: brigades.length,
      active: brigades.filter((b) => b.status === 'ACTIVE').length,
      planned: brigades.filter((b) => b.status === 'PLANNED').length,
      completed: brigades.filter((b) => b.status === 'COMPLETED').length,
      totalConsultations: brigades.reduce((acc, b) => acc + (b.totalConsultations || 0), 0),
    };
  }, [brigades]);

  // Handlers CRUD
  const handleOpenCreate = () => {
    setBrigadeToEdit(null);
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (brigade: BrigadeItem) => {
    setBrigadeToEdit(brigade);
    setIsCreateModalOpen(true);
  };

  const handleSave = async (dto: CreateBrigadeDto) => {
    if (brigadeToEdit) {
      await updateBrigade(brigadeToEdit.id, dto);
    } else {
      await createBrigade(dto);
    }
  };

  const handleOpenLeader = (brigade: BrigadeItem) => {
    setSelectedBrigadeForLeader(brigade);
    setIsLeaderModalOpen(true);
  };

  const handleOpenStatus = (brigade: BrigadeItem) => {
    setSelectedBrigadeForStatus(brigade);
    setIsStatusModalOpen(true);
  };

  const handleOpenDelete = (brigade: BrigadeItem) => {
    setSelectedBrigadeForDelete(brigade);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedBrigadeForDelete) {
      await deleteBrigade(selectedBrigadeForDelete.id);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-[1700px] mx-auto">
      <BrigadasHeader
        onNewBrigade={handleOpenCreate}
        onRefresh={() => void refetch()}
      />

      <BrigadasMetrics metrics={metrics} />

      <BrigadasFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      <BrigadasTable
        brigades={brigades}
        isLoading={isLoading}
        onEdit={handleOpenEdit}
        onAssignLeader={handleOpenLeader}
        onStatusChange={handleOpenStatus}
        onDelete={handleOpenDelete}
      />

      <CreateBrigadeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleSave}
        brigadeToEdit={brigadeToEdit}
        personnel={personnel}
      />

      <AssignLeaderModal
        isOpen={isLeaderModalOpen}
        onClose={() => setIsLeaderModalOpen(false)}
        onAssign={assignLeader}
        brigade={selectedBrigadeForLeader}
        personnel={personnel}
      />

      <BrigadeStatusModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        onUpdateStatus={updateBrigadeStatus}
        brigade={selectedBrigadeForStatus}
      />

      <DeleteBrigadeModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        brigade={selectedBrigadeForDelete}
      />
    </div>
  );
};

export default BrigadasPage;