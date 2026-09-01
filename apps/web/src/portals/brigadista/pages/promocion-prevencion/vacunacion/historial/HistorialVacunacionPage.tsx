// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/promocion-prevencion/vacunacion/historial/HistorialVacunacionPage.tsx
// DESCRIPCIÓN: Vista de historial de vacunas aplicadas en el Portal Brigadista.
// =========================================================================

import React from 'react';
import { useVaccinationHistory } from '../../../../../../modules/vaccinations';
import {
  HistorialVacunacionHeader,
  HistorialVacunacionFilters,
  HistorialVacunacionList,
  HistorialVacunacionDetail,
} from './components';
import { AlertCircle } from 'lucide-react';

export const HistorialVacunacionPage: React.FC = () => {
  const {
    items,
    catalog,
    loading,
    error,
    filters,
    hasActiveFilters,
    selectedRecord,
    setSelectedRecord,
    updateFilters,
    resetFilters,
  } = useVaccinationHistory();

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200 max-w-[1700px] mx-auto">
      <HistorialVacunacionHeader />

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-semibold flex items-center gap-2.5 shadow-2xs">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <HistorialVacunacionFilters
        filters={filters}
        catalog={catalog}
        hasActiveFilters={hasActiveFilters}
        onUpdateFilters={updateFilters}
        onResetFilters={resetFilters}
      />

      {loading ? (
        <div className="h-48 bg-slate-200/70 rounded-2xl animate-pulse" />
      ) : (
        <HistorialVacunacionList items={items} onSelectRecord={setSelectedRecord} />
      )}

      <HistorialVacunacionDetail
        record={selectedRecord}
        isOpen={Boolean(selectedRecord)}
        onClose={() => setSelectedRecord(null)}
      />
    </div>
  );
};

export default HistorialVacunacionPage;