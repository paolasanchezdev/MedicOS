// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/salud-materna/diario-sintomas/components/SignosAlarmaCard.tsx
// DESCRIPCIÓN: Tarjeta estructurada para señales de alerta (sin fondo lavado).
// =========================================================================

import React, { useState } from 'react';
import { AlertTriangle, ChevronRight, ShieldAlert, PhoneCall, X } from 'lucide-react';
import { OFFICIAL_WARNING_SIGNS } from '../../../../../../modules/maternal-health/services/symptom-diary.service.js';

export const SignosAlarmaCard: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shadow-xs shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-rose-600">
                Aviso Preventivo Oficial
              </p>
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight mt-0.5">
                Señales de Alerta que requieren atención médica
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl shadow-2xs transition cursor-pointer self-start sm:self-center shrink-0"
          >
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>Consultar señales</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Modal Institucional */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-5 border border-slate-100 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5 text-rose-700">
                <div className="p-2 rounded-xl bg-rose-50 border border-rose-100">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <h4 className="text-base font-black text-slate-900 tracking-tight">
                  Señales de Alerta Obstétricas
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Conoce las situaciones que requieren atención médica urgente según los protocolos institucionales de salud materna:
            </p>

            <div className="space-y-3">
              {OFFICIAL_WARNING_SIGNS.map((sign) => (
                <div
                  key={sign.id}
                  className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-1"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-black text-slate-900">{sign.title}</span>
                    <span className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-lg tracking-wider ${
                      sign.urgencyLevel === 'INMEDIATA'
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}>
                      {sign.urgencyLevel}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-snug font-medium">{sign.description}</p>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200/80 flex items-center justify-between gap-3 text-xs text-[#2B7A78] font-bold">
              <div className="flex items-center gap-2.5">
                <PhoneCall className="w-4 h-4 shrink-0" />
                <span>Asistencia y emergencias obstétricas: Línea 132 (MINSAL)</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold rounded-xl transition cursor-pointer"
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

export default SignosAlarmaCard;