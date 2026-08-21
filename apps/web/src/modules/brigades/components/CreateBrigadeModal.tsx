// apps/web/src/modules/brigades/components/CreateBrigadeModal.tsx
import React, { useState } from 'react';
import { X, Calendar, MapPin, User, Users, ShieldAlert } from 'lucide-react';
import type {
  BrigadeItem,
  CreateBrigadeDto,
  EligiblePersonnel,
} from '../types/brigade.types';

export interface CreateBrigadeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dto: CreateBrigadeDto) => Promise<void>;
  brigadeToEdit?: BrigadeItem | null;
  personnel: EligiblePersonnel[];
}

const DEPARTMENTS = [
  'Ahuachapán',
  'Cabañas',
  'Chalatenango',
  'Cuscatlán',
  'La Libertad',
  'La Paz',
  'La Unión',
  'Morazán',
  'San Miguel',
  'San Salvador',
  'San Vicente',
  'Santa Ana',
  'Sonsonate',
  'Usulután',
];

interface FormContentProps {
  onClose: () => void;
  onSubmit: (dto: CreateBrigadeDto) => Promise<void>;
  brigadeToEdit?: BrigadeItem | null;
  personnel: EligiblePersonnel[];
}

const CreateBrigadeFormContent: React.FC<FormContentProps> = ({
  onClose,
  onSubmit,
  brigadeToEdit,
  personnel,
}) => {
  const [formData, setFormData] = useState<CreateBrigadeDto>(() => ({
    name: brigadeToEdit?.name ?? '',
    department: brigadeToEdit?.department ?? 'San Salvador',
    municipality: brigadeToEdit?.municipality ?? '',
    latitude: brigadeToEdit?.latitude ?? null,
    longitude: brigadeToEdit?.longitude ?? null,
    startDate: brigadeToEdit?.startDate
      ? brigadeToEdit.startDate.split('T')[0] ?? ''
      : new Date().toISOString().split('T')[0] ?? '',
    endDate: brigadeToEdit?.endDate ? brigadeToEdit.endDate.split('T')[0] ?? '' : '',
    leaderId: brigadeToEdit?.leaderId ?? '',
    memberIds: brigadeToEdit?.members.map((m) => m.userId) ?? [],
  }));

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.municipality.trim() || !formData.startDate) {
      setErrorMessage('Por favor completa todos los campos requeridos (*).');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      await onSubmit({
        ...formData,
        leaderId: formData.leaderId || null,
        endDate: formData.endDate || null,
      });
      onClose();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Error al guardar la brigada');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMemberToggle = (userId: string) => {
    setFormData((prev) => {
      const exists = prev.memberIds?.includes(userId);
      const newMemberIds = exists
        ? prev.memberIds?.filter((id) => id !== userId)
        : [...(prev.memberIds || []), userId];
      return { ...prev, memberIds: newMemberIds };
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-800">
            {brigadeToEdit ? 'Editar Brigada Médica' : 'Planificar Nueva Brigada'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Registro de expedición de salud comunitaria y dotación de personal
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4 flex-1 text-sm">
        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Nombre de la Brigada *
          </label>
          <input
            type="text"
            required
            placeholder="Ej: Brigada de Atención Integral El Mozote"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all text-slate-800 placeholder:text-slate-400"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Departamento *
            </label>
            <select
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all text-slate-800 bg-white"
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Municipio / Cantón *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="Ej: Meanguera"
                value={formData.municipality}
                onChange={(e) => setFormData({ ...formData, municipality: e.target.value })}
                className="w-full px-3.5 py-2 pl-9 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all text-slate-800"
              />
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Fecha de Inicio *
            </label>
            <div className="relative">
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3.5 py-2 pl-9 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all text-slate-800"
              />
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Fecha Estimada de Finalización
            </label>
            <div className="relative">
              <input
                type="date"
                value={formData.endDate || ''}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3.5 py-2 pl-9 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all text-slate-800"
              />
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Responsable / Líder de Brigada
          </label>
          <div className="relative">
            <select
              value={formData.leaderId || ''}
              onChange={(e) => setFormData({ ...formData, leaderId: e.target.value })}
              className="w-full px-3.5 py-2 pl-9 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all text-slate-800 bg-white"
            >
              <option value="">-- Sin líder asignado --</option>
              {personnel.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.firstName} {p.lastName} ({p.role}) - {p.email}
                </option>
              ))}
            </select>
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Equipo de Trabajo Inicial (Médicos y Brigadistas)
          </label>
          <div className="border border-slate-200 rounded-xl p-3 max-h-40 overflow-y-auto space-y-1.5 bg-slate-50/50">
            {personnel.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-2">
                No hay personal clínico disponible para asignar.
              </p>
            ) : (
              personnel.map((p) => {
                const isChecked = formData.memberIds?.includes(p.id);
                return (
                  <label
                    key={p.id}
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white border border-transparent hover:border-slate-200 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleMemberToggle(p.id)}
                      className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                    />
                    <div className="flex-1 text-xs">
                      <span className="font-semibold text-slate-800">
                        {p.firstName} {p.lastName}
                      </span>
                      <span className="text-slate-400 ml-2 font-mono text-[11px]">
                        [{p.role}]
                      </span>
                    </div>
                  </label>
                );
              })
            )}
          </div>
        </div>

        <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Users className="w-3.5 h-3.5" />
            {isSubmitting ? 'Guardando...' : brigadeToEdit ? 'Actualizar Brigada' : 'Crear Brigada'}
          </button>
        </div>
      </form>
    </div>
  );
};

export const CreateBrigadeModal: React.FC<CreateBrigadeModalProps> = (props) => {
  if (!props.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <CreateBrigadeFormContent
        key={props.brigadeToEdit?.id ?? 'new'}
        onClose={props.onClose}
        onSubmit={props.onSubmit}
        brigadeToEdit={props.brigadeToEdit}
        personnel={props.personnel}
      />
    </div>
  );
};