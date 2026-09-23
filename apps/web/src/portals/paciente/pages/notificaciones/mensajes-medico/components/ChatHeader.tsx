// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/notificaciones/mensajes-medico/components/ChatHeader.tsx
// DESCRIPCIÓN: Cabecera superior del chat con información del médico y disponibilidad.
// =========================================================================

import React from 'react';
import { User, Building, ShieldCheck } from 'lucide-react';
import type { ClinicalConversationThread, DoctorAvailability } from '../../../../../../modules/clinical-messages/types/clinical-messages.types.js';

interface ChatHeaderProps {
  thread: ClinicalConversationThread;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ thread }) => {
  const renderStatusBadge = (status: DoctorAvailability) => {
    switch (status) {
      case 'DISPONIBLE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Disponible para responder
          </span>
        );
      case 'EN_CONSULTA':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            En consulta presencial
          </span>
        );
      case 'OCUPADO':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            Ocupado en procedimiento
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold text-slate-600 bg-slate-100 border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            Fuera de turno
          </span>
        );
    }
  };

  return (
    <div className="p-3 sm:p-4 border-b border-slate-200 flex items-center justify-between gap-3 bg-white select-none">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 text-[#1c5752] flex items-center justify-center font-bold shrink-0">
          <User className="w-4 h-4 text-[#1c5752]" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="text-sm font-black text-slate-900 truncate tracking-tight">
              {thread.doctorName}
            </h3>
            <span title="Profesional Verificado de la Red MedicOS">
              <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5 truncate">
            <span>{thread.doctorSpecialty}</span>
            <span>•</span>
            <span className="flex items-center gap-1 truncate text-slate-400">
              <Building className="w-3 h-3 text-[#1c5752]" />
              {thread.relatedContext.establishmentName}
            </span>
          </p>
        </div>
      </div>

      <div className="shrink-0">
        {renderStatusBadge(thread.doctorAvailability)}
      </div>
    </div>
  );
};

export default ChatHeader;