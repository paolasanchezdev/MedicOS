// apps/web/src/modules/resources/components/EquipmentMaintenanceModal.tsx
import React, { useState } from 'react';
import { X, Wrench, AlertCircle } from 'lucide-react';
import type { MedicalEquipment, EquipmentStatus } from '../types/resource.types';

interface EquipmentMaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (id: string, status: EquipmentStatus) => Promise<void>;
  equipment: MedicalEquipment | null;
}

interface MaintenanceFormProps {
  equipment: MedicalEquipment;
  onClose: () => void;
  onUpdateStatus: (id: string, status: EquipmentStatus) => Promise<void>;
}

const MaintenanceForm: React.FC<MaintenanceFormProps> = ({
  equipment,
  onClose,
  onUpdateStatus,
}) => {
  const [status, setStatus] = useState<EquipmentStatus>(equipment.status);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      setIsSubmitting(true);
      await onUpdateStatus(equipment.id, status);
      onClose();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Error al actualizar estado.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
            <Wrench className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-800">Control Operativo y Mantenimiento</h2>
            <p className="text-xs text-slate-500 font-mono">{equipment.code}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-xs text-rose-700">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Equipo
          </label>
          <p className="text-sm font-semibold text-slate-800">{equipment.name}</p>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            S/N: {equipment.serialNumber || 'No registrado'}
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Estado Operativo *
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as EquipmentStatus)}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 bg-white"
          >
            <option value="OPERATIONAL">Operativo (Habilitado para brigadas)</option>
            <option value="IN_MAINTENANCE">En Mantenimiento / Calibración</option>
            <option value="DAMAGED">Dañado (Requiere reparación)</option>
            <option value="DECOMMISSIONED">Dado de Baja</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition-colors shadow-xs"
          >
            {isSubmitting ? 'Actualizando...' : 'Guardar Estado'}
          </button>
        </div>
      </form>
    </div>
  );
};

export const EquipmentMaintenanceModal: React.FC<EquipmentMaintenanceModalProps> = ({
  isOpen,
  onClose,
  onUpdateStatus,
  equipment,
}) => {
  if (!isOpen || !equipment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <MaintenanceForm
        key={equipment.id}
        equipment={equipment}
        onClose={onClose}
        onUpdateStatus={onUpdateStatus}
      />
    </div>
  );
};