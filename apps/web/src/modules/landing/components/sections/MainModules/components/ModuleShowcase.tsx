/* =========================================================================
   ARCHIVO:
   apps/web/src/modules/landing/components/sections/MainModules/components/ModuleShowcase.tsx
   ========================================================================= */

import React from 'react';
import { type RoleId, MODULES_DATA } from '../data/modulesData';
import { mainModulesStyles } from '../MainModules.styles';

interface ModuleShowcaseProps {
  activeRole: RoleId;
}

// Micro-vista para Brigadista (Optimizada con React.memo)
const BrigadistaShowcase: React.FC = React.memo(() => (
  <div className="space-y-4">
    {/* Ficha rápida de paciente */}
    <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-700 font-black flex items-center justify-center text-xs shadow-2xs">
          QR
        </div>
        <div>
          <div className="text-xs sm:text-sm font-bold text-slate-900">María Elena López</div>
          <div className="text-[11px] text-slate-500 font-mono">ID: #QR-8921-SV • 42 años</div>
        </div>
      </div>
      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
        Registrado
      </span>
    </div>

    {/* Captura de Signos Vitales (Sin contenedor exterior doble) */}
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Toma de Signos Vitales
        </span>
        <span className="text-[11px] text-medicos-teal font-mono font-semibold">Modo Directo</span>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <div className="p-3 rounded-2xl bg-slate-50/70 border border-slate-100/80">
          <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Presión Arterial</div>
          <div className="text-sm sm:text-base font-black text-slate-800 font-mono mt-0.5">
            120/80 <span className="text-[10px] font-normal text-slate-400 font-sans">mmHg</span>
          </div>
        </div>
        <div className="p-3 rounded-2xl bg-slate-50/70 border border-slate-100/80">
          <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Frecuencia C.</div>
          <div className="text-sm sm:text-base font-black text-slate-800 font-mono mt-0.5">
            72 <span className="text-[10px] font-normal text-slate-400 font-sans">bpm</span>
          </div>
        </div>
        <div className="p-3 rounded-2xl bg-slate-50/70 border border-slate-100/80">
          <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Temperatura</div>
          <div className="text-sm sm:text-base font-black text-slate-800 font-mono mt-0.5">
            36.6 <span className="text-[10px] font-normal text-slate-400 font-sans">°C</span>
          </div>
        </div>
        <div className="p-3 rounded-2xl bg-slate-50/70 border border-slate-100/80">
          <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Saturación O₂</div>
          <div className="text-sm sm:text-base font-black text-slate-800 font-mono mt-0.5">
            98 <span className="text-[10px] font-normal text-slate-400 font-sans">%</span>
          </div>
        </div>
      </div>
    </div>

    {/* Indicador de Almacenamiento Local */}
    <div className="p-3 bg-amber-500/5 rounded-xl border border-amber-500/20 flex items-center justify-between text-xs">
      <div className="flex items-center gap-2 text-amber-900 font-medium text-[11px] sm:text-xs">
        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
        <span>4 registros guardados en memoria local</span>
      </div>
      <span className="text-[10px] font-mono text-amber-800 bg-amber-500/10 px-2 py-0.5 rounded-md font-bold uppercase">
        Pendiente Red
      </span>
    </div>
  </div>
));

BrigadistaShowcase.displayName = 'BrigadistaShowcase';

// Micro-vista para Paciente (Optimizada con React.memo)
const PacienteShowcase: React.FC = React.memo(() => (
  <div className="space-y-4">
    {/* Carné de Identidad Digital */}
    <div className="p-4 sm:p-5 bg-gradient-to-br from-medicos-dark-blue to-slate-900 rounded-2xl text-white shadow-xs relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-medicos-teal/15 rounded-full blur-2xl pointer-events-none" />
      <div className="flex items-start justify-between relative z-10">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-medicos-cyan font-bold">
            MedicOS • Expediente Único
          </span>
          <h4 className="text-base sm:text-lg font-bold mt-1 text-white">María Elena López</h4>
          <p className="text-xs text-slate-300 font-mono">Chalatenango, El Salvador</p>
        </div>
        <div className="w-11 h-11 bg-white rounded-xl p-1 flex items-center justify-center shadow-2xs shrink-0">
          <div className="w-full h-full border border-dashed border-medicos-dark-blue/40 rounded-lg flex items-center justify-center text-[10px] font-mono font-bold text-medicos-dark-blue">
            QR
          </div>
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-300">
        <span>SANGRE: O+</span>
        <span>ALERGIAS: PENICILINA</span>
      </div>
    </div>

    {/* Historial Clínico Longitudinal */}
    <div className="space-y-2">
      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1 block">
        Historial de Consultas
      </span>
      <div className="space-y-2">
        <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-start gap-3">
          <div className="w-2 h-2 rounded-full bg-medicos-teal mt-1.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">Control de Hipertensión</span>
              <span className="text-[10px] text-slate-400 font-mono">18 Mayo 2026</span>
            </div>
            <p className="text-[11px] text-slate-500 truncate mt-0.5">
              Brigada Cantón San José • Dr. R. Rivera
            </p>
          </div>
        </div>
        <div className="p-3 rounded-2xl bg-slate-50/50 border border-slate-100/60 flex items-start gap-3 opacity-75">
          <div className="w-2 h-2 rounded-full bg-slate-300 mt-1.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Consulta General</span>
              <span className="text-[10px] text-slate-400 font-mono">12 Feb 2026</span>
            </div>
            <p className="text-[11px] text-slate-400 truncate mt-0.5">
              Brigada Municipal • Dra. S. Cruz
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
));

PacienteShowcase.displayName = 'PacienteShowcase';

// Micro-vista para Doctor (Optimizada con React.memo)
const DoctorShowcase: React.FC = React.memo(() => (
  <div className="space-y-4">
    {/* Encabezado de Evaluación Clínica */}
    <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100 flex items-center justify-between">
      <div>
        <div className="text-xs sm:text-sm font-bold text-slate-900">Evaluación Médica en Curso</div>
        <div className="text-[11px] text-slate-500 font-mono">Paciente: María Elena López (42a)</div>
      </div>
      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-medicos-teal/10 text-medicos-teal border border-medicos-teal/20 uppercase">
        Validación
      </span>
    </div>

    {/* Tarjeta del Asistente de IA (Copiloto) */}
    <div className="p-4 bg-teal-50/40 rounded-2xl border border-teal-200/50 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
          <svg className="w-4 h-4 text-medicos-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>IA Copilot • Sugerencia Clínica</span>
        </div>
        <span className="text-[10px] font-mono uppercase bg-white text-slate-500 px-2 py-0.5 rounded-md border border-slate-200/80 shadow-2xs">
          Asistente
        </span>
      </div>
      <p className="text-xs text-slate-600 leading-relaxed">
        Presión en rango (120/80 mmHg). Se sugiere mantener dosis de <strong className="font-semibold text-slate-900">Enalapril 10mg</strong>. Sin contraindicaciones detectadas en el historial.
      </p>
    </div>

    {/* Botón de Acción Clínica */}
    <div className="p-3 bg-white rounded-2xl border border-slate-100 flex items-center justify-between">
      <div className="text-xs font-bold text-slate-800">Firma y Prescripción</div>
      <button 
        type="button" 
        tabIndex={-1}
        className="px-3.5 py-2 rounded-xl bg-medicos-dark-blue text-white text-xs font-bold shadow-2xs flex items-center gap-2 pointer-events-none"
      >
        <svg className="w-3.5 h-3.5 text-medicos-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        Validar Consulta
      </button>
    </div>
  </div>
));

DoctorShowcase.displayName = 'DoctorShowcase';

export const ModuleShowcase: React.FC<ModuleShowcaseProps> = ({ activeRole }) => {
  const data = MODULES_DATA[activeRole];

  return (
    <div className={mainModulesStyles.showcaseCard}>
      {/* Top Header del Preview */}
      <div className={mainModulesStyles.showcaseHeader}>
        <span className={mainModulesStyles.showcaseBadge}>{data.showcase.badgeText}</span>
        <div className={mainModulesStyles.showcaseStatus}>
          <span className={mainModulesStyles.pulseDot} />
          <span>{data.showcase.statusLabel}</span>
        </div>
      </div>

      {/* Contenido Dinámico según el Rol */}
      <div className="flex-1 my-2 flex flex-col justify-center">
        {activeRole === 'brigadista' && <BrigadistaShowcase />}
        {activeRole === 'paciente' && <PacienteShowcase />}
        {activeRole === 'doctor' && <DoctorShowcase />}
      </div>
    </div>
  );
};