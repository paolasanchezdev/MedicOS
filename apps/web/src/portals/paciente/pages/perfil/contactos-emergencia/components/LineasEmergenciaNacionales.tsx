// =========================================================================
// ARCHIVO: LineasEmergenciaNacionales.tsx
// DESCRIPCIÓN: Líneas de salud 24/7 en formato micro-tarjetas limpio.
// =========================================================================

import React from 'react';
import { Ambulance, Stethoscope, HeartHandshake, Cross, PhoneCall } from 'lucide-react';

interface MedicalLine {
  number: string;
  name: string;
  service: string;
  icon: React.ElementType;
  phoneRaw: string;
}

const MEDICAL_LINES: MedicalLine[] = [
  {
    number: '132',
    name: 'SEM Ambulancias',
    service: 'Urgencias vitales 24/7',
    icon: Ambulance,
    phoneRaw: '132',
  },
  {
    number: '131',
    name: 'FOSALUD / MINSAL',
    service: 'Orientación médica telefónica',
    icon: Stethoscope,
    phoneRaw: '131',
  },
  {
    number: '131',
    name: 'Salud Mental',
    service: 'Apoyo en crisis (Opción 2)',
    icon: HeartHandshake,
    phoneRaw: '131',
  },
  {
    number: '2222-5155',
    name: 'Cruz Roja Salvadoreña',
    service: 'Socorrismo y traslados',
    icon: Cross,
    phoneRaw: '+50322225155',
  },
];

export const LineasEmergenciaNacionales: React.FC = () => {
  return (
    <div className="w-full space-y-2.5 pt-2">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
        Líneas médicas de auxilio nacional 24/7
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full">
        {MEDICAL_LINES.map((line) => {
          const Icon = line.icon;
          return (
            <div
              key={`${line.number}-${line.name}`}
              className="bg-white rounded-xl border border-slate-200/70 p-3 shadow-2xs hover:border-slate-300 transition flex items-center justify-between gap-2.5"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[#EEF7F8] text-[#166E7A] flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="font-bold text-slate-800 text-xs block truncate">
                    {line.name}
                  </span>
                  <span className="font-mono text-[11px] text-slate-400 block">
                    {line.number}
                  </span>
                </div>
              </div>

              <a
                href={`tel:${line.phoneRaw}`}
                className="h-7 px-2.5 rounded-lg bg-slate-50 hover:bg-[#EEF7F8] text-[#166E7A] text-[11px] font-semibold inline-flex items-center gap-1 transition cursor-pointer shrink-0"
              >
                <PhoneCall className="w-3 h-3" />
                <span>Llamar</span>
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LineasEmergenciaNacionales;