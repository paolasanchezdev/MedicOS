// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/expediente/diagnosticos/DiagnosticosPage.tsx
// DESCRIPCIÓN: Página orquestadora del expediente de diagnósticos del paciente.
//              Integra 4 tarjetas de estatus superiores, filtros y lista cronológica.
// =========================================================================

import React, { useState, useMemo } from 'react';
import {
  useDiagnosisHistory,
  type Diagnosis,
  type DiagnosisFilterStatus,
  DetalleDiagnosticoModal,
} from '../../../../../modules/diagnoses/index.js';
import {
  DiagnosticosHeader,
  DiagnosticosFilters,
  DiagnosticoCard,
  DiagnosticosEmpty,
  DiagnosticosError,
  DiagnosticosStatusCards,
} from './components/index.js';

export const DiagnosticosPage: React.FC = () => {
  const {
    diagnoses,
    filteredDiagnoses,
    loading,
    error,
    refetch,
    search,
    setSearch,
    status,
    setStatus,
  } = useDiagnosisHistory();

  const [selectedDiagnosis, setSelectedDiagnosis] = useState<Diagnosis | null>(null);

  // Agrupación cronológica por año
  const groupedByYear = useMemo(() => {
    const map = new Map<number, Diagnosis[]>();

    filteredDiagnoses.forEach((item) => {
      const year = new Date(item.diagnosedAt).getFullYear();
      if (!map.has(year)) {
        map.set(year, []);
      }
      map.get(year)!.push(item);
    });

    return Array.from(map.entries())
      .sort(([yearA], [yearB]) => yearB - yearA)
      .map(([year, items]) => ({
        year,
        items: items.sort(
          (a, b) => new Date(b.diagnosedAt).getTime() - new Date(a.diagnosedAt).getTime()
        ),
      }));
  }, [filteredDiagnoses]);

  if (loading && diagnoses.length === 0) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-5 space-y-4 max-w-[1700px] mx-auto animate-pulse">
        <div className="h-28 bg-slate-200 rounded-2xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="h-40 bg-slate-200 rounded-2xl" />
          <div className="h-40 bg-slate-200 rounded-2xl" />
          <div className="h-40 bg-slate-200 rounded-2xl" />
          <div className="h-40 bg-slate-200 rounded-2xl" />
        </div>
        <div className="h-10 bg-slate-200 rounded-xl" />
        <div className="h-24 bg-slate-200 rounded-2xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-5 max-w-[1700px] mx-auto">
        <DiagnosticosError message={error} onRetry={refetch} />
      </div>
    );
  }

  if (diagnoses.length === 0) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-5 space-y-4 max-w-[1700px] mx-auto">
        <DiagnosticosHeader totalCount={0} />
        <DiagnosticosEmpty />
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-5 space-y-4 max-w-[1700px] mx-auto animate-in fade-in duration-200">
      <DiagnosticosHeader totalCount={diagnoses.length} />

      {/* 4 Tarjetas Superiores de Estatus Clínico */}
      <DiagnosticosStatusCards
        diagnoses={diagnoses}
        selectedStatus={status}
        onSelectStatus={(newStatus: DiagnosisFilterStatus) => setStatus(newStatus)}
      />

      {/* Barra de Búsqueda y Pestañas Segmentadas */}
      <DiagnosticosFilters
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
      />

      {filteredDiagnoses.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-7 text-center text-xs text-slate-500 shadow-2xs space-y-2">
          <p className="font-semibold text-slate-700">No se encontraron diagnósticos con este filtro</p>
          <p className="text-[11px] text-slate-400">
            Intenta cambiar los términos de búsqueda o selecciona otro estatus en las tarjetas superiores.
          </p>
          {status !== 'ALL' && (
            <button
              type="button"
              onClick={() => setStatus('ALL')}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
            >
              Mostrar todos los diagnósticos
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {groupedByYear.map(({ year, items }) => (
            <section key={year} className="space-y-2.5">
              <div className="flex items-center gap-3 px-1">
                <span className="text-xs font-black text-[#2B7A78] tabular-nums tracking-wide">
                  {year}
                </span>
                <div className="h-px bg-slate-200/80 flex-1" />
                <span className="text-[10.5px] font-semibold text-slate-400">
                  {items.length} condición(es)
                </span>
              </div>

              <div className="space-y-2">
                {items.map((diagnosis) => (
                  <DiagnosticoCard
                    key={diagnosis.id}
                    diagnosis={diagnosis}
                    onViewDetail={setSelectedDiagnosis}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* Modal Reutilizable de Detalle Clínico */}
      <DetalleDiagnosticoModal
        diagnosis={selectedDiagnosis}
        onClose={() => setSelectedDiagnosis(null)}
      />
    </div>
  );
};

export default DiagnosticosPage;