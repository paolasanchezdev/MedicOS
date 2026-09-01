// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/brigada/pacientes/PacientesBrigadaPage.tsx
// DESCRIPCIÓN: Página principal de Pacientes de la Brigada con filtrado estricto e independiente.
// =========================================================================

import React, { useState, useMemo } from 'react';
import { usePacientesBrigada } from '../../../../../modules/brigades';
import { Database, RefreshCw } from 'lucide-react';

import {
  PacientesBrigadaHeader,
  PacientesBrigadaResumen,
  PacientesBrigadaFiltros,
  PacientesBrigadaTabla,
} from './components';
import type { FiltroEstadoPaciente } from './components/PacientesBrigadaFiltros';

export const PacientesBrigadaPage: React.FC = () => {
  const { data, loading, error, refreshing, refresh } = usePacientesBrigada();

  const [busqueda, setBusqueda] = useState<string>('');
  const [filtroEstado, setFiltroEstado] = useState<FiltroEstadoPaciente>('TODOS');

  const rawPacientes = data?.pacientes;

  // Filtrado 1:1 estricto con cada pestaña y tarjeta
  const pacientesFiltrados = useMemo(() => {
    if (!rawPacientes) return [];

    return rawPacientes.filter((p) => {
      // 1. Búsqueda por Nombre o DUI
      if (busqueda.trim()) {
        const q = busqueda.toLowerCase().trim();
        const coincideNombre = p.nombreCompleto.toLowerCase().includes(q);
        const coincideDui = p.dui.toLowerCase().includes(q);
        if (!coincideNombre && !coincideDui) return false;
      }

      // 2. Filtro estricto por pestañas de estado
      if (filtroEstado === 'PENDIENTES') return p.estadoBrigada === 'PENDIENTE';
      if (filtroEstado === 'EVALUADOS') return p.estadoBrigada === 'EVALUADO';
      if (filtroEstado === 'SEGUIMIENTO') return p.estadoBrigada === 'SEGUIMIENTO';
      if (filtroEstado === 'REFERIDOS') return p.estadoBrigada === 'REFERIDO';

      return true;
    });
  }, [rawPacientes, busqueda, filtroEstado]);

  const handleLimpiarFiltros = () => {
    setBusqueda('');
    setFiltroEstado('TODOS');
  };

  if (loading) {
    return (
      <div className="w-full p-6 space-y-6 animate-pulse max-w-[1700px] mx-auto">
        <div className="h-8 bg-slate-200/60 rounded-xl w-48" />
        <div className="h-32 bg-slate-200/60 rounded-2xl" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="h-28 bg-white rounded-2xl border border-slate-200/80" />
          <div className="h-28 bg-white rounded-2xl border border-slate-200/80" />
          <div className="h-28 bg-white rounded-2xl border border-slate-200/80" />
          <div className="h-28 bg-white rounded-2xl border border-slate-200/80" />
        </div>
        <div className="h-24 bg-white rounded-2xl border border-slate-200/80" />
        <div className="h-96 bg-white rounded-2xl border border-slate-200/80" />
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
            {error || 'No se pudo obtener el padrón de pacientes de la brigada.'}
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
      {/* 1. Encabezado Contextual */}
      <PacientesBrigadaHeader
        nombreBrigada={data.identificacion.nombre}
        comunidad={data.identificacion.comunidad}
        fecha={data.identificacion.fecha}
        enCurso={data.identificacion.enCurso}
        totalPacientes={data.resumen.totalPacientes}
        onRefresh={() => void refresh()}
        isRefreshing={refreshing}
      />

      {/* 2. Resumen del Padrón */}
      <PacientesBrigadaResumen resumen={data.resumen} />

      {/* 3. Búsqueda y Pestañas de Filtro */}
      <PacientesBrigadaFiltros
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        filtroEstado={filtroEstado}
        setFiltroEstado={setFiltroEstado}
        onLimpiar={handleLimpiarFiltros}
      />

      {/* 4. Padrón de Pacientes */}
      <PacientesBrigadaTabla pacientes={pacientesFiltrados} />
    </div>
  );
};

export default PacientesBrigadaPage;