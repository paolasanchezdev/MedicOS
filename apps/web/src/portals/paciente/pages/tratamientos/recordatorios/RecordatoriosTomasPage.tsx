// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/tratamientos/recordatorios/RecordatoriosTomasPage.tsx
// DESCRIPCIÓN: Centro de recordatorios y seguimiento de tomas con tarjetas KPI.
// =========================================================================

import React from 'react';
import { useAuth } from '../../../../../core/context/useAuth.js';
import { useMedicationReminders } from '../../../../../modules/prescriptions/index.js';
import {
  RecordatoriosHeader,
  RecordatoriosStatusCards,
  ProximaTomaCard,
  ProgresoDiaCard,
  HorarioDiaList,
} from './components/index.js';
import { Info, Clock, ArrowRight, AlertCircle, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

export const RecordatoriosTomasPage: React.FC = () => {
  const { user } = useAuth();
  const patientId = user?.id || '';

  const {
    schedule,
    currentIntake,
    totalToday,
    takenCount,
    progressPercentage,
    selectedDate,
    loading,
    markingId,
    error,
    markAsTaken,
    goToPreviousDay,
    goToNextDay,
    goToToday,
    refresh,
  } = useMedicationReminders(patientId);

  if (loading && schedule.length === 0) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-5 space-y-4 max-w-[1700px] mx-auto animate-pulse">
        <div className="h-28 bg-slate-200 rounded-2xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="h-44 bg-slate-200 rounded-2xl" />
          <div className="h-44 bg-slate-200 rounded-2xl" />
          <div className="h-44 bg-slate-200 rounded-2xl" />
          <div className="h-44 bg-slate-200 rounded-2xl" />
        </div>
        <div className="h-56 bg-slate-200 rounded-2xl" />
      </div>
    );
  }

  if (error && schedule.length === 0) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-10 max-w-md mx-auto text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-2xs">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-900">Error al cargar recordatorios</h2>
          <p className="text-xs text-slate-500 mt-1">{error}</p>
        </div>
        <button
          type="button"
          onClick={refresh}
          className="inline-flex items-center gap-2 px-4 py-2 bg-medicos-teal hover:bg-[#16646e] text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reintentar</span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-5 space-y-4 max-w-[1700px] mx-auto animate-in fade-in duration-200">
      {/* 1. Cabecera Verde Institucional */}
      <RecordatoriosHeader
        selectedDate={selectedDate}
        takenCount={takenCount}
        totalToday={totalToday}
        onPrevDay={goToPreviousDay}
        onNextDay={goToNextDay}
        onToday={goToToday}
      />

      {/* 2. Grid de 4 Tarjetas de Resumen Clínico */}
      <RecordatoriosStatusCards
        totalToday={totalToday}
        takenCount={takenCount}
        progressPercentage={progressPercentage}
        currentIntake={currentIntake}
        schedule={schedule}
      />

      {/* 3. Bloques de Acción y Lista */}
      {totalToday === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-10 text-center text-xs text-slate-500 shadow-2xs space-y-3.5 max-w-xl mx-auto select-none">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 text-medicos-teal flex items-center justify-center mx-auto shadow-2xs">
            <Clock className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <h2 className="text-base font-black text-slate-900">
              No tienes recordatorios para esta fecha
            </h2>
            <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">
              Cuando tengas un tratamiento activo prescrito por tu profesional de salud, tus próximas tomas aparecerán aquí de forma automática.
            </p>
          </div>

          <div className="pt-2">
            <Link
              to="/paciente/tratamientos/recetas-activas"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-medicos-teal hover:text-[#16646e] transition"
            >
              <span>Ver mis recetas activas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
            <div className="lg:col-span-7">
              <ProximaTomaCard
                intake={currentIntake}
                onMarkAsTaken={markAsTaken}
                isMarking={markingId === currentIntake?.id}
              />
            </div>

            <div className="lg:col-span-5">
              <ProgresoDiaCard
                takenCount={takenCount}
                totalToday={totalToday}
                progressPercentage={progressPercentage}
              />
            </div>
          </div>

          <HorarioDiaList
            schedule={schedule}
            onMarkAsTaken={markAsTaken}
            markingId={markingId}
          />

          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex items-center gap-3 select-none">
            <div className="w-7 h-7 rounded-xl bg-teal-50 border border-teal-100 text-medicos-teal flex items-center justify-center shrink-0">
              <Info className="w-3.5 h-3.5" />
            </div>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              <strong className="text-slate-900 font-bold">Seguridad Farmacológica:</strong> Los recordatorios se generan a partir de tus prescripciones vigentes. Las dosis y frecuencias no pueden modificarse desde esta sección. Sigue siempre las indicaciones dadas por tu facultativo.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default RecordatoriosTomasPage;