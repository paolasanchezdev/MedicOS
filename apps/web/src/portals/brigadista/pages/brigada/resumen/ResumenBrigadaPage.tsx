// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/brigada/resumen/ResumenBrigadaPage.tsx
// DESCRIPCIÓN: Cabina de Control y Resumen Institucional de la Misión Territorial
//              con espaciado adaptativo mobile-first y soporte responsivo en terreno.
// =========================================================================

import React from 'react';
import { useResumenBrigada, useJornadaBrigada } from '../../../../../modules/brigades';
import { Database, RefreshCw } from 'lucide-react';

import {
  ResumenBrigadaHeader,
  AccionesRapidasBrigada,
  MetricasBrigadaCards,
  EstadoActualBrigadaCard,
  RequiereAtencionBrigadaCard,
  NavegacionBrigadaCards,
} from './components';

import {
  JornadaEquipoCard,
  JornadaRecursosCard,
} from '../jornada/components';

export const ResumenBrigadaPage: React.FC = () => {
  const {
    data: resumenData,
    loading: resumenLoading,
    error: resumenError,
    refreshing: resumenRefreshing,
    refresh: refreshResumen,
  } = useResumenBrigada();

  const {
    data: jornadaData,
    loading: jornadaLoading,
    refresh: refreshJornada,
  } = useJornadaBrigada();

  const loading = resumenLoading || jornadaLoading;
  const refreshing = resumenRefreshing;

  const handleRefreshAll = async () => {
    await Promise.all([refreshResumen(), refreshJornada()]);
  };

  if (loading) {
    return (
      <div className="w-full p-3.5 sm:p-6 space-y-3.5 sm:space-y-6 animate-pulse max-w-[1700px] mx-auto">
        <div className="h-24 sm:h-32 bg-slate-200/60 rounded-2xl" />
        <div className="h-20 bg-white rounded-2xl border border-slate-200/80" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="h-32 bg-white rounded-2xl border border-slate-200/80" />
          <div className="h-32 bg-white rounded-2xl border border-slate-200/80" />
          <div className="h-32 bg-white rounded-2xl border border-slate-200/80" />
          <div className="h-32 bg-white rounded-2xl border border-slate-200/80" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 sm:gap-6">
          <div className="h-60 bg-white rounded-2xl border border-slate-200/80" />
          <div className="h-60 bg-white rounded-2xl border border-slate-200/80" />
        </div>
      </div>
    );
  }

  if (resumenError || !resumenData) {
    return (
      <div className="p-6 sm:p-8 max-w-lg mx-auto text-center my-8 sm:my-12 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="w-12 h-12 bg-teal-50 text-[#2B7A78] rounded-2xl flex items-center justify-center mx-auto border border-teal-100 shadow-2xs">
          <Database className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">Sin conexión con la Base de Datos</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            {resumenError || 'No se pudo obtener el estado operacional de la brigada.'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => void handleRefreshAll()}
          disabled={refreshing}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2B7A78] hover:bg-[#236866] text-white text-xs font-bold rounded-xl transition-all shadow-xs active:scale-95 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Reintentar Conexión</span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full p-3.5 sm:p-6 space-y-3.5 sm:space-y-6 max-w-[1700px] mx-auto animate-in fade-in duration-200">
      {/* 1. Encabezado de Identificación Institucional */}
      <ResumenBrigadaHeader
        nombreBrigada={resumenData.identificacion.nombre}
        comunidad={resumenData.identificacion.comunidad}
        fecha={resumenData.identificacion.fecha}
        enCurso={resumenData.identificacion.enCurso}
        estadoBrigada={resumenData.identificacion.estadoBrigada}
        onRefresh={() => void handleRefreshAll()}
        isRefreshing={refreshing}
      />

      {/* 2. Acciones Rápidas Hacia la Misión */}
      <AccionesRapidasBrigada enCurso={resumenData.identificacion.enCurso} />

      {/* 3. Indicadores Clave Acumulados de la Brigada */}
      <MetricasBrigadaCards
        pacientesRegistrados={resumenData.metricas.pacientes}
        evaluacionesRealizadas={resumenData.metricas.evaluaciones}
        seguimientosPendientes={resumenData.metricas.seguimientos}
        referidos={resumenData.metricas.referidos}
      />

      {/* 4. Estado Institucional y Casos Prioritarios */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 sm:gap-6 items-stretch">
        <EstadoActualBrigadaCard
          enCurso={resumenData.identificacion.enCurso}
          evaluacionesRealizadas={resumenData.estado.evaluacionesRealizadas}
          totalPacientes={resumenData.estado.totalPacientes}
          fechaInicio={resumenData.identificacion.fechaInicio}
          fechaFin={resumenData.identificacion.fechaFin}
          responsable={resumenData.identificacion.responsable}
          territorio={resumenData.identificacion.comunidad}
        />

        <RequiereAtencionBrigadaCard
          seguimientosPendientes={resumenData.requiereAtencion.seguimientosPendientes}
          referenciasRealizadas={resumenData.requiereAtencion.referenciasRealizadas}
        />
      </div>

      {/* 5. Despliegue de Jornadas Reales de PostgreSQL (WorkSessions) */}
      <NavegacionBrigadaCards
        enCurso={resumenData.identificacion.enCurso}
        jornadas={resumenData.jornadas}
      />

      {/* 6. Dotación de Recursos y Equipo Multidisciplinario Asignado */}
      {jornadaData && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-6 items-stretch">
          <div className="lg:col-span-6">
            <JornadaEquipoCard equipo={jornadaData.equipo} />
          </div>

          <div className="lg:col-span-6">
            <JornadaRecursosCard recursos={jornadaData.recursos} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumenBrigadaPage;