// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/brigada/resumen/ResumenBrigadaPage.tsx
// DESCRIPCIÓN: Cabina de Control y Resumen Colectivo de la Brigada en MedicOS.
// =========================================================================

import React from 'react';
import { useResumenBrigada } from '../../../../../modules/brigades';
import { Database, RefreshCw } from 'lucide-react';

import {
  ResumenBrigadaHeader,
  AccionesRapidasBrigada,
  MetricasBrigadaCards,
  EstadoActualBrigadaCard,
  RequiereAtencionBrigadaCard,
  NavegacionBrigadaCards,
} from './components';

export const ResumenBrigadaPage: React.FC = () => {
  const { data, loading, error, refreshing, refresh } = useResumenBrigada();

  if (loading) {
    return (
      <div className="w-full p-6 space-y-6 animate-pulse max-w-[1700px] mx-auto">
        <div className="h-32 bg-slate-200/60 rounded-2xl" />
        <div className="h-20 bg-white rounded-2xl border border-slate-200/80" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="h-40 bg-white rounded-2xl border border-slate-200/80" />
          <div className="h-40 bg-white rounded-2xl border border-slate-200/80" />
          <div className="h-40 bg-white rounded-2xl border border-slate-200/80" />
          <div className="h-40 bg-white rounded-2xl border border-slate-200/80" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64 bg-white rounded-2xl border border-slate-200/80" />
          <div className="h-64 bg-white rounded-2xl border border-slate-200/80" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="h-36 bg-white rounded-2xl border border-slate-200/80" />
          <div className="h-36 bg-white rounded-2xl border border-slate-200/80" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 max-w-lg mx-auto text-center my-12 bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="w-12 h-12 bg-teal-50 text-[#2B7A78] rounded-2xl flex items-center justify-center mx-auto border border-teal-100 shadow-xs">
          <Database className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-slate-900">Sin conexión con la Base de Datos</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            {error || 'No se pudo obtener el estado operacional de la brigada.'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => void refresh()}
          disabled={refreshing}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2B7A78] hover:bg-[#236866] text-white text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Reintentar Conexión</span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full p-6 space-y-6 max-w-[1700px] mx-auto animate-in fade-in duration-200">
      {/* 1. Encabezado de Identificación con Banner Oficial Teal */}
      <ResumenBrigadaHeader
        nombreBrigada={data.identificacion.nombre}
        comunidad={data.identificacion.comunidad}
        fecha={data.identificacion.fecha}
        enCurso={data.identificacion.enCurso}
        onRefresh={() => void refresh()}
        isRefreshing={refreshing}
      />

      {/* 2. Acciones Rápidas */}
      <AccionesRapidasBrigada enCurso={data.identificacion.enCurso} />

      {/* 3. Indicadores Clave */}
      <MetricasBrigadaCards
        pacientesRegistrados={data.metricas.pacientes}
        evaluacionesRealizadas={data.metricas.evaluaciones}
        seguimientosPendientes={data.metricas.seguimientos}
        referidos={data.metricas.referidos}
      />

      {/* 4. Estado Actual de la Brigada y Requiere Atención */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <EstadoActualBrigadaCard
          enCurso={data.estado.enCurso}
          horaInicio={data.estado.horaInicio}
          tiempoTranscurrido={data.estado.tiempoTranscurrido}
          evaluacionesRealizadas={data.estado.evaluacionesRealizadas}
          totalPacientes={data.estado.totalPacientes}
        />

        <RequiereAtencionBrigadaCard
          seguimientosPendientes={data.requiereAtencion.seguimientosPendientes}
          referenciasRealizadas={data.requiereAtencion.referenciasRealizadas}
        />
      </div>

      {/* 5. Exploración y Detalle */}
      <NavegacionBrigadaCards />
    </div>
  );
};

export default ResumenBrigadaPage;