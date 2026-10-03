// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/promocion-prevencion/educacion-prevencion/components/ModalNuevaActividadEducativa.tsx
// DESCRIPCIÓN: Modal por pasos con altura fija (cero saltos visuales),
//              stepper guiado y catálogo oficial de 28 guías de salud.
// =========================================================================

import React, { useState, useMemo } from 'react';
import {
  X,
  BookOpen,
  CheckCircle2,
  UserCheck,
  ChevronDown,
  ChevronUp,
  Search,
  Info,
  ArrowRight,
  ArrowLeft,
  Users,
  MapPin,
  Check,
} from 'lucide-react';
import type { PatientRecord } from '../../../../../../modules/patients/types/patient.types';
import type {
  ModalidadEducativa,
  RegistrarActividadEducativaDto,
  ArticuloGuiaRef,
} from '../../../../../../modules/health-education/types/health-education.types';
import { ALL_HEALTH_ARTICLES } from '../../../../../../modules/health-education/data/articles';
import { HEALTH_CATEGORIES } from '../../../../../../modules/health-education/data/categories';

interface ModalNuevaActividadEducativaProps {
  isOpen: boolean;
  onClose: () => void;
  pacientesPadron: PatientRecord[];
  onGuardar: (dto: RegistrarActividadEducativaDto) => Promise<boolean>;
}

export const ModalNuevaActividadEducativa: React.FC<ModalNuevaActividadEducativaProps> = ({
  isOpen,
  onClose,
  pacientesPadron,
  onGuardar,
}) => {
  const hoyStr = new Date().toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  // Control de flujo por pasos
  const [paso, setPaso] = useState<number>(1);

  // Paso 1: Contexto y Modalidad
  const [modalidad, setModalidad] = useState<ModalidadEducativa>('GRUPAL');
  const [fecha, setFecha] = useState<string>(hoyStr);
  const [lugar, setLugar] = useState<string>('');
  const [sector, setSector] = useState<string>('');
  const [pacienteId, setPacienteId] = useState<string>('');
  const [cantidadPersonas, setCantidadPersonas] = useState<number>(12);
  const [grupos, setGrupos] = useState<string[]>(['Familias']);

  // Paso 2: Catálogo Oficial y Guías
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>('ALL');
  const [busquedaArticulo, setBusquedaArticulo] = useState<string>('');
  const [articulosSeleccionadosIds, setArticulosSeleccionadosIds] = useState<string[]>(['art-prev-1']);
  const [articuloAbiertoId, setArticuloAbiertoId] = useState<string | null>(null);

  // Paso 3: Metodología y Observaciones
  const [materiales, setMateriales] = useState<string[]>(['Demostración práctica', 'Charla participativa']);
  const [observaciones, setObservaciones] = useState<string>('');
  const [guardando, setGuardando] = useState<boolean>(false);

  // Filtrado reactivo de los 28 artículos oficiales[cite: 14]
  const articulosFiltrados = useMemo(() => {
    return ALL_HEALTH_ARTICLES.filter((art) => {
      const matchCat = categoriaSeleccionada === 'ALL' || art.category === categoriaSeleccionada;
      const q = busquedaArticulo.toLowerCase().trim();
      const matchText =
        !q ||
        art.title.toLowerCase().includes(q) ||
        art.tags.some((t) => t.toLowerCase().includes(q)) ||
        art.summary.toLowerCase().includes(q);
      return matchCat && matchText;
    });
  }, [categoriaSeleccionada, busquedaArticulo]);

  // Artículos seleccionados actualmente para el resumen
  const articulosSeleccionados = useMemo(() => {
    return ALL_HEALTH_ARTICLES.filter((art) => articulosSeleccionadosIds.includes(art.id));
  }, [articulosSeleccionadosIds]);

  if (!isOpen) return null;

  const toggleArrayItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    setter((prev) => (prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]));
  };

  const toggleArticuloSeleccionado = (artId: string) => {
    setArticulosSeleccionadosIds((prev) =>
      prev.includes(artId) ? prev.filter((id) => id !== artId) : [...prev, artId]
    );
  };

  const opcionesGrupos = ['Niños', 'Adolescentes', 'Adultos', 'Adultos mayores', 'Familias', 'Comunidad general'];

  const opcionesMateriales = [
    'Material educativo impreso',
    'Demostración práctica',
    'Charla participativa',
    'Visita domiciliaria',
    'Orientación individual',
  ];

  // Validaciones por paso
  const paso1Valido =
    lugar.trim().length > 0 && (modalidad !== 'INDIVIDUAL' || pacienteId.trim().length > 0);
  const paso2Valido = articulosSeleccionadosIds.length > 0;

  const handleSubmit = async () => {
    if (!paso1Valido || !paso2Valido) return;

    const articulosGuia: ArticuloGuiaRef[] = articulosSeleccionados.map((art) => ({
      id: art.id,
      slug: art.slug,
      title: art.title,
      category: art.category,
      categoryLabel: art.categoryLabel,
      summary: art.summary,
      keyPoints: art.keyPoints,
    }));

    const temasAbordados = articulosGuia.map((a) => a.title);

    setGuardando(true);
    const ok = await onGuardar({
      fecha,
      lugar: lugar.trim(),
      sector: sector.trim() || undefined,
      modalidad,
      pacienteId: modalidad === 'INDIVIDUAL' ? pacienteId : null,
      cantidadPersonas: modalidad === 'INDIVIDUAL' ? 1 : cantidadPersonas,
      gruposPoblacionales: grupos,
      temasAbordados,
      articulosGuia,
      materialUtilizado: materiales,
      observaciones: observaciones.trim() || null,
    });
    setGuardando(false);
    if (ok) {
      setPaso(1);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      {/* Contenedor con altura y ancho estrictamente fijados para evitar saltos de layout */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl h-155 max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Cabecera Fija */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/90 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-50 text-[#166E7A] border border-teal-200/80">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                Nueva Actividad Educativa y Sanitaria
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Paso {paso} de 3 • {paso === 1 ? 'Modalidad y Ubicación' : paso === 2 ? 'Guías Oficiales del Catálogo' : 'Metodología y Cierre'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stepper Fijo y Compacto */}
        <div className="px-5 py-2.5 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between gap-2 shrink-0">
          {[
            { num: 1, label: 'Modalidad y Lugar' },
            { num: 2, label: `Guías (${articulosSeleccionadosIds.length})` },
            { num: 3, label: 'Metodología y Cierre' },
          ].map((st, idx) => {
            const isCompleted = paso > st.num;
            const isCurrent = paso === st.num;

            return (
              <React.Fragment key={st.num}>
                <div
                  onClick={() => {
                    if (st.num === 1) setPaso(1);
                    if (st.num === 2 && paso1Valido) setPaso(2);
                    if (st.num === 3 && paso1Valido && paso2Valido) setPaso(3);
                  }}
                  className={`flex items-center gap-2 text-xs font-bold transition cursor-pointer select-none ${
                    isCurrent
                      ? 'text-[#166E7A]'
                      : isCompleted
                      ? 'text-emerald-700'
                      : 'text-slate-400'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black transition ${
                      isCurrent
                        ? 'bg-[#166E7A] text-white shadow-2xs'
                        : isCompleted
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {isCompleted ? <Check className="w-3.5 h-3.5 stroke-3" /> : st.num}
                  </span>
                  <span className="hidden sm:inline">{st.label}</span>
                </div>
                {idx < 2 && <div className="flex-1 h-0.5 bg-slate-200 mx-2" />}
              </React.Fragment>
            );
          })}
        </div>

        {/* Cuerpo con Transición Suave y Altura Flexible dentro del Marco Fijo */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* PASO 1: MODALIDAD Y UBICACIÓN */}
          {paso === 1 && (
            <div key="paso-1" className="space-y-4 animate-in fade-in duration-200">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Modalidad de la Actividad
                </label>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  {(['INDIVIDUAL', 'FAMILIAR', 'GRUPAL', 'COMUNITARIA'] as ModalidadEducativa[]).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setModalidad(m)}
                      className={`py-2 px-2 rounded-xl border text-center font-bold transition cursor-pointer ${
                        modalidad === m
                          ? 'bg-[#166E7A] text-white border-[#166E7A] shadow-2xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {m.charAt(0) + m.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selector individual de Padrón o selector grupal */}
              {modalidad === 'INDIVIDUAL' ? (
                <div className="p-3.5 rounded-2xl bg-teal-50/60 border border-teal-200 space-y-1.5">
                  <label className="text-xs font-bold text-[#166E7A] flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4" />
                    <span>Persona Orientada (Padrón Comunitario)</span>
                  </label>
                  <select
                    value={pacienteId}
                    onChange={(e) => setPacienteId(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs bg-white border border-teal-300 rounded-xl focus:outline-none"
                  >
                    <option value="">-- Seleccionar Persona del Padrón --</option>
                    {pacientesPadron.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.firstName} {p.lastName} • DUI: {p.dui || 'Sin DUI'} • {p.address}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Personas Alcanzadas
                    </label>
                    <input
                      type="number"
                      min="2"
                      value={cantidadPersonas}
                      onChange={(e) => setCantidadPersonas(parseInt(e.target.value, 10))}
                      required
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166E7A]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Fecha</label>
                    <input
                      type="text"
                      value={fecha}
                      onChange={(e) => setFecha(e.target.value)}
                      required
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166E7A]"
                    />
                  </div>
                </div>
              )}

              {/* Ubicación y Sector[cite: 16] */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Comunidad o Lugar de la Charla[cite: 16]
                  </label>
                  <input
                    type="text"
                    value={lugar}
                    onChange={(e) => setLugar(e.target.value)}
                    placeholder="Ej. Cantón El Carmen"
                    required
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166E7A]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Sector o Área Territorial[cite: 16]
                  </label>
                  <input
                    type="text"
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    placeholder="Ej. Sector La Quebrada"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166E7A]"
                  />
                </div>
              </div>

              {/* Grupos Poblacionales[cite: 16] */}
              {modalidad !== 'INDIVIDUAL' && (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Grupos Poblacionales Presentes[cite: 16]
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {opcionesGrupos.map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => toggleArrayItem(setGrupos, g)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition cursor-pointer ${
                          grupos.includes(g)
                            ? 'bg-[#166E7A] text-white border-[#166E7A] font-bold shadow-2xs'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {grupos.includes(g) ? '✓ ' : ''}{g}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PASO 2: CATÁLOGO OFICIAL Y GUÍAS DE SALUD */}
          {paso === 2 && (
            <div key="paso-2" className="space-y-3 animate-in fade-in duration-200 flex flex-col h-full">
              <div className="flex items-center justify-between shrink-0">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                    Selecciona las Guías y Temas Impartidos[cite: 16]
                  </h4>
                  <p className="text-[10.5px] text-slate-400">
                    Marca los artículos oficiales abordados y consulta sus puntos clave como apoyo didáctico.
                  </p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-teal-50 text-[#166E7A] border border-teal-200">
                  {articulosSeleccionadosIds.length} seleccionados
                </span>
              </div>

              {/* Filtro por Categorías Oficiales[cite: 15, 16] */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] shrink-0 scrollbar-none">
                {HEALTH_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategoriaSeleccionada(cat.id)}
                    className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition cursor-pointer ${
                      categoriaSeleccionada === cat.id
                        ? 'bg-[#166E7A] text-white shadow-2xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Buscador Rápido[cite: 16] */}
              <div className="relative shrink-0">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={busquedaArticulo}
                  onChange={(e) => setBusquedaArticulo(e.target.value)}
                  placeholder="Buscar en las 28 guías (ej. dengue, vacunas, lavado de manos...)"
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166E7A]"
                />
              </div>

              {/* Lista Desplazable de Artículos Oficiales */}
              <div className="flex-1 overflow-y-auto space-y-1.5 pr-0.5">
                {articulosFiltrados.map((art) => {
                  const isSelected = articulosSeleccionadosIds.includes(art.id);
                  const isOpen = articuloAbiertoId === art.id;

                  return (
                    <div
                      key={art.id}
                      className={`rounded-xl border transition overflow-hidden ${
                        isSelected
                          ? 'border-teal-300 bg-teal-50/40 shadow-2xs'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="p-2.5 flex items-center justify-between gap-2">
                        <label className="flex items-center gap-2 cursor-pointer flex-1 min-w-0">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleArticuloSeleccionado(art.id)}
                            className="rounded text-[#166E7A] focus:ring-0 shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-xs font-bold text-slate-900 truncate">
                                {art.title}
                              </span>
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-slate-100 text-slate-600 border border-slate-200">
                                {art.categoryLabel}
                              </span>
                            </div>
                            <p className="text-[10.5px] text-slate-500 truncate mt-0.5">
                              {art.summary}
                            </p>
                          </div>
                        </label>

                        <button
                          type="button"
                          onClick={() => setArticuloAbiertoId(isOpen ? null : art.id)}
                          className="px-2 py-1 rounded-lg text-[10px] font-bold text-[#166E7A] hover:bg-teal-100/50 transition shrink-0 flex items-center gap-1 cursor-pointer"
                        >
                          <Info className="w-3 h-3" />
                          <span>{isOpen ? 'Ocultar' : 'Puntos Clave'}</span>
                          {isOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                      </div>

                      {/* Acordeón Didáctico de Puntos Clave[cite: 14, 16] */}
                      {isOpen && (
                        <div className="p-3 bg-white border-t border-teal-100 space-y-1.5 text-[11px] animate-in fade-in duration-150">
                          <p className="text-[10px] font-bold text-[#166E7A] uppercase tracking-wider">
                            Puntos Clave Oficiales para Orientar a la Comunidad:
                          </p>
                          <ul className="space-y-1 text-slate-700 pl-1">
                            {art.keyPoints.map((kp, idx) => (
                              <li key={idx} className="flex items-start gap-1.5 leading-snug">
                                <span className="text-[#166E7A] font-bold shrink-0">•</span>
                                <span>{kp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* PASO 3: METODOLOGÍA, OBSERVACIONES Y CIERRE[cite: 16] */}
          {paso === 3 && (
            <div key="paso-3" className="space-y-4 animate-in fade-in duration-200">
              {/* Tarjeta Resumen de Confirmación */}
              <div className="p-3 rounded-2xl bg-teal-50/60 border border-teal-200 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-[#166E7A] flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{lugar} {sector ? `(${sector})` : ''}</span>
                  </span>
                  <span className="text-slate-500 font-semibold">{fecha}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <Users className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span>
                    Modalidad <strong>{modalidad}</strong> • Alcanzados: <strong>{modalidad === 'INDIVIDUAL' ? 1 : cantidadPersonas} personas</strong>
                  </span>
                </div>
                <div className="pt-1 border-t border-teal-200/60">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Guías Oficiales Vinculadas ({articulosSeleccionados.length}):
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {articulosSeleccionados.map((a) => (
                      <span key={a.id} className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white text-[#166E7A] border border-teal-200">
                        ✓ {a.title}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Material o Metodología Utilizada[cite: 16] */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Material o Metodología Utilizada[cite: 16]
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {opcionesMateriales.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => toggleArrayItem(setMateriales, m)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition cursor-pointer ${
                        materiales.includes(m)
                          ? 'bg-teal-50 text-[#166E7A] border-teal-300 font-bold shadow-2xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {materiales.includes(m) ? '✓ ' : ''}{m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Observaciones de la Intervención[cite: 16] */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Observaciones de la Intervención Comunitaria[cite: 16]
                </label>
                <textarea
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  rows={3}
                  placeholder="Acuerdos establecidos con la comunidad, dudas atendidas, compromisos asumidos..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166E7A]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Pie Fijo con Botones de Navegación */}
        <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50/90 flex items-center justify-between shrink-0">
          {paso > 1 ? (
            <button
              type="button"
              onClick={() => setPaso((p) => p - 1)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Atrás</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
            >
              Cancelar[cite: 16]
            </button>
          )}

          {paso < 3 ? (
            <button
              type="button"
              disabled={paso === 1 ? !paso1Valido : !paso2Valido}
              onClick={() => setPaso((p) => p + 1)}
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#166E7A] hover:bg-[#105F68] text-white text-xs font-bold rounded-xl shadow-xs transition active:scale-95 disabled:opacity-40 cursor-pointer"
            >
              <span>Continuar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              disabled={guardando || !paso1Valido || !paso2Valido}
              onClick={() => void handleSubmit()}
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{guardando ? 'Guardando...' : 'Guardar Actividad con Guías'}[cite: 16]</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalNuevaActividadEducativa;