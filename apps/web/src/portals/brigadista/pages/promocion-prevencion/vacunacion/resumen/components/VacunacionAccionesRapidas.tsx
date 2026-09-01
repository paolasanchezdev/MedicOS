// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/promocion-prevencion/vacunacion/resumen/components/VacunacionAccionesRapidas.tsx
// DESCRIPCIÓN: Fila de accesos directos estilo Admin Portal.
// =========================================================================

import React from 'react';
import { Syringe, History, UserSearch, CloudSync, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const VacunacionAccionesRapidas: React.FC = () => {
  const navigate = useNavigate();

  const acciones = [
    {
      titulo: 'Registrar Aplicación',
      subtitulo: 'Catálogo oficial y lote',
      icono: Syringe,
      ruta: '/brigadista/promocion-prevencion/vacunacion/registro',
      color: 'teal',
      bgIcon: 'bg-teal-500/10 border-teal-500/20 text-teal-700',
    },
    {
      titulo: 'Historial de Inmunización',
      subtitulo: 'Consultar dosis aplicadas',
      icono: History,
      ruta: '/brigadista/promocion-prevencion/vacunacion/historial',
      color: 'blue',
      bgIcon: 'bg-blue-500/10 border-blue-500/20 text-blue-700',
    },
    {
      titulo: 'Buscar Paciente',
      subtitulo: 'Verificar esquema previo',
      icono: UserSearch,
      ruta: '/brigadista/pacientes/buscar',
      color: 'purple',
      bgIcon: 'bg-purple-500/10 border-purple-500/20 text-purple-700',
    },
    {
      titulo: 'Sincronización Outbox',
      subtitulo: 'Cola de biológicos offline',
      icono: CloudSync,
      ruta: '/brigadista/sincronizacion/estado',
      color: 'amber',
      bgIcon: 'bg-amber-500/10 border-amber-500/20 text-amber-700',
    },
  ];

  return (
    <div className="space-y-2">
      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
        Acciones Rápidas
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {acciones.map((acc, idx) => {
          const Icon = acc.icono;

          return (
            <div
              key={idx}
              onClick={() => navigate(acc.ruta)}
              className="group bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 shadow-2xs ${acc.bgIcon}`}>
                  <Icon className="w-5 h-5 stroke-2" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-800 group-hover:text-teal-900 transition truncate">
                    {acc.titulo}
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {acc.subtitulo}
                  </p>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-teal-600 group-hover:translate-x-0.5 transition shrink-0" />
            </div>
          );
        })}
      </div>
    </div>
  );
};