// apps/web/src/modules/resources/components/CreateResourceModal.tsx
import React, { useState } from 'react';
import { X, Pill, AlertCircle } from 'lucide-react';
import type { ResourceWithMetrics, CreateResourceDto, ResourceCategory } from '../types/resource.types';

interface CreateResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dto: CreateResourceDto) => Promise<void>;
  resourceToEdit?: ResourceWithMetrics | null;
}

interface ResourceFormProps {
  resourceToEdit?: ResourceWithMetrics | null;
  onClose: () => void;
  onSubmit: (dto: CreateResourceDto) => Promise<void>;
}

const ResourceForm: React.FC<ResourceFormProps> = ({
  resourceToEdit,
  onClose,
  onSubmit,
}) => {
  const [code, setCode] = useState(resourceToEdit?.code ?? '');
  const [name, setName] = useState(resourceToEdit?.name ?? '');
  const [genericName, setGenericName] = useState(resourceToEdit?.genericName ?? '');
  const [category, setCategory] = useState<ResourceCategory>(resourceToEdit?.category ?? 'MEDICINE');
  const [unit, setUnit] = useState(resourceToEdit?.unit ?? 'Tabletas');
  const [minThreshold, setMinThreshold] = useState<number>(resourceToEdit?.minThreshold ?? 20);
  const [isConsumable, setIsConsumable] = useState<boolean>(resourceToEdit?.isConsumable ?? true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!code.trim() || !name.trim() || !unit.trim()) {
      setErrorMessage('Código, nombre comercial y unidad de medida son obligatorios.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        code: code.trim().toUpperCase(),
        name: name.trim(),
        genericName: genericName.trim() || null,
        category,
        unit: unit.trim(),
        minThreshold: Number(minThreshold) || 10,
        isConsumable,
      });
      onClose();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Ocurrió un error al guardar.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
            <Pill className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-800">
              {resourceToEdit ? 'Editar Medicamento / Insumo' : 'Nuevo Medicamento / Insumo'}
            </h2>
            <p className="text-xs text-slate-500">Catálogo institucional de recursos clínicos</p>
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
              disabled={Boolean(resourceToEdit)}
              placeholder="Ej. MED-AMOX-500"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 disabled:bg-slate-100 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Categoría *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ResourceCategory)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 bg-white"
            >
              <option value="MEDICINE">Medicamento</option>
              <option value="CLINICAL_SUPPLY">Insumo Clínico / Curación</option>
              <option value="OTHER">Otro Suministro</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Nombre Comercial / Descripción *
          </label>
          <input
            type="text"
            placeholder="Ej. Amoxicilina 500mg cápsulas"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Nombre Genérico / Principio Activo
          </label>
          <input
            type="text"
            placeholder="Ej. Amoxicilina Trihidrato"
            value={genericName}
            onChange={(e) => setGenericName(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Unidad de Presentación *
            </label>
            <input
              type="text"
              placeholder="Tabletas, Frascos, Viales, Rollos..."
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Umbral Mínimo de Alerta *
            </label>
            <input
              type="number"
              min="1"
              value={minThreshold}
              onChange={(e) => setMinThreshold(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="isConsumableCheck"
            checked={isConsumable}
            onChange={(e) => setIsConsumable(e.target.checked)}
            className="rounded text-teal-600 focus:ring-teal-600/20 w-4 h-4"
          />
          <label htmlFor="isConsumableCheck" className="text-xs text-slate-600">
            Es material fungible / consumible (se descuenta con la dispensación).
          </label>
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
            {isSubmitting ? 'Guardando...' : resourceToEdit ? 'Actualizar Fármaco' : 'Registrar en Catálogo'}
          </button>
        </div>
      </form>
    </div>
  );
};

export const CreateResourceModal: React.FC<CreateResourceModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  resourceToEdit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <ResourceForm
        key={resourceToEdit ? resourceToEdit.id : 'create-resource-form'}
        resourceToEdit={resourceToEdit}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    </div>
  );
};