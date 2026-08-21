// ARCHIVO: apps/web/src/portals/admin/pages/usuarios/roles/components/RoleStatsCards.tsx
// DESCRIPCIÓN: Tarjetas métricas de distribución de usuarios por rol en MedicOS.

import React from 'react';

interface RoleStatsCardsProps {
  counts: Record<string, number>;
}

export const RoleStatsCards: React.FC<RoleStatsCardsProps> = ({ counts }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">ADMINISTRADOR</p>
        <p className="text-2xl font-extrabold text-slate-900 mt-1">{counts.ADMIN ?? 0}</p>
        <p className="text-xs text-slate-400 mt-0.5">Sistemas y Soporte</p>
      </div>

      <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
        <p className="text-xs font-bold text-teal-600 uppercase tracking-wider">MÉDICOS</p>
        <p className="text-2xl font-extrabold text-slate-900 mt-1">{counts.DOCTOR ?? 0}</p>
        <p className="text-xs text-slate-400 mt-0.5">Atención Clínica / SOAP</p>
      </div>

      <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
        <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">BRIGADISTAS</p>
        <p className="text-2xl font-extrabold text-slate-900 mt-1">{counts.BRIGADISTA ?? 0}</p>
        <p className="text-xs text-slate-400 mt-0.5">Despliegue Territorial</p>
      </div>

      <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
        <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">AUTORIDADES</p>
        <p className="text-2xl font-extrabold text-slate-900 mt-1">{counts.AUTHORITY ?? 0}</p>
        <p className="text-xs text-slate-400 mt-0.5">Salud Pública / MINSAL</p>
      </div>

      <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow col-span-2 md:col-span-1">
        <p className="text-xs font-bold text-purple-600 uppercase tracking-wider">PACIENTES</p>
        <p className="text-2xl font-extrabold text-slate-900 mt-1">{counts.PATIENT ?? 0}</p>
        <p className="text-xs text-slate-400 mt-0.5">Portal Ciudadano</p>
      </div>
    </div>
  );
};