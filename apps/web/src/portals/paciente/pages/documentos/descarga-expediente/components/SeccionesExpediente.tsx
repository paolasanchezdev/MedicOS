// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/documentos/descarga-expediente/components/SeccionesExpediente.tsx
// DESCRIPCIÓN: Índice organizado por áreas médicas con diseño limpio institucional.
// =========================================================================

import React from 'react';
import { FolderCheck, CheckSquare, Square, Layers } from 'lucide-react';
import type { SectionItemData } from './SeccionExpedienteCard.js';

interface SeccionesExpedienteProps {
  sections: SectionItemData[];
  onToggleSection: (id: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

export const SeccionesExpediente: React.FC<SeccionesExpedienteProps> = ({
  sections,
  onToggleSection,
  onSelectAll,
  onDeselectAll,
}) => {
  const selectedCount = sections.filter((s) => s.included).length;

  // Agrupación en 4 dominios clínicos intuitivos
  const groups = [
    {
      name: 'Filiación y Antecedentes Médicos',
      description: 'Datos de identidad, historia familiar, cirugías y alergias documentadas',
      ids: ['sec-id', 'sec-ant', 'sec-fam', 'sec-alg'],
    },
    {
      name: 'Atenciones y Encuentros Clínicos',
      description: 'Consultas médicas, controles prenatales, esquema de vacunación y brigadas',
      ids: ['sec-cons', 'sec-mat', 'sec-vac', 'sec-brig', 'sec-cita'],
    },
    {
      name: 'Diagnósticos y Tratamientos',
      description: 'Diagnósticos formales CIE-10 y prescripción de fármacos activos',
      ids: ['sec-diag', 'sec-med'],
    },
    {
      name: 'Estudios, Monitoreo y Autocuidado',
      description: 'Signos vitales, análisis de laboratorio, estudios de imagen, hábitos y constancias',
      ids: ['sec-vit', 'sec-lab', 'sec-img', 'sec-hab', 'sec-doc'],
    },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs select-none space-y-6">
      
      {/* Cabecera del bloque */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-200/70 flex items-center justify-center text-[#1c5752]">
            <FolderCheck className="w-5 h-5 text-[#1c5752]" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
              Información a Incluir en el Expediente ({selectedCount} de {sections.length} secciones)
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Selecciona qué partes del historial clínico deseas compilar en el documento oficial.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold shrink-0">
          <button
            type="button"
            onClick={onSelectAll}
            className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-teal-50 text-[#1c5752] border border-slate-200 hover:border-teal-300 transition cursor-pointer"
          >
            Seleccionar todas
          </button>
          <button
            type="button"
            onClick={onDeselectAll}
            className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition cursor-pointer"
          >
            Deseleccionar
          </button>
        </div>
      </div>

      {/* Secciones agrupadas por dominios clínicos */}
      <div className="space-y-6">
        {groups.map((group) => {
          const groupSections = sections.filter((s) => group.ids.includes(s.id));
          if (groupSections.length === 0) return null;

          return (
            <div key={group.name} className="space-y-3">
              <div className="flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-[#1c5752]" />
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                  {group.name}
                </h4>
                <span className="text-[11px] text-slate-400 font-normal hidden sm:inline">
                  — {group.description}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {groupSections.map((sec) => {
                  const hasData = sec.count > 0;
                  return (
                    <div
                      key={sec.id}
                      onClick={() => onToggleSection(sec.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 select-none ${
                        sec.included
                          ? 'bg-white border-teal-300/80 shadow-xs hover:border-[#1c5752]'
                          : 'bg-slate-50/60 border-slate-200 opacity-60 hover:opacity-85'
                      }`}
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                          sec.included ? 'bg-teal-50 text-[#1c5752] border border-teal-200/60' : 'bg-slate-100 text-slate-400'
                        }`}>
                          {sec.icon}
                        </div>
                        <div className="min-w-0">
                          <h5 className="text-xs font-bold text-slate-900 tracking-tight truncate">
                            {sec.title}
                          </h5>
                          <p className="text-[10.5px] text-slate-500 font-medium truncate mt-0.5">
                            {sec.description}
                          </p>
                          <div className="mt-2">
                            {hasData ? (
                              <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-md bg-teal-50 text-[#1c5752] border border-teal-200/70">
                                {sec.count} {sec.count === 1 ? 'registro' : 'registros'}
                              </span>
                            ) : (
                              <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-400 italic">
                                Sin registros
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 mt-0.5">
                        {sec.included ? (
                          <CheckSquare className="w-5 h-5 text-[#1c5752]" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-300" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default SeccionesExpediente;