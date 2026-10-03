// =========================================================================
// ARCHIVO: ReferenciasPendientesPage.tsx
// DESCRIPCIÓN: Bandeja principal de Referencias a la Red de Salud (F-01).
//              Con formulario flotante central y alta densidad de datos.
// =========================================================================

import React, { useState } from 'react';
import { useReferences } from '../../../../../modules/references/hooks/useReferences';
import type { CommunityReferenceRecord } from '../../../../../modules/references/types/reference.types';
import { ReferenciasHeader } from './components/ReferenciasHeader';
import { ReferenciasMetricas } from './components/ReferenciasMetricas';
import { ReferenciasFiltros } from './components/ReferenciasFiltros';
import { ModalDetalleReferencia } from './components/ModalDetalleReferencia';
import { ModalActualizarEstadoReferencia } from './components/ModalActualizarEstadoReferencia';
import { ModalNuevaReferencia } from './components/ModalNuevaReferencia';
import {
  Share2,
  Eye,
  Edit3,
  Building2,
  CheckCircle2,
  Plus,
  FileCheck2,
  ShieldAlert,
} from 'lucide-react';

export const ReferenciasPendientesPage: React.FC = () => {
  const {
    references,
    pacientesPadron,
    establecimientos,
    metricas,
    loading,
    filtroTexto,
    setFiltroTexto,
    filtroEstado,
    setFiltroEstado,
    filtroPrioridad,
    setFiltroPrioridad,
    filtroDestino,
    setFiltroDestino,
    createReference,
    changeStatus,
    fetchReferences,
  } = useReferences();

  const [isModalNuevaOpen, setIsModalNuevaOpen] = useState<boolean>(false);
  const [refDetalle, setRefDetalle] = useState<CommunityReferenceRecord | null>(null);
  const [refEstado, setRefEstado] = useState<CommunityReferenceRecord | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  const notificar = (msg: string) => {
    setMensajeExito(msg);
    setTimeout(() => setMensajeExito(null), 3500);
  };

  const handleLimpiar = () => {
    setFiltroTexto('');
    setFiltroEstado('TODOS');
    setFiltroPrioridad('TODOS');
    setFiltroDestino('TODOS');
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
      <ReferenciasHeader
        loading={loading}
        onActualizar={() => void fetchReferences()}
      />

      {/* 2. Cuadrícula de Métricas */}
      <ReferenciasMetricas
        metricas={metricas}
        filtroEstado={filtroEstado}
        onSelectEstado={(st) => setFiltroEstado(st)}
      />

      {/* 3. Filtros */}
      <ReferenciasFiltros
        filtroTexto={filtroTexto}
        setFiltroTexto={setFiltroTexto}
        filtroEstado={filtroEstado}
        setFiltroEstado={setFiltroEstado}
        filtroPrioridad={filtroPrioridad}
        setFiltroPrioridad={setFiltroPrioridad}
        filtroDestino={filtroDestino}
        setFiltroDestino={setFiltroDestino}
        establecimientos={establecimientos}
        onLimpiar={handleLimpiar}
      />

      {/* 4. Lista o Guía de Referencias */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-black uppercase tracking-wider text-[#1A282D]">
            Bandeja de Referencias F-01 ({references.length})
          </h3>
          <button
            type="button"
            onClick={() => setIsModalNuevaOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#166E7A] hover:bg-[#105F68] text-white text-xs font-black rounded-xl shadow-xs transition active:scale-95 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Emitir Referencia F-01</span>
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Cargando referencias a la red...</div>
        ) : references.length === 0 ? (
          <div className="p-6 rounded-3xl bg-white border border-[#D3E8EC] shadow-2xs space-y-6">
            <div className="text-center space-y-2 max-w-md mx-auto pt-2">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#166E7A] flex items-center justify-center mx-auto border border-teal-200">
                <Share2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-black text-[#1A282D]">
                No hay referencias activas en este criterio
              </h4>
              <p className="text-xs text-medicos-muted">
                Este módulo permite derivar formalmente a pacientes hacia hospitales y unidades de salud mediante la boleta oficial F-01.
              </p>
              <button
                type="button"
                onClick={() => setIsModalNuevaOpen(true)}
                className="mt-2 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#166E7A] text-white text-xs font-black hover:bg-[#105F68] shadow-sm transition active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Emitir Nueva Boleta F-01</span>
              </button>
            </div>

            {/* 3 Pasos del Flujo Territorial */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="font-black text-[#166E7A] flex items-center gap-1.5 uppercase text-[10.5px]">
                  <FileCheck2 className="w-4 h-4" />
                  <span>1. Emisión en Terreno</span>
                </span>
                <p className="text-slate-700 leading-snug">
                  Selecciona al paciente del padrón nominal. Los signos vitales y datos generales se recuperan automáticamente.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="font-black text-[#166E7A] flex items-center gap-1.5 uppercase text-[10.5px]">
                  <Building2 className="w-4 h-4" />
                  <span>2. Asignación de Red</span>
                </span>
                <p className="text-slate-700 leading-snug">
                  Elige el hospital o unidad de salud del catálogo oficial de El Salvador y define el medio de traslado.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="font-black text-[#166E7A] flex items-center gap-1.5 uppercase text-[10.5px]">
                  <ShieldAlert className="w-4 h-4" />
                  <span>3. Retorno y Seguimiento</span>
                </span>
                <p className="text-slate-700 leading-snug">
                  Registra la respuesta médica, indicaciones de retorno y continúa la vigilancia domiciliaria si es requerida.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
            {references.map((r) => (
              <div
                key={r.id}
                className="p-4 rounded-3xl border border-[#D3E8EC] bg-white transition shadow-2xs hover:shadow-xs flex flex-col justify-between gap-3"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs font-black text-[#166E7A] bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        {r.folioF01}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[9.5px] font-black uppercase tracking-wider border ${
                          r.status === 'ATTENDED'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : r.status === 'SENT'
                            ? 'bg-cyan-50 text-cyan-800 border-cyan-200'
                            : r.status === 'IN_FOLLOW_UP'
                            ? 'bg-teal-50 text-[#166E7A] border-teal-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        ● {r.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span
                        className={`px-2 py-0.5 rounded text-[9.5px] font-black uppercase tracking-wider border ${
                          r.priority === 'HIGH' || r.priority === 'URGENT'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        Prioridad {r.priority}
                      </span>
                      <span className="text-[10.5px] text-slate-500 font-bold bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                        {r.referredAt.slice(0, 10)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-black text-[#1A282D]">
                      {r.patientName}
                    </h4>
                    <p className="text-[11px] text-medicos-muted font-semibold mt-0.5 flex items-center gap-1.5">
                      <span>DUI: {r.patientDui}</span>
                      {r.patientAge && (
                        <>
                          <span className="text-slate-300">•</span>
                          <span>{r.patientAge}</span>
                        </>
                      )}
                      {r.patientCommunity && (
                        <>
                          <span className="text-slate-300">•</span>
                          <span className="truncate">{r.patientCommunity}</span>
                        </>
                      )}
                    </p>
                  </div>

                  <div className="space-y-1 pt-1 border-t border-slate-100">
                    <p className="text-xs font-bold text-[#1A282D]">
                      {r.reason}
                    </p>
                    <p className="text-[11px] text-medicos-muted flex items-center gap-1 truncate font-medium">
                      <Building2 className="w-3.5 h-3.5 text-[#166E7A] shrink-0" />
                      <span className="truncate">
                        <strong>{r.establishmentName}</strong> {r.establishmentDepartment ? `(${r.establishmentDepartment})` : ''}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                  <span className="text-[10px] text-slate-400 font-medium">
                    Traslado: <strong>{r.medioTraslado || 'Propio'}</strong>
                  </span>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => setRefDetalle(r)}
                      className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <span>Ver F-01</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRefEstado(r)}
                      className="px-3 py-1.5 rounded-xl bg-[#166E7A] hover:bg-[#105F68] text-white font-black transition shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Actualizar</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modales */}
      <ModalNuevaReferencia
        isOpen={isModalNuevaOpen}
        onClose={() => setIsModalNuevaOpen(false)}
        pacientesPadron={pacientesPadron}
        establecimientos={establecimientos}
        onGuardar={async (dto) => {
          await createReference(dto);
          notificar('Referencia F-01 emitida y registrada en la base de datos.');
        }}
      />

      <ModalDetalleReferencia
        isOpen={refDetalle !== null}
        onClose={() => setRefDetalle(null)}
        referencia={refDetalle}
        onEditarEstado={(r) => {
          setRefDetalle(null);
          setRefEstado(r);
        }}
      />

      <ModalActualizarEstadoReferencia
        isOpen={refEstado !== null}
        onClose={() => setRefEstado(null)}
        referencia={refEstado}
        onGuardar={async (dto) => {
          const ok = await changeStatus(dto);
          if (ok) notificar('Estado de referencia actualizado exitosamente.');
          return ok;
        }}
      />
    </div>
  );
};

export default ReferenciasPendientesPage;