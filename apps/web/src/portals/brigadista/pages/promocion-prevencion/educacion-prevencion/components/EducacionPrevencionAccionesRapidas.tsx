// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/promocion-prevencion/educacion-prevencion/components/EducacionPrevencionAccionesRapidas.tsx
// DESCRIPCIÓN: 4 accesos rápidos de alta densidad.
// =========================================================================

import React from 'react';
import { BookOpen, Bug, Search, RefreshCw, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EducacionPrevencionAccionesRapidasProps {
  onNuevaEducacion: () => void;
  onNuevoVector: () => void;
}

export const EducacionPrevencionAccionesRapidas: React.FC<EducacionPrevencionAccionesRapidasProps> = ({
  onNuevaEducacion,
  onNuevoVector,
}) => {
  const navigate = useNavigate();

  const acciones = [
    {
      title: 'Nueva Actividad Educativa',
      subtitle: 'Individual, familiar o comunitaria',
      icon: BookOpen,
      color: 'text-[#166E7A]',
      bg: 'bg-teal-50',
      action: onNuevaEducacion,
    },
    {
      title: 'Control e Inspección de Vectores',
      subtitle: 'Criaderos y vigilancia ambiental',
      icon: Bug,
      color: 'text-emerald-700',
      bg: 'bg-emerald-50',
      action: onNuevoVector,
    },
    {
      title: 'Buscar Persona en Padrón',
      subtitle: 'Asociar educación individual',
      icon: Search,
      color: 'text-purple-700',
      bg: 'bg-purple-50',
      action: () => navigate('/brigadista/pacientes/buscar'),
    },
    {
      title: 'Sincronización Outbox',
      subtitle: 'Actividades de campo offline',
      icon: RefreshCw,
      color: 'text-amber-700',
      bg: 'bg-amber-50',
      action: () => navigate('/brigadista/atencion/pendientes'),
    },
  ];

  return (
    <div className="space-y-1.5">
      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block px-0.5">
        Acciones Rápidas
      </span>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {acciones.map((a, idx) => {
          const Icon = a.icon;
          return (
            <button
              key={idx}
              type="button"
              onClick={a.action}
              className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-xs hover:border-[#166E7A]/40 transition text-left flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`p-2 rounded-lg ${a.bg} ${a.color} shrink-0`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#166E7A] transition truncate">
                    {a.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-medium truncate">{a.subtitle}</p>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#166E7A] group-hover:translate-x-0.5 transition shrink-0 ml-1.5" />
            </button>
          );
        })}
      </div>
    </div>
  );
};