// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/brigada/pacientes/components/PacientesBrigadaResumen.tsx
// DESCRIPCIÓN: 4 indicadores numéricos del padrón territorial.
// =========================================================================

import React from 'react';
import { Users, CheckCircle2, Clock, Send } from 'lucide-react';
import type { PacientesBrigadaResumenData } from '../../../../../../modules/brigades';

interface PacientesBrigadaResumenProps {
  resumen: PacientesBrigadaResumenData;
}

export const PacientesBrigadaResumen: React.FC<PacientesBrigadaResumenProps> = ({ resumen }) => {
  const cards = [
    {
      label: 'Pacientes en Padrón',
      value: resumen.totalPacientes,
      pill: 'Total',
      pillClass: 'bg-blue-50 text-blue-700 border-blue-200/60',
      icon: Users,
      iconBg: 'bg-blue-50 border-blue-100 text-blue-600',
    },
    {
      label: 'Evaluados',
      value: resumen.evaluados,
      pill: 'Estables',
      pillClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
      icon: CheckCircle2,
      iconBg: 'bg-emerald-50 border-emerald-100 text-emerald-600',
    },
    {
      label: 'Pendientes',
      value: resumen.pendientes,
      pill: 'Por Evaluar',
      pillClass: 'bg-amber-50 text-amber-700 border-amber-200/60',
      icon: Clock,
      iconBg: 'bg-amber-50 border-amber-100 text-amber-600',
    },
    {
      label: 'Referidos',
      value: resumen.referidos,
      pill: 'A Salud',
      pillClass: 'bg-purple-50 text-purple-700 border-purple-200/60',
      icon: Send,
      iconBg: 'bg-purple-50 border-purple-100 text-purple-600',
    },
  ];

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        Resumen del Padrón
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, idx) => {
          const IconComponent = c.icon;
          return (
            <div
              key={idx}
              className="group bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`w-10 h-10 rounded-xl border flex items-center justify-center shadow-xs ${c.iconBg}`}
                >
                  <IconComponent className="w-5 h-5" />
                </div>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${c.pillClass}`}
                >
                  {c.pill}
                </span>
              </div>

              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 truncate">
                  {c.label}
                </p>
                <p className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                  {c.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};