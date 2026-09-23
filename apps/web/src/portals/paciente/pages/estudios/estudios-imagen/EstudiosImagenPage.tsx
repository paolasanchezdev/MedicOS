// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/estudios/estudios-imagen/EstudiosImagenPage.tsx
// DESCRIPCIÓN: Vista oficial de Estudios de Imagen agrupada por mes con tarjetas KPI.
// =========================================================================

import React, { useState, useMemo } from 'react';
import {
  useMedicalImagingStudies,
  type MedicalImagingStudy,
  DetalleEstudioImagenModal,
} from '../../../../../modules/medical-imaging/index.js';
import {
  EstudiosImagenHeader,
  EstudiosImagenStatusCards,
  EstudiosImagenFilters,
  EstudioImagenCard,
  EstudiosImagenEmpty,
  EstudiosImagenLoading,
  EstudiosImagenError,
} from './components/index.js';

export const EstudiosImagenPage: React.FC = () => {
  const [search, setSearch] = useState<string>('');
  const [type, setType] = useState<string>('ALL');
  const [sort, setSort] = useState<'recent' | 'oldest' | 'az'>('recent');

  const { studies, loading, error, refetch } = useMedicalImagingStudies({
    search,
    type,
    sort,
  });

  const [selectedStudy, setSelectedStudy] = useState<MedicalImagingStudy | null>(null);

  // Agrupación por Mes y Año
  const groupedByMonth = useMemo(() => {
    const map = new Map<string, MedicalImagingStudy[]>();

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
        <EstudiosImagenLoading />
      </div>
    );
  }

  if (error && studies.length === 0) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-10 max-w-md mx-auto">
        <EstudiosImagenError message={error} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-5 space-y-4 max-w-[1700px] mx-auto animate-in fade-in duration-200">
      {/* 1. Cabecera Verde Institucional */}
      <EstudiosImagenHeader totalCount={studies.length} />

      {/* 2. Grid de 4 Tarjetas de Resumen Clínico */}
      <EstudiosImagenStatusCards
        studies={studies}
        onSelectType={setType}
      />

      {/* 3. Barra Compacta de Filtros */}
      <EstudiosImagenFilters
        search={search}
        onSearchChange={setSearch}
        type={type}
        onTypeChange={setType}
        sort={sort}
        onSortChange={setSort}
      />

      {/* 4. Listado o Estado Vacío */}
      {studies.length === 0 ? (
        <EstudiosImagenEmpty />
      ) : (
        <div className="space-y-4">
          {groupedByMonth.map(({ label, items }) => (
            <section key={label} className="space-y-2.5">
              {/* Separador de Mes */}
              <div className="flex items-center gap-3 px-1 select-none">
                <span className="text-xs font-black text-medicos-teal tracking-wide">
                  {label}
                </span>
                <div className="h-px bg-slate-200/80 flex-1" />
                <span className="text-[10.5px] font-semibold text-slate-400">
                  {items.length} estudio(s)
                </span>
              </div>

              {/* Grid de Tarjetas */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {items.map((study) => (
                  <EstudioImagenCard
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

      {/* Modal Clínico Desacoplado del Dominio */}
      <DetalleEstudioImagenModal
        study={selectedStudy}
        onClose={() => setSelectedStudy(null)}
      />
    </div>
  );
};

export default EstudiosImagenPage;