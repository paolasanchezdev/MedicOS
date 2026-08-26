// =========================================================================
// ARCHIVO: apps/web/src/portals/medico/pages/consultas/nueva/components/SoporteInferenciaCard.tsx
// DESCRIPCIÓN: Banner clínico compacto y desplegable de soporte a la decisión (CDSS).
// =========================================================================

import React, { useState } from 'react';
import {
  Activity,
  ShieldAlert,
  AlertTriangle,
  Pill,
  ChevronDown,
  ChevronUp,
  Flame,
} from 'lucide-react';
import type { ClinicalInferenceResult } from '../utils/clinicalEngine';

interface SoporteInferenciaCardProps {
  inference: ClinicalInferenceResult;
}

export const SoporteInferenciaCard: React.FC<SoporteInferenciaCardProps> = ({ inference }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  if (
    inference.overallRisk === 'BAJO' &&
    inference.findings.length === 0 &&
    !inference.hasPharmacologicalAlert &&
    inference.totalScore === 0
  ) {
    return null;
  }

  const riskBadgeStyles = {
    BAJO: 'bg-slate-100 text-slate-700 border-slate-200',
    MODERADO: 'bg-amber-100 text-amber-900 border-amber-300',
    ALTO: 'bg-rose-100 text-rose-900 border-rose-300',
    CRITICO: 'bg-rose-600 text-white border-rose-700 animate-pulse',
  };

  const cardBorderStyles = {
    BAJO: 'bg-slate-50 border-slate-200',
    MODERADO: 'bg-amber-50/70 border-amber-200',
    ALTO: 'bg-rose-50/70 border-rose-200',
    CRITICO: 'bg-rose-50/90 border border-rose-400',
  };

  return (
    <div className={`rounded-xl border transition-all overflow-hidden ${cardBorderStyles[inference.overallRisk]}`}>
      {/* FILA PRINCIPAL: RESUMEN EN 1 LÍNEA */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="p-2.5 sm:p-3 flex items-center justify-between gap-3 cursor-pointer hover:bg-black/5 transition-colors"
      >
        <div className="flex items-center gap-2 min-w-0">
          {inference.overallRisk === 'CRITICO' ? (
            <Flame size={16} className="text-rose-600 shrink-0" />
          ) : inference.overallRisk === 'ALTO' ? (
            <ShieldAlert size={16} className="text-rose-600 shrink-0" />
          ) : inference.overallRisk === 'MODERADO' ? (
            <AlertTriangle size={16} className="text-amber-600 shrink-0" />
          ) : (
            <Activity size={16} className="text-[#0e7490] shrink-0" />
          )}

          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
              CDSS Offline
            </span>
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${
                riskBadgeStyles[inference.overallRisk]
              }`}
            >
              Riesgo {inference.overallRisk} ({inference.totalScore} pts)
            </span>
            {inference.syndromicPattern && (
              <span className="text-xs font-bold text-slate-700 truncate hidden sm:inline">
                • {inference.syndromicPattern}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-bold text-slate-500 hidden md:inline">
            {isOpen ? 'Ocultar detalles' : 'Ver análisis clínico'}
          </span>
          <div className="p-1 rounded-md bg-white border border-slate-200 text-slate-600">
            {isOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </div>
        </div>
      </div>

      {/* CUERPO EXPANDIBLE */}
      {isOpen && (
        <div className="p-3.5 bg-white border-t border-slate-200/80 space-y-3 text-xs animate-in fade-in duration-150">
          {/* Hallazgos */}
          {inference.findings.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 mr-1">Hallazgos:</span>
              {inference.findings.map((f, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-slate-50 border border-slate-200 rounded-md text-[11px] font-semibold text-slate-800"
                >
                  <strong className="text-slate-900">{f.label}:</strong> {f.detail}
                </span>
              ))}
            </div>
          )}

          {/* Alertas Farmacológicas */}
          {inference.hasPharmacologicalAlert && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg space-y-1 text-rose-950 font-medium">
              <div className="flex items-center gap-1.5 text-rose-800 font-bold text-[11px] uppercase">
                <Pill size={13} />
                <span>Advertencia de Farmacoseguridad:</span>
              </div>
              <ul className="pl-4 list-disc text-xs space-y-0.5">
                {inference.pharmacologicalAlerts.map((alert, idx) => (
                  <li key={idx}>{alert.message}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Recomendación */}
          <p className="text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-200/70 text-xs">
            <strong className="text-slate-800">Orientación Médica: </strong>
            {inference.recommendation}
          </p>

          {/* Scoring Trace */}
          {inference.scoreTrace.length > 0 && (
            <div className="pt-1 text-[11px] font-mono text-slate-500 flex flex-wrap gap-x-4 gap-y-1">
              {inference.scoreTrace.map((item, idx) => (
                <span key={idx} className="bg-slate-100 px-1.5 py-0.5 rounded">
                  {item.rule} (+{item.points} pts)
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SoporteInferenciaCard;