// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/dashboard/resumen/ResumenBrigadistaPage.tsx
// DESCRIPCIÓN: Centro Operativo del Brigadista conectado al hook modular useBrigadistaDashboard.
// =========================================================================

import React, { useContext } from 'react';
import { AuthContext } from '../../../../../core/context/AuthContextInstance';
import { useBrigadistaDashboard } from '../../../../../modules/brigades';

import {
  TarjetaBienvenidaPromotor,
  EstadoJornadaOperativaCard,
  ResumenOperativoCard,
  AccionesRapidasPromotor,
  ProximaAccionCard,
  AlertasRiesgoCard,
  SincronizacionCard,
  ActividadRecientePromotor,
} from './components';

import { Database, RefreshCw } from 'lucide-react';

export const ResumenBrigadistaPage: React.FC = () => {
  const auth = useContext(AuthContext);
  const { data, loading, error, refreshing, refresh } = useBrigadistaDashboard();

  if (loading) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-pulse max-w-[1700px] mx-auto">
        <div className="h-36 bg-slate-200/60 rounded-2xl" />
        <div className="h-20 bg-slate-200/60 rounded-2xl" />
        <div className="h-28 bg-slate-200/60 rounded-2xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="h-36 bg-slate-200/60 rounded-2xl" />
          <div className="h-36 bg-slate-200/60 rounded-2xl" />
          <div className="h-36 bg-slate-200/60 rounded-2xl" />
          <div className="h-36 bg-slate-200/60 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 max-w-lg mx-auto text-center my-12 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="w-12 h-12 bg-teal-50 text-[#2B7A78] rounded-2xl flex items-center justify-center mx-auto border border-teal-100">
          <Database className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-slate-900">Sin conexión con la Base de Datos</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            {error || 'No se pudo sincronizar la información del brigadista con la estación local.'}
          </p>
        </div>
        <button
          onClick={() => void refresh()}
          disabled={refreshing}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2B7A78] hover:bg-[#236866] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Reintentar Conexión</span>
        </button>
      </div>
    );
  }

  const personasRegistradas = data.resumenTriajes.total + data.resumenTriajes.pendientes;
  const evaluacionesRealizadas = data.resumenTriajes.total;
  const pendientesEvaluacion = data.resumenTriajes.pendientes;
  const riesgosDetectados = data.resumenTriajes.alertas;

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-[1700px] mx-auto animate-in fade-in duration-200">
      {/* 1. Header Institucional / Banner de Bienvenida */}
      <TarjetaBienvenidaPromotor
        firstName={auth?.user?.firstName}
        lastName={auth?.user?.lastName}
        role={auth?.user?.role}
        onRefresh={() => void refresh()}
        isRefreshing={refreshing}
        isOnline={true}
      />

      {/* 2. Estado de la Jornada Territorial */}
      <EstadoJornadaOperativaCard
        jornadaActiva={data.estadoJornada.jornadaActiva}
        nombreBrigada={data.estadoJornada.nombreBrigada}
        ubicacion={data.estadoJornada.ubicacion}
        horaInicio={data.estadoJornada.horaInicio}
      />

      {/* 3. Acciones Rápidas Operativas */}
      <AccionesRapidasPromotor />

      {/* 4. Indicadores Operativos Reales */}
      <ResumenOperativoCard
        personasRegistradas={personasRegistradas}
        evaluacionesRealizadas={evaluacionesRealizadas}
        pendientesEvaluacion={pendientesEvaluacion}
        riesgosDetectados={riesgosDetectados}
      />

      {/* 5. Próxima Acción y Señales de Riesgo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProximaAccionCard
          proximaPersona={data.proximoPaciente}
          jornadaActiva={data.estadoJornada.jornadaActiva}
        />
        <AlertasRiesgoCard alertas={data.alertasClinicasData.alertas} />
      </div>

      {/* 6. Sincronización Outbox y Cronología de Actividad */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SincronizacionCard
          isOnline={true}
          pendientesOutbox={0}
          ultimaSincro={new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        />
        <ActividadRecientePromotor actividades={data.triajesRecientes} />
      </div>
    </div>
  );
};

export default ResumenBrigadistaPage;