// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/perfil/contactos-emergencia/components/LineasEmergenciaNacionales.tsx
// DESCRIPCIÓN: Directorio 24/7 ultra compacto y aesthetic para móvil (2x2) y escritorio (4 columnas).
// =========================================================================

import React from 'react';
import { 
  Ambulance, 
  Stethoscope, 
  HeartHandshake, 
  PhoneCall, 
  ShieldPlus,
  Phone
} from 'lucide-react';

interface MedicalLine {
  number: string;
  name: string;
  service: string;
  badge: string;
  icon: React.ElementType;
  phoneRaw: string;
}

const MEDICAL_LINES: MedicalLine[] = [
  {
    number: '132',
    name: 'SEM Ambulancias',
    service: 'Emergencias vitales y traslados',
    badge: 'Urgencia 24/7',
    icon: Ambulance,
    phoneRaw: '132',
  },
  {
    number: '131',
    name: 'FOSALUD / MINSAL',
    service: 'Orientación médica telefónica',
    badge: 'Línea gratuita',
    icon: Stethoscope,
    phoneRaw: '131',
  },
  {
    number: '131 (Op. 2)',
    name: 'Salud Mental',
    service: 'Apoyo y contención emocional',
    badge: 'Confidencial',
    icon: HeartHandshake,
    phoneRaw: '131',
  },
  {
    number: '2222-5155',
    name: 'Cruz Roja Salvadoreña',
    service: 'Cuerpo de socorro y rescate',
    badge: 'Nacional',
    icon: ShieldPlus,
    phoneRaw: '+50322225155',
  },
];

export const LineasEmergenciaNacionales: React.FC = () => {
  return (
    <div className="w-full space-y-2 sm:space-y-3 pt-1">
      {/* Encabezado minimalista */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5">
          <Phone className="w-3.5 h-3.5 text-[#105F68]" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Líneas médicas de auxilio nacional 24/7
          </h2>
        </div>
        <span className="text-[11px] font-normal text-slate-400 hidden sm:inline-block">
          Red pública y cuerpos de socorro en El Salvador
        </span>
      </div>

      {/* Rejilla: 2x2 en móvil (compacto) y 4 columnas en pantallas grandes */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3.5 w-full">
        {MEDICAL_LINES.map((line) => {
          const Icon = line.icon;
          return (
            <div
              key={`${line.number}-${line.name}`}
              className="rounded-2xl bg-white border border-slate-200/80 p-2.5 sm:p-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-[#9ED5D1] hover:shadow-[0_6px_20px_rgba(16,95,104,0.06)] transition-all duration-200 flex flex-col justify-between space-y-2 sm:space-y-3.5 group"
            >
              {/* Fila superior: Ícono y Badge */}
              <div className="flex items-center justify-between gap-1.5">
                <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-[#F4FAF9] border border-[#E2EEEE] text-[#105F68] flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
                  <Icon className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 stroke-2" />
                </div>

                <span className="hidden sm:inline-block text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-50 border border-slate-200/60 text-slate-500 shrink-0">
                  {line.badge}
                </span>
              </div>

              {/* Información y Número */}
              <div className="space-y-0.5 min-w-0">
                <h3 className="font-bold text-slate-800 text-[11.5px] sm:text-xs tracking-tight truncate">
                  {line.name}
                </h3>
                <p className="hidden sm:block text-[11px] text-slate-400 font-normal leading-tight truncate">
                  {line.service}
                </p>
                <div className="pt-0.5 sm:pt-1">
                  <span className="font-mono text-xs sm:text-base font-bold text-slate-900 tracking-tight block truncate">
                    {line.number}
                  </span>
                </div>
              </div>

              {/* Botón Llamar con Color y Ajuste Ergonómico */}
              <div className="pt-1.5 sm:pt-2 border-t border-slate-100/90">
                <a
                  href={`tel:${line.phoneRaw}`}
                  className="w-full h-7 sm:h-8.5 rounded-full bg-[#105F68] hover:bg-[#0c4b52] text-white text-[11px] sm:text-xs font-bold inline-flex items-center justify-center gap-1.5 shadow-2xs transition-all duration-150 active:scale-95 cursor-pointer"
                  title={`Llamar a ${line.name}`}
                >
                  <PhoneCall className="w-3 h-3 stroke-[2.4]" />
                  <span>Llamar</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LineasEmergenciaNacionales;