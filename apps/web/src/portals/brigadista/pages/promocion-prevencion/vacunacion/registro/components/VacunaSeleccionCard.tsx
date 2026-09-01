// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/promocion-prevencion/vacunacion/registro/components/VacunaSeleccionCard.tsx
// DESCRIPCIÓN: Selector de biológico con soporte oficial MINSAL 2026,
//              altura simétrica (min-h-151.25) y cuadrícula interna calibrada a 345px
//              para evitar cortes en las tarjetas y eliminar espacios vacíos.
// =========================================================================

import React, { useState, useMemo } from 'react';
import {
  Syringe,
  Search,
  CheckCircle2,
  ShieldAlert,
  Plus,
  X,
  Layers,
} from 'lucide-react';
import type {
  VaccineCatalogItem,
  AdministrationRoute,
  AnatomicalSite,
} from '../../../../../../../modules/vaccinations';

export interface VacunaSeleccionCardProps {
  catalog: VaccineCatalogItem[];
  selectedVaccine: VaccineCatalogItem | null;
  doseNumber: number;
  onSelectVaccine: (vaccine: VaccineCatalogItem) => void;
  onDoseChange: (dose: number) => void;
}

const PEDIATRIC_CODES = [
  'HB_RN',
  'BCG',
  'HEXAVALENTE',
  'ROTAVIRUS',
  'NEUMOCOCO_20V_PED',
  'SPR',
  'HEPATITIS_A',
  'VARICELA',
  'DPAT_IPV',
  'VPH_FEM',
  'VPH_MASC',
];

const MATERNAL_CODES = ['VSR_MATERNAL', 'TDPA', 'INFLUENZA_MAT'];

const ADULT_CODES = [
  'TD_ADULTO',
  'VPH_ADULT',
  'NEUMOCOCO_20V_ADULT',
  'INFLUENZA',
  'HB_ADULTO',
  'FIEBRE_AMARILLA',
  'ANTIRRABICA_HUMANA',
  'SR',
];

export const VacunaSeleccionCard: React.FC<VacunaSeleccionCardProps> = ({
  catalog,
  selectedVaccine,
  doseNumber,
  onSelectVaccine,
  onDoseChange,
}) => {
  const [filterSearch, setFilterSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'PEDIATRIC' | 'ADULT' | 'MATERNAL'>('ALL');
  const [customVaccines, setCustomVaccines] = useState<VaccineCatalogItem[]>([]);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  // Formulario para nueva vacuna fuera de catálogo
  const [customName, setCustomName] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [customDisease, setCustomDisease] = useState('');
  const [customTotalDoses, setCustomTotalDoses] = useState<number>(1);
  const [customRoute, setCustomRoute] = useState<AdministrationRoute>('INTRAMUSCULAR');
  const [customSite, setCustomSite] = useState<AnatomicalSite>('DELTOIDES_IZQUIERDO');
  const [customDesc, setCustomDesc] = useState('');

  // Unificación del catálogo oficial con las creadas en sesión
  const fullCatalog = useMemo(() => {
    return [...customVaccines, ...catalog];
  }, [customVaccines, catalog]);

  const filteredCatalog = useMemo(() => {
    let list = fullCatalog;

    if (categoryFilter === 'PEDIATRIC') {
      list = list.filter(
        (v) =>
          PEDIATRIC_CODES.includes(v.code) ||
          (v.minAgeMonths < 120 && !MATERNAL_CODES.includes(v.code))
      );
    } else if (categoryFilter === 'MATERNAL') {
      list = list.filter(
        (v) =>
          MATERNAL_CODES.includes(v.code) ||
          v.targetDisease.toLowerCase().includes('gestación') ||
          v.targetDisease.toLowerCase().includes('embarazo')
      );
    } else if (categoryFilter === 'ADULT') {
      list = list.filter(
        (v) =>
          ADULT_CODES.includes(v.code) ||
          (v.minAgeMonths >= 120 && !MATERNAL_CODES.includes(v.code))
      );
    }

    if (!filterSearch.trim()) return list;

    const q = filterSearch.toLowerCase();
    return list.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        v.code.toLowerCase().includes(q) ||
        v.targetDisease.toLowerCase().includes(q)
    );
  }, [fullCatalog, filterSearch, categoryFilter]);

  const handleCreateCustomVaccine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim() || !customCode.trim()) return;

    const newVac: VaccineCatalogItem = {
      id: `custom-vac-${Date.now()}`,
      code: customCode.trim().toUpperCase(),
      name: customName.trim(),
      targetDisease: customDisease.trim() || 'Inmunización Especial',
      minAgeMonths: 0,
      doseNumber: 1,
      totalDoses: customTotalDoses || 1,
      route: customRoute,
      anatomicalSiteDefault: customSite,
      isRequired: false,
      description: customDesc.trim() || 'Biológico registrado fuera de catálogo estándar.',
      isCustom: true,
    };

    setCustomVaccines((prev) => [newVac, ...prev]);
    onSelectVaccine(newVac);
    setIsCustomModalOpen(false);

    // Limpiar modal
    setCustomName('');
    setCustomCode('');
    setCustomDisease('');
    setCustomTotalDoses(1);
    setCustomDesc('');
  };

  return (
    <div className="group min-h-151.25 h-full bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/70 p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:border-slate-300 transition-all duration-200 flex flex-col justify-between space-y-3.5">
      <div className="space-y-3.5">
        {/* 1. Cabecera y botón de acción */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-700 shadow-2xs">
              <Syringe className="w-5 h-5 stroke-2" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                1. Selección del Biológico a Aplicar
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                Esquema Oficial MINSAL 2026 &bull; {filteredCatalog.length} disponibles
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsCustomModalOpen(true)}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-teal-800 bg-teal-50 hover:bg-teal-100/80 border border-teal-200/80 transition active:scale-95 cursor-pointer shrink-0 shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5 text-teal-700" />
            <span>Otra Vacuna</span>
          </button>
        </div>

        {/* 2. Barra Unificada: Buscador + Filtros de Categoría */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-0.5">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={filterSearch}
              onChange={(e) => setFilterSearch(e.target.value)}
              placeholder="Buscar por nombre, sigla o enfermedad..."
              className="w-full pl-10 pr-3.5 py-2 bg-slate-50/70 border border-slate-200/80 rounded-xl text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition shadow-2xs"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto pb-0.5 sm:pb-0 shrink-0">
            <button
              type="button"
              onClick={() => setCategoryFilter('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                categoryFilter === 'ALL'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Todas
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter('PEDIATRIC')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                categoryFilter === 'PEDIATRIC'
                  ? 'bg-[#2B7A78] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Pediátricas
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter('ADULT')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                categoryFilter === 'ADULT'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Adultos
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter('MATERNAL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                categoryFilter === 'MATERNAL'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Materno
            </button>
          </div>
        </div>

        {/* 3. Cuadrícula de Vacunas Calibrada a 345px para encajar 2 filas completas sin corte */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 h-86.25 max-h-86.25 overflow-y-auto pr-1.5">
          {filteredCatalog.map((v) => {
            const isSelected = selectedVaccine?.id === v.id;

            return (
              <div
                key={v.id}
                onClick={() => onSelectVaccine(v)}
                className={`p-3.5 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between cursor-pointer relative ${
                  isSelected
                    ? 'bg-teal-50/90 border-[#2B7A78] shadow-sm ring-2 ring-[#2B7A78]/20'
                    : 'bg-white hover:bg-slate-50/80 border-slate-200/80 hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-black tracking-wider text-teal-900 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-md shadow-2xs">
                        {v.code}
                      </span>
                      {v.isCustom ? (
                        <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                          Personalizada
                        </span>
                      ) : v.isRequired ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                          Obligatoria
                        </span>
                      ) : null}
                    </div>

                    {isSelected ? (
                      <div className="w-5 h-5 rounded-full bg-[#2B7A78] text-white flex items-center justify-center shrink-0 shadow-2xs">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200/70 shrink-0">
                        {v.totalDoses} {v.totalDoses === 1 ? 'dosis' : 'dosis'}
                      </span>
                    )}
                  </div>

                  <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 mt-1.5 line-clamp-1">
                    {v.name}
                  </h4>

                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">
                    {v.description}
                  </p>
                </div>

                {/* Selector de Dosis si está seleccionada */}
                {isSelected ? (
                  <div
                    className="mt-2.5 pt-2 border-t border-teal-200/80 space-y-1.5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between text-[10px] font-bold text-teal-900">
                      <span className="flex items-center gap-1">
                        <Layers className="w-3 h-3 text-teal-700" />
                        Dosis a Registrar:
                      </span>
                      <span className="text-teal-700 font-semibold">{v.route}</span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {Array.from({ length: v.totalDoses || 1 }, (_, i) => i + 1).map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => onDoseChange(num)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer active:scale-95 ${
                            doseNumber === num
                              ? 'bg-[#2B7A78] text-white shadow-xs ring-1 ring-teal-700'
                              : 'bg-white border border-teal-200 text-teal-900 hover:bg-teal-100/70 shadow-2xs'
                          }`}
                        >
                          Dosis {num}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="mt-2.5 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] font-medium text-slate-500">
                    <span className="flex items-center gap-1 truncate">
                      <ShieldAlert className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{v.targetDisease}</span>
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer alineado simétricamente en la base */}
      <div className="pt-3 border-t border-slate-100 text-xs text-slate-400 flex items-center justify-between">
        <span>Biológico: {selectedVaccine ? selectedVaccine.name : 'Pendiente de selección'}</span>
        <span className="font-bold text-[#2B7A78]">
          {selectedVaccine ? `Dosis ${doseNumber} seleccionada` : 'Paso 1 de 4'}
        </span>
      </div>

      {/* Modal: Registrar Biológico No Catalogado */}
      {isCustomModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-700">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Registrar Biológico Fuera de Catálogo
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Para campañas especiales, viajeros o vacunas no listadas
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCustomModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomVaccine} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-1">
                  <label className="font-bold text-slate-700 block">Nombre del Biológico *</label>
                  <input
                    type="text"
                    required
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="Ej. Cólera, Ébola, etc."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 focus:outline-none font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Acrónimo/Código *</label>
                  <input
                    type="text"
                    required
                    value={customCode}
                    onChange={(e) => setCustomCode(e.target.value.toUpperCase())}
                    placeholder="Ej. COL-1"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 focus:outline-none font-mono uppercase font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Enfermedad que Previene</label>
                  <input
                    type="text"
                    value={customDisease}
                    onChange={(e) => setCustomDisease(e.target.value)}
                    placeholder="Ej. Infección por Vibrio cholerae"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 focus:outline-none font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Total de Dosis en Esquema</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={customTotalDoses}
                    onChange={(e) => setCustomTotalDoses(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 focus:outline-none font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Vía Predeterminada</label>
                  <select
                    value={customRoute}
                    onChange={(e) => setCustomRoute(e.target.value as AdministrationRoute)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none"
                  >
                    <option value="INTRAMUSCULAR">Intramuscular (IM)</option>
                    <option value="SUBCUTANEOUS">Subcutánea (SC)</option>
                    <option value="INTRADERMAL">Intradérmica (ID)</option>
                    <option value="ORAL">Oral</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Sitio Predeterminado</label>
                  <select
                    value={customSite}
                    onChange={(e) => setCustomSite(e.target.value as AnatomicalSite)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none"
                  >
                    <option value="DELTOIDES_IZQUIERDO">Brazo Izquierdo (Deltoides)</option>
                    <option value="DELTOIDES_DERECHO">Brazo Derecho (Deltoides)</option>
                    <option value="VASTO_LATERAL_IZQUIERDO">Muslo Izquierdo</option>
                    <option value="VASTO_LATERAL_DERECHO">Muslo Derecho</option>
                    <option value="ORAL">Oral</option>
                    <option value="OTRO">Otro</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Descripción / Indicación</label>
                <textarea
                  rows={2}
                  value={customDesc}
                  onChange={(e) => setCustomDesc(e.target.value)}
                  placeholder="Motivo de aplicación o campaña territorial..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCustomModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2B7A78] hover:bg-[#236866] text-white font-extrabold rounded-xl shadow-xs transition active:scale-95 cursor-pointer"
                >
                  Agregar y Seleccionar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VacunaSeleccionCard;