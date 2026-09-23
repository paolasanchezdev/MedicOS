// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/perfil/datos-personales/components/InformacionContactoCard.tsx
// DESCRIPCIÓN: Card de información de contacto con pastillas diferenciadas,
//              iconos de canal y selectores en línea de territorio salvadoreño.
// =========================================================================

import React, { useState, useMemo } from 'react';
import { Pencil, X, Check, Mail, Phone, MapPin, Building2, Map, Lock, Contact2 } from 'lucide-react';
import { TERRITORIO_EL_SALVADOR } from '../../../../../../shared/data/elSalvadorTerritory.js';
import type {
  PatientPersonalDataProfile,
  UpdatePersonalContactDto,
} from '../../../../../../modules/patients/types/patient-personal-data.types.js';

interface InformacionContactoCardProps {
  profile: PatientPersonalDataProfile;
  isEditing: boolean;
  saving: boolean;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSave: (dto: UpdatePersonalContactDto) => Promise<boolean>;
}

export const InformacionContactoCard: React.FC<InformacionContactoCardProps> = ({
  profile,
  isEditing,
  saving,
  onStartEdit,
  onCancelEdit,
  onSave,
}) => {
  const [formData, setFormData] = useState<UpdatePersonalContactDto>({
    phone: profile.phone,
    department: profile.department || 'La Paz',
    municipality: profile.municipality || 'San Miguel Tepezontes',
    district: profile.district || 'San Miguel Tepezontes',
    address: profile.address,
  });

  const departamentosList = useMemo(() => TERRITORIO_EL_SALVADOR.map((d) => d.nombre), []);

  const municipiosList = useMemo(() => {
    const dep = TERRITORIO_EL_SALVADOR.find((d) => d.nombre === formData.department);
    return dep ? dep.municipios.map((m) => m.nombre) : [];
  }, [formData.department]);

  const handleDepartmentChange = (depName: string) => {
    const dep = TERRITORIO_EL_SALVADOR.find((d) => d.nombre === depName);
    const firstMun = dep?.municipios[0]?.nombre || '';
    const firstDist = dep?.municipios[0]?.distritos[0] || '';

    setFormData({
      ...formData,
      department: depName,
      municipality: firstMun,
      district: firstDist,
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_2px_14px_rgba(0,0,0,0.03)] p-5 sm:p-6 select-none flex flex-col justify-between h-full">
      <div>
        {/* Cabecera con Pastilla de Icono */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-700 border border-sky-200/70 flex items-center justify-center">
              <Contact2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 tracking-tight">
                Información de contacto
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">
                Canales de comunicación y ubicación de residencia.
              </p>
            </div>
          </div>

          {!isEditing ? (
            <button
              type="button"
              onClick={onStartEdit}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-teal-50 text-slate-600 hover:text-[#1c5752] border border-slate-200/80 text-xs font-bold transition cursor-pointer active:scale-95"
            >
              <Pencil className="w-3 h-3" />
              <span>Editar</span>
            </button>
          ) : (
            <span className="text-[11px] font-bold text-[#1c5752] bg-teal-50 px-2.5 py-0.5 rounded-lg border border-teal-200/80">
              Modo edición
            </span>
          )}
        </div>

        {/* MODO EDICIÓN EN LÍNEA */}
        {isEditing ? (
          <form onSubmit={handleFormSubmit} className="space-y-3 animate-in fade-in duration-150 text-xs">
            <div>
              <label className="text-[11px] font-bold text-slate-400 flex items-center justify-between mb-1">
                <span>Correo electrónico</span>
                <span className="flex items-center gap-1 text-[10px] text-slate-400 font-normal">
                  <Lock className="w-2.5 h-2.5" /> Cambiar en Seguridad
                </span>
              </label>
              <input
                type="email"
                disabled
                value={profile.email}
                className="w-full px-3 py-2 bg-slate-100 text-slate-400 border border-slate-200 rounded-xl cursor-not-allowed"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Teléfono</label>
              <input
                type="tel"
                required
                placeholder="+503 7000-0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1c5752]/20 focus:border-[#1c5752] focus:bg-white font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Dirección</label>
              <input
                type="text"
                required
                placeholder="Colonia, cantón, barrio, pasaje..."
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1c5752]/20 focus:border-[#1c5752] focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Departamento</label>
                <select
                  value={formData.department}
                  onChange={(e) => handleDepartmentChange(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1c5752]/20 focus:border-[#1c5752] focus:bg-white"
                >
                  {departamentosList.map((dep) => (
                    <option key={dep} value={dep}>
                      {dep}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Municipio</label>
                <select
                  value={formData.municipality}
                  onChange={(e) => setFormData({ ...formData, municipality: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1c5752]/20 focus:border-[#1c5752] focus:bg-white"
                >
                  {municipiosList.map((mun) => (
                    <option key={mun} value={mun}>
                      {mun}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                disabled={saving}
                onClick={onCancelEdit}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Cancelar</span>
              </button>

              <button
                type="submit"
                disabled={saving}
                className="px-4 py-1.5 rounded-xl bg-[#1c5752] hover:bg-[#164743] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{saving ? 'Guardando...' : 'Guardar'}</span>
              </button>
            </div>
          </form>
        ) : (
          /* MODO LECTURA: Filas en pastillas con contraste y separación */
          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-2xl bg-slate-50/75 border border-slate-150 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-slate-500">
                <div className="w-6 h-6 rounded-lg bg-teal-100/70 text-[#1c5752] flex items-center justify-center shrink-0">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <span className="font-semibold">Correo electrónico</span>
              </div>
              <span className="font-bold text-slate-900 text-right truncate max-w-50 sm:max-w-xs">{profile.email}</span>
            </div>

            <div className="p-2.5 rounded-2xl bg-slate-50/75 border border-slate-150 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-slate-500">
                <div className="w-6 h-6 rounded-lg bg-emerald-100/80 text-emerald-700 flex items-center justify-center shrink-0">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <span className="font-semibold">Teléfono</span>
              </div>
              <span className="font-mono font-bold text-slate-900 text-right">{profile.phone || 'No registrado'}</span>
            </div>

            <div className="p-2.5 rounded-2xl bg-slate-50/75 border border-slate-150 flex items-start justify-between gap-3">
              <div className="flex items-center gap-2 text-slate-500 shrink-0 mt-0.5">
                <div className="w-6 h-6 rounded-lg bg-amber-100/80 text-amber-700 flex items-center justify-center shrink-0">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <span className="font-semibold">Dirección</span>
              </div>
              <span className="font-bold text-slate-900 text-right leading-relaxed">{profile.address || 'No registrada'}</span>
            </div>

            <div className="p-2.5 rounded-2xl bg-slate-50/75 border border-slate-150 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-slate-500">
                <div className="w-6 h-6 rounded-lg bg-indigo-100/80 text-indigo-700 flex items-center justify-center shrink-0">
                  <Building2 className="w-3.5 h-3.5" />
                </div>
                <span className="font-semibold">Municipio</span>
              </div>
              <span className="font-bold text-slate-900 text-right">{profile.municipality}</span>
            </div>

            <div className="p-2.5 rounded-2xl bg-slate-50/75 border border-slate-150 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-slate-500">
                <div className="w-6 h-6 rounded-lg bg-sky-100/80 text-sky-700 flex items-center justify-center shrink-0">
                  <Map className="w-3.5 h-3.5" />
                </div>
                <span className="font-semibold">Departamento</span>
              </div>
              <span className="font-bold text-slate-900 text-right">{profile.department}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InformacionContactoCard;