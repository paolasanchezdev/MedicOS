// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/citas/agendar/components/DoctorSelector.tsx
// DESCRIPCIÓN: Selector de médicos en cuadrícula 2x2. Tarjetas ejecutivas
//              optimizadas para visualización completa en PC sin scroll.
// =========================================================================

import React, { useState, useMemo } from 'react';
import {
  Stethoscope,
  User,
  Loader2,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Award,
  Search,
  X,
  Sparkles,
  Info,
} from 'lucide-react';
import type { DoctorSummary } from '../../../../../../modules/appointments/types/appointment.types';

export type DoctorItem = DoctorSummary;

interface DoctorSelectorProps {
  doctores: DoctorSummary[];
  selectedDoctorId: string;
  onSelectDoctor: (id: string) => void;
  isLoading: boolean;
  suggestedArea?: string;
}

const BASE_SPECIALTIES = ['Todas', 'Medicina General', 'Pediatría', 'Medicina Interna', 'Ginecología'];
const ITEMS_PER_PAGE = 4;

export const DoctorSelector: React.FC<DoctorSelectorProps> = ({
  doctores,
  selectedDoctorId,
  onSelectDoctor,
  isLoading,
  suggestedArea = 'Medicina General',
}) => {
  const [manualSpecialty, setManualSpecialty] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Especialidad activa derivada reactivamente sin efectos colaterales
  const activeSpecialty = useMemo(() => {
    if (manualSpecialty !== null) return manualSpecialty;
    if (suggestedArea && suggestedArea !== 'Medicina General') {
      const hasMatchingDoc = doctores.some(
        (d) => d.specialty?.toLowerCase() === suggestedArea.toLowerCase()
      );
      if (hasMatchingDoc) return suggestedArea;
    }
    return 'Todas';
  }, [manualSpecialty, suggestedArea, doctores]);

  const specialtiesList = useMemo(() => {
    const extraSpecs = doctores
      .map((d) => d.specialty?.trim())
      .filter((s): s is string => Boolean(s && !BASE_SPECIALTIES.includes(s)));
    return [...BASE_SPECIALTIES, ...Array.from(new Set(extraSpecs))];
  }, [doctores]);

  const filteredDoctors = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return doctores.filter((d) => {
      const docSpec = (d.specialty?.trim() || 'Medicina General').toLowerCase();
      const matchesSpecialty =
        activeSpecialty === 'Todas' || docSpec === activeSpecialty.toLowerCase();
      const fullName = `${d.firstName} ${d.lastName}`.toLowerCase();
      const matchesSearch =
        !query || fullName.includes(query) || docSpec.includes(query);

      return matchesSpecialty && matchesSearch;
    });
  }, [doctores, activeSpecialty, searchQuery]);

  const totalPages = Math.ceil(filteredDoctors.length / ITEMS_PER_PAGE) || 1;
  const currentDoctors = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredDoctors.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredDoctors, currentPage]);

  const handleSearchChange = (val: string): void => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleSpecialtyChange = (spec: string): void => {
    setManualSpecialty(spec);
    setCurrentPage(1);
  };

  const existsSpecialistInArea = useMemo(() => {
    return doctores.some(
      (d) => (d.specialty?.trim() || 'Medicina General').toLowerCase() === suggestedArea.toLowerCase()
    );
  }, [doctores, suggestedArea]);

  return (
    <div className="flex flex-col justify-between h-full space-y-3">
      <div className="space-y-2.5">
        {/* Cabecera del Paso */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-2">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Stethoscope className="w-4 h-4 text-[#2B7A78]" />
              Profesional de Salud <span className="text-rose-500">*</span>
            </label>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Selecciona al médico responsable de tu atención.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200/80 self-start sm:self-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {filteredDoctors.length} disponible(s)
          </span>
        </div>

        {/* Mensaje de orientación si no hay especialista en el área */}
        {suggestedArea !== 'Medicina General' && !existsSpecialistInArea && (
          <div className="p-2 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-xs text-amber-900 font-medium">
            <Info className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="text-[11px]">
              No hay turnos directos para <b>{suggestedArea}</b>. Los médicos de <b>Medicina General</b> realizarán tu evaluación.
            </span>
          </div>
        )}

        {/* Buscador Rápido */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Buscar médico por nombre o especialidad..."
            className="w-full pl-8.5 pr-8 py-1.5 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 focus:border-[#2B7A78] rounded-xl text-xs text-slate-800 placeholder-slate-400 outline-none transition-all duration-150"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => handleSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filtros por Especialidad */}
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none">
          {specialtiesList.map((spec) => {
            const isActive = activeSpecialty === spec;
            return (
              <button
                key={spec}
                type="button"
                onClick={() => handleSpecialtyChange(spec)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-[#2B7A78] text-white shadow-2xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/70'
                }`}
              >
                {spec}
              </button>
            );
          })}
        </div>

        {/* Listado de Médicos */}
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 text-xs text-slate-500 py-12 bg-white rounded-2xl border border-slate-200/80">
            <Loader2 className="w-4 h-4 animate-spin text-[#2B7A78]" />
            <span>Consultando catálogo de médicos...</span>
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="text-center py-8 px-4 bg-white rounded-2xl border border-dashed border-slate-200 text-xs text-slate-500 space-y-1.5">
            <p className="font-semibold text-slate-700">No hay profesionales con este filtro</p>
            <p className="text-slate-400 text-[11px] max-w-xs mx-auto">
              Prueba seleccionando otra especialidad o borrando la búsqueda.
            </p>
            <button
              type="button"
              onClick={() => {
                handleSearchChange('');
                handleSpecialtyChange('Todas');
              }}
              className="text-xs font-bold text-[#2B7A78] hover:underline cursor-pointer pt-1"
            >
              Ver todos los médicos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {currentDoctors.map((doc) => {
              const isSelected = selectedDoctorId === doc.id;
              const specialtyLabel = doc.specialty?.trim() || 'Medicina General';
              const isRecommended =
                specialtyLabel.toLowerCase() === suggestedArea.toLowerCase();

              return (
                <div
                  key={doc.id}
                  onClick={() => onSelectDoctor(doc.id)}
                  className={`group bg-white rounded-2xl border p-3.5 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer select-none ${
                    isSelected
                      ? 'border-[#2B7A78] ring-2 ring-[#2B7A78]/15 shadow-xs bg-teal-50/20'
                      : 'border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-2">
                    {/* Cabecera con Avatar, Nombre y Badge */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-2xs transition-colors ${
                            isSelected
                              ? 'bg-[#2B7A78] text-white'
                              : 'bg-teal-50 border border-teal-100 text-[#2B7A78]'
                          }`}
                        >
                          <User className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight leading-snug truncate">
                            Dr. {doc.firstName} {doc.lastName}
                          </h3>
                          <p className="text-[11px] font-medium text-slate-400 truncate">
                            {doc.email}
                          </p>
                        </div>
                      </div>

                      {isRecommended ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-300/80 shrink-0 shadow-2xs">
                          <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" />
                          Orientación
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Disponible
                        </span>
                      )}
                    </div>

                    {/* Etiquetas en una sola línea horizontal */}
                    <div className="flex items-center gap-1.5 pt-0.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200/70 text-slate-700 font-semibold text-[10.5px]">
                        <Award className="w-3 h-3 text-[#2B7A78]" />
                        {specialtyLabel}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200/70 text-slate-600 font-medium text-[10.5px]">
                        Presencial
                      </span>
                    </div>
                  </div>

                  {/* Pie de Acción */}
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold">
                    <span className={isSelected ? 'text-[#2B7A78] font-bold' : 'text-slate-500 group-hover:text-slate-800'}>
                      {isSelected ? 'Profesional seleccionado' : 'Seleccionar este médico'}
                    </span>
                    {isSelected ? (
                      <CheckCircle2 className="w-4 h-4 text-[#2B7A78]" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 transition-transform group-hover:translate-x-0.5" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Paginación sólo si hay más de 4 médicos */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2 px-1 text-xs text-slate-500 border-t border-slate-100">
          <span className="text-[11px] font-medium">
            Página {currentPage} de {totalPages} ({filteredDoctors.length} médicos)
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorSelector;