// apps/web/src/portals/admin/pages/recursos/dotacion/DotacionBrigadasPage.tsx
import React, { useState, useMemo } from 'react';
import { DotacionHeader } from './components/DotacionHeader';
import { DotacionMetrics, type DotacionMetricsData } from './components/DotacionMetrics';
import { DotacionFilters } from './components/DotacionFilters';
import { DotacionTable } from './components/DotacionTable';
import {
  useDotacion,
  CreateDotationModal,
  LiquidateDotationModal,
  DotationDetailsModal,
} from '../../../../../modules/resources';
import type {
  BrigadeDotationSummary,
  CreateDotationDto,
  LiquidateDotationDto,
} from '../../../../../modules/resources';

export const DotacionBrigadasPage: React.FC = () => {
  const {
    dotations,
    isLoading,
    filters,
    handleFilterChange,
    handleResetFilters,
    createDotation,
    liquidateDotation,
  } = useDotacion();

  // Modales
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLiquidateModalOpen, setIsLiquidateModalOpen] = useState(false);
  const [selectedBrigadeForLiquidation, setSelectedBrigadeForLiquidation] = useState<BrigadeDotationSummary | null>(null);

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedBrigadeForDetails, setSelectedBrigadeForDetails] = useState<BrigadeDotationSummary | null>(null);

  // Métricas
  const metrics: DotacionMetricsData = useMemo(() => {
    const totalEquipped = dotations.length;
    const activeInFieldCount = dotations.filter((d) => d.status === 'ACTIVE').length;
    const pendingReturnCount = dotations.filter((d) => d.status === 'PLANNED').length;
    const closedCount = dotations.filter((d) => d.status === 'COMPLETED').length;

    return {
      totalEquipped,
      activeInFieldCount,
      pendingReturnCount,
      closedCount,
    };
  }, [dotations]);

  // Handlers
  const handleOpenNewDotation = () => {
    setIsCreateModalOpen(true);
  };

  const handleSaveDotation = async (dto: CreateDotationDto) => {
    await createDotation(dto);
  };

  const handleOpenLiquidation = (brigade?: BrigadeDotationSummary) => {
    if (brigade) {
      setSelectedBrigadeForLiquidation(brigade);
    } else if (dotations.length > 0) {
      setSelectedBrigadeForLiquidation(dotations[0] || null);
    }
    setIsLiquidateModalOpen(true);
  };

  const handleSaveLiquidation = async (brigadeId: string, dto: LiquidateDotationDto) => {
    await liquidateDotation(brigadeId, dto);
  };

  const handleViewDetails = (item: BrigadeDotationSummary) => {
    setSelectedBrigadeForDetails(item);
    setIsDetailsModalOpen(true);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1700px] mx-auto">
      {/* Encabezado */}
      <DotacionHeader
        onNewDotation={handleOpenNewDotation}
        onCloseLiquidation={() => handleOpenLiquidation()}
      />

      {/* Métricas KPI */}
      <DotacionMetrics metrics={metrics} />

      {/* Filtros */}
      <DotacionFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Tabla de Dotación */}
      <DotacionTable
        dotations={dotations}
        isLoading={isLoading}
        onViewDetails={handleViewDetails}
        onLiquidate={handleOpenLiquidation}
      />

      {/* Modales */}
      <CreateDotationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleSaveDotation}
        brigades={dotations}
      />

      <LiquidateDotationModal
        isOpen={isLiquidateModalOpen}
        onClose={() => setIsLiquidateModalOpen(false)}
        onSubmit={handleSaveLiquidation}
        brigade={selectedBrigadeForLiquidation}
      />

      <DotationDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        brigade={selectedBrigadeForDetails}
      />
    </div>
  );
};