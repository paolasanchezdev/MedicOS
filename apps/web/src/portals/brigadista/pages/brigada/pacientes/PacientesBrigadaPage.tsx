// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/brigada/pacientes/PacientesBrigadaPage.tsx
// DESCRIPCIÓN: Registro de pacientes atendidos y en espera en la jornada de hoy.
//              Permite registrar personas in situ, escanear QR y operar triage.
// =========================================================================

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePacientesBrigada } from '../../../../../modules/brigades';
import { Database, RefreshCw, QrCode, UserSearch, PlusCircle, Users, UserPlus } from 'lucide-react';

import {
  PacientesBrigadaHeader,
  PacientesBrigadaResumen,
  PacientesBrigadaFiltros,
  PacientesBrigadaTabla,
} from './components';
import type { FiltroEstadoPaciente } from './components/PacientesBrigadaFiltros';

export const PacientesBrigadaPage: React.FC = () => {
  const navigate = useNavigate();
  const { data, loading, error, refreshing, refresh } = usePacientesBrigada();

  const [busqueda, setBusqueda] = useState<string>('');
  const [filtroEstado, setFiltroEstado] = useState<FiltroEstadoPaciente>('TODOS');

  const rawPacientes = data?.pacientes;

  const pacientesFiltrados = useMemo(() => {
    if (!rawPacientes) return [];

    return rawPacientes.filter((p) => {
      if (busqueda.trim()) {
        const q = busqueda.toLowerCase().trim();
        const coincideNombre = p.nombreCompleto.toLowerCase().includes(q);
        const coincideDui = p.dui.toLowerCase().includes(q);
        if (!coincideNombre && !coincideDui) return false;
      }

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
    <div className="w-full p-4 sm:p-6 space-y-6 max-w-[1700px] mx-auto animate-in fade-in duration-200">
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

      {/* 2. Barra de Acciones Operativas con Acceso Directo a Registrar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/70 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#2B7A78]" />
          <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
            Control de Asistencia del Día
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            (Sala de espera y atenciones registradas hoy)
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => navigate('/brigadista/pacientes/registrar')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-teal-50 hover:bg-teal-100 text-[#2B7A78] border border-teal-200/80 text-xs font-bold rounded-xl transition cursor-pointer active:scale-95"
          >
            <UserPlus className="w-3.5 h-3.5 text-[#2B7A78]" />
            <span>Registrar Persona</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/brigadista/pacientes/escanear')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer active:scale-95"
          >
            <QrCode className="w-3.5 h-3.5 text-[#2B7A78]" />
            <span>Escanear QR</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/brigadista/pacientes/buscar')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer active:scale-95"
          >
            <UserSearch className="w-3.5 h-3.5 text-[#2B7A78]" />
            <span>Buscar en Padrón</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/brigadista/atencion/nueva')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2B7A78] hover:bg-[#236866] text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer active:scale-95"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Nueva Atención</span>
          </button>
        </div>
      </div>

      {/* 3. Resumen Operativo de la Jornada */}
      <PacientesBrigadaResumen resumen={data.resumen} />

      {/* 4. Lista de Pacientes o Estado Vacío */}
      {data.pacientes.length > 0 ? (
        <>
          <PacientesBrigadaFiltros
            busqueda={busqueda}
            setBusqueda={setBusqueda}
            filtroEstado={filtroEstado}
            setFiltroEstado={setFiltroEstado}
            onLimpiar={handleLimpiarFiltros}
          />
          <PacientesBrigadaTabla pacientes={pacientesFiltrados} />
        </>
      ) : (
        <div className="p-10 text-center bg-white rounded-3xl border border-slate-200/80 shadow-2xs space-y-4 max-w-xl mx-auto my-6">
          <div className="w-14 h-14 bg-teal-50 text-[#2B7A78] rounded-2xl flex items-center justify-center mx-auto border border-teal-100">
            <Users className="w-7 h-7" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-extrabold text-slate-900">
              Aún no hay pacientes en la sala de espera de hoy
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
              Si estás en un <strong>puesto fijo</strong>, registra a la persona o escanea su carnet QR
              para que pase a la cola de espera. Si estás en <strong>visita domiciliaria</strong>, registra y
              atiende directamente en la vivienda.
            </p>
          </div>
          <div className="pt-2 flex items-center justify-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={() => navigate('/brigadista/pacientes/registrar')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-teal-50 hover:bg-teal-100 text-[#2B7A78] border border-teal-200/80 text-xs font-bold rounded-xl transition cursor-pointer active:scale-95"
            >
              <UserPlus className="w-4 h-4 text-[#2B7A78]" />
              <span>Registrar Paciente Nuevo</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/brigadista/pacientes/escanear')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer active:scale-95"
            >
              <QrCode className="w-4 h-4 text-[#2B7A78]" />
              <span>Escanear Carnet QR</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/brigadista/atencion/nueva')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#2B7A78] hover:bg-[#236866] text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Atención Directa</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PacientesBrigadaPage;