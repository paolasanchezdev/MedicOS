// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/brigada/resumen/components/AccionesRapidasBrigada.tsx
// DESCRIPCIÓN: Acciones operativas inmediatas con diseño homologado al Admin.
// =========================================================================

import React from 'react';
import { UserPlus, ClipboardList, HeartPulse, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AccionesRapidasBrigadaProps {
  enCurso?: boolean;
}

export const AccionesRapidasBrigada: React.FC<AccionesRapidasBrigadaProps> = ({
  enCurso = true,
}) => {
  const navigate = useNavigate();

  const acciones = [
    {
      label: 'Registrar Paciente',
      descripcion: 'Cuentas, padrón y expedientes',
      icon: UserPlus,
      ruta: '/brigadista/pacientes/registrar',
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50 border-blue-100',
    },
    {
      label: 'Registrar Actividad',
      descripcion: 'Bitácora y despacho de campo',
      icon: ClipboardList,
      ruta: '/brigadista/dashboard/actividad',
      iconColor: 'text-[#2B7A78]',
      iconBg: 'bg-teal-50 border-teal-100',
    },
    {
      label: 'Registrar Visita / Triage',
      descripcion: 'Toma rápida de constantes físicas',
      icon: HeartPulse,
      ruta: '/brigadista/evaluacion/signos-vitales',
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50 border-emerald-100',
    },
  ];

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        Acciones Rápidas
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {acciones.map((acc, idx) => {
          const IconComponent = acc.icon;
          return (
            <button
              key={idx}
              type="button"
              disabled={!enCurso}
              onClick={() => navigate(acc.ruta)}
              className="group bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex items-center justify-between text-left cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className={`w-10 h-10 rounded-xl border flex items-center justify-center shadow-xs shrink-0 ${acc.iconBg} ${acc.iconColor}`}
                >
                  <IconComponent className="w-5 h-5" />
                </div>

                <div className="min-w-0">
                  <span className="text-sm font-bold text-slate-900 block truncate group-hover:text-[#2B7A78] transition-colors">
                    {acc.label}
                  </span>
                  <span className="text-xs text-slate-500 block truncate mt-0.5">
                    {acc.descripcion}
                  </span>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#2B7A78] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
            </button>
          );
        })}
      </div>
    </div>
  );
};