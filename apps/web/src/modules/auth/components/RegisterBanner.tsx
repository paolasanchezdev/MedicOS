// =========================================================================
// ARCHIVO: apps/web/src/core/auth/components/RegisterBanner.tsx
// DESCRIPCIÓN: Panel lateral con beneficios del portal de pacientes.
// =========================================================================

import React from 'react';
import { Calendar, FileText, Activity, ShieldCheck } from 'lucide-react';

export const RegisterBanner: React.FC = () => {
  return (
    <div className="hidden lg:flex lg:col-span-5 relative flex-col items-center justify-between p-8 bg-[#202b38] text-left select-none">
      
      <div className="my-auto w-full max-w-64">
        {/* Titular */}
        <span className="text-[10px] font-bold text-teal-400 tracking-wider uppercase block mb-1">
          Portal del Paciente
        </span>
        <h3 className="text-lg font-bold text-white tracking-tight mb-6">
          Gestiona tu salud en un solo lugar
        </h3>

        {/* Lista de beneficios estilo Apple UI */}
        <div className="space-y-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2 rounded-xl bg-white/10 text-teal-300 border border-white/10 shrink-0">
              <Calendar size={18} />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white">Citas en línea</h4>
              <p className="text-[11px] text-slate-300 leading-normal font-normal">
                Agenda y reprograma tus consultas médicas en segundos.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2 rounded-xl bg-white/10 text-teal-300 border border-white/10 shrink-0">
              <FileText size={18} />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white">Historial Digital</h4>
              <p className="text-[11px] text-slate-300 leading-normal font-normal">
                Accede a tus recetas y resultados de laboratorio cuando quieras.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2 rounded-xl bg-white/10 text-teal-300 border border-white/10 shrink-0">
              <Activity size={18} />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white">Seguimiento Real</h4>
              <p className="text-[11px] text-slate-300 leading-normal font-normal">
                Monitorea el avance de tus tratamientos activos.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer del Banner */}
      <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 mt-2 font-medium w-full text-center">
        <ShieldCheck size={13} className="text-teal-400" />
        <span>Datos protegidos bajo norma de privacidad médica</span>
      </div>
    </div>
  );
};