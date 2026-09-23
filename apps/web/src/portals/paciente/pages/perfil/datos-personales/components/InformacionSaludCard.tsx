// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/perfil/datos-personales/components/InformacionSaludCard.tsx
// DESCRIPCIÓN: Card de Información de Salud rediseñada como un Dashboard Bento
//              con widgets limpios, iconos destacados y tipografía jerárquica.
// =========================================================================

import React from 'react';
import {
  HeartPulse,
  AlertTriangle,
  Activity,
  FileSpreadsheet,
  Users,
  Droplet,
  Pill,
  ExternalLink,
} from 'lucide-react';
import type { BasalHealthData } from '../../../../../../modules/patients/types/patient-personal-data.types.js';

interface InformacionSaludCardProps {
  health: BasalHealthData;
  onOpenHealthModal: () => void;
}

export const InformacionSaludCard: React.FC<InformacionSaludCardProps> = ({
  health,
  onOpenHealthModal,
}) => {
  const bloodSourceLabel =
    health.bloodTypeSource === 'CLINICAL' ? 'Uso clínico' : 'Autoreporte';

  const items = [
    {
      label: 'Alergias',
      count: health.allergies.length,
      icon: AlertTriangle,
      color: 'text-amber-600',
      bg: 'bg-amber-100/50',
    },
    {
      label: 'Enf. crónicas',
      count: health.chronicDiseases.length,
      icon: Activity,
      color: 'text-rose-600',
      bg: 'bg-rose-100/50',
    },
    {
      label: 'Antecedentes',
      count: health.medicalHistory.length,
      icon: FileSpreadsheet,
      color: 'text-indigo-600',
      bg: 'bg-indigo-100/50',
    },
    {
      label: 'Familiares',
      count: health.familyHistory.length,
      icon: Users,
      color: 'text-sky-600',
      bg: 'bg-sky-100/50',
    },
    {
      label: 'Medicamentos',
      count: health.habitualMedications.length,
      icon: Pill,
      color: 'text-emerald-600',
      bg: 'bg-emerald-100/50',
    },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/70 shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-6 select-none space-y-5">
      {/* Cabecera */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-50 text-[#1c5752] flex items-center justify-center border border-teal-100/50">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              Información de salud
            </h3>
            <p className="text-[11.5px] text-slate-500 font-medium">
              Datos médicos basales y antecedentes del paciente.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenHealthModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-50 hover:bg-teal-50 text-slate-700 hover:text-[#1c5752] border border-slate-200/80 text-xs font-bold transition cursor-pointer active:scale-95"
        >
          <span>Ver / editar</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Grid de Widgets Estilo Apple Health */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3.5">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              onClick={onOpenHealthModal}
              className="p-4 rounded-[1.25rem] bg-slate-50/70 border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-[0.6rem] flex items-center justify-center shrink-0 ${item.bg} ${item.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[12.5px] font-bold text-slate-700 group-hover:text-slate-900 transition-colors leading-tight">
                  {item.label}
                </span>
              </div>
              <span className="text-xl font-black text-slate-900 font-mono">
                {item.count}
              </span>
            </div>
          );
        })}

        {/* Ficha Especial: Tipo de Sangre */}
        <div
          onClick={onOpenHealthModal}
          className="p-4 rounded-[1.25rem] bg-rose-50/40 border border-rose-100/80 hover:bg-rose-50 transition-all cursor-pointer flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[0.6rem] bg-rose-100/80 text-rose-600 flex items-center justify-center shrink-0">
              <Droplet className="w-4 h-4 fill-rose-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-[12.5px] font-bold text-slate-800 leading-tight">Tipo de sangre</span>
              <span className="text-[10px] text-slate-500 font-medium">
                {bloodSourceLabel}
              </span>
            </div>
          </div>
          <span className="text-xl font-black text-rose-600 font-mono">
            {health.bloodType}
          </span>
        </div>
      </div>
    </div>
  );
};

export default InformacionSaludCard;