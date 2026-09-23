// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/notificaciones/mensajes-medico/components/ChatMessageBubble.tsx
// DESCRIPCIÓN: Burbuja de mensaje estilo iOS Messages con curvas orgánicas,
//              menú contextual flotante y renderizado clínico estructurado.
// =========================================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Check,
  CheckCheck,
  Activity,
  TestTube2,
  AlertTriangle,
  ArrowRight,
  Pencil,
  Trash2,
} from 'lucide-react';
import type { ClinicalMessageItem } from '../../../../../../modules/clinical-messages/types/clinical-messages.types.js';

interface ChatMessageBubbleProps {
  message: ClinicalMessageItem;
  onEditMessage?: (message: ClinicalMessageItem) => void;
  onDeleteMessage?: (messageId: string) => void;
}

export const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({
  message,
  onEditMessage,
  onDeleteMessage,
}) => {
  const navigate = useNavigate();
  const isPatient = message.senderRole === 'PATIENT';
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const formatTime = (isoString: string): string => {
    try {
      return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  const renderStatusCheck = () => {
    if (!isPatient) return null;
    switch (message.status) {
      case 'READ':
        return (
          <span title="Leído por el médico" className="inline-flex items-center">
            <CheckCheck className="w-3.5 h-3.5 text-teal-200" />
          </span>
        );
      case 'DELIVERED':
        return (
          <span title="Entregado" className="inline-flex items-center">
            <CheckCheck className="w-3.5 h-3.5 text-white/70" />
          </span>
        );
      default:
        return (
          <span title="Enviado" className="inline-flex items-center">
            <Check className="w-3.5 h-3.5 text-white/70" />
          </span>
        );
    }
  };

  return (
    <div className={`flex flex-col ${isPatient ? 'items-end' : 'items-start'} space-y-1 group relative my-1`}>
      {/* Menú Flotante de Acciones estilo iOS (Pencil / Trash) */}
      {isPatient && !showConfirmDelete && (
        <div className="opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-all duration-150 flex items-center gap-1 bg-white/90 backdrop-blur-md border border-slate-200/90 shadow-sm rounded-full px-2 py-0.5 mb-0.5 z-10">
          <button
            type="button"
            onClick={() => onEditMessage?.(message)}
            title="Editar mensaje"
            className="p-1 rounded-full text-slate-500 hover:text-[#1c5752] hover:bg-slate-100 transition cursor-pointer"
          >
            <Pencil className="w-3 h-3" />
          </button>
          <div className="w-px h-3 bg-slate-200" />
          <button
            type="button"
            onClick={() => setShowConfirmDelete(true)}
            title="Eliminar mensaje"
            className="p-1 rounded-full text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Confirmación flotante estilo iOS */}
      {showConfirmDelete ? (
        <div className="p-3 bg-white border border-rose-200 shadow-md rounded-2xl space-y-2 animate-in fade-in zoom-in-95 duration-150 max-w-xs text-xs z-10">
          <p className="font-bold text-slate-800">¿Eliminar este mensaje?</p>
          <p className="text-[11px] text-slate-500">Se retirará permanentemente de la conversación clínica.</p>
          <div className="flex items-center gap-2 justify-end pt-1">
            <button
              type="button"
              onClick={() => setShowConfirmDelete(false)}
              className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => {
                onDeleteMessage?.(message.id);
                setShowConfirmDelete(false);
              }}
              className="px-2.5 py-1 text-[11px] rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold transition cursor-pointer"
            >
              Eliminar
            </button>
          </div>
        </div>
      ) : (
        /* Burbuja de Mensaje Estilo iOS */
        <div
          className={`max-w-[85%] sm:max-w-[72%] px-4 py-2.5 shadow-xs text-[13px] leading-relaxed relative ${
            isPatient
              ? 'bg-[#1c5752] text-white rounded-[22px] rounded-br-[5px]'
              : 'bg-white border border-slate-200/80 text-slate-800 rounded-[22px] rounded-bl-[5px]'
          }`}
        >
          {/* Contenido textual del mensaje */}
          <p className="whitespace-pre-wrap select-text">{message.content}</p>

          {/* TARJETA ADJUNTA: Diario de Síntomas estilo iOS Card */}
          {message.type === 'CLINICAL_SYMPTOM' && message.payload?.symptoms && (
            <div
              className={`mt-2.5 p-3 rounded-2xl text-xs space-y-2 border ${
                isPatient
                  ? 'bg-white/12 border-white/20 text-white'
                  : 'bg-teal-50/70 border-teal-200/80 text-slate-800'
              }`}
            >
              <div className="flex items-center justify-between gap-2 border-b pb-1.5 border-white/15">
                <span className="font-bold flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-teal-300" />
                  Registro de Síntomas
                </span>
                {message.payload.isWarningSign && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white shadow-2xs">
                    <AlertTriangle className="w-3 h-3" />
                    Signo de Alarma
                  </span>
                )}
              </div>

              <div className="space-y-1">
                {message.payload.symptoms.map((s, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-2 text-[11px]">
                    <span>• {s.name} ({s.onset})</span>
                    <span className="font-mono font-bold text-[10px] px-2 py-0.5 rounded-full bg-black/15">
                      {s.intensity}
                    </span>
                  </div>
                ))}
              </div>

              {message.payload.notes && (
                <p className="text-[10.5px] italic pt-1 border-t border-white/10 opacity-90">
                  "{message.payload.notes}"
                </p>
              )}

              <button
                type="button"
                onClick={() => navigate('/paciente/salud-materna/diario-sintomas')}
                className={`w-full py-1.5 px-3 rounded-xl text-[11px] font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  isPatient
                    ? 'bg-white/20 hover:bg-white/30 text-white'
                    : 'bg-white hover:bg-teal-50 text-[#1c5752] border border-slate-200'
                }`}
              >
                <span>Ver en Diario de Síntomas</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* TARJETA ADJUNTA: Estudio de Laboratorio estilo iOS Card */}
          {message.type === 'CLINICAL_LAB' && message.payload?.labStudyName && (
            <div
              className={`mt-2.5 p-3 rounded-2xl text-xs space-y-2 border ${
                isPatient
                  ? 'bg-white/12 border-white/20 text-white'
                  : 'bg-indigo-50/70 border-indigo-200/80 text-slate-800'
              }`}
            >
              <div className="flex items-center justify-between gap-2 border-b pb-1.5 border-white/15">
                <span className="font-bold flex items-center gap-1.5">
                  <TestTube2 className="w-3.5 h-3.5 text-indigo-300" />
                  Estudio de Laboratorio
                </span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-black/15">
                  {message.payload.labStudyCode}
                </span>
              </div>

              <p className="font-bold text-[12px]">{message.payload.labStudyName}</p>
              {message.payload.labAnalytesSummary && (
                <p className="text-[11px] opacity-90">{message.payload.labAnalytesSummary}</p>
              )}

              <button
                type="button"
                onClick={() => navigate('/paciente/estudios/resultados-laboratorio')}
                className={`w-full py-1.5 px-3 rounded-xl text-[11px] font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  isPatient
                    ? 'bg-white/20 hover:bg-white/30 text-white'
                    : 'bg-white hover:bg-indigo-50 text-indigo-900 border border-slate-200'
                }`}
              >
                <span>Ver Resultados Oficiales</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Pie de burbuja: Hora, Estado (editado) y Doble Check */}
          <div
            className={`flex items-center justify-end gap-1.5 text-[10px] font-mono mt-1 ${
              isPatient ? 'text-teal-100/75' : 'text-slate-400'
            }`}
          >
            {message.isEdited && <span className="italic text-[9.5px] opacity-75">(editado)</span>}
            <span>{formatTime(message.createdAt)}</span>
            {renderStatusCheck()}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessageBubble;