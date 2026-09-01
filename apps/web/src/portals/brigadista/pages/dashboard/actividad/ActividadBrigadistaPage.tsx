// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/dashboard/actividad/ActividadBrigadistaPage.tsx
// DESCRIPCIÓN: Centro Operativo de Despacho y Bitácora del Brigadista con estilo Admin.
// =========================================================================

import React, { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBrigadistaActividad } from '../../../../../modules/brigades';
import { Database, RefreshCw } from 'lucide-react';

import {
  ActividadHeader,
  ActividadResumen,
  ActividadFiltros,
  ActividadTimeline,
  ProximaActividadCard,
  ActividadTabla,
  ActividadCard,
} from './components';
import type { ActividadItemOperativa } from '../../../../../modules/brigades';

export const ActividadBrigadistaPage: React.FC = () => {
  const navigate = useNavigate();
  const tablaRef = useRef<HTMLDivElement>(null);

  // Estados de Filtros
  const [busqueda, setBusqueda] = useState<string>('');
  const [tipoSeleccionado, setTipoSeleccionado] = useState<string>('');
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<string>('');
  const [temporalidad, setTemporalidad] = useState<'HOY' | 'JORNADA' | 'TODAS'>('HOY');
  const [fechaInicio, setFechaInicio] = useState<string>('');
  const [fechaFin, setFechaFin] = useState<string>('');

  // Hook conectado con parámetros de consulta hacia PostgreSQL
  const { data, loading, error, refreshing, refresh } = useBrigadistaActividad({
    search: busqueda,
    tipo: tipoSeleccionado,
    estado: estadoSeleccionado,
    temporalidad,
    startDate: fechaInicio,
    endDate: fechaFin,
  });

  // Estado del Modal de Detalle
  const [actividadSeleccionada, setActividadSeleccionada] = useState<ActividadItemOperativa | null>(null);

  const rawActividades = data?.actividades;

  // Filtrado reactivo adicional en memoria
  const actividadesFiltradas = useMemo(() => {
    if (!rawActividades) return [];

    return rawActividades.filter((act) => {
      if (busqueda) {
        const query = busqueda.toLowerCase();
        const coincideSujeto = act.sujeto.toLowerCase().includes(query);
        const coincideTitulo = act.titulo.toLowerCase().includes(query);
        const coincideComunidad = act.comunidad.toLowerCase().includes(query);
        const coincideResultado = act.resultado.toLowerCase().includes(query);
        if (!coincideSujeto && !coincideTitulo && !coincideComunidad && !coincideResultado) {
          return false;
        }
      }

      if (tipoSeleccionado && act.tipo !== tipoSeleccionado) {
        return false;
      }

      if (estadoSeleccionado && act.estado !== estadoSeleccionado) {
        return false;
      }

      return true;
    });
  }, [rawActividades, busqueda, tipoSeleccionado, estadoSeleccionado]);

  const hasActiveFilters = Boolean(
    busqueda || tipoSeleccionado || estadoSeleccionado || fechaInicio || fechaFin || temporalidad !== 'HOY'
  );

  const handleLimpiarFiltros = () => {
    setBusqueda('');
    setTipoSeleccionado('');
    setEstadoSeleccionado('');
    setFechaInicio('');
    setFechaFin('');
    setTemporalidad('HOY');
  };

  const handleScrollToTabla = () => {
    tablaRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="w-full p-6 space-y-6 animate-pulse max-w-[1700px] mx-auto">
        <div className="h-32 bg-slate-200/60 rounded-2xl" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="h-28 bg-white rounded-2xl border border-slate-200/80" />
          <div className="h-28 bg-white rounded-2xl border border-slate-200/80" />
          <div className="h-28 bg-white rounded-2xl border border-slate-200/80" />
          <div className="h-28 bg-white rounded-2xl border border-slate-200/80" />
          <div className="h-28 bg-white rounded-2xl border border-slate-200/80" />
        </div>
        <div className="h-24 bg-white rounded-2xl border border-slate-200/80" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 h-96 bg-white rounded-2xl border border-slate-200/80" />
          <div className="lg:col-span-5 h-96 bg-white rounded-2xl border border-slate-200/80" />
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
            {error || 'No se pudo sincronizar la bitácora operacional de actividades del brigadista.'}
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
      <ActividadHeader
        nombreJornada={data.contexto.nombreJornada}
        territorio={data.contexto.territorio}
        fecha={data.contexto.fecha}
        jornadaActiva={data.contexto.jornadaActiva}
        onNuevaActividad={() => navigate('/brigadista/pacientes/registrar')}
        onRefresh={() => void refresh()}
        isRefreshing={refreshing}
      />

      {/* 2. Resumen de Operación (5 Indicadores Reales desde PostgreSQL) */}
      <ActividadResumen
        visitas={data.metricas.visitas}
        personas={data.metricas.personas}
        evaluaciones={data.metricas.evaluaciones}
        riesgos={data.metricas.riesgos}
        referencias={data.metricas.referencias}
      />

      {/* 3. Barra de Búsqueda y Filtros de Operación */}
      <ActividadFiltros
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        tipoSeleccionado={tipoSeleccionado}
        setTipoSeleccionado={setTipoSeleccionado}
        estadoSeleccionado={estadoSeleccionado}
        setEstadoSeleccionado={setEstadoSeleccionado}
        temporalidad={temporalidad}
        setTemporalidad={setTemporalidad}
        fechaInicio={fechaInicio}
        setFechaInicio={setFechaInicio}
        fechaFin={fechaFin}
        setFechaFin={setFechaFin}
        onLimpiar={handleLimpiarFiltros}
        hasActiveFilters={hasActiveFilters}
      />

      {/* 4. Cuadrícula Balanceada: Últimos Movimientos y Próxima Actividad */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 flex flex-col">
          <ActividadTimeline
            actividades={actividadesFiltradas}
            onSeleccionarActividad={(act) => setActividadSeleccionada(act)}
            onVerTodas={handleScrollToTabla}
          />
        </div>

        <div className="lg:col-span-5 flex flex-col justify-between">
          <ProximaActividadCard
            proximaActividad={data.proximaActividad}
            seguimientosAtrasados={data.atencionInmediata.seguimientosAtrasados}
            referenciasPendientes={data.atencionInmediata.referenciasPendientes}
            pendientesSync={data.atencionInmediata.pendientesSync}
            onVerDetalleProxima={() => {
              const primera = data.actividades[0];
              if (primera) setActividadSeleccionada(primera);
            }}
          />
        </div>
      </div>

      {/* 5. Tabla de Registro Completo de Actividades Reales */}
      <div ref={tablaRef}>
        <ActividadTabla
          actividades={actividadesFiltradas}
          onSeleccionarActividad={(act) => setActividadSeleccionada(act)}
        />
      </div>

      {/* Modal de Detalle Operativo */}
      <ActividadCard
        actividad={actividadSeleccionada}
        onClose={() => setActividadSeleccionada(null)}
      />
    </div>
  );
};

export default ActividadBrigadistaPage;