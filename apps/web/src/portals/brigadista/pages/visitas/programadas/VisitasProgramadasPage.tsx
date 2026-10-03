// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/visitas/programadas/VisitasProgramadasPage.tsx
// DESCRIPCIÓN: Agenda operativa de Visitas Domiciliarias Programadas.
//              Conexión directa con la base de datos de citas y consultas.
// =========================================================================

import React, { useState } from 'react';
import { useAuth } from '../../../../../core/context/useAuth';
import { useJornadaBrigada } from '../../../../../modules/brigades';
import { useVisits, calcularTemporalidadVisita } from '../../../../../modules/visits/hooks/useVisits';
import type { CommunityVisitRecord, VisitType } from '../../../../../modules/visits/types/visit.types';
import { VisitasProgramadasHeader } from './components/VisitasProgramadasHeader';
import { VisitasProgramadasMetricas } from './components/VisitasProgramadasMetricas';
import { VisitasProgramadasFiltros } from './components/VisitasProgramadasFiltros';
import { ModalProgramarVisita } from './components/ModalProgramarVisita';
import { ModalRegistrarResultadoVisita } from './components/ModalRegistrarResultadoVisita';
import { ModalDetalleVisita } from './components/ModalDetalleVisita';
import {
  Clock,
  MapPin,
  CheckCircle2,
  Play,
  Eye,
  Home,
  HeartPulse,
  Apple,
  ShieldCheck,
  ArrowUpRight,
} from 'lucide-react';

function getMotivoBadge(tipo: VisitType) {
  switch (tipo) {
    case 'MATERNO_INFANTIL':
      return { label: 'Materno-Infantil', icon: HeartPulse, bg: 'bg-teal-50', text: 'text-[#166E7A]', border: 'border-teal-200' };
    case 'SEGUIMIENTO_NUTRICIONAL':
      return { label: 'Nutrición', icon: Apple, bg: 'bg-amber-50', text: 'text-amber-900', border: 'border-amber-200' };
    case 'ADHERENCIA_TRATAMIENTO':
      return { label: 'Tratamiento', icon: ShieldCheck, bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' };
    case 'SEGUIMIENTO_REFERENCIA':
      return { label: 'Referencia', icon: ArrowUpRight, bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' };
    default:
      return { label: 'Seguimiento', icon: Home, bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' };
  }
}

export const VisitasProgramadasPage: React.FC = () => {
  const { user } = useAuth();
  const { data: jornadaData } = useJornadaBrigada();

  const {
    pacientesPadron,
    visitas,
    metricas,
    loading,
    filtroTexto,
    setFiltroTexto,
    filtroEstado,
    setFiltroEstado,
    filtroTemporalidad,
    setFiltroTemporalidad,
    filtroMotivo,
    setFiltroMotivo,
    programarVisita,
    iniciarVisita,
    registrarResultado,
    recargar,
  } = useVisits();

  const [isModalProgramarOpen, setIsModalProgramarOpen] = useState<boolean>(false);
  const [visitaDetalle, setVisitaDetalle] = useState<CommunityVisitRecord | null>(null);
  const [visitaResultado, setVisitaResultado] = useState<CommunityVisitRecord | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  const notificar = (msg: string) => {
    setMensajeExito(msg);
    setTimeout(() => setMensajeExito(null), 3500);
  };

  const handleLimpiarFiltros = () => {
    setFiltroTexto('');
    setFiltroEstado('TODOS');
    setFiltroTemporalidad('TODOS');
    setFiltroMotivo('TODOS');
  };

  const nombreResponsable = user
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || ''
    : '';

  return (
    <div className="space-y-4 animate-in fade-in duration-200 min-h-[calc(100vh-5rem)] pb-8 bg-[#FAF8F5] -m-4 sm:-m-6 p-4 sm:p-6">
      {mensajeExito && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-emerald-800 text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{mensajeExito}</span>
        </div>
      )}

      {/* 1. Header Oficial */}
      <VisitasProgramadasHeader
        loading={loading}
        onActualizar={() => void recargar()}
        onProgramarVisita={() => setIsModalProgramarOpen(true)}
      />

      {/* 2. Métricas */}
      <VisitasProgramadasMetricas
        metricas={metricas}
        temporalidadActual={filtroTemporalidad}
        onFiltrarTemporalidad={(t) => setFiltroTemporalidad(t)}
      />

      {/* 3. Filtros */}
      <VisitasProgramadasFiltros
        filtroTexto={filtroTexto}
        setFiltroTexto={setFiltroTexto}
        filtroEstado={filtroEstado}
        setFiltroEstado={setFiltroEstado}
        filtroMotivo={filtroMotivo}
        setFiltroMotivo={setFiltroMotivo}
        filtroTemporalidad={filtroTemporalidad}
        setFiltroTemporalidad={setFiltroTemporalidad}
        onLimpiar={handleLimpiarFiltros}
      />

      {/* 4. Agenda Operativa */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-black uppercase tracking-wider text-[#1A282D]">
            Agenda de Visitas Domiciliarias ({visitas.length})
          </h3>
          <span className="text-[11px] font-bold text-[#52656C]">
            Conexión en tiempo real con la base de datos
          </span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Cargando agenda de visitas desde la base de datos...</div>
        ) : visitas.length === 0 ? (
          <div className="p-10 rounded-3xl bg-white border border-[#D3E8EC] text-center space-y-3 shadow-2xs">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#166E7A] flex items-center justify-center mx-auto border border-teal-200">
              <Home className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-[#1A282D]">Sin visitas domiciliarias registradas</h4>
              <p className="text-xs text-[#52656C] mt-0.5 max-w-sm mx-auto">
                No hay visitas domiciliarias pendientes. Aparecerán aquí al registrar una atención con visita domiciliaria o al programar una nueva visita.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsModalProgramarOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#166E7A] text-white text-xs font-bold hover:bg-[#105F68] transition cursor-pointer"
            >
              <span>+ Programar Nueva Visita</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
            {visitas.map((v) => {
              const temp = calcularTemporalidadVisita(v.scheduledDate, v.status);
              const badge = getMotivoBadge(v.visitType);
              const BadgeIcon = badge.icon;

              return (
                <div
                  key={v.id}
                  className={`p-4 rounded-3xl border bg-white transition shadow-2xs hover:shadow-xs flex flex-col justify-between gap-3.5 ${
                    v.status === 'IN_PROGRESS'
                      ? 'border-amber-300 ring-2 ring-amber-100'
                      : 'border-[#D3E8EC]'
                  }`}
                >
                  <div className="space-y-2.5">
                    {/* Fila 1: Motivo + Estado + Fecha/Hora */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${badge.bg} ${badge.text} ${badge.border}`}
                        >
                          <BadgeIcon className="w-3 h-3 shrink-0" />
                          <span>{badge.label}</span>
                        </span>

                        <span
                          className={`px-2 py-0.5 rounded-md text-[9.5px] font-black uppercase tracking-wider border ${
                            v.status === 'IN_PROGRESS'
                              ? 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse'
                              : temp === 'VENCIDA'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : temp === 'HOY'
                              ? 'bg-teal-50 text-[#166E7A] border-teal-200'
                              : temp === 'COMPLETADA'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-slate-50 text-slate-600 border-slate-200'
                          }`}
                        >
                          ● {v.status === 'IN_PROGRESS' ? 'EN CURSO' : v.status === 'SCHEDULED' ? temp : v.status}
                        </span>

                        {v.priority === 'HIGH' && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-rose-50 text-rose-700 border border-rose-200">
                            Alta
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 text-[11px] font-black text-slate-800 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-200 shrink-0">
                        <Clock className="w-3 h-3 text-[#166E7A]" />
                        <span>{temp === 'HOY' ? `HOY ${v.scheduledTime || '09:00'}` : `${v.scheduledDate} · ${v.scheduledTime || '09:00'}`}</span>
                      </div>
                    </div>

                    {/* Fila 2: Nombre de la Persona y Expediente */}
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-black text-[#1A282D]">
                          {v.patientName}
                        </h4>
                        <p className="text-[11px] text-[#52656C] font-semibold mt-0.5">
                          DUI: {v.patientDui || 'Sin DUI'}
                        </p>
                      </div>
                      {v.patientExpediente && (
                        <span className="font-mono text-[10px] font-bold text-[#166E7A] bg-teal-50 px-2 py-0.5 rounded border border-teal-200 shrink-0">
                          {v.patientExpediente}
                        </span>
                      )}
                    </div>

                    {/* Fila 3: Motivo y Ubicación Territorial */}
                    <div className="space-y-1 pt-1 border-t border-slate-100">
                      <p className="text-xs font-bold text-[#1A282D] leading-snug">
                        {v.reason}
                      </p>
                      {(v.comunidad || v.referenciaUbicacion || v.patientAddress) && (
                        <p className="text-[11px] text-[#52656C] flex items-center gap-1 truncate">
                          <MapPin className="w-3 h-3 text-[#166E7A] shrink-0" />
                          <span className="truncate">
                            {v.comunidad && <strong>{v.comunidad}</strong>}
                            {v.sector && ` (${v.sector})`}
                            {(v.referenciaUbicacion || v.patientAddress) && ` — ${v.referenciaUbicacion || v.patientAddress}`}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Fila 4: Acciones Operativas de Campo */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                    <span className="text-[10.5px] text-slate-400 font-medium truncate">
                      Resp: {v.brigadistaName?.split('(')[0] || nombreResponsable || 'Brigadista'}
                    </span>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => setVisitaDetalle(v)}
                        className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
                        <span>Ver Visita</span>
                      </button>

                      {v.status === 'SCHEDULED' && (
                        <button
                          type="button"
                          onClick={async () => {
                            const ok = await iniciarVisita(v.id);
                            if (ok) notificar('Visita iniciada en vivienda y registrada en bitácora.');
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-[#166E7A] hover:bg-[#105F68] text-white font-black transition shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>Iniciar Visita</span>
                        </button>
                      )}

                      {v.status === 'IN_PROGRESS' && (
                        <button
                          type="button"
                          onClick={() => setVisitaResultado(v)}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black transition shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Registrar Resultado</span>
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
      <ModalProgramarVisita
        isOpen={isModalProgramarOpen}
        onClose={() => setIsModalProgramarOpen(false)}
        pacientesPadron={pacientesPadron}
        responsableDefecto={nombreResponsable}
        onProgramar={async (dto) => {
          const ok = await programarVisita(dto, {
            brigadistaId: user?.id,
            brigadeId: jornadaData?.identificacion?.id,
          });
          if (ok) notificar('Visita domiciliaria programada en base de datos.');
          return ok;
        }}
      />

      <ModalRegistrarResultadoVisita
        isOpen={visitaResultado !== null}
        onClose={() => setVisitaResultado(null)}
        visita={visitaResultado}
        onGuardar={async (dto) => {
          const ok = await registrarResultado(dto);
          if (ok) notificar('Visita finalizada en base de datos y registrada en bitácora.');
          return ok;
        }}
      />

      <ModalDetalleVisita
        isOpen={visitaDetalle !== null}
        onClose={() => setVisitaDetalle(null)}
        visita={visitaDetalle}
        onIniciarVisita={async (id) => {
          const ok = await iniciarVisita(id);
          if (ok) notificar('Visita domiciliaria iniciada.');
        }}
        onRegistrarResultado={(v) => setVisitaResultado(v)}
      />
    </div>
  );
};

export default VisitasProgramadasPage;