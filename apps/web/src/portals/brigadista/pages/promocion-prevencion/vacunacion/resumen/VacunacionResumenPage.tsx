// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/promocion-prevencion/vacunacion/resumen/VacunacionResumenPage.tsx
// DESCRIPCIÓN: Vista principal de resumen y estado operativo de vacunación con diseño institucional.
// =========================================================================

import React from 'react';
import { useVaccinationHistory } from '../../../../../../modules/vaccinations';
import {
  VacunacionResumenHeader,
  VacunacionAccionesRapidas,
  VacunacionMetricasCards,
  VacunacionRecentCard,
  VacunacionSincronizacionCard,
} from './components';
import { AlertCircle } from 'lucide-react';

export const VacunacionResumenPage: React.FC = () => {
  const { summary, catalog, pendingQueue, retrySync, deletePending, refresh, loading, error } =
    useVaccinationHistory();

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200 max-w-[1700px] mx-auto">
      {/* 1. Banner Institucional de Bienvenida */}
      <VacunacionResumenHeader onRefresh={refresh} isRefreshing={loading} />

      {/* 2. Error si ocurre */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-semibold flex items-center gap-2.5 shadow-2xs">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 3. Acciones Rápidas */}
      <VacunacionAccionesRapidas />

      {/* 4. Métricas y KPIs de Vacunación (4 Columnas) */}
      <VacunacionMetricasCards summary={summary} catalog={catalog} />

      {/* 5. Monitoreo: Últimas Aplicaciones + Cola Outbox de Sincronización */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VacunacionRecentCard recentApplications={summary?.recentApplications || []} />
        <VacunacionSincronizacionCard
          pendingQueue={pendingQueue}
          onRetrySync={retrySync}
          onDeletePending={deletePending}
        />
      </div>
    </div>
  );
};

export default VacunacionResumenPage;