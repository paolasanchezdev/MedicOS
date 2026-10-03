// =========================================================================
// ARCHIVO: HistorialReferenciasPage.tsx
// DESCRIPCIÓN: Historial consolidado de referencias emitidas, enviadas y atendidas.
//              Con métricas de retorno clínico y botones de acción directos.
// =========================================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReferences } from '../../../../../modules/references/hooks/useReferences';
import type { CommunityReferenceRecord } from '../../../../../modules/references/types/reference.types';
import { ModalDetalleReferencia } from '../pendientes/components/ModalDetalleReferencia';
import { ModalActualizarEstadoReferencia } from '../pendientes/components/ModalActualizarEstadoReferencia';
import {
  History,
  ArrowLeft,
  Search,
  Eye,
} from 'lucide-react';

export const HistorialReferenciasPage: React.FC = () => {
  const navigate = useNavigate();
  const { references, loading, changeStatus, fetchReferences } = useReferences();

  const [filtroTexto, setFiltroTexto] = useState<string>('');
  const [refDetalle, setRefDetalle] = useState<CommunityReferenceRecord | null>(null);
  const [refEstado, setRefEstado] = useState<CommunityReferenceRecord | null>(null);

  const filtradas = references.filter((r) => {
    const q = filtroTexto.toLowerCase().trim();
    return (
      !q ||
      r.patientName?.toLowerCase().includes(q) ||
      r.patientDui?.toLowerCase().includes(q) ||
      r.folioF01?.toLowerCase().includes(q) ||
      r.establishmentName?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-200 min-h-[calc(100vh-5rem)] pb-8 bg-[#FAF8F5] -m-4 sm:-m-6 p-4 sm:p-6">
      
      {/* Cabecera */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/brigadista/referencias/pendientes')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#166E7A] hover:underline cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a Bandeja de Referencias</span>
        </button>

        <span className="font-mono text-xs font-bold text-slate-500">
          Auditoría de Derivaciones Clínicas F-01
        </span>
      </div>

      <div className="p-5 rounded-3xl bg-white border border-[#D3E8EC] shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-black text-[#1A282D]">
              Historial de Referencias Emitidas
            </h2>
            <p className="text-xs text-medicos-muted">
              Consulta el histórico de derivaciones hacia la red nacional y su retorno clínico.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filtroTexto}
              onChange={(e) => setFiltroTexto(e.target.value)}
              placeholder="Buscar por paciente, DUI o folio..."
              className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#166E7A]"
            />
          </div>
        </div>

        {/* Tabla */}
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Cargando histórico...</div>
        ) : filtradas.length === 0 ? (
          <div className="p-10 text-center space-y-2">
            <History className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs font-bold text-slate-700">Sin registros históricos de referencia</p>
            <p className="text-[11px] text-slate-400">
              Las referencias emitidas que completen su ciclo de atención en la red se auditarán en esta sección.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="py-2.5 px-3">Folio F-01</th>
                  <th className="py-2.5 px-3">Paciente</th>
                  <th className="py-2.5 px-3">Establecimiento Destino</th>
                  <th className="py-2.5 px-3">Prioridad</th>
                  <th className="py-2.5 px-3">Estado</th>
                  <th className="py-2.5 px-3">Fecha</th>
                  <th className="py-2.5 px-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filtradas.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-2.5 px-3 font-mono font-bold text-[#166E7A]">
                      {r.folioF01}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="font-bold text-slate-900 block">{r.patientName}</span>
                      <span className="text-[10px] text-slate-400">{r.patientDui}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="font-bold text-slate-800 block">{r.establishmentName}</span>
                      <span className="text-[10px] text-slate-400">{r.establishmentDepartment}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[9.5px] font-black uppercase ${
                        r.priority === 'HIGH' || r.priority === 'URGENT'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        {r.priority}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded-md text-[9.5px] font-black uppercase border ${
                        r.status === 'ATTENDED'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : r.status === 'SENT'
                          ? 'bg-cyan-50 text-cyan-800 border-cyan-200'
                          : r.status === 'IN_FOLLOW_UP'
                          ? 'bg-teal-50 text-[#166E7A] border-teal-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">
                      {r.referredAt.slice(0, 10)}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => setRefDetalle(r)}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition cursor-pointer font-bold inline-flex items-center gap-1"
                        title="Ver detalle F-01"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#166E7A]" />
                        <span>Ver F-01</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modales */}
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
          if (ok) await fetchReferences();
          return ok;
        }}
      />
    </div>
  );
};

export default HistorialReferenciasPage;