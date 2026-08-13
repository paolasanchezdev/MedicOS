// =========================================================================
// ARCHIVO: apps/web/src/portals/admin/pages/dashboard/resumen/components/AccionesRapidas.tsx
// DESCRIPCIÓN: Panel de accesos directos estilo iOS / Microsoft Fluent Design.
// =========================================================================

import React from 'react';
import { Users, Layers, Shield, FileText, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AccionItem {
  label: string;
  description: string;
  icon: React.ElementType;
  path: string;
  iconBg: string;
  iconColor: string;
}

export const AccionesRapidas: React.FC = () => {
  const navigate = useNavigate();

  const acciones: AccionItem[] = [
    {
      label: 'Gestionar Usuarios',
      description: 'Cuentas, roles y permisos',
      icon: Users,
      path: '/admin/usuarios',
      iconBg: 'bg-teal-500/10 border-teal-500/20',
      iconColor: 'text-teal-700',
    },
    {
      label: 'Supervisar Brigadas',
      description: 'Estado y despliegues activos',
      icon: Layers,
      path: '/admin/brigadas',
      iconBg: 'bg-indigo-500/10 border-indigo-500/20',
      iconColor: 'text-indigo-700',
    },
    {
      label: 'Bitácora de Auditoría',
      description: 'Historial de actividad global',
      icon: FileText,
      path: '/admin/dashboard/actividad',
      iconBg: 'bg-amber-500/10 border-amber-500/20',
      iconColor: 'text-amber-700',
    },
    {
      label: 'Seguridad y Accesos',
      description: 'Políticas y eventos de acceso',
      icon: Shield,
      path: '/security/auditoria',
      iconBg: 'bg-slate-500/10 border-slate-500/20',
      iconColor: 'text-slate-800',
    },
  ];

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/70 p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-between mb-3.5 px-0.5">
        <h3 className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
          Acciones Rápidas
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {acciones.map((acc, index) => {
          const IconComponent = acc.icon;
          return (
            <button
              key={index}
              onClick={() => navigate(acc.path)}
              className="group flex items-center justify-between p-3.5 rounded-xl bg-slate-50/60 hover:bg-slate-100/80 active:bg-slate-200/60 border border-slate-200/50 hover:border-slate-300/60 transition-all duration-200 active:scale-[0.98] text-left cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-10 h-10 rounded-xl border ${acc.iconBg} ${acc.iconColor} flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105`}
                >
                  <IconComponent className="w-5 h-5 stroke-2" />
                </div>
                <div className="truncate">
                  <span className="block text-xs font-semibold text-slate-900 truncate tracking-tight">
                    {acc.label}
                  </span>
                  <span className="block text-[11px] text-slate-500 font-normal leading-tight mt-0.5 truncate">
                    {acc.description}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
            </button>
          );
        })}
      </div>
    </div>
  );
};