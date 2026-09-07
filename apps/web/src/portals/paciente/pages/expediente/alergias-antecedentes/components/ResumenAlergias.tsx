// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/expediente/alergias-antecedentes/components/ResumenAlergias.tsx
// DESCRIPCIÓN: Tarjeta 1 (Alergias) con altura compacta y métricas intactas.
// =========================================================================

import React from 'react';
import { ShieldAlert, ChevronRight } from 'lucide-react';
import type { AllergyItem } from '../../../../../../modules/clinical-history/index.js';
import { AlergiaCard } from './AlergiaCard.js';

interface ResumenAlergiasProps {
  allergies: AllergyItem[];
  onViewDetail: (allergy: AllergyItem) => void;
}

export const ResumenAlergias: React.FC<ResumenAlergiasProps> = ({ allergies, onViewDetail }) => {
  const total = allergies.length;
  const hasAlerts = total > 0;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Cabecera de la Tarjeta */}
        <div className="flex items-center justify-between">
          <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shadow-xs">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <span
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
              hasAlerts
                ? 'bg-rose-50 text-rose-700 border-rose-200/60'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                hasAlerts ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'
              }`}
            />
            {hasAlerts ? `${total} Activa(s)` : '0 Alergias'}
          </span>
        </div>

        {/* Métricas Principales */}
        <div className="mt-2.5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Alergias Registradas
          </p>
          <p className="text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5 leading-none">
            {total}
          </p>
        </div>

        {/* Desglose en Filas */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1.5 text-xs">
          {total === 0 ? (
            <>
              <div className="flex items-center justify-between px-2 py-1 rounded-lg bg-slate-50/70 border border-slate-100 text-slate-600">
                <span className="font-medium text-[11px]">Medicamentos</span>
                <span className="font-bold text-slate-900 bg-white px-2 py-0.2 rounded-md border border-slate-200/60 shadow-2xs text-[11px]">
                  Ninguno
                </span>
              </div>
              <div className="flex items-center justify-between px-2 py-1 rounded-lg bg-slate-50/70 border border-slate-100 text-slate-600">
                <span className="font-medium text-[11px]">Alimentos</span>
                <span className="font-bold text-slate-900 bg-white px-2 py-0.2 rounded-md border border-slate-200/60 shadow-2xs text-[11px]">
                  Ninguno
                </span>
              </div>
              <div className="flex items-center justify-between px-2 py-1 rounded-lg bg-slate-50/70 border border-slate-100 text-slate-600">
                <span className="font-medium text-[11px]">Ambientales</span>
                <span className="font-bold text-slate-900 bg-white px-2 py-0.2 rounded-md border border-slate-200/60 shadow-2xs text-[11px]">
                  Ninguno
                </span>
              </div>
            </>
          ) : (
            allergies.slice(0, 3).map((item) => (
              <AlergiaCard key={item.id} allergy={item} onViewDetail={onViewDetail} />
            ))
          )}
        </div>
      </div>

      {/* Acción / Redirección */}
      <button
        type="button"
        disabled={total === 0}
        onClick={() => total > 0 && onViewDetail(allergies[0]!)}
        className="mt-3 pt-2.5 border-t border-slate-100 w-full inline-flex items-center justify-between text-[11px] font-semibold text-rose-600 hover:text-rose-700 disabled:text-slate-400 disabled:hover:text-slate-400 transition-colors group/btn cursor-pointer disabled:cursor-default"
      >
        <span>{total > 0 ? 'Ver detalles clínicos' : 'Sin reacciones registradas'}</span>
        <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
      </button>
    </div>
  );
};

export default ResumenAlergias;