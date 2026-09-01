// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/pacientes/buscar/components/ResultadosPaciente.tsx
// DESCRIPCIÓN: Lista y renderizado de pacientes con estado inicial poblado de BD.
// =========================================================================

import React from 'react';
import { PacienteResultadoCard } from './PacienteResultadoCard';
import { EstadoBusqueda } from './EstadoBusqueda';
import type { PatientRecord } from '../../../../../../modules/patients';

interface ResultadosPacienteProps {
  results: PatientRecord[];
  hasSearched: boolean;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

export const ResultadosPaciente: React.FC<ResultadosPacienteProps> = ({
  results,
  hasSearched,
  loading,
  error,
  onRetry,
}) => {
  if (loading) {
    return (
      <div className="space-y-3">
        <div className="h-6 w-44 bg-slate-200/70 rounded-lg animate-pulse" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-white rounded-2xl border border-slate-200/80 p-5 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <EstadoBusqueda tipo="ERROR" mensajeError={error} onRetry={onRetry} />;
  }

  if (hasSearched && results.length === 0) {
    return <EstadoBusqueda tipo="SIN_RESULTADOS" />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {hasSearched
            ? `Resultados Encontrados (${results.length})`
            : `Pacientes Registrados en el Sistema (${results.length})`}
        </h2>
      </div>

      <div className="space-y-3">
        {results.map((patient) => (
          <PacienteResultadoCard key={patient.id} patient={patient} />
        ))}
      </div>
    </div>
  );
};