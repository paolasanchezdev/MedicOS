// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/pacientes/registrar/components/InformacionMedicaCard.tsx
// DESCRIPCIÓN: Captura de antecedentes médicos preliminares para el carnet y expediente.
// =========================================================================

import React from 'react';
import { Heart, Shield, Droplet } from 'lucide-react';
import type { PatientFormState } from '../../../../../../modules/patients';

interface InformacionMedicaCardProps {
  formData: PatientFormState;
  setField: <K extends keyof PatientFormState>(field: K, value: PatientFormState[K]) => void;
}

export const InformacionMedicaCard: React.FC<InformacionMedicaCardProps> = ({
  formData,
  setField,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-5">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
        <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#2B7A78]">
          <Heart className="w-4 h-4 fill-[#2B7A78]" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            4. Información Médica Preliminar
          </h2>
          <p className="text-xs text-slate-500">
            Datos clínicos base que se plasmarán en el carnet digital de emergencia.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Grupo Sanguíneo */}
        <div>
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Droplet className="w-3.5 h-3.5 text-[#2B7A78]" />
            <span>Grupo Sanguíneo</span>
          </label>
          <select
            value={formData.bloodType}
            onChange={(e) =>
              setField('bloodType', e.target.value as PatientFormState['bloodType'])
            }
            className="w-full bg-slate-50/70 focus:bg-white border border-slate-200/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#2B7A78]/20 focus:border-[#2B7A78] transition-all cursor-pointer"
          >
            <option value="UNKNOWN">Desconocido / Por determinar</option>
            <option value="O_POSITIVE">O Positivo (O+)</option>
            <option value="O_NEGATIVE">O Negativo (O-)</option>
            <option value="A_POSITIVE">A Positivo (A+)</option>
            <option value="A_NEGATIVE">A Negativo (A-)</option>
            <option value="B_POSITIVE">B Positivo (B+)</option>
            <option value="B_NEGATIVE">B Negativo (B-)</option>
            <option value="AB_POSITIVE">AB Positivo (AB+)</option>
            <option value="AB_NEGATIVE">AB Negativo (AB-)</option>
          </select>
        </div>

        {/* Alergias Conocidas */}
        <div>
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-[#2B7A78]" />
            <span>Alergias Conocidas</span>
          </label>
          <input
            type="text"
            value={formData.allergies}
            onChange={(e) => setField('allergies', e.target.value)}
            placeholder="Ej. Alergia a la penicilina, sulfas..."
            className="w-full bg-slate-50/70 focus:bg-white border border-slate-200/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#2B7A78]/20 focus:border-[#2B7A78] transition-all"
          />
        </div>

        {/* Enfermedades Crónicas */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Enfermedades Crónicas
          </label>
          <input
            type="text"
            value={formData.chronicDiseases}
            onChange={(e) => setField('chronicDiseases', e.target.value)}
            placeholder="Ej. Hipertensión arterial, Diabetes tipo 2..."
            className="w-full bg-slate-50/70 focus:bg-white border border-slate-200/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#2B7A78]/20 focus:border-[#2B7A78] transition-all"
          />
        </div>

        {/* Discapacidad o Condición */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Discapacidad o Condición Especial
          </label>
          <input
            type="text"
            value={formData.disabilities}
            onChange={(e) => setField('disabilities', e.target.value)}
            placeholder="Ej. Movilidad reducida, visual..."
            className="w-full bg-slate-50/70 focus:bg-white border border-slate-200/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#2B7A78]/20 focus:border-[#2B7A78] transition-all"
          />
        </div>
      </div>
    </div>
  );
};