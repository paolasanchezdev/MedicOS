import React from 'react';
import { AlertTriangle, CheckCircle2, ShieldAlert, RefreshCw, X } from 'lucide-react';
import type { User, UserStatus } from '../types/user.types';

interface UserStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  user: User | null;
  targetStatus: UserStatus | 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | null;
  isSubmitting: boolean;
  getFullName: (user: User) => string;
}

export const UserStatusModal: React.FC<UserStatusModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  user,
  targetStatus,
  isSubmitting,
  getFullName,
}) => {
  if (!isOpen || !user || !targetStatus) return null;

  const getStatusConfig = () => {
    switch (targetStatus) {
      case 'ACTIVE':
        return {
          title: 'Activar Cuenta de Usuario',
          description: `¿Estás seguro de reactivar el acceso para ${getFullName(user)}? El usuario podrá volver a ingresar al sistema.`,
          icon: <CheckCircle2 className="w-6 h-6 text-emerald-600" />,
          bgIcon: 'bg-emerald-100',
          confirmBtnClass: 'bg-emerald-600 hover:bg-emerald-700 text-white',
          confirmText: 'Sí, activar cuenta',
        };
      case 'INACTIVE':
        return {
          title: 'Inactivar Cuenta de Usuario',
          description: `¿Estás seguro de marcar la cuenta de ${getFullName(user)} como inactiva? Se restringirá el acceso hasta su reactivación.`,
          icon: <AlertTriangle className="w-6 h-6 text-slate-600" />,
          bgIcon: 'bg-slate-100',
          confirmBtnClass: 'bg-slate-700 hover:bg-slate-800 text-white',
          confirmText: 'Sí, inactivar cuenta',
        };
      case 'SUSPENDED':
        return {
          title: 'Suspender Cuenta de Usuario',
          description: `¡Atención! Vas a suspender la cuenta de ${getFullName(user)}. Esta acción bloqueará de inmediato sus operaciones en MedicOS.`,
          icon: <ShieldAlert className="w-6 h-6 text-rose-600" />,
          bgIcon: 'bg-rose-100',
          confirmBtnClass: 'bg-rose-600 hover:bg-rose-700 text-white',
          confirmText: 'Sí, suspender cuenta',
        };
      default:
        return {
          title: 'Cambiar Estado',
          description: `¿Confirmas el cambio de estado para ${getFullName(user)}?`,
          icon: <AlertTriangle className="w-6 h-6 text-blue-600" />,
          bgIcon: 'bg-blue-100',
          confirmBtnClass: 'bg-blue-600 hover:bg-blue-700 text-white',
          confirmText: 'Confirmar',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${config.bgIcon}`}>{config.icon}</div>
            <h3 className="text-lg font-bold text-slate-900">{config.title}</h3>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100 disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed">{config.description}</p>

        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 space-y-1">
          <p>
            <span className="font-semibold">Usuario:</span> {getFullName(user)}
          </p>
          <p>
            <span className="font-semibold">Correo:</span> {user.email}
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-xs disabled:opacity-50 ${config.confirmBtnClass}`}
          >
            {isSubmitting && <RefreshCw className="w-4 h-4 animate-spin" />}
            {config.confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};