// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/perfil/datos-personales/components/PrivacidadPerfilCard.tsx
// DESCRIPCIÓN: Card de preferencias de visibilidad estilo iOS Settings.
// =========================================================================

import React, { useState } from 'react';
import { Eye, Check, X, Pencil } from 'lucide-react';
import type {
  PatientPersonalDataProfile,
  UpdateProfileCustomizationDto,
} from '../../../../../../modules/patients/types/patient-personal-data.types.js';

interface PrivacidadPerfilCardProps {
  profile: PatientPersonalDataProfile;
  isEditing: boolean;
  saving: boolean;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSave: (dto: UpdateProfileCustomizationDto) => Promise<boolean>;
}

export const PrivacidadPerfilCard: React.FC<PrivacidadPerfilCardProps> = ({
  profile,
  isEditing,
  saving,
  onStartEdit,
  onCancelEdit,
  onSave,
}) => {
  const [visibilities, setVisibilities] = useState({ ...profile.visibleInProfile });

  const toggleField = (key: keyof typeof visibilities) => {
    if (!isEditing) return;
    setVisibilities((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    await onSave({
      preferredName: profile.preferredName,
      visibleInProfile: visibilities,
    });
  };

  const options = [
    { key: 'showPhone', label: 'Número de Teléfono', desc: 'Visible en brigadas y contactos' },
    { key: 'showEmail', label: 'Correo Electrónico', desc: 'Para avisos y notificaciones' },
    { key: 'showDateOfBirth', label: 'Fecha de Nacimiento', desc: 'Verificación de edad' },
    { key: 'showMunicipality', label: 'Municipio', desc: 'Ubicación comunitaria' },
    { key: 'showAddress', label: 'Dirección Completa', desc: 'Residencia registrada' },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 select-none flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#1c5752]" />
            <h3 className="text-sm font-black text-slate-900 tracking-tight">
              Visibilidad del Perfil
            </h3>
          </div>

          {!isEditing ? (
            <button
              type="button"
              onClick={onStartEdit}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-50 hover:bg-teal-50 text-slate-600 hover:text-[#1c5752] border border-slate-200/80 text-xs font-bold transition active:scale-95 cursor-pointer"
            >
              <Pencil className="w-3 h-3" />
              <span>Editar</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={saving}
                onClick={onCancelEdit}
                className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={handleSave}
                className="px-3 py-1 rounded-full bg-[#1c5752] text-white text-xs font-bold flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Guardar</span>
              </button>
            </div>
          )}
        </div>

        <p className="text-[11px] text-slate-500 font-medium mb-3">
          Configura qué información deseas que se muestre en tu identificación digital comunitaria.
        </p>

        {/* Toggles estilo iOS */}
        <div className="divide-y divide-slate-100 text-xs">
          {options.map((item) => {
            const isChecked = visibilities[item.key as keyof typeof visibilities];
            return (
              <div
                key={item.key}
                onClick={() => toggleField(item.key as keyof typeof visibilities)}
                className={`py-2.5 flex items-center justify-between gap-3 ${
                  isEditing ? 'cursor-pointer hover:bg-slate-50/60 -mx-2 px-2 rounded-xl transition' : ''
                }`}
              >
                <div>
                  <span className="font-bold text-slate-800 block">{item.label}</span>
                  <span className="text-[10px] text-slate-400">{item.desc}</span>
                </div>

                <div
                  className={`w-9 h-5 rounded-full transition-colors p-0.5 flex items-center ${
                    isChecked ? 'bg-[#1c5752] justify-end' : 'bg-slate-200 justify-start'
                  } ${!isEditing ? 'opacity-80' : ''}`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PrivacidadPerfilCard;