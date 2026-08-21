// apps/web/src/modules/brigades/components/BrigadeStatusModal.tsx
import React, { useState } from 'react';
import { X, Activity, ShieldAlert } from 'lucide-react';
import type { BrigadeItem, BrigadeStatus } from '../types/brigade.types';

export interface BrigadeStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (id: string, status: BrigadeStatus) => Promise<void>;
  brigade: BrigadeItem | null;
}

const STATUS_OPTIONS: { value: BrigadeStatus; label: string; desc: string }[] = [
  { value: 'PLANNED', label: 'Planificada', desc: 'En fase de preparación y dotación logística.' },
  { value: 'ACTIVE', label: 'En Despliegue / Activa', desc: 'Operando en territorio con jornadas activas.' },
  { value: 'COMPLETED', label: 'Completada / Finalizada', desc: 'Jornadas concluidas y sincronizadas con el servidor central.' },
  { value: 'CANCELLED', label: 'Cancelada', desc: 'Expedición suspendida u operativamente anulada.' },
];

interface FormContentProps {
  onClose: () => void;
  onUpdateStatus: (id: string, status: BrigadeStatus) => Promise<void>;
  brigade: BrigadeItem;
}

const BrigadeStatusFormContent: React.FC<FormContentProps> = ({
  onClose,
  onUpdateStatus,
  brigade,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<BrigadeStatus>(brigade.status);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      await onUpdateStatus(brigade.id, selectedStatus);
      onClose();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Error al cambiar estado');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-800">Estado Operativo de Brigada</h2>
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

        <div className="space-y-2">
          {STATUS_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                selectedStatus === opt.value
                  ? 'border-teal-600 bg-teal-50/40 ring-1 ring-teal-600'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <input
                type="radio"
                name="status"
                value={opt.value}
                checked={selectedStatus === opt.value}
                onChange={() => setSelectedStatus(opt.value)}
                className="mt-1 text-teal-600 focus:ring-teal-500"
              />
              <div>
                <div className="font-semibold text-slate-800 text-xs">{opt.label}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{opt.desc}</div>
              </div>
            </label>
          ))}
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
            <Activity className="w-3.5 h-3.5" />
            {isSubmitting ? 'Actualizando...' : 'Actualizar Estado'}
          </button>
        </div>
      </form>
    </div>
  );
};

export const BrigadeStatusModal: React.FC<BrigadeStatusModalProps> = (props) => {
  if (!props.isOpen || !props.brigade) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <BrigadeStatusFormContent
        key={props.brigade.id}
        onClose={props.onClose}
        onUpdateStatus={props.onUpdateStatus}
        brigade={props.brigade}
      />
    </div>
  );
};