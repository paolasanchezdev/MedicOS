// apps/web/src/portals/admin/pages/recursos/medicamentos/MedicamentosPage.tsx
import React, { useState, useMemo } from 'react';
import { MedicamentosHeader } from './components/MedicamentosHeader';
import { MedicamentosMetrics, type MedicamentosMetricsData } from './components/MedicamentosMetrics';
import { MedicamentosFilters } from './components/MedicamentosFilters';
import { MedicamentosTable } from './components/MedicamentosTable';
import {
  useResources,
  CreateResourceModal,
  CreateStockModal,
  ResourceLotsModal,
  DeleteResourceModal,
} from '../../../../../modules/resources';
import type {
  ResourceWithMetrics,
  CreateResourceDto,
  CreateResourceStockDto,
} from '../../../../../modules/resources';

export const MedicamentosPage: React.FC = () => {
  const {
    resources,
    isLoading,
    filters,
    handleFilterChange,
    handleResetFilters,
    createResource,
    updateResource,
    deleteResource,
    createStock,
  } = useResources();

  const [isCreateResourceOpen, setIsCreateResourceOpen] = useState(false);
  const [resourceToEdit, setResourceToEdit] = useState<ResourceWithMetrics | null>(null);

  const [isCreateStockOpen, setIsCreateStockOpen] = useState(false);
  const [stockTargetResource, setStockTargetResource] = useState<ResourceWithMetrics | null>(null);

  const [isLotsModalOpen, setIsLotsModalOpen] = useState(false);
  const [selectedResourceForLots, setSelectedResourceForLots] = useState<ResourceWithMetrics | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState<ResourceWithMetrics | null>(null);

  const metrics: MedicamentosMetricsData = useMemo(() => {
    const totalCatalog = resources.length;
    const availableStockUnits = resources.reduce((sum, r) => sum + r.totalAvailableStock, 0);
    const lowStockCount = resources.filter(
      (r) => r.totalAvailableStock > 0 && r.totalAvailableStock <= r.minThreshold
    ).length;
    const expiringLotsCount = resources.filter((r) => r.hasExpiringLots).length;

    return {
      totalCatalog,
      availableStockUnits,
      lowStockCount,
      expiringLotsCount,
    };
  }, [resources]);

  const handleOpenCreateResource = () => {
    setResourceToEdit(null);
    setIsCreateResourceOpen(true);
  };

  const handleOpenEditResource = (resource: ResourceWithMetrics) => {
    setResourceToEdit(resource);
    setIsCreateResourceOpen(true);
  };

  const handleSaveResource = async (dto: CreateResourceDto) => {
    if (resourceToEdit) {
      await updateResource(resourceToEdit.id, dto);
    } else {
      await createResource(dto);
    }
  };

  const handleOpenCreateStock = (resource?: ResourceWithMetrics) => {
    setStockTargetResource(resource || null);
    setIsCreateStockOpen(true);
  };

  const handleSaveStock = async (dto: CreateResourceStockDto) => {
    await createStock(dto);
  };

  const handleViewLots = (resource: ResourceWithMetrics) => {
    setSelectedResourceForLots(resource);
    setIsLotsModalOpen(true);
  };

  const handleOpenDelete = (resource: ResourceWithMetrics) => {
    setResourceToDelete(resource);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (resourceToDelete) {
      await deleteResource(resourceToDelete.id);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-[1700px] mx-auto">
      {/* Encabezado */}
      <MedicamentosHeader
        onNewResource={handleOpenCreateResource}
        onNewStockLot={() => handleOpenCreateStock()}
      />

      {/* Métricas */}
      <MedicamentosMetrics metrics={metrics} />

      {/* Filtros */}
      <MedicamentosFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Tabla */}
      <MedicamentosTable
        resources={resources}
        isLoading={isLoading}
        onViewLots={handleViewLots}
        onEdit={handleOpenEditResource}
        onDelete={handleOpenDelete}
      />

      {/* Modales Reutilizables */}
      <CreateResourceModal
        isOpen={isCreateResourceOpen}
        onClose={() => setIsCreateResourceOpen(false)}
        onSubmit={handleSaveResource}
        resourceToEdit={resourceToEdit}
      />

      <CreateStockModal
        isOpen={isCreateStockOpen}
        onClose={() => setIsCreateStockOpen(false)}
        onSubmit={handleSaveStock}
        resources={resources}
        selectedResource={stockTargetResource}
      />

      <ResourceLotsModal
        isOpen={isLotsModalOpen}
        onClose={() => setIsLotsModalOpen(false)}
        resource={selectedResourceForLots}
        onAddStockClick={(res) => {
          setIsLotsModalOpen(false);
          handleOpenCreateStock(res);
        }}
      />

      <DeleteResourceModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        resource={resourceToDelete}
      />
    </div>
  );
};