// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/documentos/descarga-expediente/components/ResumenIAExpedienteCard.tsx
// DESCRIPCIÓN: Síntesis clínica profesional basada en evidencia real.
// =========================================================================

import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import type { ClinicalGraphNode } from '../../../../../../modules/clinical-knowledge/types/clinical-graph.types.js';

interface ResumenIAExpedienteCardProps {
  nodes: ClinicalGraphNode[];
}

export const ResumenIAExpedienteCard: React.FC<ResumenIAExpedienteCardProps> = ({ nodes }) => {
  const allergies = nodes.filter((n) => n.type === 'ALLERGY').map((n) => n.label);
  const diagnoses = nodes.filter((n) => n.type === 'DIAGNOSIS').map((n) => n.label);
  const prenatal = nodes.filter((n) => n.type === 'PRENATAL_CONTROL');
  const vaccines = nodes.filter((n) => n.type === 'VACCINATION');
  const vitals = nodes.filter((n) => n.type === 'VITAL_SIGN');
  const lastVital = vitals[0]?.label;

  // Puntos fácticos de atención clínica
  const keyObservations: string[] = [];

  if (prenatal.length > 0) {
    keyObservations.push(`Cuenta con ${prenatal.length} controles prenatales registrados con evolución obstétrica activa.`);
  }
  if (vaccines.length > 0) {
    keyObservations.push(`Esquema de inmunización registrado con ${vaccines.length} biológico documentado.`);
  }
  if (diagnoses.length > 0) {
    keyObservations.push(`Presenta ${diagnoses.length} diagnóstico clínico formal: ${diagnoses.join(', ')}.`);
  }
  if (allergies.length > 0) {
    keyObservations.push(`Alerta de hipersensibilidad a: ${allergies.join(', ')}.`);
  } else {
    keyObservations.push('Niega alergias medicamentosas o alimentarias en su expediente base.');
  }

  return (
    <div className="bg-white rounded-3xl border border-teal-200/90 p-5 sm:p-6 shadow-xs select-none space-y-4">
      
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-teal-100/80 pb-3.5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-200/80 text-[#1c5752] flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-[#1c5752]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                Resumen Clínico Asistido por Inteligencia Médica
              </h3>
              <span className="text-[10px] font-bold text-[#1c5752] bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                MedicOS AI
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Síntesis estructurada basada en los registros reales del expediente. No reemplaza el criterio médico.
            </p>
          </div>
        </div>
      </div>

      {/* Píldoras de métricas clínicas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="bg-teal-50/60 p-3 rounded-2xl border border-teal-100">
          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 block">Diagnósticos</span>
          <span className="text-sm font-black text-slate-900 mt-0.5 block">
            {diagnoses.length > 0 ? `${diagnoses.length} Activo` : 'Sin diagnósticos'}
          </span>
        </div>

        <div className="bg-pink-50/60 p-3 rounded-2xl border border-pink-100">
          <span className="text-[10px] font-bold uppercase tracking-wider text-pink-800 block">Controles Maternos</span>
          <span className="text-sm font-black text-slate-900 mt-0.5 block">
            {prenatal.length > 0 ? `${prenatal.length} Registrados` : 'No gestante'}
          </span>
        </div>

        <div className="bg-emerald-50/60 p-3 rounded-2xl border border-emerald-100">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">Inmunización</span>
          <span className="text-sm font-black text-slate-900 mt-0.5 block">
            {vaccines.length > 0 ? `${vaccines.length} Dosis Aplicada` : 'Sin vacunas'}
          </span>
        </div>

        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Última Presión</span>
          <span className="text-sm font-black text-slate-900 mt-0.5 block font-mono">
            {lastVital || 'Sin tomas recientes'}
          </span>
        </div>
      </div>

      {/* Puntos de atención médica */}
      <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200 space-y-2">
        <span className="text-[10.5px] font-black uppercase tracking-wider text-[#1c5752] flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#1c5752]" />
          Puntos Relevantes del Expediente
        </span>
        <ul className="space-y-1.5 text-xs text-slate-700">
          {keyObservations.map((obs, idx) => (
            <li key={idx} className="flex items-start gap-2 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1c5752] mt-1.5 shrink-0"></span>
              <span>{obs}</span>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
};

export default ResumenIAExpedienteCard;