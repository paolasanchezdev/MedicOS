// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/seguimiento/pacientes/SeguimientoPacientesPage.tsx
// DESCRIPCIÓN: Bandeja de Trabajo de Continuidad Territorial con diseño
//              limpio, espacioso y sin sobrecarga visual.
// =========================================================================

import React, { useState } from 'react';
import { useContinuidadPacientes, calcularTemporalidad } from '../../../../../modules/continuity/hooks/useContinuidadPacientes';
import type { SeguimientoItem, TipoSeguimiento } from '../../../../../modules/continuity/types/continuity.types';
import { SeguimientoHeader } from './components/SeguimientoHeader';
import { SeguimientoMetricas } from './components/SeguimientoMetricas';
import { SeguimientoFiltros } from './components/SeguimientoFiltros';
import { ModalNuevoSeguimiento } from './components/ModalNuevoSeguimiento';
import { ModalRegistrarAccionSeguimiento } from './components/ModalRegistrarAccionSeguimiento';
import { ModalDetalleSeguimiento } from './components/ModalDetalleSeguimiento';
import {
  Calendar,
  CheckCircle2,
  Eye,
  MapPin,
  Baby,
  Apple,
  HeartPulse,
  Home,
  ArrowUpRight,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';

function getModuloBadge(tipo: TipoSeguimiento) {
  switch (tipo) {
    case 'CONTROL_MATERNO':
      return {
        label: 'Control Materno',
        icon: HeartPulse,
        bg: 'bg-teal-50',
        text: 'text-[#166E7A]',
        border: 'border-teal-200',
      };
    case 'CONTROL_INFANTIL':
      return {
        label: 'Control Infantil',
        icon: Baby,
        bg: 'bg-emerald-50',
        text: 'text-emerald-800',
        border: 'border-emerald-200',
      };
    case 'SEGUIMIENTO_NUTRICIONAL':
      return {
        label: 'Nutrición',
        icon: Apple,
        bg: 'bg-amber-50',
        text: 'text-amber-900',
        border: 'border-amber-200',
      };
    case 'VISITA_DOMICILIARIA':
      return {
        label: 'Visita Domiciliaria',
        icon: Home,
        bg: 'bg-purple-50',
        text: 'text-purple-800',
        border: 'border-purple-200',
      };
    case 'SEGUIMIENTO_REFERENCIA':
      return {
        label: 'Referencia a Red',
        icon: ArrowUpRight,
        bg: 'bg-blue-50',
        text: 'text-blue-800',
        border: 'border-blue-200',
      };
    default:
      return {
        label: 'Continuidad Clínica',
        icon: ShieldCheck,
        bg: 'bg-slate-50',
        text: 'text-slate-700',
        border: 'border-slate-200',
      };
  }
}

export const SeguimientoPacientesPage: React.FC = () => {
  const {
    pacientesPadron,
    seguimientos,
    metricas,
    loading,
    filtroTexto,
    setFiltroTexto,
    filtroEstado,
    setFiltroEstado,
    filtroTipo,
    setFiltroTipo,
    filtroTemporalidad,
    setFiltroTemporalidad,
    filtroPrioridad,
    setFiltroPrioridad,
    crearSeguimiento,
    registrarAccion,
    cerrarSeguimiento,
    recargar,
  } = useContinuidadPacientes();

  const [isModalNuevoOpen, setIsModalNuevoOpen] = useState<boolean>(false);
  const [seguimientoAccionModal, setSeguimientoAccionModal] = useState<SeguimientoItem | null>(null);
  const [seguimientoDetalleModal, setSeguimientoDetalleModal] = useState<SeguimientoItem | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  const notificar = (msg: string) => {
    setMensajeExito(msg);
    setTimeout(() => setMensajeExito(null), 3500);
  };

  const handleLimpiarFiltros = () => {
    setFiltroTexto('');
    setFiltroEstado('TODOS');
    setFiltroTipo('TODOS');
    setFiltroTemporalidad('TODOS');
    setFiltroPrioridad('TODOS');
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200 min-h-[calc(100vh-5rem)] pb-8 bg-[#FAF8F5] -m-4 sm:-m-6 p-4 sm:p-6">
      {mensajeExito && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-emerald-800 text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{mensajeExito}</span>
        </div>
      )}

      {/* 1. Header Oficial */}
      <SeguimientoHeader
        loading={loading}
        onActualizar={() => void recargar()}
        onNuevoSeguimiento={() => setIsModalNuevoOpen(true)}
      />

      {/* 2. Cuadrícula de 4 Métricas de Continuidad */}
      <SeguimientoMetricas
        metricas={metricas}
        temporalidadActual={filtroTemporalidad}
        onFiltrarTemporalidad={(temp) => setFiltroTemporalidad(temp)}
      />

      {/* 3. Filtros */}
      <SeguimientoFiltros
        filtroTexto={filtroTexto}
        setFiltroTexto={setFiltroTexto}
        filtroEstado={filtroEstado}
        setFiltroEstado={setFiltroEstado}
        filtroTipo={filtroTipo}
        setFiltroTipo={setFiltroTipo}
        filtroPrioridad={filtroPrioridad}
        setFiltroPrioridad={setFiltroPrioridad}
        filtroTemporalidad={filtroTemporalidad}
        setFiltroTemporalidad={setFiltroTemporalidad}
        onLimpiar={handleLimpiarFiltros}
      />

      {/* 4. Bandeja de Trabajo */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-black uppercase tracking-wider text-[#1A282D]">
            Bandeja de Continuidad Territorial ({seguimientos.length})
          </h3>
          <span className="text-[11px] font-bold text-medicos-muted">
            Integrado transversalmente desde programas comunitarios
          </span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Cargando tareas de continuidad...</div>
        ) : seguimientos.length === 0 ? (
          <div className="p-10 rounded-3xl bg-white border border-[#D3E8EC] text-center space-y-3 shadow-2xs">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#166E7A] flex items-center justify-center mx-auto border border-teal-200">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-[#1A282D]">Territorio al Día • Sin Tareas Pendientes</h4>
              <p className="text-xs text-medicos-muted mt-0.5 max-w-sm mx-auto">
                No hay pacientes con acciones pendientes. Las tareas aparecerán automáticamente cuando se programe un próximo control en Materno-Infantil, Nutrición o cuando cree un seguimiento manual.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsModalNuevoOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#166E7A] text-white text-xs font-bold hover:bg-[#105F68] transition cursor-pointer"
            >
              <span>+ Crear Nuevo Seguimiento</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
            {seguimientos.map((seg) => {
              const temp = calcularTemporalidad(seg.fechaPrevista, seg.estado);
              const badge = getModuloBadge(seg.tipo);
              const BadgeIcon = badge.icon;

              return (
                <div
                  key={seg.id}
                  className="p-4 rounded-3xl border border-[#D3E8EC] bg-white transition shadow-2xs hover:shadow-xs flex flex-col justify-between gap-3.5"
                >
                  <div className="space-y-2.5">
                    {/* Fila 1: Chip de Módulo de Origen + Temporalidad suave + Expediente */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {/* Módulo de origen */}
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${badge.bg} ${badge.text} ${badge.border}`}
                        >
                          <BadgeIcon className="w-3 h-3 shrink-0" />
                          <span>{badge.label}</span>
                        </span>

                        {/* Estado temporal suave */}
                        <span
                          className={`px-2 py-0.5 rounded-md text-[9.5px] font-black uppercase tracking-wider border ${
                            temp === 'VENCIDO'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : temp === 'HOY'
                              ? 'bg-teal-50 text-[#166E7A] border-teal-200'
                              : temp === 'COMPLETADO'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-slate-50 text-slate-600 border-slate-200'
                          }`}
                        >
                          ● {temp}
                        </span>

                        {seg.prioridad === 'ALTA' && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-rose-50 text-rose-700 border border-rose-200">
                            Alta
                          </span>
                        )}
                      </div>

                      <span className="font-mono text-[10px] font-bold text-[#166E7A] bg-teal-50 px-2 py-0.5 rounded border border-teal-200 shrink-0">
                        {seg.pacienteExpediente}
                      </span>
                    </div>

                    {/* Fila 2: Nombre del Paciente */}
                    <div>
                      <h4 className="text-sm font-black text-[#1A282D]">
                        {seg.pacienteNombre}
                      </h4>
                      <p className="text-[11px] text-medicos-muted font-medium mt-0.5 flex items-center gap-2">
                        <span>{seg.pacienteEdad}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 truncate max-w-xs">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{seg.pacienteDireccion}</span>
                        </span>
                      </p>
                    </div>

                    {/* Fila 3: Acción Pendiente */}
                    <div className="space-y-1 pt-1 border-t border-slate-100">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-extrabold text-[#1A282D] truncate">
                          {seg.proximaAccion}
                        </span>
                        <span className="font-bold text-slate-500 shrink-0 flex items-center gap-1 text-[10.5px]">
                          <Calendar className="w-3 h-3 text-[#166E7A]" />
                          <span>{seg.fechaPrevista}</span>
                        </span>
                      </div>
                      <p className="text-xs text-medicos-muted line-clamp-2 leading-relaxed">
                        {seg.descripcion}
                      </p>
                    </div>
                  </div>

                  {/* Fila 4: Acciones Operativas */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                    <span className="text-[10.5px] text-slate-400 font-medium truncate">
                      Resp: {seg.responsable.split('(')[0]}
                    </span>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => setSeguimientoDetalleModal(seg)}
                        className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
                        <span>Ver Detalle</span>
                      </button>

                      {seg.estado !== 'COMPLETADO' && (
                        <button
                          type="button"
                          onClick={() => setSeguimientoAccionModal(seg)}
                          className="px-3 py-1.5 rounded-xl bg-[#166E7A] hover:bg-[#105F68] text-white font-black transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Registrar Acción</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modales */}
      <ModalNuevoSeguimiento
        isOpen={isModalNuevoOpen}
        onClose={() => setIsModalNuevoOpen(false)}
        pacientesPadron={pacientesPadron}
        onCrear={async (dto) => {
          const ok = await crearSeguimiento(dto);
          if (ok) notificar('Tarea de seguimiento activo creada e incorporada a la bandeja.');
          return ok;
        }}
      />

      <ModalRegistrarAccionSeguimiento
        isOpen={seguimientoAccionModal !== null}
        onClose={() => setSeguimientoAccionModal(null)}
        seguimiento={seguimientoAccionModal}
        onRegistrar={async (dto) => {
          const ok = await registrarAccion(dto);
          if (ok) notificar('Acción de continuidad registrada y actualizada en la línea de tiempo.');
          return ok;
        }}
      />

      <ModalDetalleSeguimiento
        isOpen={seguimientoDetalleModal !== null}
        onClose={() => setSeguimientoDetalleModal(null)}
        seguimiento={seguimientoDetalleModal}
        onRegistrarAccion={(seg) => setSeguimientoAccionModal(seg)}
        onCerrarSeguimiento={async (id, motivo) => {
          const ok = await cerrarSeguimiento(id, motivo);
          if (ok) notificar('Seguimiento completado y cerrado exitosamente.');
          return ok;
        }}
      />
    </div>
  );
};

export default SeguimientoPacientesPage;