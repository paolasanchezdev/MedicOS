// apps/web/src/modules/resources/components/CreateEquipmentModal.tsx
import React, { useState } from 'react';
import { X, Stethoscope, AlertCircle } from 'lucide-react';
import type { MedicalEquipment, CreateMedicalEquipmentDto, EquipmentStatus } from '../types/resource.types';

interface CreateEquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dto: CreateMedicalEquipmentDto) => Promise<void>;
  equipmentToEdit?: MedicalEquipment | null;
}

interface EquipmentFormProps {
  equipmentToEdit?: MedicalEquipment | null;
  onClose: () => void;
  onSubmit: (dto: CreateMedicalEquipmentDto) => Promise<void>;
}

const EquipmentForm: React.FC<EquipmentFormProps> = ({
  equipmentToEdit,
  onClose,
  onSubmit,
}) => {
  const [code, setCode] = useState(equipmentToEdit?.code ?? '');
  const [name, setName] = useState(equipmentToEdit?.name ?? '');
  const [model, setModel] = useState(equipmentToEdit?.model ?? '');
  const [serialNumber, setSerialNumber] = useState(equipmentToEdit?.serialNumber ?? '');
  const [status, setStatus] = useState<EquipmentStatus>(equipmentToEdit?.status ?? 'OPERATIONAL');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!code.trim() || !name.trim()) {
      setErrorMessage('El código institucional y el nombre del equipo son obligatorios.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        code: code.trim().toUpperCase(),
        name: name.trim(),
        model: model.trim() || undefined,
        serialNumber: serialNumber.trim() || undefined,
        status,
      });
      onClose();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Error al guardar equipo médico.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
            <Stethoscope className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-800">
              {equipmentToEdit ? 'Editar Equipo Médico' : 'Nuevo Equipo Médico'}
            </h2>
            <p className="text-xs text-slate-500">Instrumental clínico y aparatos de diagnóstico</p>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Código Institucional *
            </label>
            <input
              type="text"
              disabled={Boolean(equipmentToEdit)}
              placeholder="Ej. EQ-ESTET-01"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 disabled:bg-slate-100 font-mono"
            />
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
              <option value="OPERATIONAL">Operativo (Listo)</option>
              <option value="IN_MAINTENANCE">En Mantenimiento</option>
              <option value="DAMAGED">Dañado</option>
              <option value="DECOMMISSIONED">Dado de Baja</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Nombre del Instrumental / Dispositivo *
          </label>
          <input
            type="text"
            placeholder="Ej. Estetoscopio Clínico Littmann Classic III"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Modelo / Fabricante
            </label>
            <input
              type="text"
              placeholder="Ej. Classic III / 3M"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Número de Serie (S/N)
            </label>
            <input
              type="text"
              placeholder="Ej. SN-3M-889021"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 font-mono"
            />
          </div>
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
            className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors shadow-xs"
          >
            {isSubmitting ? 'Guardando...' : equipmentToEdit ? 'Actualizar Equipo' : 'Registrar Equipo'}
          </button>
        </div>
      </form>
    </div>
  );
};

export const CreateEquipmentModal: React.FC<CreateEquipmentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  equipmentToEdit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <EquipmentForm
        key={equipmentToEdit ? equipmentToEdit.id : 'create-equipment-form'}
        equipmentToEdit={equipmentToEdit}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    </div>
  );
};