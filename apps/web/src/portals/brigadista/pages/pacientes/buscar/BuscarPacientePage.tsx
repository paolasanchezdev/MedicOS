// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/pacientes/buscar/BuscarPacientePage.tsx
// DESCRIPCIÓN: Página principal de búsqueda y localización de pacientes.
// =========================================================================

import React from 'react';
import { useSearchPatients } from '../../../../../modules/patients';
import {
  BuscarPacienteHeader,
  BuscadorPaciente,
  EscanearPacienteCard,
  ResultadosPaciente,
  EstadoBusqueda,
} from './components';

export const BuscarPacientePage: React.FC = () => {
  const {
    query,
    setQuery,
    results,
    loading,
    error,
    hasSearched,
    isOffline,
    executeSearch,
    clearSearch,
  } = useSearchPatients();

  return (
    <div className="w-full p-6 space-y-6 max-w-[1700px] mx-auto animate-in fade-in duration-200">
      {/* 1. Cabecera Contextual */}
      <BuscarPacienteHeader totalResultados={results.length} />

      {/* 2. Banner de Conectividad Offline si aplica */}
      {isOffline && <EstadoBusqueda tipo="OFFLINE" />}

      {/* 3. Buscador Unificado */}
      <BuscadorPaciente
        query={query}
        setQuery={setQuery}
        onSearch={executeSearch}
        onClear={clearSearch}
        loading={loading}
      />

      {/* 4. Tarjeta de Acceso a Escaneo QR */}
      <EscanearPacienteCard />

      {/* 5. Contenedor de Resultados / Lista General de Pacientes */}
      <ResultadosPaciente
        results={results}
        hasSearched={hasSearched}
        loading={loading}
        error={error}
        onRetry={() => executeSearch(query)}
      />
    </div>
  );
};

export default BuscarPacientePage;