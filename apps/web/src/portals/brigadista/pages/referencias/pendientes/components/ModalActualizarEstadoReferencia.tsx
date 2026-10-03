// =========================================================================
// ARCHIVO: ModalActualizarEstadoReferencia.tsx
// DESCRIPCIÓN: Modal para actualizar el estado del paciente referido y registrar
//              el retorno/respuesta médica.
// =========================================================================

import React, { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import type {
  CommunityReferenceRecord,
  ReferenceStatus,
  UpdateReferenceStatusDTO,
} from '../../../../../../modules/references/types/reference.types';

interface ModalActualizarEstadoReferenciaProps {
  isOpen: boolean;
  onClose: () => void;
  referencia: CommunityReferenceRecord | null;
  onGuardar: (dto: UpdateReferenceStatusDTO) => Promise<boolean>;
}

export const ModalActualizarEstadoReferencia: React.FC<ModalActualizarEstadoReferenciaProps> = ({
  isOpen,
  onClose,
  referencia,
  onGuardar,
}) => {
  const [status, setStatus] = useState<ReferenceStatus>(referencia?.status || 'SENT');
  const [notes, setNotes] = useState<string>('');
  const [respuestaEstablecimiento, setRespuestaEstablecimiento] = useState<string>('');
  const [indicacionesRetorno, setIndicacionesRetorno] = useState<string>('');
  const [guardando, setGuardando] = useState<boolean>(false);

  if (!isOpen || !referencia) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    const ok = await onGuardar({
      referenceId: referencia.id,
      status,
      notes: notes.trim() || undefined,
      respuestaEstablecimiento: respuestaEstablecimiento.trim() || undefined,
      indicacionesRetorno: indicacionesRetorno.trim() || undefined,
    });
    setGuardando(false);
    if (ok) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in duration-150">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/90 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#166E7A] bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                {referencia.folioF01}
              </span>
              <h3 className="text-sm font-black text-[#1A282D] uppercase tracking-tight">
                Actualizar Estado de Referencia
              </h3>
            </div>
            <p className="text-[11px] text-medicos-muted font-semibold mt-0.5">
              {referencia.patientName} • Destino: {referencia.establishmentName}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Nuevo Estado de la Referencia
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { id: 'PENDING', label: 'Pendiente de Envío' },
                { id: 'SENT', label: 'Enviada / Entregada' },
                { id: 'IN_FOLLOW_UP', label: 'En Seguimiento' },
                { id: 'ATTENDED', label: 'Atendida / Completada' },
                { id: 'CANCELLED', label: 'Cancelada' },
              ].map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setStatus(st.id as ReferenceStatus)}
                  className={`p-2.5 rounded-xl border text-center font-bold transition cursor-pointer ${
                    status === st.id
                      ? 'bg-[#166E7A] text-white border-[#166E7A]'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Bitácora / Observaciones de Actualización
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Detalla qué ocurrió (ej. Se entregó copia al familiar, paciente acudió a consulta, etc.)..."
              required
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166E7A]"
            />
          </div>

          {status === 'ATTENDED' && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-900 block">
                Cierre de Referencia / Retorno Clínico
              </span>
              <div>
                <label className="text-[11px] font-bold text-emerald-950 block mb-0.5">
                  Respuesta o Diagnóstico del Centro de Salud
                </label>
                <input
                  type="text"
                  value={respuestaEstablecimiento}
                  onChange={(e) => setRespuestaEstablecimiento(e.target.value)}
                  placeholder="Ej. Paciente atendido en medicina interna, diagnosticado con..."
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-emerald-300 rounded-xl"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-emerald-950 block mb-0.5">
                  Indicaciones para Seguimiento en Comunidad
                </label>
                <input
                  type="text"
                  value={indicacionesRetorno}
                  onChange={(e) => setIndicacionesRetorno(e.target.value)}
                  placeholder="Ej. Continuar antihipertensivo, control de signos en 15 días..."
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-emerald-300 rounded-xl"
                />
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={guardando || !notes.trim()}
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#166E7A] hover:bg-[#105F68] text-white text-xs font-bold rounded-xl shadow-xs transition active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{guardando ? 'Guardando...' : 'Actualizar Estado'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};