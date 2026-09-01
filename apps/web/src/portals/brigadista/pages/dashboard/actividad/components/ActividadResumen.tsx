// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/dashboard/actividad/components/ActividadResumen.tsx
// DESCRIPCIÓN: 5 tarjetas de métricas del turno con estilo y bordes Admin.
// =========================================================================

import React from 'react';
import { Home, Users, HeartPulse, AlertTriangle, Send } from 'lucide-react';

interface ActividadResumenProps {
  visitas: number;
  personas: number;
  evaluaciones: number;
  riesgos: number;
  referencias: number;
}

export const ActividadResumen: React.FC<ActividadResumenProps> = ({
  visitas,
  personas,
  evaluaciones,
  riesgos,
  referencias,
}) => {
  const cards = [
    {
      label: 'Visitas Domiciliares',
      value: visitas,
      pill: 'Hogares',
      pillClass: 'bg-blue-50 text-blue-700 border-blue-200/60',
      icon: Home,
      iconBg: 'bg-blue-50 border-blue-100 text-blue-600',
    },
    {
      label: 'Personas Atendidas',
      value: personas,
      pill: 'Padrón',
      pillClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
      icon: Users,
      iconBg: 'bg-emerald-50 border-emerald-100 text-emerald-600',
    },
    {
      label: 'Evaluaciones Físicas',
      value: evaluaciones,
      pill: 'Al día',
      pillClass: 'bg-teal-50 text-teal-700 border-teal-200/60',
      icon: HeartPulse,
      iconBg: 'bg-teal-50 border-teal-100 text-[#2B7A78]',
    },
    {
      label: 'Riesgos Detectados',
      value: riesgos,
      pill: 'En alerta',
      pillClass: 'bg-amber-50 text-amber-700 border-amber-200/60',
      icon: AlertTriangle,
      iconBg: 'bg-amber-50 border-amber-100 text-amber-600',
    },
    {
      label: 'Referencias Médicas',
      value: referencias,
      pill: 'Despacho',
      pillClass: 'bg-purple-50 text-purple-700 border-purple-200/60',
      icon: Send,
      iconBg: 'bg-purple-50 border-purple-100 text-purple-600',
    },
  ];

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        Resumen de Operación
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {cards.map((card, idx) => {
          const IconComponent = card.icon;
          return (
            <div
              key={idx}
              className="group bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`w-10 h-10 rounded-xl border flex items-center justify-center shadow-xs ${card.iconBg}`}
                >
                  <IconComponent className="w-5 h-5" />
                </div>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${card.pillClass}`}
                >
                  {card.pill}
                </span>
              </div>

              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 truncate">
                  {card.label}
                </p>
                <p className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                  {card.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};