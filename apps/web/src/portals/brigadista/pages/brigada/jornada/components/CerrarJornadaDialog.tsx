// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/brigada/jornada/components/CerrarJornadaDialog.tsx
// DESCRIPCIÓN: Diálogo modal de confirmación y validación previa a finalizar jornada.
// =========================================================================

import React from 'react';
import { AlertTriangle, X, CheckCircle2 } from 'lucide-react';

interface CerrarJornadaDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  pendientesCount: number;
  totalAtendidos: number;
}

export const CerrarJornadaDialog: React.FC<CerrarJornadaDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  pendientesCount,
  totalAtendidos,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-medicos-surface border border-medicos-soft-border rounded-2xl max-w-md w-full p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-medicos-dark-blue">Finalizar Jornada Médica</h3>
              <p className="text-xs text-medicos-muted">Confirmación requerida en estación</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-medicos-muted hover:text-medicos-dark-blue rounded-lg">
            <X size={18} />
          </button>
        </div>

        <div className="p-4 bg-medicos-canvas rounded-xl border border-medicos-soft-border space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-medicos-muted">Total pacientes atendidos hoy:</span>
            <strong className="text-medicos-dark-blue">{totalAtendidos}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-medicos-muted">Registros pendientes de sincronización:</span>
            <strong className={pendientesCount > 0 ? 'text-amber-700' : 'text-emerald-700'}>
              {pendientesCount} registros
            </strong>
          </div>
        </div>

        {pendientesCount > 0 && (
          <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs flex items-start gap-2">
            <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
            <p><strong>Advertencia:</strong> Existen registros en la estación local que aún no se han sincronizado con el servidor central. Asegúrate de sincronizar antes de apagar el dispositivo.</p>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-medicos-canvas hover:bg-medicos-soft-border/50 text-medicos-dark-blue font-semibold text-xs rounded-xl transition-all cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCircle2 size={15} />
            <span>Sí, Finalizar Jornada</span>
          </button>
        </div>
      </div>
    </div>
  );
};