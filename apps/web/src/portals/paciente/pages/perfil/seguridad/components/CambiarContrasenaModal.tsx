// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/perfil/seguridad/components/CambiarContrasenaModal.tsx
// DESCRIPCIÓN: Modal estricto para cambio de contraseña con validación de requisitos.
// =========================================================================

import React, { useState } from 'react';
import { X, KeyRound, Eye, EyeOff, Check, AlertCircle } from 'lucide-react';

interface CambiarContrasenaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (currentPass: string, newPass: string) => Promise<boolean>;
  loading?: boolean;
}

export const CambiarContrasenaModal: React.FC<CambiarContrasenaModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
}) => {
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Requisitos mínimos
  const hasMinLength = newPass.length >= 8;
  const hasNumber = /\d/.test(newPass);
  const passwordsMatch = newPass === confirmPass && newPass.length > 0;
  const isValid = hasMinLength && hasNumber && passwordsMatch && currentPass.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!isValid) {
      setErrorMsg('Verifica los requisitos mínimos de seguridad antes de continuar.');
      return;
    }

    const success = await onSubmit(currentPass, newPass);
    if (success) {
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-[#D3E8EC] space-y-4">
        {/* Cabecera del Modal */}
        <div className="flex items-start justify-between gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#166E7A] border border-teal-100 flex items-center justify-center shrink-0">
            <KeyRound className="w-5 h-5 stroke-[2.2]" />
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div>
          <h3 className="text-base font-extrabold text-slate-900">
            Actualizar contraseña
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Ingresa tu clave actual y define una nueva que cumpla con los estándares de MedicOS.
          </p>
        </div>

        {errorMsg ? (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Contraseña Actual */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Contraseña actual</label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                required
                value={currentPass}
                onChange={(e) => setCurrentPass(e.target.value)}
                placeholder="••••••••••••"
                className="w-full h-10 px-3.5 pr-10 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:bg-white focus:border-[#166E7A] focus:outline-hidden"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Nueva Contraseña */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Nueva contraseña</label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                required
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                className="w-full h-10 px-3.5 pr-10 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:bg-white focus:border-[#166E7A] focus:outline-hidden"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirmar Nueva Contraseña */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Confirmar nueva contraseña</label>
            <input
              type="password"
              required
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              placeholder="Repite la contraseña"
              className="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:bg-white focus:border-[#166E7A] focus:outline-hidden"
            />
          </div>

          {/* Checklist de Requisitos */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-[11px]">
            <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-700 font-semibold' : 'text-slate-400'}`}>
              <Check className={`w-3.5 h-3.5 ${hasMinLength ? 'text-emerald-600' : 'text-slate-300'}`} />
              <span>Al menos 8 caracteres</span>
            </div>
            <div className={`flex items-center gap-1.5 ${hasNumber ? 'text-emerald-700 font-semibold' : 'text-slate-400'}`}>
              <Check className={`w-3.5 h-3.5 ${hasNumber ? 'text-emerald-600' : 'text-slate-300'}`} />
              <span>Incluye al menos un número</span>
            </div>
            <div className={`flex items-center gap-1.5 ${passwordsMatch ? 'text-emerald-700 font-semibold' : 'text-slate-400'}`}>
              <Check className={`w-3.5 h-3.5 ${passwordsMatch ? 'text-emerald-600' : 'text-slate-300'}`} />
              <span>Las contraseñas coinciden</span>
            </div>
          </div>

          {/* Acciones */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!isValid || loading}
              className="px-4.5 py-2 rounded-xl bg-[#166E7A] hover:bg-[#125861] disabled:opacity-50 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              {loading ? 'Guardando...' : 'Cambiar contraseña'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CambiarContrasenaModal;