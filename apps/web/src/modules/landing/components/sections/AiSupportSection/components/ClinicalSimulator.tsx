/* ==========================================================================
   ClinicalSimulator.tsx - IA Premium sin Errores ESLint / Tailwind v4
   ========================================================================== */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  activeId: string;
}

const CAPABILITY_PROMPTS: Record<
  string,
  { id: string; label: string; promptText: string; response: React.ReactNode }[]
> = {
  validation: [
    {
      id: "v1",
      label: "🔍 Validar Signos Vitales",
      promptText: "¿Hay alguna anomalía en la presión arterial o frecuencia cardíaca ingresada?",
      response: (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/80 shadow-2xs text-[11px] flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
              Inconsistencia detectada
            </span>
            <span className="text-[10px] text-slate-400 font-mono">PAS: 145/95 mmHg</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            El valor registrado supera el rango histórico del paciente (120/80 mmHg). Se sugiere verificar si hubo un error de digitación antes de guardar.
          </p>
        </div>
      ),
    },
    {
      id: "v2",
      label: "💊 Dosis de Fármacos",
      promptText: "Verificar si la dosis de Enalapril 20mg es adecuada para este expediente.",
      response: (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/80 shadow-2xs text-[11px] flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Dosis dentro de rango
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Guía Clínica V.2</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            La dosificación indicada coincide con el protocolo estándar para hipertensión leve. No se registran duplicidades terapéuticas.
          </p>
        </div>
      ),
    },
  ],
  patterns: [
    {
      id: "p1",
      label: "📈 Analizar Glucosa (3 Meses)",
      promptText: "Mostrar tendencia de los niveles de glucosa en ayunas en los últimos controles.",
      response: (
        <div className="space-y-2.5">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-slate-800">Evolución Trimestral</span>
            <span className="font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200/80 text-[11px]">
              +14% Incremento
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded-xl bg-white border border-slate-200/60 shadow-2xs">
              <span className="block text-[9px] text-slate-400 uppercase font-mono">Mayo</span>
              <span className="text-xs font-bold text-emerald-600">95 mg/dL</span>
            </div>
            <div className="p-2 rounded-xl bg-white border border-slate-200/60 shadow-2xs">
              <span className="block text-[9px] text-slate-400 uppercase font-mono">Junio</span>
              <span className="text-xs font-bold text-amber-600">108 mg/dL</span>
            </div>
            <div className="p-2 rounded-xl bg-teal-50 border border-teal-200 shadow-2xs">
              <span className="block text-[9px] text-teal-800 uppercase font-mono font-bold">Julio</span>
              <span className="text-xs font-bold text-rose-600">124 mg/dL</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "p2",
      label: "🫀 Variabilidad IMC",
      promptText: "Evaluar el comportamiento del peso e IMC durante este año.",
      response: (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200/80 text-[11px]">
              Estabilidad Ligera
            </span>
            <span className="text-[10px] text-slate-400 font-mono">IMC: 26.4</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Variación de -1.2 kg en los últimos 6 meses. Se mantiene una curva favorable sustained con apego al plan nutricional.
          </p>
        </div>
      ),
    },
  ],
  recommendations: [
    {
      id: "r1",
      label: "🧪 Pruebas Sugeridas",
      promptText: "¿Qué exámenes de laboratorio se recomienda solicitar en la próxima cita?",
      response: (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200/80 text-[11px] flex items-center gap-1">
              💡 Sugerencia Automática
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Preventivo</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Se sugiere incluir <strong>Perfil Lipídico Completo</strong> y <strong>HbA1c</strong> debido al incremento progresivo en la glucosa en ayunas.
          </p>
        </div>
      ),
    },
    {
      id: "r2",
      label: "📋 Hábitos de Vida",
      promptText: "Sugerir recomendaciones preventivas no farmacológicas para el paciente.",
      response: (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/80 text-[11px]">
              Guía de Estilo de Vida
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Reforzar hidratación diaria (mínimo 2L) y programar caminata aeróbica de 30 min / 5 días a la semana.
          </p>
        </div>
      ),
    },
  ],
  context: [
    {
      id: "c1",
      label: "⚠️ Alergias y Contraindicaciones",
      promptText: "Resumir alertas críticas y antecedentes de alergias de este paciente.",
      response: (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200/80 text-[11px] flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping" />
              Alerta de Seguridad
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            <strong>Penicilina:</strong> Reacción severa registrada en 2022. Evitar derivados de lactámicos β en la prescripción.
          </p>
        </div>
      ),
    },
    {
      id: "c2",
      label: "🏥 Resumen Última Consulta",
      promptText: "¿Cuál fue el motivo de consulta y tratamiento establecido en la última cita?",
      response: (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200/80 text-[11px]">
              Hace 18 Días
            </span>
            <span className="text-[10px] text-slate-400">Dra. M. Rodríguez</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Atención por cefalea leve. Se ajustó dosis de Enalapril y se agendó seguimiento de presión en bitácora digital.
          </p>
        </div>
      ),
    },
  ],
};

export const ClinicalSimulator: React.FC<Props> = ({ activeId }) => {
  const currentPrompts = CAPABILITY_PROMPTS[activeId] || CAPABILITY_PROMPTS.validation;
  const [selectedPromptId, setSelectedPromptId] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState<boolean>(true);

  // Rastreo de cambio de activeId durante renderizado
  const [prevActiveId, setPrevActiveId] = useState<string>(activeId);
  if (activeId !== prevActiveId) {
    setPrevActiveId(activeId);
    setSelectedPromptId(null);
    setIsThinking(true);
  }

  // Seleccionar la consulta activa actual
  const activePromptData =
    currentPrompts.find((p) => p.id === selectedPromptId) || currentPrompts[0];

  // Efecto enfocado exclusivamente en apagar la animación de "pensando"
  useEffect(() => {
    if (!isThinking) return;

    const timer = setTimeout(() => {
      setIsThinking(false);
    }, 220);

    return () => clearTimeout(timer);
  }, [isThinking]);

  const handleSelectPrompt = (id: string) => {
    if (id === activePromptData.id && !isThinking) return;
    setIsThinking(true);
    setSelectedPromptId(id);
  };

  return (
    <motion.div
      layout
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      className="relative rounded-2xl sm:rounded-3xl bg-white/95 backdrop-blur-md border border-slate-200/80 p-4 sm:p-6 shadow-xl shadow-teal-900/5 flex flex-col justify-between overflow-hidden h-full min-h-97.5"
    >
      {/* Fondo Ambient Glow cuando la IA procesa */}
      <AnimatePresence>
        {isThinking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-linear-to-b from-teal-500/5 via-transparent to-transparent pointer-events-none z-0"
          />
        )}
      </AnimatePresence>

      {/* Encabezado Superior */}
      <div className="relative z-10">
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </div>
            <span className="text-[11px] font-bold text-slate-700 tracking-wide uppercase ml-1 flex items-center gap-1.5">
              <span>Asistente de Expediente</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-teal-800 border border-slate-200">
                v2.0
              </span>
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200/60 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" />
            En vivo
          </span>
        </div>

        {/* Prompts Rápidos */}
        <div className="mt-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Selecciona una consulta interactiva:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {currentPrompts.map((p) => {
              const isSelected = p.id === activePromptData.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectPrompt(p.id)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold text-left transition-all duration-200 cursor-pointer border flex items-center justify-between ${
                    isSelected
                      ? "bg-[#024945] text-white border-[#024945] shadow-xs scale-[1.01]"
                      : "bg-slate-50/80 text-slate-700 border-slate-200/70 hover:bg-teal-50/60 hover:border-teal-200"
                  }`}
                >
                  <span className="truncate">{p.label}</span>
                  {isSelected && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-[10px] ml-1"
                    >
                      ✨
                    </motion.span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Ventana de Respuestas Chat Estilo IA Premium */}
      <div className="my-3 flex-1 flex flex-col justify-center min-h-50 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeId}-${activePromptData.id}`}
            initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="space-y-3 w-full"
          >
            {/* Pregunta Usuario */}
            <div className="flex justify-end">
              <div className="bg-teal-900 text-teal-50 border border-teal-800 rounded-2xl rounded-tr-xs px-3.5 py-2 max-w-[90%] text-xs font-medium shadow-xs">
                {activePromptData.promptText}
              </div>
            </div>

            {/* Respuesta IA con Avatar y Caja de Respuesta */}
            <div className="flex justify-start gap-2.5 items-start">
              <div className="h-7 w-7 rounded-xl bg-linear-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white text-xs font-bold shadow-xs shrink-0 mt-0.5">
                ✨
              </div>

              <div className="bg-slate-50/90 border border-slate-200/80 rounded-2xl rounded-tl-xs p-3.5 max-w-[92%] w-full shadow-2xs relative overflow-hidden">
                {isThinking ? (
                  <div className="flex items-center gap-2 py-1.5 text-teal-800 text-xs font-mono">
                    <span className="h-2 w-2 rounded-full bg-teal-500 animate-ping" />
                    <span>Sintetizando datos clínicos...</span>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {activePromptData.response}
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pie de simulación */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium relative z-10">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
          Simulación clínica en tiempo real
        </span>
        <span className="text-teal-700 font-bold font-mono text-[10px] uppercase tracking-wider">
          Interactivo
        </span>
      </div>
    </motion.div>
  );
};

export default ClinicalSimulator;