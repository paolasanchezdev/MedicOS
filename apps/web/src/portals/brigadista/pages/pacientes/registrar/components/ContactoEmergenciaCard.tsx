// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/pacientes/registrar/components/ContactoEmergenciaCard.tsx
// DESCRIPCIÓN: Captura de contacto de emergencia con catálogo dinámico de parentescos,
//              campo personalizado para "Otro" y formateo automático de teléfono salvadoreño.
// =========================================================================

import React, { useState, useEffect } from 'react';
import { Users, Phone, User, Edit3 } from 'lucide-react';
import type { PatientFormState } from '../../../../../../modules/patients';

interface ContactoEmergenciaCardProps {
  formData: PatientFormState;
  setField: <K extends keyof PatientFormState>(field: K, value: PatientFormState[K]) => void;
}

const PARENTESCOS_PREDEFINIDOS = [
  'Madre',
  'Padre',
  'Hijo/a',
  'Cónyuge / Pareja',
  'Hermano/a',
  'Abuelo/a',
  'Tío/a',
  'Tutor/a Legal',
  'Amigo/a',
  'Vecino/a',
  'Otro',
];

function formatearTelefonoSV(valor: string): string {
  const soloNumeros = valor.replace(/\D/g, '').slice(0, 8);
  if (soloNumeros.length <= 4) {
    return soloNumeros;
  }
  return `${soloNumeros.slice(0, 4)}-${soloNumeros.slice(4)}`;
}

export const ContactoEmergenciaCard: React.FC<ContactoEmergenciaCardProps> = ({
  formData,
  setField,
}) => {
  // Determina si el parentesco actual pertenece a la lista o es personalizado ("Otro")
  const [selectedOption, setSelectedOption] = useState<string>(() => {
    if (!formData.emergencyRelation) return 'Madre';
    if (PARENTESCOS_PREDEFINIDOS.includes(formData.emergencyRelation)) {
      return formData.emergencyRelation;
    }
    return 'Otro';
  });

  const [customRelation, setCustomRelation] = useState<string>(() => {
    if (
      formData.emergencyRelation &&
      !PARENTESCOS_PREDEFINIDOS.filter((p) => p !== 'Otro').includes(formData.emergencyRelation)
    ) {
      return formData.emergencyRelation;
    }
    return '';
  });

  // Sincroniza el valor por defecto si el formulario está vacío
  useEffect(() => {
    if (!formData.emergencyRelation && selectedOption !== 'Otro') {
      setField('emergencyRelation', selectedOption);
    }
  }, [formData.emergencyRelation, selectedOption, setField]);

  const handleSelectRelation = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedOption(value);

    if (value === 'Otro') {
      setField('emergencyRelation', customRelation.trim() || 'Otro');
    } else {
      setField('emergencyRelation', value);
    }
  };

  const handleCustomRelationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomRelation(value);
    setField('emergencyRelation', value);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formateado = formatearTelefonoSV(e.target.value);
    setField('emergencyPhone', formateado);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-5">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
        <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#2B7A78]">
          <Users className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            5. Contacto de Emergencia
          </h2>
          <p className="text-xs text-slate-500">
            Persona de referencia para contactar en situaciones críticas o urgencias médicas.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 1. Nombre Completo */}
        <div>
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-[#2B7A78]" />
            <span>Nombre Completo</span>
          </label>
          <input
            type="text"
            value={formData.emergencyName}
            onChange={(e) => setField('emergencyName', e.target.value)}
            placeholder="Ej. Juan Gómez Henríquez"
            className="w-full bg-slate-50/70 focus:bg-white border border-slate-200/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#2B7A78]/20 focus:border-[#2B7A78] transition-all"
          />
        </div>

        {/* 2. Parentesco (Selector dinámico) */}
        <div>
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-[#2B7A78]" />
            <span>Parentesco</span>
          </label>
          <select
            value={selectedOption}
            onChange={handleSelectRelation}
            className="w-full bg-slate-50/70 focus:bg-white border border-slate-200/80 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#2B7A78]/20 focus:border-[#2B7A78] transition-all cursor-pointer"
          >
            {PARENTESCOS_PREDEFINIDOS.map((parentesco) => (
              <option key={parentesco} value={parentesco}>
                {parentesco}
              </option>
            ))}
          </select>
        </div>

        {/* 3. Teléfono de Emergencia con máscara salvadoreña XXXX-XXXX */}
        <div>
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Phone className="w-3.5 h-3.5 text-[#2B7A78]" />
            <span>Teléfono de Emergencia</span>
          </label>
          <div className="relative">
            <input
              type="tel"
              inputMode="numeric"
              value={formData.emergencyPhone}
              onChange={handlePhoneChange}
              placeholder="7123-4567"
              maxLength={9}
              className="w-full bg-slate-50/70 focus:bg-white border border-slate-200/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-mono text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#2B7A78]/20 focus:border-[#2B7A78] transition-all"
            />
          </div>
        </div>

        {/* 4. Campo Condicional: Si selecciona "Otro", especificar parentesco */}
        {selectedOption === 'Otro' && (
          <div className="sm:col-span-2 lg:col-span-3 animate-in fade-in duration-200">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Edit3 className="w-3.5 h-3.5 text-[#2B7A78]" />
              <span>Especificar Parentesco o Relación</span>
            </label>
            <input
              type="text"
              value={customRelation}
              onChange={handleCustomRelationChange}
              placeholder="Ej. Padrastro, Cuñado/a, Cuidador/a principal, etc."
              className="w-full bg-slate-50/70 focus:bg-white border border-teal-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#2B7A78]/20 focus:border-[#2B7A78] transition-all"
              autoFocus
            />
          </div>
        )}
      </div>
    </div>
  );
};