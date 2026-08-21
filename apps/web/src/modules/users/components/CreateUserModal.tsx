// ARCHIVO: apps/web/src/modules/users/components/CreateUserModal.tsx
// DESCRIPCIÓN: Modal para el registro de nuevos usuarios en MedicOS.

import React, { useState } from 'react';
import type { CreateUserInput } from '../schemas/user.schemas';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateUserInput) => Promise<boolean>;
  isSubmitting: boolean;
}

const ROLES_OPTIONS = [
  { value: 'DOCTOR', label: 'Médico / Doctor' },
  { value: 'BRIGADISTA', label: 'Brigadista' },
  { value: 'ADMIN', label: 'Administrador' },
  { value: 'AUTHORITY', label: 'Autoridad de Salud' },
  { value: 'PATIENT', label: 'Paciente' },
];

export const CreateUserModal: React.FC<CreateUserModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}) => {
  const [formData, setFormData] = useState<CreateUserInput>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    role: 'DOCTOR',
  });
  const [formError, setFormError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setFormError('Nombre y apellido son obligatorios.');
      return;
    }
    if (!formData.email.trim()) {
      setFormError('El correo electrónico es obligatorio.');
      return;
    }
    if (formData.password.length < 6) {
      setFormError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    const success = await onSubmit(formData);
    if (success) {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        role: 'DOCTOR',
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="font-semibold text-base text-slate-800">
              Crear Nuevo Usuario
            </h3>
            <p className="text-xs text-slate-500">
              Registra un nuevo integrante para el sistema MedicOS.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-medium text-lg leading-none cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium">
              {formError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Nombre *
              </label>
              <input
                type="text"
                name="firstName"
                required
                placeholder="Ej. Ana"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Apellido *
              </label>
              <input
                type="text"
                name="lastName"
                required
                placeholder="Ej. Martínez"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Correo Electrónico *
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="correo@medicos.org"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Rol Inicial *
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {ROLES_OPTIONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Teléfono (Opcional)
              </label>
              <input
                type="text"
                name="phone"
                placeholder="Ej. +503 7000-0000"
                value={formData.phone || ''}
                onChange={handleChange}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Contraseña *
            </label>
            <input
              type="password"
              name="password"
              autoComplete="new-password"
              required
              placeholder="Mínimo 6 caracteres"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 cursor-pointer disabled:opacity-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 rounded-xl hover:bg-teal-700 cursor-pointer disabled:opacity-50 transition-colors shadow-xs"
            >
              {isSubmitting ? 'Creando...' : 'Crear Usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};