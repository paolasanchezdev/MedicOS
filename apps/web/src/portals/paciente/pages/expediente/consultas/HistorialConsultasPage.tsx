// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/expediente/consultas/HistorialConsultasPage.tsx
// DESCRIPCIÓN: Página orquestadora con filtrado tipado y 4 tarjetas de estatus.
// =========================================================================

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  useConsultationHistory,
  type Consultation,
  DetalleConsultaModal,
  consultationsService,
} from '../../../../../modules/consultations/index.js';
import {
  HistorialConsultasHeader,
  HistorialConsultasFilters,
  ConsultaHistorialCard,
  HistorialConsultasEmpty,
  HistorialConsultasError,
  ConsultasStatusCards,
} from './components/index.js';

export const HistorialConsultasPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const targetId = searchParams.get('id');

  const {
    consultations,
    filteredConsultations,
    loading,
    error,
    refetch,
    search,
    setSearch,
    period,
    setPeriod,
  } = useConsultationHistory();

  const [directSelected, setDirectSelected] = useState<Consultation | null>(null);
  const [fetchedConsultation, setFetchedConsultation] = useState<Consultation | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const matchedInList = useMemo(() => {
    if (!targetId) return null;
    return consultations.find((c) => c.id === targetId) ?? null;
  }, [targetId, consultations]);

  useEffect(() => {
    if (!targetId || matchedInList) return;

    let isMounted = true;

    consultationsService
      .getConsultationById(targetId)
      .then((data) => {
        if (isMounted && data) {
          setFetchedConsultation(data);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [targetId, matchedInList]);

  const activeConsultation = useMemo((): Consultation | null => {
    if (directSelected) return directSelected;
    if (matchedInList) return matchedInList;
    if (fetchedConsultation && fetchedConsultation.id === targetId) return fetchedConsultation;
    return null;
  }, [directSelected, matchedInList, fetchedConsultation, targetId]);

  const finalFilteredConsultations = useMemo(() => {
    return filteredConsultations.filter((c) => {
      if (statusFilter === 'ALL') return true;
      return c.status === statusFilter;
    });
  }, [filteredConsultations, statusFilter]);

  const groupedByYear = useMemo(() => {
    const map = new Map<number, Consultation[]>();

    finalFilteredConsultations.forEach((item) => {
      const year = new Date(item.consultationDate).getFullYear();
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
          (a, b) => new Date(b.consultationDate).getTime() - new Date(a.consultationDate).getTime()
        ),
      }));
  }, [finalFilteredConsultations]);

  const handleCloseModal = () => {
    setDirectSelected(null);
    setFetchedConsultation(null);
    if (searchParams.has('id')) {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete('id');
      setSearchParams(nextParams, { replace: true });
    }
  };

  if (loading && consultations.length === 0) {
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
        <HistorialConsultasError message={error} onRetry={refetch} />
      </div>
    );
  }

  if (consultations.length === 0) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-5 space-y-4 max-w-[1700px] mx-auto">
        <HistorialConsultasHeader totalCount={0} />
        <HistorialConsultasEmpty />
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-5 space-y-4 max-w-[1700px] mx-auto animate-in fade-in duration-200">
      <HistorialConsultasHeader totalCount={consultations.length} />

      <ConsultasStatusCards
        consultations={consultations}
        selectedStatusFilter={statusFilter}
        onSelectStatusFilter={setStatusFilter}
      />

      <HistorialConsultasFilters
        search={search}
        onSearchChange={setSearch}
        period={period}
        onPeriodChange={setPeriod}
      />

      {finalFilteredConsultations.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-7 text-center text-xs text-slate-500 shadow-2xs space-y-2">
          <p className="font-semibold text-slate-700">No se encontraron atenciones médicas con este filtro</p>
          <p className="text-[11px] text-slate-400">
            Intenta cambiar los términos de búsqueda o selecciona otro estatus en las tarjetas superiores.
          </p>
          {statusFilter !== 'ALL' && (
            <button
              type="button"
              onClick={() => setStatusFilter('ALL')}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
            >
              Mostrar todas las consultas
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
                  {items.length} atención(es)
                </span>
              </div>

              <div className="space-y-2">
                {items.map((consultation) => (
                  <ConsultaHistorialCard
                    key={consultation.id}
                    consultation={consultation}
                    onViewDetail={setDirectSelected}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      <DetalleConsultaModal
        consultation={activeConsultation}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default HistorialConsultasPage;