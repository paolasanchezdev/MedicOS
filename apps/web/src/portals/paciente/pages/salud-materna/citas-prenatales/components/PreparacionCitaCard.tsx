// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/salud-materna/citas-prenatales/components/PreparacionCitaCard.tsx
// DESCRIPCIÓN: Guía de preparación y documentación en formato ligero y compacto,
//              diseñada para no saturar el flujo visual de la página.
// =========================================================================

import React from 'react';
import { CheckCircle2, ChevronRight, HeartHandshake, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PreparacionCitaCard: React.FC = () => {
  const navigate = useNavigate();

  const items = [
    { title: 'Carnet de Control Prenatal', tag: 'Obligatorio' },
    { title: 'Documento Único de Identidad (DUI)', tag: 'Obligatorio' },
    { title: 'Exámenes de laboratorio o ultrasonografías recientes', tag: 'Sugerido' },
    { title: 'Dudas y síntomas anotados en tu diario', tag: 'Recomendado' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs select-none space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-[#2B7A78]">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h3 className="text-xs sm:text-sm font-extrabold text-slate-800 tracking-tight">
            ¿Qué debes llevar a tu control obstétrico?
          </h3>
        </div>

        <button
          type="button"
          onClick={() => navigate('/paciente/salud-materna/diario-sintomas')}
          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2B7A78] hover:text-[#236866] transition cursor-pointer self-start sm:self-center"
        >
          <HeartHandshake className="w-3.5 h-3.5" />
          <span>Consultar dudas del diario</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Grid compacto de 2 columnas en pantallas medianas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-slate-50/70 border border-slate-100 text-xs"
          >
            <div className="flex items-center gap-2 truncate">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2B7A78] shrink-0" />
              <span className="font-semibold text-slate-700 truncate">{item.title}</span>
            </div>

            <span
              className={`text-[9.5px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md shrink-0 ${
                item.tag === 'Obligatorio'
                  ? 'bg-amber-50 text-amber-800 border border-amber-200/60'
                  : 'bg-white text-slate-500 border border-slate-200/60'
              }`}
            >
              {item.tag}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PreparacionCitaCard;