// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/atencion/historial/HistorialAtencionesPage.tsx
// DESCRIPCIÓN: Orquestador principal de la vista de Historial de Atenciones Comunitarias.
// =========================================================================

import React from 'react';
import { useAttentionHistory, DetalleAtencionModal } from '../../../../../modules/atencion';
import {
  HistorialAtencionesHeader,
  HistorialAtencionesResumen,
  HistorialAtencionesFiltros,
  HistorialAtencionesTabla,
  HistorialAtencionesEmpty,
  HistorialAtencionesSkeleton,
} from './components';
import { AlertCircle } from 'lucide-react';

export const HistorialAtencionesPage: React.FC = () => {
  const {
    items,
    total,
    loading,
    error,
    filters,
    hasActiveFilters,
    metrics,
    selectedAttention,
    setSelectedAttention,
    updateFilters,
    resetFilters,
    setPage,
  } = useAttentionHistory();

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200 max-w-[1700px] mx-auto">
      {/* 1. Header Contextual */}
      <HistorialAtencionesHeader />

      {/* 2. Error si ocurre en consulta */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-semibold flex items-center gap-2.5 shadow-2xs">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 3. Franja de Resumen Operativo */}
      <HistorialAtencionesResumen metrics={metrics} />

      {/* 4. Buscador y Filtros */}
      <HistorialAtencionesFiltros
        filters={filters}
        hasActiveFilters={hasActiveFilters}
        onUpdateFilters={updateFilters}
        onResetFilters={resetFilters}
      />

      {/* 5. Resultados / Tabla / Estado Vacío / Skeleton */}
      {loading ? (
        <HistorialAtencionesSkeleton />
      ) : items.length === 0 ? (
        <HistorialAtencionesEmpty
          isSearching={hasActiveFilters}
          onResetFilters={resetFilters}
        />
      ) : (
        <HistorialAtencionesTabla
          items={items}
          total={total}
          currentPage={filters.page}
          limit={filters.limit}
          onPageChange={setPage}
          onSelectAttention={setSelectedAttention}
        />
      )}

      {/* 6. Modal Global Unificado de Detalle SOAP */}
      <DetalleAtencionModal
        attention={selectedAttention}
        isOpen={Boolean(selectedAttention)}
        onClose={() => setSelectedAttention(null)}
      />
    </div>
  );
};

export default HistorialAtencionesPage;