// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/pacientes/expediente/ExpedientePacientePage.tsx
// DESCRIPCIÓN: Vista principal de Expediente con Live Search y diseño responsivo para móviles.
// =========================================================================

import React, { useState, useEffect, useCallback, useTransition } from 'react';
import { useSearchParams } from 'react-router-dom';
import { patientsService, usePatientRecord, type PatientRecord } from '../../../../../modules/patients';
import {
  ExpedientePacienteHeader,
  ExpedienteBuscador,
  ExpedienteResultados,
  ExpedienteResumenClinico,
  ExpedienteTabs,
} from './components';
import { Loader2, AlertCircle } from 'lucide-react';

export const ExpedientePacientePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedPatientId = searchParams.get('id');

  const [query, setQuery] = useState<string>('');
  const [allPatients, setAllPatients] = useState<PatientRecord[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<PatientRecord[]>([]);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [, startTransition] = useTransition();

  const { historyData, loading: recordLoading, error: recordError } = usePatientRecord(selectedPatientId);

  // 1. Cargar pacientes iniciales
  useEffect(() => {
    let isMounted = true;

    const loadInitialPatients = async () => {
      try {
        const list = await patientsService.getAllPatients();
        if (isMounted) {
          setAllPatients(list);
          setFilteredPatients(list.slice(0, 6));
        }
      } catch (err) {
        console.error('Error al cargar pacientes recientes:', err);
      } finally {
        if (isMounted) setInitialLoading(false);
      }
    };

    void loadInitialPatients();

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Live Search con filtrado instantáneo
  const handleQueryChange = useCallback((newQuery: string) => {
    setQuery(newQuery);

    const clean = newQuery.trim().toLowerCase();
    if (!clean) {
      setFilteredPatients(allPatients.slice(0, 6));
      return;
    }

    startTransition(() => {
      const matched = allPatients.filter((p) => {
        const fullName = `${p.firstName} ${p.lastName}`.toLowerCase();
        const dui = (p.dui || '').replace(/[^0-9]/g, '');
        const cleanQueryNums = clean.replace(/[^0-9]/g, '');
        return (
          fullName.includes(clean) ||
          (cleanQueryNums && dui.includes(cleanQueryNums)) ||
          (p.phone && p.phone.includes(clean))
        );
      });
      setFilteredPatients(matched);
    });

    if (clean.length >= 2) {
      setSearchLoading(true);
      const timer = setTimeout(async () => {
        try {
          const results = await patientsService.searchPatients(clean);
          setFilteredPatients(results);
        } catch (err) {
          console.error('Error en búsqueda live:', err);
        } finally {
          setSearchLoading(false);
        }
      }, 250);

      return () => clearTimeout(timer);
    }
  }, [allPatients]);

  const handleSelectPatient = (id: string) => {
    setSearchParams({ id });
  };

  const handleClearPatient = () => {
    setSearchParams({});
    setQuery('');
    setFilteredPatients(allPatients.slice(0, 6));
  };

  return (
    <div className="w-full space-y-2.5 sm:space-y-4 animate-in fade-in duration-200">
      {/* Encabezado contextual compacto */}
      <ExpedientePacienteHeader
        hasActivePatient={Boolean(selectedPatientId)}
        onClearPatient={handleClearPatient}
      />

      {/* Si hay un paciente seleccionado */}
      {selectedPatientId ? (
        recordLoading ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center space-y-2 shadow-xs">
            <Loader2 className="w-6 h-6 animate-spin text-[#00838F] mx-auto" />
            <h3 className="text-xs font-bold text-slate-800">Cargando expediente clínico...</h3>
            <p className="text-[11px] text-slate-400">Consultando registros en base de datos.</p>
          </div>
        ) : recordError ? (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-semibold flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{recordError}</span>
            </div>
            <button
              onClick={handleClearPatient}
              className="px-2.5 py-1 bg-white border border-rose-300 text-rose-800 rounded-lg font-bold hover:bg-rose-100 transition-colors"
            >
              Volver
            </button>
          </div>
        ) : historyData ? (
          <div className="space-y-2.5 sm:space-y-4">
            <ExpedienteResumenClinico historyData={historyData} />
            <ExpedienteTabs historyData={historyData} />
          </div>
        ) : null
      ) : (
        /* Vista de Búsqueda Live y Pacientes Recientes */
        <div className="space-y-3">
          <ExpedienteBuscador
            query={query}
            onQueryChange={handleQueryChange}
            loading={searchLoading}
          />

          {initialLoading ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center space-y-2 shadow-xs">
              <Loader2 className="w-5 h-5 animate-spin text-[#00838F] mx-auto" />
              <p className="text-xs text-slate-500 font-medium">Cargando pacientes de la brigada...</p>
            </div>
          ) : (
            <ExpedienteResultados
              patients={filteredPatients}
              onSelectPatient={handleSelectPatient}
              isSearching={Boolean(query.trim())}
              query={query}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ExpedientePacientePage;