// apps/web/src/modules/resources/components/CreateDeviceModal.tsx
import React, { useState } from 'react';
import { X, Laptop, AlertCircle } from 'lucide-react';
import type { DeviceItem, CreateDeviceDto, DeviceStatus } from '../types/resource.types';

interface CreateDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dto: CreateDeviceDto) => Promise<void>;
  deviceToEdit?: DeviceItem | null;
}

interface DeviceFormProps {
  deviceToEdit?: DeviceItem | null;
  onClose: () => void;
  onSubmit: (dto: CreateDeviceDto) => Promise<void>;
}

const DeviceForm: React.FC<DeviceFormProps> = ({
  deviceToEdit,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState(deviceToEdit?.name ?? '');
  const [serialNumber, setSerialNumber] = useState(deviceToEdit?.serialNumber ?? '');
  const [operatingSystem, setOperatingSystem] = useState(deviceToEdit?.operatingSystem ?? 'Linux / Raspberry Pi OS');
  const [appVersion, setAppVersion] = useState(deviceToEdit?.appVersion ?? 'v1.0.0-offline');
  const [location, setLocation] = useState(deviceToEdit?.location ?? '');
  const [publicKey, setPublicKey] = useState(deviceToEdit?.publicKey ?? '');
  const [status, setStatus] = useState<DeviceStatus>(deviceToEdit?.status ?? 'ACTIVE');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim() || !serialNumber.trim() || !operatingSystem.trim()) {
      setErrorMessage('Nombre del dispositivo, número de serie y sistema operativo son obligatorios.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        name: name.trim(),
        serialNumber: serialNumber.trim(),
        operatingSystem: operatingSystem.trim(),
        appVersion: appVersion.trim() || 'v1.0.0',
        location: location.trim() || undefined,
        publicKey: publicKey.trim() || undefined,
        status,
      });
      onClose();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Error al guardar dispositivo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Laptop className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-800">
              {deviceToEdit ? 'Editar Dispositivo / Estación' : 'Registrar Dispositivo Tecnológico'}
            </h2>
            <p className="text-xs text-slate-500">Servidores Raspberry Pi, laptops clínicas y tablets</p>
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
              Nombre / Identificador *
            </label>
            <input
              type="text"
              placeholder="Ej. RPi-Estacion-01"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Número de Serie *
            </label>
            <input
              type="text"
              disabled={Boolean(deviceToEdit)}
              placeholder="Ej. SN-RPI-2026-90"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 font-mono disabled:bg-slate-100"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Sistema Operativo *
            </label>
            <input
              type="text"
              placeholder="Raspberry Pi OS / Ubuntu / Android"
              value={operatingSystem}
              onChange={(e) => setOperatingSystem(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Versión de App *
            </label>
            <input
              type="text"
              placeholder="Ej. v1.2.0-stable"
              value={appVersion}
              onChange={(e) => setAppVersion(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Ubicación / Asignación Habitual
            </label>
            <input
              type="text"
              placeholder="Ej. Bodega Central San Salvador"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Estado de Red *
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as DeviceStatus)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 bg-white"
            >
              <option value="ACTIVE">Activo / Operativo</option>
              <option value="OFFLINE">Offline (En campo sin red)</option>
              <option value="BLOCKED">Bloqueado / En revisión</option>
              <option value="RETIRED">Retirado / Baja</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Clave Pública de Autenticación / Certificado (Opcional)
          </label>
          <input
            type="text"
            placeholder="ssh-ed25519 AAAAC3NzaC1lZDI1NTE5..."
            value={publicKey}
            onChange={(e) => setPublicKey(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 font-mono"
          />
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
            {isSubmitting ? 'Guardando...' : deviceToEdit ? 'Actualizar Dispositivo' : 'Registrar Dispositivo'}
          </button>
        </div>
      </form>
    </div>
  );
};

export const CreateDeviceModal: React.FC<CreateDeviceModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  deviceToEdit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <DeviceForm
        key={deviceToEdit ? deviceToEdit.id : 'create-device-form'}
        deviceToEdit={deviceToEdit}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    </div>
  );
};