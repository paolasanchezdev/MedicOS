// apps/web/src/modules/resources/components/DeleteDeviceModal.tsx
import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import type { DeviceItem } from '../types/resource.types';

interface DeleteDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  device: DeviceItem | null;
}

export const DeleteDeviceModal: React.FC<DeleteDeviceModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  device,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen || !device) return null;

  const handleConfirm = async () => {
    try {
      setIsDeleting(true);
      setErrorMessage(null);
      await onConfirm();
      onClose();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Error al retirar dispositivo.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <h3 className="text-base font-bold text-slate-800">
            ¿Dar de baja {device.name}?
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            El hardware con número de serie <span className="font-mono font-semibold text-slate-700">{device.serialNumber}</span> será marcado como retirado y se desactivará su clave de sincronización con el servidor central.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
            {errorMessage}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-lg hover:bg-rose-700 transition-colors shadow-xs"
          >
            {isDeleting ? 'Retirando...' : 'Confirmar Retiro'}
          </button>
        </div>
      </div>
    </div>
  );
};