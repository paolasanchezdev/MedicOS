// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/notificaciones/mensajes-medico/components/ChatClinicalContextCard.tsx
// DESCRIPCIÓN: Ficha contextual estilo widget iOS con diseño minimalista y limpio.
// =========================================================================

import React, { useState } from 'react';
import { FileText, ChevronDown, ChevronUp, Pill, MapPin } from 'lucide-react';
import type { ClinicalConversationThread } from '../../../../../../modules/clinical-messages/types/clinical-messages.types.js';

interface ChatClinicalContextCardProps {
  thread: ClinicalConversationThread;
}

export const ChatClinicalContextCard: React.FC<ChatClinicalContextCardProps> = ({ thread }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const { relatedContext } = thread;

  return (
    <div className="border-b border-slate-200/70 bg-slate-50/70 backdrop-blur-xs px-4 py-2.5 transition-all select-none">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-full bg-teal-100/80 text-[#1c5752] flex items-center justify-center shrink-0">
            <FileText className="w-3.5 h-3.5 text-[#1c5752]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900 tracking-tight truncate">
                Atención <span className="font-mono text-[#1c5752]">{relatedContext.code}</span>
              </span>
              <span className="text-[10.5px] font-mono text-slate-400 hidden sm:inline">
                ({new Date(relatedContext.date).toLocaleDateString('es-SV', { day: 'numeric', month: 'short' })})
              </span>
            </div>
            <p className="text-[11px] text-slate-500 truncate font-medium">
              {relatedContext.diagnosisSummary}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 text-[11px] font-bold text-[#1c5752] hover:text-[#164743] px-2.5 py-1 rounded-full hover:bg-teal-100/60 transition cursor-pointer shrink-0"
        >
          <span>{isExpanded ? 'Ocultar' : 'Ver indicación'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-2.5 pt-2 border-t border-slate-200/60 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs animate-in fade-in duration-150">
          <div className="p-3 rounded-2xl bg-white border border-slate-200/80 space-y-1 shadow-2xs">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#1c5752]" />
              Sede o Brigada
            </span>
            <p className="text-[11.5px] font-medium text-slate-700">
              {relatedContext.establishmentName}
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-teal-50/60 border border-teal-200 space-y-1 shadow-2xs">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#1c5752] flex items-center gap-1">
              <Pill className="w-3 h-3 text-[#1c5752]" />
              Indicación Oficial
            </span>
            <p className="text-[11.5px] font-medium text-slate-800 leading-snug">
              {relatedContext.treatmentPlan ? `"${relatedContext.treatmentPlan}"` : 'Sin indicaciones documentadas.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatClinicalContextCard;