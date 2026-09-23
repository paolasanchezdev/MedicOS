// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/estudios/resultados-laboratorio/ResultadosLaboratorioPage.tsx
// DESCRIPCIÓN: Vista de Resultados de Laboratorio con tarjetas KPI y diseño clínico.
// =========================================================================

import React, { useState, useMemo } from 'react';
import {
  useLaboratoryResults,
  type LaboratoryStudy,
  DetalleResultadoLaboratorioModal,
} from '../../../../../modules/laboratory/index.js';
import {
  ResultadosLaboratorioHeader,
  ResultadosLaboratorioStatusCards,
  ResultadosLaboratorioFilters,
  ResultadoLaboratorioCard,
  ResultadosLaboratorioEmpty,
  ResultadosLaboratorioLoading,
  ResultadosLaboratorioError,
} from './components/index.js';

export const ResultadosLaboratorioPage: React.FC = () => {
  const [search, setSearch] = useState<string>('');
  const [status, setStatus] = useState<string>('ALL');
  const [sort, setSort] = useState<'recent' | 'oldest' | 'az'>('recent');

  const { studies, loading, error, refetch } = useLaboratoryResults({
    search,
    status,
    sort,
  });

  const [selectedStudy, setSelectedStudy] = useState<LaboratoryStudy | null>(null);

  // Agrupación por Mes y Año
  const groupedByMonth = useMemo(() => {
    const map = new Map<string, LaboratoryStudy[]>();

    studies.forEach((study) => {
      const d = new Date(study.performedAt);
      const key = d.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }).toUpperCase();
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)!.push(study);
    });

    return Array.from(map.entries()).map(([label, items]) => ({
      label,
      items,
    }));
  }, [studies]);

  if (loading && studies.length === 0) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-5 max-w-[1700px] mx-auto">
        <ResultadosLaboratorioLoading />
      </div>
    );
  }

  if (error && studies.length === 0) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-10 max-w-md mx-auto">
        <ResultadosLaboratorioError message={error} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-5 space-y-4 max-w-[1700px] mx-auto animate-in fade-in duration-200">
      {/* 1. Cabecera Verde Institucional */}
      <ResultadosLaboratorioHeader totalCount={studies.length} />

      {/* 2. Grid de 4 Tarjetas de Resumen Clínico */}
      <ResultadosLaboratorioStatusCards
        studies={studies}
        onSelectStatus={setStatus}
      />

      {/* 3. Barra Compacta de Filtros */}
      <ResultadosLaboratorioFilters
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        sort={sort}
        onSortChange={setSort}
      />

      {/* 4. Listado o Estado Vacío */}
      {studies.length === 0 ? (
        <ResultadosLaboratorioEmpty />
      ) : (
        <div className="space-y-4">
          {groupedByMonth.map(({ label, items }) => (
            <section key={label} className="space-y-2.5">
              <div className="flex items-center gap-3 px-1 select-none">
                <span className="text-xs font-black text-medicos-teal tracking-wide">
                  {label}
                </span>
                <div className="h-px bg-slate-200/80 flex-1" />
                <span className="text-[10.5px] font-semibold text-slate-400">
                  {items.length} estudio(s)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {items.map((study) => (
                  <ResultadoLaboratorioCard
                    key={study.id}
                    study={study}
                    onViewDetails={setSelectedStudy}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* Modal Desacoplado */}
      <DetalleResultadoLaboratorioModal
        study={selectedStudy}
        onClose={() => setSelectedStudy(null)}
      />
    </div>
  );
};

export default ResultadosLaboratorioPage;