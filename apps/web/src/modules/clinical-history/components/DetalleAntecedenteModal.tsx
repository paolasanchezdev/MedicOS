// =========================================================================
// ARCHIVO: apps/web/src/modules/clinical-history/components/DetalleAntecedenteModal.tsx
// DESCRIPCIÓN: Modal reutilizable para visualizar antecedentes médicos, familiares
//              o quirúrgicos registrados en el expediente.
// =========================================================================

import React from 'react';
import { X, Calendar, Activity, Users, Scissors, FileText } from 'lucide-react';
import type {
  MedicalHistoryItem,
  FamilyHistoryItem,
  SurgicalHistoryItem,
} from '../types/clinical-history.types.js';

export type AnyAntecedente =
  | { kind: 'MEDICAL'; data: MedicalHistoryItem }
  | { kind: 'FAMILY'; data: FamilyHistoryItem }
  | { kind: 'SURGICAL'; data: SurgicalHistoryItem };

interface DetalleAntecedenteModalProps {
  antecedente: AnyAntecedente | null;
  onClose: () => void;
}

export const DetalleAntecedenteModal: React.FC<DetalleAntecedenteModalProps> = ({ antecedente, onClose }) => {
  if (!antecedente) return null;

  const { kind, data } = antecedente;

  const headers: Record<string, { title: string; subtitle: string; icon: React.ReactNode }> = {
    MEDICAL: {
      title: 'Antecedente Patológico Personal',
      subtitle: (data as MedicalHistoryItem).name,
      icon: <Activity className="w-4 h-4 text-[#2B7A78]" />,
    },
    FAMILY: {
      title: 'Antecedente Heredo-Familiar',
      subtitle: (data as FamilyHistoryItem).condition,
      icon: <Users className="w-4 h-4 text-purple-600" />,
    },
    SURGICAL: {
      title: 'Antecedente Quirúrgico',
      subtitle: (data as SurgicalHistoryItem).procedure,
      icon: <Scissors className="w-4 h-4 text-indigo-600" />,
    },
  };

  const currentHeader = headers[kind];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white/95 backdrop-blur-xl border border-white/60 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] rounded-3xl p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto scrollbar-none animate-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#2B7A78] flex items-center gap-1.5">
              {currentHeader.icon}
              {currentHeader.title}
            </span>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              {currentHeader.subtitle}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          {kind === 'FAMILY' && (
            <div className="bg-purple-50/70 border border-purple-200/70 rounded-2xl p-3.5 space-y-0.5">
              <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">
                Familiar Afectado
              </span>
              <p className="text-purple-950 font-black text-sm">{(data as FamilyHistoryItem).relative}</p>
            </div>
          )}

          <div className="bg-slate-50/80 border border-slate-200/70 rounded-2xl p-3.5 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#2B7A78]" /> Detalles y Observaciones
            </span>
            <p className="text-slate-700 leading-relaxed font-medium">
              {kind === 'MEDICAL' && (data as MedicalHistoryItem).description}
              {kind === 'FAMILY' && ((data as FamilyHistoryItem).notes || 'Antecedente documentado en expediente.')}
              {kind === 'SURGICAL' && ((data as SurgicalHistoryItem).notes || 'Procedimiento quirúrgico documentado.')}
            </p>
          </div>

          <div className="bg-slate-50/80 border border-slate-200/70 rounded-2xl p-3.5 space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#2B7A78]" /> Registrado en Expediente
            </span>
            <p className="text-slate-800 font-bold capitalize">
              {new Date(data.recordedAt).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2 bg-[#2B7A78] hover:bg-[#236866] text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer active:scale-95"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetalleAntecedenteModal;