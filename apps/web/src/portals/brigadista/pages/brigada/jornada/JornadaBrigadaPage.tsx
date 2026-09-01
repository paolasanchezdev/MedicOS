// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/brigada/jornada/JornadaBrigadaPage.tsx
// DESCRIPCIÓN: Página principal de Jornada Territorial conectada a PostgreSQL.
// =========================================================================

import React, { useState } from 'react';
import { useJornadaBrigada } from '../../../../../modules/brigades';
import { Database, RefreshCw } from 'lucide-react';

import {
  JornadaHeader,
  JornadaInfoCard,
  JornadaControlCard,
  JornadaActividadesTimeline,
  JornadaEquipoCard,
  JornadaRecursosCard,
  RegistrarActividadModal,
} from './components';

export const JornadaBrigadaPage: React.FC = () => {
  const {
    data,
    loading,
    error,
    refreshing,
    actionLoading,
    refresh,
    iniciarJornada,
    finalizarJornada,
  } = useJornadaBrigada();

  const [modalActividadOpen, setModalActividadOpen] = useState<boolean>(false);

  if (loading) {
    return (
      <div className="w-full p-6 space-y-6 animate-pulse max-w-[1700px] mx-auto">
        <div className="h-8 bg-slate-200/60 rounded-xl w-48" />
        <div className="h-32 bg-slate-200/60 rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 h-72 bg-white rounded-2xl border border-slate-200/80" />
          <div className="lg:col-span-6 h-72 bg-white rounded-2xl border border-slate-200/80" />
        </div>
        <div className="h-80 bg-white rounded-2xl border border-slate-200/80" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 h-64 bg-white rounded-2xl border border-slate-200/80" />
          <div className="lg:col-span-6 h-64 bg-white rounded-2xl border border-slate-200/80" />
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
            {error || 'No se pudo obtener la información operativa de la jornada.'}
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
      {/* 1. Encabezado de Jornada */}
      <JornadaHeader
        nombreJornada={data.identificacion.nombre}
        comunidad={data.identificacion.comunidad}
        fecha={data.identificacion.fecha}
        estado={data.identificacion.estado}
        onRefresh={() => void refresh()}
        isRefreshing={refreshing}
      />

      {/* 2. Información y Control de Jornada */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-6">
          <JornadaInfoCard informacion={data.informacion} />
        </div>

        <div className="lg:col-span-6">
          <JornadaControlCard
            control={data.control}
            actionLoading={actionLoading}
            onIniciar={() => void iniciarJornada()}
            onFinalizar={() => void finalizarJornada()}
          />
        </div>
      </div>

      {/* 3. Actividades de la Jornada (Timeline de Registros Reales) */}
      <JornadaActividadesTimeline
        actividades={data.actividades}
        onRegistrarActividad={() => setModalActividadOpen(true)}
        enCurso={data.control.estado === 'EN_CURSO'}
      />

      {/* 4. Equipo Asignado y Recursos Reales */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-6">
          <JornadaEquipoCard equipo={data.equipo} />
        </div>

        <div className="lg:col-span-6">
          <JornadaRecursosCard recursos={data.recursos} />
        </div>
      </div>

      {/* Modal de Registro Rápido */}
      <RegistrarActividadModal
        isOpen={modalActividadOpen}
        onClose={() => setModalActividadOpen(false)}
        onRegistrado={() => void refresh()}
      />
    </div>
  );
};

export default JornadaBrigadaPage;