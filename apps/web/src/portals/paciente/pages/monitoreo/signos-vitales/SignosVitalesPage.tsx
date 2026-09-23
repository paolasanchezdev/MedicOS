// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/monitoreo/signos-vitales/SignosVitalesPage.tsx
// DESCRIPCIÓN: Vista oficial de Monitoreo de Signos Vitales con tarjetas KPI y evolución.
// =========================================================================

import React, { useState } from 'react';
import {
  useVitalSignsHistory,
  type VitalSignsRecord,
  type VitalMetricType,
  DetalleSignosVitalesModal,
} from '../../../../../modules/vital-signs/index.js';
import {
  SignosVitalesHeader,
  SignosVitalesStatusCards,
  SignosVitalesFilters,
  EvolucionSignosVitales,
  HistorialSignosVitales,
  SignosVitalesEmpty,
  SignosVitalesLoading,
  SignosVitalesError,
} from './components/index.js';
import { Info } from 'lucide-react';

export const SignosVitalesPage: React.FC = () => {
  const [period, setPeriod] = useState<'7d' | '30d' | '3m' | '6m' | '1y' | 'all'>('30d');
  const [selectedMetric, setSelectedMetric] = useState<VitalMetricType>('heartRate');
  const [selectedRecord, setSelectedRecord] = useState<VitalSignsRecord | null>(null);

  const { records, latest, loading, error, refetch } = useVitalSignsHistory({ period });

  if (loading && records.length === 0) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-5 max-w-[1700px] mx-auto">
        <SignosVitalesLoading />
      </div>
    );
  }

  if (error && records.length === 0) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-10 max-w-md mx-auto">
        <SignosVitalesError message={error} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-5 space-y-4 max-w-[1700px] mx-auto animate-in fade-in duration-200">
      {/* 1. Cabecera Verde Institucional */}
      <SignosVitalesHeader totalCount={records.length} />

      {/* 2. Grid de 4 Tarjetas de Resumen Fisiológico */}
      <SignosVitalesStatusCards latest={latest} recordsCount={records.length} />

      {/* 3. Selector de Métrica y Período */}
      <SignosVitalesFilters
        period={period}
        onPeriodChange={setPeriod}
        selectedMetric={selectedMetric}
        onMetricChange={setSelectedMetric}
      />

      {/* 4. Cuerpo de Monitoreo o Estado Vacío */}
      {records.length === 0 ? (
        <SignosVitalesEmpty />
      ) : (
        <div className="space-y-4">
          <EvolucionSignosVitales records={records} metric={selectedMetric} />
          <HistorialSignosVitales records={records} onViewDetails={setSelectedRecord} />

          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex items-center gap-3 select-none">
            <div className="w-7 h-7 rounded-xl bg-teal-50 border border-teal-100 text-medicos-tealeal flex items-center justify-center shrink-0">
              <Info className="w-3.5 h-3.5" />
            </div>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              <strong className="text-slate-900 font-bold">Nota de supervisión médica:</strong> Los registros mostrados corresponden a evaluaciones clínicas documentadas por personal de salud. Los rangos de referencia son orientativos y su interpretación final depende del criterio facultativo.
            </p>
          </div>
        </div>
      )}

      {/* Modal Desacoplado del Dominio */}
      <DetalleSignosVitalesModal record={selectedRecord} onClose={() => setSelectedRecord(null)} />
    </div>
  );
};

export default SignosVitalesPage;