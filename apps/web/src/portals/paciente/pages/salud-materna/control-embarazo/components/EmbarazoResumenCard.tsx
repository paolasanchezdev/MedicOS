// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/salud-materna/control-embarazo/components/EmbarazoResumenCard.tsx
// DESCRIPCIÓN: Resumen general obstétrico con guía médica semanal integrada
//              en modal sin sacar a la paciente del módulo de control.
// =========================================================================

import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  ArrowRight,
  Baby,
  ShieldCheck,
  Sparkles,
  X,
  Heart,
  AlertTriangle,
  BookOpen,
  CheckCircle2,
} from 'lucide-react';
import type { PregnancyInfo } from '../../../../../../modules/maternal-health/types/maternal-health.types.js';

interface EmbarazoResumenCardProps {
  pregnancy: PregnancyInfo;
}

export const EmbarazoResumenCard: React.FC<EmbarazoResumenCardProps> = ({ pregnancy }) => {
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);

  // Fechas obstétricas clave
  const fppDate = new Date(pregnancy.estimatedDueDate);
  const formattedFPP = fppDate.toLocaleDateString('es-SV', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const furDate = pregnancy.lastMenstrualPeriod ? new Date(pregnancy.lastMenstrualPeriod) : null;
  const formattedFUR = furDate
    ? furDate.toLocaleDateString('es-SV', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : 'No registrada';

  // Cuenta regresiva
  const now = new Date();
  const diffTime = fppDate.getTime() - now.getTime();
  const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  const weeksRemaining = Math.max(0, 40 - pregnancy.gestationalWeeks);

  // Información de desarrollo fetal según edad gestacional
  const getFetalDevelopment = (week: number) => {
    if (week >= 37) {
      return {
        stageTitle: 'Embarazo a Término',
        description: 'El bebé está completamente formado y preparado para el nacimiento. Desciende a la pelvis.',
        size: 'Sandía',
        length: '~48-52 cm',
        weight: '~3.0-3.5 kg',
        maternalChanges: 'Mayor presión pélvica, contracciones preparatorias y cambios en el cuello uterino.',
        clinicalCare: 'Monitoreo de movimientos fetales activo. Reconocer pérdida de tapón mucoso o rotura de membranas.',
      };
    }
    if (week >= 28) {
      return {
        stageTitle: 'Tercer Trimestre • Maduración Pulmonar',
        description: 'El bebé abre los ojos, percibe luz y acumula grasa protectora bajo la piel. Movimientos más vigorosos.',
        size: 'Berenjena grande',
        length: '~37-40 cm',
        weight: '~1.3-1.6 kg',
        maternalChanges: 'Sensación de saciedad temprana por compresión gástrica y calambres ocasionales en piernas.',
        clinicalCare: 'Aplicación de vacuna Tdap (sem 27-36), tamizaje de diabetes gestacional y conteo diario de movimientos.',
      };
    }
    if (week >= 14) {
      return {
        stageTitle: 'Segundo Trimestre • Desarrollo Sensorial',
        description: 'Los órganos ya están formados y maduran rápidamente. Se perciben las primeras pataditas.',
        size: 'Plátano maduro',
        length: '~25-28 cm',
        weight: '~350-500 g',
        maternalChanges: 'Disminución de náuseas, mayor apetito y leve distensión ligamentosa pélvica.',
        clinicalCare: 'Ultrasonografía morfológica (sem 20-24), control de presión arterial y suplementación continua de hierro.',
      };
    }
    return {
      stageTitle: 'Primer Trimestre • Organogénesis',
      description: 'Formación del corazón, sistema nervioso central y extremidades del embrión.',
      size: 'Manzana verde',
      length: '~12-14 cm',
      weight: '~100-140 g',
      maternalChanges: 'Sensibilidad mamaria, cansancio acentuado y náuseas matutinas frecuentes.',
      clinicalCare: 'Ácido fólico diario (1 mg o 5 mg según riesgo), biometría hemática inicial, EGO y tipificación sanguínea.',
    };
  };

  const fetalInfo = getFetalDevelopment(pregnancy.gestationalWeeks);

  // Parámetros SVG del medidor circular
  const circleRadius = 46;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circumference - (pregnancy.progressPercentage / 100) * circumference;

  return (
    <>
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-7 shadow-2xs select-none relative overflow-hidden space-y-6">
        {/* Resplandor sutil de fondo */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-linear-to-bl from-teal-50/70 via-emerald-50/30 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* ------------------------------------------------------------- */}
        {/* SECCIÓN SUPERIOR: HERO DEL ESTADO GESTACIONAL                 */}
        {/* ------------------------------------------------------------- */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Columna Izquierda (4/12): Gauge de Semanas */}
          <div className="lg:col-span-4 flex items-center gap-4.5">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 drop-shadow-2xs" viewBox="0 0 108 108">
                <circle
                  cx="54"
                  cy="54"
                  r={circleRadius}
                  fill="transparent"
                  stroke="#F1F5F9"
                  strokeWidth="7.5"
                />
                <circle
                  cx="54"
                  cy="54"
                  r={circleRadius}
                  fill="transparent"
                  stroke="#0F766E"
                  strokeWidth="7.5"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-none">
                  {pregnancy.gestationalWeeks}
                </span>
                <span className="text-[10px] font-extrabold text-teal-700 uppercase tracking-wider mt-1">
                  Semanas
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-teal-50 text-teal-800 border border-teal-200/70 uppercase tracking-wide">
                  {pregnancy.trimesterLabel}
                </span>
                <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                  +{pregnancy.gestationalDays} días
                </span>
              </div>

              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug">
                Resumen de Gestación
              </h2>

              <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Control prenatal activo</span>
              </div>
            </div>
          </div>

          {/* Columna Central (4/12): Hito Fetal de la Semana */}
          <div className="lg:col-span-4 bg-slate-50/80 border border-slate-200/70 rounded-2xl p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Baby className="w-3.5 h-3.5 text-teal-700" />
                <span>Desarrollo Estimado</span>
              </span>
              <span className="text-[11px] font-extrabold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100">
                {fetalInfo.size}
              </span>
            </div>

            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              {fetalInfo.description}
            </p>

            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
              <div>
                <span className="block text-[10px] font-semibold text-slate-400 uppercase">Longitud</span>
                <strong className="text-slate-800 font-bold">{fetalInfo.length}</strong>
              </div>
              <div className="w-px h-6 bg-slate-200" />
              <div>
                <span className="block text-[10px] font-semibold text-slate-400 uppercase">Peso Aprox.</span>
                <strong className="text-slate-800 font-bold">{fetalInfo.weight}</strong>
              </div>
              <div className="w-px h-6 bg-slate-200" />
              <div>
                <span className="block text-[10px] font-semibold text-slate-400 uppercase">FCF Normal</span>
                <strong className="text-teal-700 font-bold">120-160 lpm</strong>
              </div>
            </div>
          </div>

          {/* Columna Derecha (4/12): FPP y Botón de Guía Semanal */}
          <div className="lg:col-span-4 flex flex-col gap-2.5">
            <div className="grid grid-cols-2 gap-2.5">
              {/* Tarjeta FPP */}
              <div className="p-3.5 rounded-2xl bg-teal-50/70 border border-teal-100/90 space-y-0.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-teal-800 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> FPP Oficial
                </span>
                <p className="text-xs sm:text-sm font-black text-teal-950 truncate">
                  {formattedFPP}
                </p>
                <p className="text-[10px] text-teal-700/80 font-medium">Regla Naegele</p>
              </div>

              {/* Tarjeta Cuenta Regresiva */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-0.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-teal-600" /> Falta Aprox.
                </span>
                <p className="text-xs sm:text-sm font-black text-slate-900">
                  {daysRemaining} días
                </p>
                <p className="text-[10px] text-slate-500 font-medium">~{weeksRemaining} semanas</p>
              </div>
            </div>

            {/* Botón de Guía Médica (Abre Modal en Contexto) */}
            <button
              type="button"
              onClick={() => setIsGuideOpen(true)}
              className="w-full inline-flex items-center justify-between p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-2xs cursor-pointer group"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-300" />
                <span>Guía médica de tu semana ({pregnancy.gestationalWeeks})</span>
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* SECCIÓN INFERIOR: BARRA DE TIEMPO Y METADATOS CLÍNICOS        */}
        {/* ------------------------------------------------------------- */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <div className="flex flex-wrap items-center justify-between text-xs gap-2">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-700">Progreso Gestacional Total</span>
              <span className="text-[11px] font-bold text-slate-400">
                (Semana {pregnancy.gestationalWeeks} de 40)
              </span>
            </div>

            <div className="flex items-center gap-3 text-[11px] font-medium text-slate-500">
              <span>FUR: <strong className="text-slate-700 font-bold">{formattedFUR}</strong></span>
              <span>•</span>
              <span className="text-teal-800 font-extrabold bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100">
                {pregnancy.progressPercentage}% transcurrido
              </span>
            </div>
          </div>

          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
            <div
              style={{ width: `${pregnancy.progressPercentage}%` }}
              className="h-full bg-linear-to-r from-teal-500 via-teal-600 to-[#0F766E] rounded-full transition-all duration-700"
            />
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MODAL CLÍNICO: GUÍA MÉDICA DE LA SEMANA GESTACIONAL           */}
      {/* ------------------------------------------------------------- */}
      {isGuideOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 select-none animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-slate-100 max-w-xl w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            {/* Cabecera del modal */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 shadow-2xs">
                  <BookOpen className="w-5 h-5 stroke-2" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-teal-700">
                      Protocolo Obstétrico Oficial
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <span className="text-[10px] font-bold text-slate-400">Semana {pregnancy.gestationalWeeks}</span>
                  </div>
                  <h3 className="text-base font-black text-slate-900 tracking-tight">
                    {fetalInfo.stageTitle}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsGuideOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Desarrollo Fetal */}
            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                  <Baby className="w-4 h-4 text-teal-700" />
                  <span>Desarrollo del Bebé esta Semana</span>
                </span>
                <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200/60">
                  {fetalInfo.size}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {fetalInfo.description}
              </p>
              <div className="pt-2 border-t border-slate-200/60 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase block">Longitud Media</span>
                  <strong className="text-slate-800">{fetalInfo.length}</strong>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase block">Peso Estimado</span>
                  <strong className="text-slate-800">{fetalInfo.weight}</strong>
                </div>
              </div>
            </div>

            {/* Cambios Maternos */}
            <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-100 space-y-1.5">
              <span className="text-xs font-black text-teal-950 flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-teal-700 fill-teal-100" />
                <span>Cambios en tu Cuerpo</span>
              </span>
              <p className="text-xs text-teal-900 leading-relaxed font-medium">
                {fetalInfo.maternalChanges}
              </p>
            </div>

            {/* Cuidados y Prioridades de la Etapa */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1.5">
              <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Pautas Médicas Recomendadas</span>
              </span>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {fetalInfo.clinicalCare}
              </p>
            </div>

            {/* Alerta de Urgencias Obstétricas */}
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-black text-rose-800 uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Signos de Alarma Obstétrica</span>
              </div>
              <p className="text-xs text-rose-950 leading-relaxed font-medium">
                Si experimentas sangrado transvaginal, salida de líquido amniótico, dolor de cabeza intenso con visión borrosa o ausencia de movimientos fetales por más de 2 horas, acude de inmediato a tu centro de salud más cercano.
              </p>
            </div>

            {/* Pie del modal */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-medium">
                Orientación clínica basada en normativas nacionales de salud materno-infantil.
              </span>
              <button
                type="button"
                onClick={() => setIsGuideOpen(false)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-xs"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EmbarazoResumenCard;