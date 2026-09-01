// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/brigada/jornada/components/JornadaRecursosCard.tsx
// DESCRIPCIÓN: Dotación real de insumos, instrumental y dispositivos de la brigada.
// =========================================================================

import React from 'react';
import { PackageCheck, Check, PackageOpen, Stethoscope, Laptop } from 'lucide-react';
import type { JornadaRecursoItem } from '../../../../../../modules/brigades';

interface JornadaRecursosCardProps {
  recursos: JornadaRecursoItem[];
}

export const JornadaRecursosCard: React.FC<JornadaRecursosCardProps> = ({ recursos }) => {
  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between h-full">
      <div className="space-y-4">
        {/* Cabecera */}
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-xs">
            <PackageCheck className="w-5 h-5" />
          </div>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            {recursos.length} Asignados
          </span>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Dotación en Campo
          </p>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight mt-0.5">
            Recursos de la Jornada
          </h2>
        </div>

        {/* Lista de Recursos Reales de PostgreSQL */}
        {recursos.length === 0 ? (
          <div className="p-6 bg-slate-50/70 rounded-xl border border-slate-100 text-center space-y-1">
            <PackageOpen className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs font-bold text-slate-800">Sin dotación registrada</p>
            <p className="text-[11px] text-slate-500">
              No hay medicamentos, equipos médicos o dispositivos vinculados a esta brigada en el inventario.
            </p>
          </div>
        ) : (
          <div className="pt-2 space-y-2 text-xs max-h-72 overflow-y-auto pr-1">
            {recursos.map((r) => (
              <div
                key={r.id}
                className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-100"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  {r.tipo === 'INSUMO' ? (
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  ) : r.tipo === 'EQUIPO' ? (
                    <Stethoscope className="w-3.5 h-3.5" />
                  ) : (
                    <Laptop className="w-3.5 h-3.5" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-bold text-slate-900 truncate">{r.nombre}</p>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600 shrink-0">
                      {r.tipo}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{r.detalle}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};