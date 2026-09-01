// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/promocion-prevencion/vacunacion/registro/components/VacunacionObservacionesCard.tsx
// DESCRIPCIÓN: Paso 3 de 4: Registro de eventos posvacunales (ESAVI), consejería y notas clínicas
//              con altura calibrada (min-h-151.25) simétrica a la tarjeta del paciente.
// =========================================================================

import React from 'react';
import {
  AlertTriangle,
  FileText,
  ShieldCheck,
  Info,
  Clock,
  Plus,
  HeartPulse,
} from 'lucide-react';

export interface VacunacionObservacionesCardProps {
  adverseReactions: string;
  onAdverseReactionsChange: (val: string) => void;
  observations: string;
  onObservationsChange: (val: string) => void;
}

const QUICK_ESAVI_TAGS = [
  'Sin reacción inmediata (15 min)',
  'Enrojecimiento leve local',
  'Dolor leve en sitio de inyección',
  'Llanto o irritabilidad leve',
  'Mareo leve transitorio',
];

const CONSEJERIA_RAPIDA_TAGS = [
  'No frotar ni aplicar compresas calientes',
  'Manejo de alza térmica con medios físicos',
  'Completar esquema en fecha indicada',
  'Vigilar signos de alarma en 48 horas',
  'Hidratación y reposo relativo en casa',
];

export const VacunacionObservacionesCard: React.FC<VacunacionObservacionesCardProps> = ({
  adverseReactions,
  onAdverseReactionsChange,
  observations,
  onObservationsChange,
}) => {
  const handleEsaviTagClick = (tag: string) => {
    if (tag === 'Sin reacción inmediata (15 min)') {
      onAdverseReactionsChange(
        'Ninguna reacción inmediata observada durante el periodo de vigilancia clínica reglamentaria (15 minutos).'
      );
      return;
    }

    const actual = adverseReactions.trim();
    if (!actual) {
      onAdverseReactionsChange(tag);
    } else if (!actual.toLowerCase().includes(tag.toLowerCase())) {
      onAdverseReactionsChange(`${actual}. ${tag}`);
    }
  };

  const handleConsejeríaTagClick = (tag: string) => {
    const actual = observations.trim();
    if (!actual) {
      onObservationsChange(tag);
    } else if (!actual.toLowerCase().includes(tag.toLowerCase())) {
      onObservationsChange(`${actual}. ${tag}`);
    }
  };

  return (
    <div className="group min-h-151.25 h-full bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/70 p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:border-slate-300 transition-all duration-200 flex flex-col justify-between space-y-3.5">
      <div className="space-y-4 flex-1 flex flex-col justify-between">
        {/* 1. Cabecera */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-700 shadow-2xs shrink-0">
              <AlertTriangle className="w-5 h-5 stroke-2" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                3. Observaciones, ESAVI y Consejería
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                Vigilancia posvacunal inmediata e instrucciones al paciente
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200/80 rounded-xl shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-amber-700" />
            <span>Vigilancia 15 min</span>
          </div>
        </div>

        {/* 2. Sección de ESAVI y Vigilancia Inmediata */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <HeartPulse className="w-4 h-4 text-amber-600" />
              Reacciones Adversas Inmediatas / Eventos Supuestamente Atribuibles (ESAVI)
            </label>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Opcional</span>
          </div>

          {/* Chips de ESAVI */}
          <div className="flex flex-wrap gap-1.5">
            {QUICK_ESAVI_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleEsaviTagClick(tag)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-amber-50 border border-slate-200/80 hover:border-amber-300 text-slate-700 hover:text-amber-900 text-[11px] font-semibold transition cursor-pointer shadow-2xs active:scale-95"
              >
                <Plus className="w-3 h-3 text-amber-600" />
                <span>{tag}</span>
              </button>
            ))}
          </div>

          <input
            type="text"
            value={adverseReactions}
            onChange={(e) => onAdverseReactionsChange(e.target.value)}
            placeholder="Ej. Enrojecimiento leve en sitio de punción, sin fiebre ni compromiso sistémico..."
            className="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-200/80 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition shadow-2xs"
          />
        </div>

        {/* 3. Sección de Consejería y Notas Clínicas */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <label className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-teal-600" />
              Notas Clínicas, Cuidados Posteriores y Consejería Brindada
            </label>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Opcional</span>
          </div>

          {/* Chips de Consejería */}
          <div className="flex flex-wrap gap-1.5">
            {CONSEJERIA_RAPIDA_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleConsejeríaTagClick(tag)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-teal-50 border border-slate-200/80 hover:border-teal-300 text-slate-700 hover:text-teal-900 text-[11px] font-semibold transition cursor-pointer shadow-2xs active:scale-95"
              >
                <Plus className="w-3 h-3 text-teal-600" />
                <span>{tag}</span>
              </button>
            ))}
          </div>

          <textarea
            rows={3}
            value={observations}
            onChange={(e) => onObservationsChange(e.target.value)}
            placeholder="Describe las recomendaciones brindadas al usuario o tutor, fecha estimada del próximo refuerzo y cuidados post-vacunación..."
            className="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-200/80 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition resize-none leading-relaxed shadow-2xs"
          />
        </div>

        {/* 4. Panel Institucional de Seguridad y Notificación */}
        <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex items-start gap-3 shadow-2xs">
          <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-950 space-y-0.5">
            <span className="font-extrabold block">Protocolo de Notificación ESAVI (MINSAL)</span>
            <p className="text-amber-900/90 leading-relaxed text-[11px]">
              Cualquier evento adverso moderado o grave debe ser notificado de inmediato al epidemiólogo del establecimiento de salud de referencia comunitaria.
            </p>
          </div>
        </div>
      </div>

      {/* 5. Footer Alineado con Pasos Anteriores */}
      <div className="pt-3.5 border-t border-slate-100 text-xs text-slate-400 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1.5 truncate">
          <Info className="w-3.5 h-3.5 text-teal-600 shrink-0" />
          <span className="truncate">
            {adverseReactions
              ? 'Evento posvacunal registrado'
              : 'Sin eventos adversos inmediatos reportados'}
          </span>
        </div>
        <span className="font-bold text-teal-800">Paso 3 de 4</span>
      </div>
    </div>
  );
};

export default VacunacionObservacionesCard;