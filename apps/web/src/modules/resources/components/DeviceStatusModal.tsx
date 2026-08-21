// apps/web/src/modules/resources/components/DeviceStatusModal.tsx
import React, { useState } from 'react';
import { X, Radio, AlertCircle } from 'lucide-react';
import type { DeviceItem, DeviceStatus } from '../types/resource.types';

interface DeviceStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (id: string, status: DeviceStatus) => Promise<void>;
  device: DeviceItem | null;
}

interface StatusFormProps {
  device: DeviceItem;
  onClose: () => void;
  onUpdateStatus: (id: string, status: DeviceStatus) => Promise<void>;
}

const StatusForm: React.FC<StatusFormProps> = ({
  device,
  onClose,
  onUpdateStatus,
}) => {
  const [status, setStatus] = useState<DeviceStatus>(device.status);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      setIsSubmitting(true);
      await onUpdateStatus(device.id, status);
      onClose();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Error al actualizar estado del dispositivo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-800">Estado de Dispositivo y Red</h2>
            <p className="text-xs text-slate-500 font-mono">{device.serialNumber}</p>
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
            Dispositivo
          </label>
          <p className="text-sm font-semibold text-slate-800">{device.name}</p>
          <p className="text-xs text-slate-500 mt-0.5">
            OS: {device.operatingSystem} • App: {device.appVersion}
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Estado Operativo *
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as DeviceStatus)}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 bg-white"
          >
            <option value="ACTIVE">Activo / Operando Conectado</option>
            <option value="OFFLINE">Offline (En campo sin red local central)</option>
            <option value="BLOCKED">Bloqueado / Certificado Revocado</option>
            <option value="RETIRED">Retirado del Parque Tecnológico</option>
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
            className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors shadow-xs"
          >
            {isSubmitting ? 'Guardando...' : 'Actualizar Estado'}
          </button>
        </div>
      </form>
    </div>
  );
};

export const DeviceStatusModal: React.FC<DeviceStatusModalProps> = ({
  isOpen,
  onClose,
  onUpdateStatus,
  device,
}) => {
  if (!isOpen || !device) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <StatusForm
        key={device.id}
        device={device}
        onClose={onClose}
        onUpdateStatus={onUpdateStatus}
      />
    </div>
  );
};