import React from 'react';
import { Users, UserCheck, UserX, ShieldAlert } from 'lucide-react';

interface UserStatusMetricsProps {
  metrics: {
    total: number;
    active: number;
    inactive: number;
    suspended: number;
  };
}

export const UserStatusMetrics: React.FC<UserStatusMetricsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Total Cuentas
          </p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{metrics.total}</p>
        </div>
        <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
          <Users className="w-6 h-6" />
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Cuentas Activas
          </p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{metrics.active}</p>
        </div>
        <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
          <UserCheck className="w-6 h-6" />
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Cuentas Inactivas
          </p>
          <p className="text-2xl font-bold text-slate-600 mt-1">{metrics.inactive}</p>
        </div>
        <div className="p-3 bg-slate-100 rounded-xl text-slate-600">
          <UserX className="w-6 h-6" />
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Suspendidas
          </p>
          <p className="text-2xl font-bold text-rose-600 mt-1">{metrics.suspended}</p>
        </div>
        <div className="p-3 bg-rose-50 rounded-xl text-rose-600">
          <ShieldAlert className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};