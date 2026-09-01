// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/atencion/nueva/components/AtencionSeguimientoReferenciaCard.tsx
// DESCRIPCIÓN: Paso 7: Plan de continuidad con seguimiento territorial y buscador interactivo en tiempo real para derivación médica.
// =========================================================================

import React, { useMemo, useState, useRef, useEffect } from 'react';
import {
  CalendarClock,
  Send,
  Building2,
  CheckCircle2,
  Info,
  Calendar,
  AlertTriangle,
  Plus,
  ShieldCheck,
  MapPin,
  Clock,
  Search,
  X,
  ChevronDown,
} from 'lucide-react';
import type { SeguimientoFormState } from '../../../../../../modules/atencion/types/atencion.types';
import { useHospitals } from '../../../../../../modules/establishments/hooks/useHospitals';

interface AtencionSeguimientoReferenciaCardProps {
  seguimiento: SeguimientoFormState;
  errors?: Record<string, string | undefined>;
  onChangeSeguimiento: (
    field: keyof SeguimientoFormState,
    value: boolean | string | 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  ) => void;
}

const CHIPS_MOTIVO_SEGUIMIENTO = [
  'Control de presión arterial',
  'Revisión de glucemia',
  'Evolución de síntomas',
  'Curación de seguimiento',
  'Verificación de medicamentos',
];

const CHIPS_MOTIVO_REFERENCIA = [
  'Evaluación médica integral',
  'Sospecha de cuadro agudo',
  'Control prenatal especializado',
  'Descompensación clínica',
  'Exámenes complementarios',
];

const PRIORIDADES_REFERENCIA: {
  key: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  label: string;
  badgeClass: string;
}[] = [
  {
    key: 'LOW',
    label: 'Baja / Rutina',
    badgeClass: 'text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100',
  },
  {
    key: 'MEDIUM',
    label: 'Media / Prioritaria',
    badgeClass: 'text-sky-700 bg-sky-50 border-sky-200 hover:bg-sky-100',
  },
  {
    key: 'HIGH',
    label: 'Alta / Pronto',
    badgeClass: 'text-amber-700 bg-amber-50 border-amber-200 hover:bg-amber-100',
  },
  {
    key: 'URGENT',
    label: 'Urgente / Emergencia',
    badgeClass: 'text-rose-700 bg-rose-50 border-rose-200 hover:bg-rose-100',
  },
];

export const AtencionSeguimientoReferenciaCard: React.FC<AtencionSeguimientoReferenciaCardProps> = ({
  seguimiento,
  errors = {},
  onChangeSeguimiento,
}) => {
  const { hospitals, loading: loadingHospitals } = useHospitals();
  const [selectedChipsSeguimiento, setSelectedChipsSeguimiento] = useState<string[]>([]);
  const [selectedChipsReferencia, setSelectedChipsReferencia] = useState<string[]>([]);

  // Estado del Buscador Live de Establecimientos
  const [searchEstablecimiento, setSearchEstablecimiento] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar lista al hacer clic fuera del componente
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtrado en Vivo de los 103 Establecimientos
  const establecimientosFiltrados = useMemo(() => {
    if (!searchEstablecimiento.trim()) return hospitals;
    const query = searchEstablecimiento.toLowerCase().trim();
    return hospitals.filter((est) => {
      const nameMatch = est.name.toLowerCase().includes(query);
      const deptoMatch = est.department?.toLowerCase().includes(query);
      const muniMatch = est.municipality?.toLowerCase().includes(query);
      const codeMatch = est.code?.toLowerCase().includes(query);
      return nameMatch || deptoMatch || muniMatch || codeMatch;
    });
  }, [hospitals, searchEstablecimiento]);

  const establecimientoSeleccionado = useMemo(() => {
    return hospitals.find((h) => h.id === seguimiento.establecimientoDestinoId);
  }, [hospitals, seguimiento.establecimientoDestinoId]);

  const handleCalcularFecha = (dias: number) => {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + dias);
    const formato = fecha.toISOString().split('T')[0];
    onChangeSeguimiento('fechaSeguimiento', formato);
  };

  const toggleChipSeguimiento = (chip: string) => {
    setSelectedChipsSeguimiento((prev) =>
      prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip]
    );
  };

  const toggleChipReferencia = (chip: string) => {
    setSelectedChipsReferencia((prev) =>
      prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip]
    );
  };

  const handleSeleccionarEstablecimiento = (id: string, nombre: string) => {
    onChangeSeguimiento('establecimientoDestinoId', id);
    onChangeSeguimiento('establecimientoDestinoNombre', nombre);
    setIsDropdownOpen(false);
    setSearchEstablecimiento('');
  };

  const handleLimpiarEstablecimiento = () => {
    onChangeSeguimiento('establecimientoDestinoId', '');
    onChangeSeguimiento('establecimientoDestinoNombre', '');
    setSearchEstablecimiento('');
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/70 p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:border-slate-300 transition-all duration-200 h-full flex flex-col justify-between space-y-2.5">
      {/* 1. Bloque Superior: Cabecera + Paneles Paralelos */}
      <div className="space-y-2.5 flex-1 flex flex-col justify-between">
        {/* Cabecera */}
        <div className="flex items-center gap-3 border-b border-slate-100 pb-2">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-700 shadow-2xs shrink-0">
            <CalendarClock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 block">
              Paso 7 de 8 • Plan de Continuidad
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight leading-snug">
              Seguimiento Comunitario y Referencia Médica
            </h2>
          </div>
        </div>

        {/* Grid Principal de 2 Columnas Balanceadas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 flex-1">
          {/* PANEL A: SEGUIMIENTO COMUNITARIO */}
          <div
            className={`rounded-2xl border p-3.5 transition-all duration-200 flex flex-col justify-between space-y-2 shadow-2xs ${
              seguimiento.requiereSeguimiento
                ? 'bg-teal-50/70 border-teal-300 ring-2 ring-teal-500/10'
                : 'bg-white border-slate-200/80 hover:border-slate-300'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                      seguimiento.requiereSeguimiento
                        ? 'bg-[#2B7A78] text-white border-teal-600 shadow-2xs'
                        : 'bg-teal-50 text-teal-700 border-teal-100'
                    }`}
                  >
                    <CalendarClock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight">
                      1. Seguimiento en Terreno
                    </h3>
                    <p className="text-[10px] text-slate-500">¿Requiere reevaluación o visita?</p>
                  </div>
                </div>

                <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200/70 shrink-0">
                  <button
                    type="button"
                    onClick={() => onChangeSeguimiento('requiereSeguimiento', false)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      !seguimiento.requiereSeguimiento
                        ? 'bg-slate-700 text-white shadow-2xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    No
                  </button>
                  <button
                    type="button"
                    onClick={() => onChangeSeguimiento('requiereSeguimiento', true)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      seguimiento.requiereSeguimiento
                        ? 'bg-[#2B7A78] text-white shadow-2xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {seguimiento.requiereSeguimiento && <CheckCircle2 className="w-3 h-3" />}
                    <span>Sí</span>
                  </button>
                </div>
              </div>

              {seguimiento.requiereSeguimiento ? (
                <div className="space-y-2 animate-in fade-in duration-150">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-teal-600" />
                        Fecha Prevista de Control <span className="text-red-500">*</span>
                      </label>
                      <span className="text-[10px] text-slate-400">Atajos rápidos:</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <input
                        type="date"
                        value={seguimiento.fechaSeguimiento}
                        onChange={(e) => onChangeSeguimiento('fechaSeguimiento', e.target.value)}
                        className="flex-1 text-xs p-2 rounded-xl border border-slate-200 bg-white font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 shadow-2xs"
                      />
                      <button
                        type="button"
                        onClick={() => handleCalcularFecha(3)}
                        className="px-2.5 py-1.5 bg-white hover:bg-teal-50 text-teal-800 border border-slate-200 text-[11px] font-bold rounded-xl cursor-pointer shadow-2xs transition"
                      >
                        +3d
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCalcularFecha(7)}
                        className="px-2.5 py-1.5 bg-white hover:bg-teal-50 text-teal-800 border border-slate-200 text-[11px] font-bold rounded-xl cursor-pointer shadow-2xs transition"
                      >
                        +7d
                      </button>
                    </div>
                    {errors.fechaSeguimiento && (
                      <p className="text-[10px] text-red-600 font-semibold">{errors.fechaSeguimiento}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800 block">
                      Motivo del Seguimiento <span className="text-red-500">*</span>
                    </label>

                    <div className="flex flex-wrap gap-1">
                      {CHIPS_MOTIVO_SEGUIMIENTO.map((chip) => {
                        const active = selectedChipsSeguimiento.includes(chip);
                        return (
                          <button
                            type="button"
                            key={chip}
                            onClick={() => toggleChipSeguimiento(chip)}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-medium transition cursor-pointer shadow-2xs ${
                              active
                                ? 'bg-teal-50 text-[#1B5250] border-[#2B7A78] font-bold'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-teal-50/60'
                            }`}
                          >
                            {active ? (
                              <CheckCircle2 className="w-2.5 h-2.5 text-[#2B7A78]" />
                            ) : (
                              <Plus className="w-2.5 h-2.5 text-teal-600" />
                            )}
                            <span>{chip}</span>
                          </button>
                        );
                      })}
                    </div>

                    <input
                      type="text"
                      placeholder="Ej. Control de presión arterial y cumplimiento de esquema..."
                      value={seguimiento.motivoSeguimiento}
                      onChange={(e) => onChangeSeguimiento('motivoSeguimiento', e.target.value)}
                      className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900 shadow-2xs"
                    />
                  </div>
                </div>
              ) : (
                <div className="py-5 sm:py-6 text-center space-y-1.5 bg-slate-50/70 border border-dashed border-slate-200 rounded-xl p-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <Clock className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-700">Sin Seguimiento Territorial Programado</h4>
                  <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                    El caso se considera resuelto en esta visita comunitaria y no amerita cita de reevaluación.
                  </p>
                </div>
              )}
            </div>

            <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-teal-600" />
                Módulo Territorial
              </span>
              <span
                className={`font-bold px-2 py-0.5 rounded-md text-[10px] ${
                  seguimiento.requiereSeguimiento
                    ? 'bg-teal-100 text-teal-800'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {seguimiento.requiereSeguimiento ? 'Programado' : 'No Requerido'}
              </span>
            </div>
          </div>

          {/* PANEL B: REFERENCIA CON BUSCADOR LIVE DE ESTABLECIMIENTOS */}
          <div
            className={`rounded-2xl border p-3.5 transition-all duration-200 flex flex-col justify-between space-y-2 shadow-2xs ${
              seguimiento.requiereReferencia
                ? 'bg-amber-50/60 border-amber-300 ring-2 ring-amber-500/10'
                : 'bg-white border-slate-200/80 hover:border-slate-300'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                      seguimiento.requiereReferencia
                        ? 'bg-amber-600 text-white border-amber-700 shadow-2xs'
                        : 'bg-amber-50 text-amber-600 border-amber-100'
                    }`}
                  >
                    <Send className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight">
                      2. Derivación Médica
                    </h3>
                    <p className="text-[10px] text-slate-500">¿Requiere envío a Unidad o Hospital?</p>
                  </div>
                </div>

                <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200/70 shrink-0">
                  <button
                    type="button"
                    onClick={() => onChangeSeguimiento('requiereReferencia', false)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      !seguimiento.requiereReferencia
                        ? 'bg-slate-700 text-white shadow-2xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    No
                  </button>
                  <button
                    type="button"
                    onClick={() => onChangeSeguimiento('requiereReferencia', true)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      seguimiento.requiereReferencia
                        ? 'bg-amber-600 text-white shadow-2xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {seguimiento.requiereReferencia && <CheckCircle2 className="w-3 h-3" />}
                    <span>Sí</span>
                  </button>
                </div>
              </div>

              {seguimiento.requiereReferencia ? (
                <div className="space-y-2 animate-in fade-in duration-150">
                  {/* Selector de Nivel de Prioridad */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800 block">
                      Nivel de Prioridad / Urgencia
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1">
                      {PRIORIDADES_REFERENCIA.map((p) => {
                        const isSelected = (seguimiento.prioridadReferencia || 'MEDIUM') === p.key;
                        return (
                          <button
                            type="button"
                            key={p.key}
                            onClick={() => onChangeSeguimiento('prioridadReferencia', p.key)}
                            className={`py-1 px-1.5 rounded-lg border text-[10px] font-bold text-center transition cursor-pointer ${
                              isSelected
                                ? `${p.badgeClass} ring-2 ring-amber-500/20 font-black shadow-2xs`
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            {p.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* BUSCADOR LIVE DE ESTABLECIMIENTO */}
                  <div className="space-y-1 relative" ref={dropdownRef}>
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-amber-600" />
                        Establecimiento de Salud Destino <span className="text-red-500">*</span>
                      </label>
                      <span className="text-[10px] text-slate-400">
                        {hospitals.length} centros disponibles
                      </span>
                    </div>

                    {/* Si ya hay uno seleccionado, muestra la ficha del establecimiento */}
                    {seguimiento.establecimientoDestinoId && establecimientoSeleccionado ? (
                      <div className="p-2 bg-white border border-amber-300 rounded-xl flex items-center justify-between shadow-2xs">
                        <div className="min-w-0 flex-1 pr-2">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-extrabold text-slate-900 truncate">
                              {establecimientoSeleccionado.name}
                            </span>
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 shrink-0">
                              {establecimientoSeleccionado.department}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 truncate">
                            {establecimientoSeleccionado.municipality || 'Municipio'} • {establecimientoSeleccionado.address || 'El Salvador'}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleLimpiarEstablecimiento}
                          className="p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition cursor-pointer shrink-0"
                          title="Cambiar establecimiento"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      /* Input de Búsqueda en Tiempo Real */
                      <div className="relative">
                        <div className="relative flex items-center">
                          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
                          <input
                            type="text"
                            placeholder={
                              loadingHospitals
                                ? 'Cargando red de salud...'
                                : 'Escribe nombre, municipio o departamento...'
                            }
                            value={searchEstablecimiento}
                            onFocus={() => setIsDropdownOpen(true)}
                            onChange={(e) => {
                              setSearchEstablecimiento(e.target.value);
                              setIsDropdownOpen(true);
                            }}
                            className="w-full text-xs pl-8 pr-7 py-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-900 outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 shadow-2xs"
                          />
                          <ChevronDown
                            className={`w-3.5 h-3.5 text-slate-400 absolute right-2.5 transition-transform duration-200 cursor-pointer ${
                              isDropdownOpen ? 'rotate-180 text-amber-600' : ''
                            }`}
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          />
                        </div>

                        {/* Menú Desplegable Flotante (no empuja el layout) */}
                        {isDropdownOpen && (
                          <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 max-h-44 overflow-y-auto divide-y divide-slate-100 animate-in fade-in zoom-in-95 duration-150">
                            {establecimientosFiltrados.length === 0 ? (
                              <div className="p-3 text-center text-xs text-slate-400">
                                No se encontraron establecimientos coincidentes con &quot;{searchEstablecimiento}&quot;
                              </div>
                            ) : (
                              establecimientosFiltrados.map((est) => (
                                <button
                                  type="button"
                                  key={est.id}
                                  onClick={() => handleSeleccionarEstablecimiento(est.id, est.name)}
                                  className="w-full p-2 text-left hover:bg-amber-50/70 transition flex items-center justify-between gap-2 cursor-pointer group"
                                >
                                  <div className="min-w-0 flex-1">
                                    <p className="text-xs font-bold text-slate-800 group-hover:text-amber-900 truncate">
                                      {est.name}
                                    </p>
                                    <p className="text-[10px] text-slate-400 group-hover:text-slate-600 truncate">
                                      {est.department} • {est.municipality || 'Sin municipio'}
                                    </p>
                                  </div>
                                  <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 shrink-0">
                                    {est.type || 'OFICIAL'}
                                  </span>
                                </button>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Motivo de Derivación con Chips */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800 block">
                      Motivo Clínico de Derivación <span className="text-red-500">*</span>
                    </label>

                    <div className="flex flex-wrap gap-1">
                      {CHIPS_MOTIVO_REFERENCIA.map((chip) => {
                        const active = selectedChipsReferencia.includes(chip);
                        return (
                          <button
                            type="button"
                            key={chip}
                            onClick={() => toggleChipReferencia(chip)}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-medium transition cursor-pointer shadow-2xs ${
                              active
                                ? 'bg-amber-50 text-amber-900 border-amber-400 font-bold'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-amber-50/60'
                            }`}
                          >
                            {active ? (
                              <CheckCircle2 className="w-2.5 h-2.5 text-amber-600" />
                            ) : (
                              <Plus className="w-2.5 h-2.5 text-amber-600" />
                            )}
                            <span>{chip}</span>
                          </button>
                        );
                      })}
                    </div>

                    <input
                      type="text"
                      placeholder="Ej. Sospecha de apendicitis aguda, evaluación especializada..."
                      value={seguimiento.motivoReferencia}
                      onChange={(e) => onChangeSeguimiento('motivoReferencia', e.target.value)}
                      className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900 shadow-2xs"
                    />
                  </div>
                </div>
              ) : (
                <div className="py-5 sm:py-6 text-center space-y-1.5 bg-slate-50/70 border border-dashed border-slate-200 rounded-xl p-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-700">Sin Derivación Médica Externa</h4>
                  <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                    No se detectaron criterios de alarma o necesidad de traslado hacia unidades médicas u hospitales.
                  </p>
                </div>
              )}
            </div>

            <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
              <span className="flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                Red Hospitalaria
              </span>
              <span
                className={`font-bold px-2 py-0.5 rounded-md text-[10px] ${
                  seguimiento.requiereReferencia
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {seguimiento.requiereReferencia ? 'Derivación Activa' : 'No Requerida'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Bloque Inferior: Pie Informativo */}
      <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between gap-2 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-teal-600 shrink-0" />
          <span className="text-[11px] sm:text-xs">
            Las derivaciones y visitas se sincronizarán con los módulos territoriales al guardar la atención.
          </span>
        </div>
        <span className="text-[11px] font-semibold text-slate-400 shrink-0">Paso 7 de 8</span>
      </div>
    </div>
  );
};

export default AtencionSeguimientoReferenciaCard;