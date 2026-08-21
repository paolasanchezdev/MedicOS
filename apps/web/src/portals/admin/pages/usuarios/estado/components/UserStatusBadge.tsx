import React from 'react';
import { CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import type { UserStatus } from '../../../../../../modules/users/types/user.types';

interface UserStatusBadgeProps {
  status?: UserStatus | string;
}

export const UserStatusBadge: React.FC<UserStatusBadgeProps> = ({ status }) => {
  const normStatus = (status || 'ACTIVE').toUpperCase();

  switch (normStatus) {
    case 'ACTIVE':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          Activo
        </span>
      );
    case 'INACTIVE':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          Inactivo
        </span>
      );
    case 'SUSPENDED':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
          Suspendido
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          Activo
        </span>
      );
  }
};