// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/perfil/datos-personales/components/PersonalizacionPerfilCard.tsx
// DESCRIPCIÓN: Card de visibilidad de perfil con lista interactiva tipo
//              iOS Settings (Inset Grouped) e interruptores nativos simulados.
// =========================================================================

import React, { useState } from 'react';
import { SlidersHorizontal, Phone, Mail, MapPin, Calendar, Building2, Pencil, X, Check } from 'lucide-react';
import type {
  PatientPersonalDataProfile,
  UpdateProfileCustomizationDto,
} from '../../../../../../modules/patients/types/patient-personal-data.types.js';

interface PersonalizacionPerfilCardProps {
  profile: PatientPersonalDataProfile;
  isEditing: boolean;
  saving: boolean;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSave: (dto: UpdateProfileCustomizationDto) => Promise<boolean>;
}

export const PersonalizacionPerfilCard: React.FC<PersonalizacionPerfilCardProps> = ({
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

  const items = [
    { key: 'showPhone', label: 'Teléfono', icon: Phone, color: 'text-emerald-600 bg-emerald-100/50' },
    { key: 'showEmail', label: 'Correo electrónico', icon: Mail, color: 'text-teal-600 bg-teal-100/50' },
    { key: 'showAddress', label: 'Dirección', icon: MapPin, color: 'text-amber-600 bg-amber-100/50' },
    { key: 'showDateOfBirth', label: 'Fecha de nacimiento', icon: Calendar, color: 'text-sky-600 bg-sky-100/50' },
    { key: 'showMunicipality', label: 'Municipio', icon: Building2, color: 'text-indigo-600 bg-indigo-100/50' },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/70 shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-6 select-none flex flex-col h-full">
      {/* Cabecera */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-50 text-slate-700 flex items-center justify-center border border-slate-200/60">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              Personalización del perfil
            </h3>
            <p className="text-[11.5px] text-slate-500 font-medium">
              Datos visibles en tu credencial digital.
            </p>
          </div>
        </div>

        {!isEditing ? (
          <button
            type="button"
            onClick={onStartEdit}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-slate-50 hover:bg-teal-50 text-slate-700 hover:text-[#1c5752] border border-slate-200/80 text-xs font-bold transition cursor-pointer active:scale-95"
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>Editar</span>
          </button>
        ) : (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={saving}
              onClick={onCancelEdit}
              className="px-3 py-2 rounded-2xl bg-slate-100 text-slate-600 text-xs font-bold cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={handleSave}
              className="px-4 py-2 rounded-2xl bg-[#1c5752] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Guardar</span>
            </button>
          </div>
        )}
      </div>

      {/* Lista Estilo iOS (Inset Grouped) */}
      <div className="bg-slate-50/50 rounded-2xl border border-slate-100 overflow-hidden divide-y divide-slate-100/80">
        {items.map((item) => {
          const isChecked = visibilities[item.key as keyof typeof visibilities];
          const Icon = item.icon;
          
          return (
            <div
              key={item.key}
              onClick={() => toggleField(item.key as keyof typeof visibilities)}
              className={`flex items-center justify-between p-3.5 sm:px-5 transition-colors ${
                isEditing ? 'cursor-pointer hover:bg-slate-50' : 'cursor-default opacity-80'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[13px] font-bold text-slate-700">{item.label}</span>
              </div>

              {/* iOS Toggle Switch */}
              <div
                className={`w-11 h-6 rounded-full transition-colors flex items-center p-0.5 shrink-0 ${
                  isChecked ? 'bg-[#1c5752] justify-end' : 'bg-slate-300 justify-start'
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-white shadow-sm" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PersonalizacionPerfilCard;