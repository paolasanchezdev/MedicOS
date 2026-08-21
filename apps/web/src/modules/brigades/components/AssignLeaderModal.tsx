// apps/web/src/modules/brigades/components/AssignLeaderModal.tsx
import React, { useState } from 'react';
import { X, UserCheck, ShieldAlert } from 'lucide-react';
import type { BrigadeItem, EligiblePersonnel } from '../types/brigade.types';

export interface AssignLeaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (brigadeId: string, leaderId: string | null) => Promise<void>;
  brigade: BrigadeItem | null;
  personnel: EligiblePersonnel[];
}

interface FormContentProps {
  onClose: () => void;
  onAssign: (brigadeId: string, leaderId: string | null) => Promise<void>;
  brigade: BrigadeItem;
  personnel: EligiblePersonnel[];
}

const AssignLeaderFormContent: React.FC<FormContentProps> = ({
  onClose,
  onAssign,
  brigade,
  personnel,
}) => {
  const [selectedLeaderId, setSelectedLeaderId] = useState<string>(
    brigade.leaderId || ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      await onAssign(brigade.id, selectedLeaderId || null);
      onClose();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Error al asignar el responsable');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-800">Asignar Responsable de Mando</h2>
          <p className="text-xs text-slate-500">{brigade.name}</p>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm">
        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Seleccionar Médico / Brigadista Coordinador
          </label>
          <select
            value={selectedLeaderId}
            onChange={(e) => setSelectedLeaderId(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 text-slate-800 bg-white"
          >
            <option value="">-- Dejar sin responsable asignado --</option>
            {personnel.map((p) => (
              <option key={p.id} value={p.id}>
                {p.firstName} {p.lastName} ({p.role}) - {p.email}
              </option>
            ))}
          </select>
        </div>

        <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 disabled:opacity-50"
          >
            <UserCheck className="w-3.5 h-3.5" />
            {isSubmitting ? 'Guardando...' : 'Confirmar Mando'}
          </button>
        </div>
      </form>
    </div>
  );
};

export const AssignLeaderModal: React.FC<AssignLeaderModalProps> = (props) => {
  if (!props.isOpen || !props.brigade) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <AssignLeaderFormContent
        key={props.brigade.id}
        onClose={props.onClose}
        onAssign={props.onAssign}
        brigade={props.brigade}
        personnel={props.personnel}
      />
    </div>
  );
};