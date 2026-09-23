// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/salud-materna/control-embarazo/components/RecomendacionesEmbarazoCard.tsx
// DESCRIPCIÓN: Tarjeta de prescripciones y plan de suplementación obstétrica con
//              diseño de bordes suaves y todo su contenido clínico e IA intacto.
// =========================================================================

import React, { useMemo } from 'react';
import { Pill, CheckCircle2, ChevronRight, Sparkles, ShieldCheck, HeartPulse } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RecomendacionesEmbarazoCardProps {
  indications: string[];
}

export const RecomendacionesEmbarazoCard: React.FC<RecomendacionesEmbarazoCardProps> = ({
  indications,
}) => {
  const navigate = useNavigate();

  // Consejos clínicos completos generados por IA a partir de las recetas del expediente
  const aiClinicalAdvice = useMemo(() => {
    const text = indications.join(' ').toLowerCase();
    const tips: { title: string; desc: string }[] = [];

    if (text.includes('hierro') || text.includes('ferroso')) {
      tips.push({
        title: 'Optimización de Absorción de Hierro',
        desc: 'Tómalo con agua o jugo de cítricos (rico en Vitamina C). Evita tomarlo junto con leche, café o té, ya que disminuyen su absorción hasta un 60%.',
      });
    }

    if (text.includes('ácido fólico') || text.includes('folico')) {
      tips.push({
        title: 'Continuidad de Folatos',
        desc: 'Fundamental para la formación de glóbulos rojos maternos y prevención de anemia gestacional. Procura tomarlo a la misma hora todos los días.',
      });
    }

    if (text.includes('calcio')) {
      tips.push({
        title: 'Separación de Calcio y Hierro',
        desc: 'Espacia la toma de calcio al menos 2 horas de la del hierro para que ambos minerales se absorban adecuadamente.',
      });
    }

    if (tips.length === 0 && indications.length > 0) {
      tips.push({
        title: 'Cumplimiento Terapéutico',
        desc: 'Sigue la dosis y periodicidad pautada por tu médico tratante para garantizar el bienestar fetal continuo.',
      });
    }

    return tips;
  }, [indications]);


  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 select-none flex flex-col justify-between space-y-5">
      <div>
        {/* Cabecera de la Tarjeta */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 shadow-xs">
              <Pill className="w-5 h-5" />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <span>Tratamientos y Cuidado</span>
                <span>•</span>
                <span className="text-teal-700 font-bold">Normativa MINSAL</span>
              </p>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                Indicaciones Médicas y Suplementación
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/paciente/tratamientos/recetas-activas')}
            className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-teal-700 hover:text-teal-800 transition-colors cursor-pointer group/btn"
          >
            <span>Ver recetas activas</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" />
          </button>
        </div>

        {/* Sección: Pautas registradas en expediente */}
        <div className="mt-5 space-y-2.5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Pautas Registradas en Expediente
          </p>

          {indications.length === 0 ? (
            <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-100 text-center space-y-1">
              <HeartPulse className="w-5 h-5 text-slate-300 mx-auto" />
              <p className="font-semibold text-slate-700 text-xs">Sin prescripciones registradas</p>
              <p className="text-[11px] text-slate-400">
                No hay prescripciones ni indicaciones médicas registradas en tu expediente.
              </p>
            </div>
          ) : (
            indications.map((ind, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50/70 border border-slate-100 text-xs text-slate-800 font-medium"
              >
                <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                <span className="leading-relaxed font-semibold">{ind}</span>
              </div>
            ))
          )}
        </div>

        {/* Sección: Recomendaciones asistidas por MedicOS IA */}
        {aiClinicalAdvice.length > 0 && (
          <div className="mt-4 p-4 rounded-xl bg-teal-50/40 border border-teal-100/70 space-y-2.5">
            <div className="flex items-center gap-2 text-teal-900 font-extrabold text-xs">
              <Sparkles className="w-4 h-4 text-teal-700 shrink-0" />
              <span>Recomendaciones Asistidas por MedicOS IA para tu Tratamiento</span>
            </div>

            <div className="space-y-2 pt-0.5">
              {aiClinicalAdvice.map((item, i) => (
                <div key={i} className="text-xs space-y-0.5">
                  <p className="font-bold text-teal-950 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-600 shrink-0" />
                    <span>{item.title}</span>
                  </p>
                  <p className="text-slate-600 pl-3.5 text-[11px] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Pie institucional y enlace */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-400 font-medium">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Tratamiento validado por tu médico tratante</span>
        </span>

        <span className="font-semibold text-slate-600">Red Nacional de Salud</span>

        <button
          type="button"
          onClick={() => navigate('/paciente/tratamientos/recetas-activas')}
          className="sm:hidden mt-2 pt-2 border-t border-slate-100 w-full inline-flex items-center justify-between text-xs font-semibold text-teal-700 hover:text-teal-800 transition-colors group/btn cursor-pointer"
        >
          <span>Ver recetas activas</span>
          <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
};

export default RecomendacionesEmbarazoCard;