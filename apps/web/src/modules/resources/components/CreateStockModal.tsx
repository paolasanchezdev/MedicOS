// apps/web/src/modules/resources/components/CreateStockModal.tsx
import React, { useState } from 'react';
import { X, PackagePlus, AlertCircle, AlertTriangle } from 'lucide-react';
import type { ResourceWithMetrics, CreateResourceStockDto } from '../types/resource.types';

interface CreateStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dto: CreateResourceStockDto) => Promise<void>;
  resources: ResourceWithMetrics[];
  selectedResource?: ResourceWithMetrics | null;
  onOpenCreateResource?: () => void;
}

interface StockFormProps {
  resources: ResourceWithMetrics[];
  selectedResource?: ResourceWithMetrics | null;
  onClose: () => void;
  onSubmit: (dto: CreateResourceStockDto) => Promise<void>;
  onOpenCreateResource?: () => void;
}

const StockForm: React.FC<StockFormProps> = ({
  resources,
  selectedResource,
  onClose,
  onSubmit,
  onOpenCreateResource,
}) => {
  const initialResourceId = selectedResource?.id || (resources.length > 0 ? (resources[0]?.id ?? '') : '');
  const [resourceId, setResourceId] = useState(initialResourceId);
  const [lotNumber, setLotNumber] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [quantityAvailable, setQuantityAvailable] = useState<number>(100);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!resourceId || !lotNumber.trim() || !expirationDate || quantityAvailable <= 0) {
      setErrorMessage('Todos los campos son obligatorios y la cantidad debe ser mayor a 0.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        resourceId,
        lotNumber: lotNumber.trim().toUpperCase(),
        expirationDate,
        quantityAvailable: Number(quantityAvailable),
      });
      onClose();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Error al registrar el lote de stock.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasNoResources = resources.length === 0 && !selectedResource;

  return (
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
            <PackagePlus className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-800">Ingreso de Lote a Bodega</h2>
            <p className="text-xs text-slate-500">Trazabilidad de existencias físicas y caducidad</p>
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

      {hasNoResources ? (
        <div className="p-6 space-y-4 text-center">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800">Catálogo institucional vacío</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              Primero debes registrar al menos un medicamento o insumo en el catálogo maestro antes de ingresar lotes de stock.
            </p>
          </div>
          <div className="flex justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cerrar
            </button>
            {onOpenCreateResource && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenCreateResource();
                }}
                className="px-4 py-2 text-xs font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors shadow-xs"
              >
                Crear Medicamento Primero
              </button>
            )}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Fármaco o Insumo *
            </label>
            <select
              value={resourceId}
              disabled={Boolean(selectedResource)}
              onChange={(e) => setResourceId(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 bg-white disabled:bg-slate-100"
            >
              {resources.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.code} - {r.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Número de Lote Sanitario *
            </label>
            <input
              type="text"
              placeholder="Ej. LOT-2026-X89"
              value={lotNumber}
              onChange={(e) => setLotNumber(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Fecha de Vencimiento *
              </label>
              <input
                type="date"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Cantidad Ingresada *
              </label>
              <input
                type="number"
                min="1"
                value={quantityAvailable}
                onChange={(e) => setQuantityAvailable(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600"
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
              {isSubmitting ? 'Ingresando...' : 'Registrar Lote'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export const CreateStockModal: React.FC<CreateStockModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  resources,
  selectedResource,
  onOpenCreateResource,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <StockForm
        key={selectedResource ? selectedResource.id : 'create-stock-form'}
        resources={resources}
        selectedResource={selectedResource}
        onClose={onClose}
        onSubmit={onSubmit}
        onOpenCreateResource={onOpenCreateResource}
      />
    </div>
  );
};