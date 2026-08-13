// =========================================================================
// ARCHIVO: apps/web/src/portals/admin/pages/dashboard/resumen/components/TarjetaUsuarios.tsx
// DESCRIPCIÓN: Tarjeta de resumen para métricas de usuarios del sistema.
// =========================================================================

import React from 'react';
import { Users, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TarjetaUsuariosProps {
  total: number;
  byRole?: Record<string, number>;
  byStatus?: Record<string, number>;
}

export const TarjetaUsuarios: React.FC<TarjetaUsuariosProps> = ({
  total,
  byRole,
  byStatus,
}) => {
  const navigate = useNavigate();

  const activeCount = byStatus?.ACTIVE ?? byStatus?.active ?? 0;
  const doctorsCount = byRole?.DOCTOR ?? byRole?.doctor ?? 0;
  const brigadistasCount = byRole?.BRIGADISTA ?? byRole?.brigadista ?? 0;
  const adminCount = byRole?.ADMIN ?? byRole?.admin ?? 0;
  const patientCount = byRole?.PATIENT ?? byRole?.patient ?? 0;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Cabecera de la Tarjeta */}
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-xs">
            <Users className="w-5 h-5" />
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {activeCount} Activos
          </span>
        </div>

        {/* Métricas Principales */}
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Usuarios Registrados
          </p>
          <p className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            {total}
          </p>
        </div>

        {/* Desglose de Roles */}
        <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-50/70 border border-slate-100 text-slate-600">
            <span className="font-medium">Médicos</span>
            <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200/60 shadow-2xs">
              {doctorsCount}
            </span>
          </div>

          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-50/70 border border-slate-100 text-slate-600">
            <span className="font-medium">Brigadistas</span>
            <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200/60 shadow-2xs">
              {brigadistasCount}
            </span>
          </div>

          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-50/70 border border-slate-100 text-slate-600">
            <span className="font-medium">Administradores</span>
            <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200/60 shadow-2xs">
              {adminCount}
            </span>
          </div>

          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-50/70 border border-slate-100 text-slate-600">
            <span className="font-medium">Pacientes (Cuentas)</span>
            <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200/60 shadow-2xs">
              {patientCount}
            </span>
          </div>
        </div>
      </div>

      {/* Acción / Redirección */}
      <button
        onClick={() => navigate('/admin/usuarios')}
        className="mt-5 pt-3 border-t border-slate-100 w-full inline-flex items-center justify-between text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors group/btn"
      >
        <span>Gestionar usuarios</span>
        <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" />
      </button>
    </div>
  );
};