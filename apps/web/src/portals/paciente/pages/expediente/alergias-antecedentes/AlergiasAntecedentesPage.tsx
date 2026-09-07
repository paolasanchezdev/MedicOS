// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/expediente/alergias-antecedentes/AlergiasAntecedentesPage.tsx
// DESCRIPCIÓN: Página principal con 4 tarjetas compactas simétricas arriba
//              y lista cronológica detallada abajo.
// =========================================================================

import React, { useState, useMemo } from 'react';
import {
  usePatientClinicalHistory,
  type AllergyItem,
  type AnyAntecedente,
  DetalleAlergiaModal,
  DetalleAntecedenteModal,
} from '../../../../../modules/clinical-history/index.js';
import {
  AlergiasAntecedentesHeader,
  ResumenAlergias,
  AntecedentesSection,
  AlergiasAntecedentesError,
} from './components/index.js';
import {
  Search,
  X,
  ShieldAlert,
  Activity,
  Users,
  Scissors,
  ChevronRight,
  Info,
  Check,
  RotateCcw,
} from 'lucide-react';

type FilterCategory = 'ALL' | 'ALLERGIES' | 'MEDICAL' | 'FAMILY' | 'SURGICAL';

interface ClinicalEventItem {
  id: string;
  category: 'ALLERGY' | 'MEDICAL' | 'FAMILY' | 'SURGICAL';
  date: string;
  title: string;
  subtitle: string;
  tag: string;
  tagClass: string;
  statusLabel: string;
  statusClass: string;
  rawAllergy?: AllergyItem;
  rawAntecedente?: AnyAntecedente;
}

export const AlergiasAntecedentesPage: React.FC = () => {
  const { data, loading, error, refetch } = usePatientClinicalHistory();

  const [selectedAllergy, setSelectedAllergy] = useState<AllergyItem | null>(null);
  const [selectedAntecedente, setSelectedAntecedente] = useState<AnyAntecedente | null>(null);
  const [showRevisionToast, setShowRevisionToast] = useState<boolean>(false);

  // Filtros y buscador
  const [search, setSearch] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<FilterCategory>('ALL');

  const handleSolicitarRevision = () => {
    setShowRevisionToast(true);
    setTimeout(() => setShowRevisionToast(false), 5000);
  };

  // 1. Unificar todos los ítems clínicos en una sola lista tipada
  const allEvents: ClinicalEventItem[] = useMemo(() => {
    if (!data) return [];

    const items: ClinicalEventItem[] = [];

    // Alergias
    data.allergies.forEach((a) => {
      items.push({
        id: a.id,
        category: 'ALLERGY',
        date: a.recordedAt,
        title: a.substance,
        subtitle: `Reacción: ${a.reaction}`,
        tag: a.type === 'MEDICINE' ? 'Medicamento' : a.type === 'FOOD' ? 'Alimento' : 'Ambiental',
        tagClass: 'bg-rose-50 text-rose-700 border-rose-200/80',
        statusLabel: 'Activa',
        statusClass: 'bg-rose-50 text-rose-700 border-rose-200/80',
        rawAllergy: a,
      });
    });

    // Patologías Personales
    data.medicalHistory.forEach((m) => {
      items.push({
        id: m.id,
        category: 'MEDICAL',
        date: m.recordedAt,
        title: m.name,
        subtitle: m.description,
        tag: m.category === 'CHRONIC' ? 'Crónico' : 'Patológico',
        tagClass: 'bg-teal-50 text-[#2B7A78] border-teal-200/80',
        statusLabel: 'Activo',
        statusClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
        rawAntecedente: { kind: 'MEDICAL', data: m },
      });
    });

    // Familiares
    data.familyHistory.forEach((f) => {
      items.push({
        id: f.id,
        category: 'FAMILY',
        date: f.recordedAt,
        title: f.condition,
        subtitle: `Familiar: ${f.relative}`,
        tag: `Familiar: ${f.relative}`,
        tagClass: 'bg-purple-50 text-purple-700 border-purple-200/80 font-bold',
        statusLabel: 'Hereditario',
        statusClass: 'bg-purple-50 text-purple-700 border-purple-200/80',
        rawAntecedente: { kind: 'FAMILY', data: f },
      });
    });

    // Quirúrgicos
    data.surgicalHistory.forEach((s) => {
      items.push({
        id: s.id,
        category: 'SURGICAL',
        date: s.recordedAt,
        title: s.procedure,
        subtitle: s.notes || 'Procedimiento quirúrgico documentado',
        tag: s.yearOrDate || 'Cirugía',
        tagClass: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
        statusLabel: 'Antecedente',
        statusClass: 'bg-slate-100 text-slate-700 border-slate-200/80',
        rawAntecedente: { kind: 'SURGICAL', data: s },
      });
    });

    return items;
  }, [data]);

  // 2. Filtrado reactivo en memoria
  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return allEvents.filter((item) => {
      if (categoryFilter === 'ALLERGIES' && item.category !== 'ALLERGY') return false;
      if (categoryFilter === 'MEDICAL' && item.category !== 'MEDICAL') return false;
      if (categoryFilter === 'FAMILY' && item.category !== 'FAMILY') return false;
      if (categoryFilter === 'SURGICAL' && item.category !== 'SURGICAL') return false;

      if (query) {
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesSub = item.subtitle.toLowerCase().includes(query);
        const matchesTag = item.tag.toLowerCase().includes(query);
        if (!matchesTitle && !matchesSub && !matchesTag) return false;
      }

      return true;
    });
  }, [allEvents, search, categoryFilter]);

  // 3. Agrupación cronológica por año
  const groupedByYear = useMemo(() => {
    const map = new Map<number, ClinicalEventItem[]>();

    filteredEvents.forEach((item) => {
      const year = new Date(item.date).getFullYear() || 2026;
      if (!map.has(year)) {
        map.set(year, []);
      }
      map.get(year)!.push(item);
    });

    return Array.from(map.entries())
      .sort(([yearA], [yearB]) => yearB - yearA)
      .map(([year, items]) => ({
        year,
        items: items.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        ),
      }));
  }, [filteredEvents]);

  if (loading) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-5 space-y-4 max-w-[1700px] mx-auto animate-pulse">
        <div className="h-28 bg-slate-200 rounded-2xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="h-44 bg-slate-200 rounded-2xl" />
          <div className="h-44 bg-slate-200 rounded-2xl" />
          <div className="h-44 bg-slate-200 rounded-2xl" />
          <div className="h-44 bg-slate-200 rounded-2xl" />
        </div>
        <div className="h-10 bg-slate-200 rounded-xl" />
        <div className="h-24 bg-slate-200 rounded-2xl" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-5 max-w-[1700px] mx-auto">
        <AlergiasAntecedentesError
          message={error || 'No fue posible recuperar tu información clínica.'}
          onRetry={refetch}
        />
      </div>
    );
  }

  const categoryOptions: { id: FilterCategory; label: string }[] = [
    { id: 'ALL', label: 'Todos' },
    { id: 'ALLERGIES', label: 'Alergias' },
    { id: 'MEDICAL', label: 'Patologías' },
    { id: 'FAMILY', label: 'Familiares' },
    { id: 'SURGICAL', label: 'Quirúrgicos' },
  ];

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-5 space-y-4 max-w-[1700px] mx-auto animate-in fade-in duration-200">
      {/* 1. Cabecera Médica Oficial */}
      <AlergiasAntecedentesHeader
        bloodType={data.bloodType}
        allergiesCount={data.allergies.length}
      />

      {/* 2. Grid de 4 Tarjetas de Resumen Clínico Compactas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <ResumenAlergias
          allergies={data.allergies}
          onViewDetail={setSelectedAllergy}
        />
        <AntecedentesSection
          medicalHistory={data.medicalHistory}
          familyHistory={data.familyHistory}
          surgicalHistory={data.surgicalHistory}
          onViewDetail={setSelectedAntecedente}
        />
      </div>

      {/* 3. Buscador y Filtros Segmentados */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 bg-white p-2 sm:p-2 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por condición, sustancia, familiar o procedimiento..."
            className="w-full pl-9.5 pr-8 py-1.5 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200/80 focus:border-[#2B7A78] rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 outline-none transition"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/70 overflow-x-auto scrollbar-none">
          {categoryOptions.map((opt) => {
            const isActive = categoryFilter === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setCategoryFilter(opt.id)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer select-none ${
                  isActive
                    ? 'bg-[#2B7A78] text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Lista Cronológica por Año con Tarjetas Clínicas Anchas */}
      {filteredEvents.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-7 text-center text-xs text-slate-500 shadow-2xs space-y-2.5">
          <p className="font-semibold text-slate-700">No se encontraron antecedentes ni alergias</p>
          <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
            Intenta cambiar los términos de búsqueda o selecciona otra categoría.
          </p>
          {(search || categoryFilter !== 'ALL') && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setCategoryFilter('ALL');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition cursor-pointer text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restablecer Filtros</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {groupedByYear.map(({ year, items }) => (
            <section key={year} className="space-y-2.5">
              <div className="flex items-center gap-3 px-1">
                <span className="text-xs font-black text-[#2B7A78] tabular-nums tracking-wide">
                  {year}
                </span>
                <div className="h-px bg-slate-200/80 flex-1" />
                <span className="text-[10.5px] font-semibold text-slate-400">
                  {items.length} registro(s)
                </span>
              </div>

              <div className="space-y-2">
                {items.map((event) => {
                  const dateObj = new Date(event.date);
                  const dia = dateObj.getDate();
                  const mes = dateObj
                    .toLocaleDateString('es-ES', { month: 'short' })
                    .replace('.', '')
                    .toUpperCase();
                  const anio = dateObj.getFullYear();

                  return (
                    <div
                      key={event.id}
                      onClick={() => {
                        if (event.category === 'ALLERGY' && event.rawAllergy) {
                          setSelectedAllergy(event.rawAllergy);
                        } else if (event.rawAntecedente) {
                          setSelectedAntecedente(event.rawAntecedente);
                        }
                      }}
                      className="group bg-white border border-slate-200/80 hover:border-[#2B7A78]/50 rounded-2xl p-3 sm:p-4 shadow-2xs hover:shadow-xs transition-all duration-150 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none"
                    >
                      <div className="flex items-start gap-3.5 min-w-0 flex-1">
                        {/* Bloque de Fecha Izquierdo */}
                        <div className="w-14 sm:w-16 bg-slate-50 border border-slate-200/80 group-hover:border-teal-200 group-hover:bg-teal-50/30 rounded-xl p-1.5 text-center shrink-0 transition-colors shadow-2xs">
                          <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#2B7A78] block">
                            {mes}
                          </span>
                          <span className="text-lg sm:text-xl font-black text-slate-900 leading-none block my-0.5 tabular-nums">
                            {dia}
                          </span>
                          <span className="text-[9px] font-semibold text-slate-400 tabular-nums">
                            {anio}
                          </span>
                        </div>

                        {/* Contenido Clínico */}
                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-xs sm:text-sm font-extrabold text-slate-900 tracking-tight">
                              {event.title}
                            </span>
                            <span
                              className={`px-1.5 py-0.2 rounded-md text-[10px] font-bold border ${event.tagClass}`}
                            >
                              {event.tag}
                            </span>
                            <span
                              className={`px-2 py-0.2 rounded-full text-[10px] font-bold border ${event.statusClass}`}
                            >
                              {event.statusLabel}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                            {event.category === 'ALLERGY' && (
                              <ShieldAlert className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                            )}
                            {event.category === 'MEDICAL' && (
                              <Activity className="w-3.5 h-3.5 text-[#2B7A78] shrink-0" />
                            )}
                            {event.category === 'FAMILY' && (
                              <Users className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                            )}
                            {event.category === 'SURGICAL' && (
                              <Scissors className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                            )}
                            <span className="truncate text-[11px] font-medium text-slate-500">{event.subtitle}</span>
                          </div>
                        </div>
                      </div>

                      {/* Botón Ver Detalle Derecho */}
                      <div className="shrink-0 flex items-center justify-end border-t sm:border-t-0 border-slate-100 pt-2 sm:pt-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (event.category === 'ALLERGY' && event.rawAllergy) {
                              setSelectedAllergy(event.rawAllergy);
                            } else if (event.rawAntecedente) {
                              setSelectedAntecedente(event.rawAntecedente);
                            }
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-50 group-hover:bg-[#2B7A78] text-slate-700 group-hover:text-white text-xs font-bold rounded-xl border border-slate-200/80 group-hover:border-[#2B7A78] transition-all duration-150 shadow-2xs cursor-pointer"
                        >
                          <span>Ver detalle</span>
                          <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* 5. Franja Inferior de Aviso y Solicitud de Revisión */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-100 text-[#2B7A78] flex items-center justify-center shrink-0 shadow-xs">
            <Info className="w-4 h-4" />
          </div>
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            <strong className="text-slate-900 font-bold">Información del expediente oficial:</strong> Datos registrados
            por personal médico autorizado. Si encuentras un antecedente desactualizado, solicita su revisión clínica.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSolicitarRevision}
          className="shrink-0 px-3.5 py-1.5 bg-slate-100 hover:bg-[#2B7A78] text-slate-700 hover:text-white font-bold text-xs rounded-xl border border-slate-200 hover:border-[#2B7A78] transition-all cursor-pointer shadow-xs select-none"
        >
          Solicitar revisión
        </button>
      </div>

      {/* Toast Flotante */}
      {showRevisionToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700 text-xs font-medium flex items-center gap-2.5 animate-in slide-in-from-bottom-3 duration-200">
          <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
            <Check className="w-3 h-3 stroke-3" />
          </div>
          <span>
            Solicitud recibida. El personal de salud revisará tus antecedentes en tu próxima atención médica.
          </span>
        </div>
      )}

      {/* Modales Clínicos Desacoplados */}
      <DetalleAlergiaModal allergy={selectedAllergy} onClose={() => setSelectedAllergy(null)} />
      <DetalleAntecedenteModal
        antecedente={selectedAntecedente}
        onClose={() => setSelectedAntecedente(null)}
      />
    </div>
  );
};

export default AlergiasAntecedentesPage;