// apps/web/src/portals/admin/pages/recursos/tecnologia/DispositivosTecnologicosPage.tsx
import React, { useState, useMemo } from 'react';
import { DispositivosHeader } from './components/DispositivosHeader';
import { DispositivosMetrics, type DispositivosMetricsData } from './components/DispositivosMetrics';
import { DispositivosFilters } from './components/DispositivosFilters';
import { DispositivosTable } from './components/DispositivosTable';
import {
  useDevices,
  CreateDeviceModal,
  DeviceStatusModal,
  DeleteDeviceModal,
} from '../../../../../modules/resources';
import type {
  DeviceItem,
  CreateDeviceDto,
  DeviceStatus,
} from '../../../../../modules/resources';

export const DispositivosTecnologicosPage: React.FC = () => {
  const {
    devices,
    isLoading,
    filters,
    handleFilterChange,
    handleResetFilters,
    createDevice,
    updateDevice,
    updateDeviceStatus,
    deleteDevice,
    refetch,
  } = useDevices();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deviceToEdit, setDeviceToEdit] = useState<DeviceItem | null>(null);

  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [deviceForStatus, setDeviceForStatus] = useState<DeviceItem | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deviceToDelete, setDeviceToDelete] = useState<DeviceItem | null>(null);

  const metrics: DispositivosMetricsData = useMemo(() => {
    const totalDevices = devices.length;
    const onlineCount = devices.filter((d) => d.status === 'ACTIVE').length;
    const offlineFieldCount = devices.filter((d) => d.status === 'OFFLINE').length;
    const lockedCount = devices.filter(
      (d) => d.status === 'BLOCKED' || d.status === 'RETIRED'
    ).length;

    return {
      totalDevices,
      onlineCount,
      offlineFieldCount,
      lockedCount,
    };
  }, [devices]);

  const handleOpenCreate = () => {
    setDeviceToEdit(null);
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (device: DeviceItem) => {
    setDeviceToEdit(device);
    setIsCreateModalOpen(true);
  };

  const handleSaveDevice = async (dto: CreateDeviceDto) => {
    if (deviceToEdit) {
      await updateDevice(deviceToEdit.id, dto);
    } else {
      await createDevice(dto);
    }
  };

  const handleOpenStatus = (device: DeviceItem) => {
    setDeviceForStatus(device);
    setIsStatusModalOpen(true);
  };

  const handleSaveStatus = async (id: string, status: DeviceStatus) => {
    await updateDeviceStatus(id, status);
  };

  const handleOpenDelete = (device: DeviceItem) => {
    setDeviceToDelete(device);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deviceToDelete) {
      await deleteDevice(deviceToDelete.id);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-[1700px] mx-auto">
      <DispositivosHeader
        onNewDevice={handleOpenCreate}
        onPingAll={refetch}
      />

      <DispositivosMetrics metrics={metrics} />

      <DispositivosFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      <DispositivosTable
        devices={devices}
        isLoading={isLoading}
        onEdit={handleOpenEdit}
        onStatusChange={handleOpenStatus}
        onDelete={handleOpenDelete}
      />

      <CreateDeviceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleSaveDevice}
        deviceToEdit={deviceToEdit}
      />

      <DeviceStatusModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        onUpdateStatus={handleSaveStatus}
        device={deviceForStatus}
      />

      <DeleteDeviceModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        device={deviceToDelete}
      />
    </div>
  );
};

export default DispositivosTecnologicosPage;