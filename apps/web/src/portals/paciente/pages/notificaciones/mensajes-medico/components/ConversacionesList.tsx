// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/notificaciones/mensajes-medico/components/ConversacionesList.tsx
// DESCRIPCIÓN: Lista lateral con scroll interno fluido y barras ocultas.
// =========================================================================

import React from 'react';
import { Search, User } from 'lucide-react';
import type { ClinicalConversationThread, DoctorAvailability } from '../../../../../../modules/clinical-messages/types/clinical-messages.types.js';

interface ConversacionesListProps {
  threads: ClinicalConversationThread[];
  selectedThreadId: string | null;
  onSelectThread: (thread: ClinicalConversationThread) => void;
  searchFilter: string;
  onSearchChange: (value: string) => void;
}

export const ConversacionesList: React.FC<ConversacionesListProps> = ({
  threads,
  selectedThreadId,
  onSelectThread,
  searchFilter,
  onSearchChange,
}) => {
  const getAvailabilityDot = (status: DoctorAvailability) => {
    switch (status) {
      case 'DISPONIBLE':
        return <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />;
      case 'EN_CONSULTA':
        return <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-white" />;
      case 'OCUPADO':
        return <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white" />;
      default:
        return <span className="w-2.5 h-2.5 rounded-full bg-slate-400 ring-2 ring-white" />;
    }
  };

  const formatTimeOrDate = (isoString?: string): string => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      const now = new Date();
      const isToday =
        d.getDate() === now.getDate() &&
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear();

      if (isToday) {
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }

      return d.toLocaleDateString('es-SV', { day: 'numeric', month: 'short' });
    } catch {
      return '';
    }
  };

  const filtered = threads.filter(
    (t) =>
      t.doctorName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      t.doctorSpecialty.toLowerCase().includes(searchFilter.toLowerCase()) ||
      t.relatedContext.diagnosisSummary.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 min-h-0">
      {/* Buscador Superior */}
      <div className="p-3.5 border-b border-slate-100 bg-slate-50/50 shrink-0">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por doctor o motivo..."
            className="w-full pl-8.5 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#1c5752] focus:border-[#1c5752] placeholder-slate-400 transition"
          />
        </div>
      </div>

      <div className="px-4 py-2 bg-slate-50/40 flex items-center justify-between border-b border-slate-100 shrink-0">
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
          Médicos que te atendieron
        </span>
        <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-teal-50 text-[#1c5752] border border-teal-200/80">
          {filtered.length}
        </span>
      </div>

      {/* Lista Scrolleable sin barra visible */}
      <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-slate-100 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No se encontraron conversaciones con ese filtro.
          </div>
        ) : (
          filtered.map((t) => {
            const isSelected = selectedThreadId === t.id;
            const hasRecentMessage = Boolean(t.lastMessage);
            const timeLabel = formatTimeOrDate(t.lastMessage?.createdAt || t.relatedContext.date);

            let previewText = t.relatedContext.diagnosisSummary;
            if (t.lastMessage) {
              const prefix = t.lastMessage.senderRole === 'PATIENT' ? 'Tú: ' : '';
              previewText = `${prefix}${t.lastMessage.content}`;
            }

            return (
              <div
                key={t.id}
                onClick={() => onSelectThread(t)}
                className={`p-3.5 transition-all cursor-pointer select-none flex items-start gap-3 relative ${
                  isSelected
                    ? 'bg-teal-50/90 border-l-4 border-[#1c5752]'
                    : 'hover:bg-slate-50'
                }`}
              >
                <div className="relative shrink-0 mt-0.5">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs ${
                      isSelected
                        ? 'bg-[#1c5752] text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <User className="w-5 h-5" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5">
                    {getAvailabilityDot(t.doctorAvailability)}
                  </div>
                </div>

                <div className="min-w-0 flex-1 space-y-0.5">
                  <div className="flex items-center justify-between gap-1">
                    <h4
                      className={`text-xs truncate ${
                        isSelected ? 'font-black text-slate-900' : 'font-bold text-slate-700'
                      }`}
                    >
                      {t.doctorName}
                    </h4>
                    <span
                      className={`text-[10px] font-mono shrink-0 ${
                        hasRecentMessage ? 'font-bold text-[#1c5752]' : 'text-slate-400'
                      }`}
                    >
                      {timeLabel}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 truncate font-medium">
                    {t.doctorSpecialty}
                  </p>

                  <div className="flex items-center gap-1.5 pt-0.5 text-[10.5px]">
                    <span className="font-mono text-[#1c5752] font-semibold shrink-0">
                      {t.relatedContext.code}
                    </span>
                    <span className="text-slate-300">·</span>
                    <p
                      className={`truncate ${
                        hasRecentMessage ? 'text-slate-700 font-medium' : 'text-slate-400'
                      }`}
                    >
                      {previewText}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ConversacionesList;