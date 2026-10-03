// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/promocion-prevencion/educacion-prevencion/components/ModalNuevoControlVectores.tsx
// DESCRIPCIÓN: Modal de control de vectores por pasos con dimensiones fijas
//              y vinculación exclusiva a guías reales de prevención de dengue.
// =========================================================================

import React, { useState } from 'react';
import {
  X,
  Bug,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Check,
  MapPin,
  Home,
  BookOpen,
} from 'lucide-react';
import type {
  TipoActividadVectores,
  RegistrarControlVectoresDto,
} from '../../../../../../modules/health-education/types/health-education.types';

interface ModalNuevoControlVectoresProps {
  isOpen: boolean;
  onClose: () => void;
  onGuardar: (dto: RegistrarControlVectoresDto) => Promise<boolean>;
}

export const ModalNuevoControlVectores: React.FC<ModalNuevoControlVectoresProps> = ({
  isOpen,
  onClose,
  onGuardar,
}) => {
  const hoyStr = new Date().toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const [paso, setPaso] = useState<number>(1);

  // Paso 1: Ubicación e Inspección
  const [fecha] = useState<string>(hoyStr);
  const [comunidad, setComunidad] = useState<string>('');
  const [sector, setSector] = useState<string>('');
  const [referencia, setReferencia] = useState<string>('');
  const [tipoActividad, setTipoActividad] = useState<TipoActividadVectores>('ELIMINACION_CRIADEROS');
  const [viviendasInspeccionadas, setViviendasInspeccionadas] = useState<number>(5);
  const [viviendasConHallazgos, setViviendasConHallazgos] = useState<number>(1);

  // Paso 2: Hallazgos y Acciones
  const [hallazgos, setHallazgos] = useState<string[]>(['Recipientes con agua sin protección']);
  const [acciones, setAcciones] = useState<string[]>([
    'Eliminación física de criaderos',
    'Orientación directa a la familia',
  ]);

  // Paso 3: Seguimiento y Orientación Oficial
  const [incluirEducacionSimultanea, setIncluirEducacionSimultanea] = useState<boolean>(true);
  const [requiereSeguimiento, setRequiereSeguimiento] = useState<boolean>(false);
  const [motivoSeguimiento, setMotivoSeguimiento] = useState<string>('');
  const [fechaPropuestaSeguimiento, setFechaPropuestaSeguimiento] = useState<string>('2026-10-08');
  const [observaciones, setObservaciones] = useState<string>('');
  const [guardando, setGuardando] = useState<boolean>(false);

  if (!isOpen) return null;

  const toggleArrayItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    setter((prev) => (prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]));
  };

  const tiposOpciones: { id: TipoActividadVectores; label: string }[] = [
    { id: 'ELIMINACION_CRIADEROS', label: 'Eliminación de Criaderos' },
    { id: 'INSPECCION', label: 'Inspección de Viviendas' },
    { id: 'VISITA_DOMICILIARIA', label: 'Visita Domiciliaria' },
    { id: 'VIGILANCIA_ENTORNO', label: 'Vigilancia del Entorno' },
    { id: 'SEGUIMIENTO', label: 'Seguimiento de Foco' },
  ];

  const opcionesHallazgos = [
    'Recipientes con agua sin protección',
    'Depósitos con larvas identificadas',
    'Llantas en desuso acumuladas',
    'Basura y residuos estancados',
    'Agua estancada en canaletas o zanjas',
    'Vegetación densa favorable',
  ];

  const opcionesAcciones = [
    'Eliminación física de criaderos',
    'Aplicación de larvicida / Abate',
    'Orientación directa a la familia',
    'Protección y tapado de recipientes',
    'Limpieza y desobstrucción de canaletas',
    'Coordinación con líder comunal',
  ];

  const paso1Valido =
    comunidad.trim().length > 0 && sector.trim().length > 0 && viviendasInspeccionadas >= 1;
  const paso2Valido = hallazgos.length > 0 || acciones.length > 0;

  const handleSubmit = async () => {
    if (!paso1Valido || !paso2Valido) return;

    setGuardando(true);
    const ok = await onGuardar({
      fecha,
      comunidad: comunidad.trim(),
      sector: sector.trim(),
      referenciaUbicacion: referencia.trim() || null,
      tipoActividad,
      viviendasInspeccionadas,
      viviendasConHallazgos,
      hallazgos,
      accionesRealizadas: acciones,
      requiereSeguimiento,
      motivoSeguimiento: requiereSeguimiento ? motivoSeguimiento.trim() : null,
      fechaPropuestaSeguimiento: requiereSeguimiento ? fechaPropuestaSeguimiento : null,
      incluirEducacionSimultanea,
      temasEducacionSimultanea: incluirEducacionSimultanea
        ? ['Dengue: cómo prevenirlo desde casa', 'Criaderos de zancudos: qué revisar en tu hogar']
        : [],
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
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl h-155 max-h-[92vh] flex flex-col overflow-hidden">
        {/* Cabecera Fija */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/90 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/80">
              <Bug className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                Control y Vigilancia de Vectores
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Paso {paso} de 3 • {paso === 1 ? 'Ubicación e Inspección' : paso === 2 ? 'Hallazgos y Acciones' : 'Seguimiento y Cierre'}
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

        {/* Stepper Fijo */}
        <div className="px-5 py-2.5 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between gap-2 shrink-0">
          {[
            { num: 1, label: 'Ubicación e Inspección' },
            { num: 2, label: `Hallazgos y Acciones (${hallazgos.length})` },
            { num: 3, label: 'Seguimiento y Cierre' },
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
                      ? 'text-emerald-700'
                      : isCompleted
                      ? 'text-[#166E7A]'
                      : 'text-slate-400'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black transition ${
                      isCurrent
                        ? 'bg-emerald-700 text-white shadow-2xs'
                        : isCompleted
                        ? 'bg-teal-100 text-[#166E7A]'
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

        {/* Cuerpo Flexible */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* PASO 1 */}
          {paso === 1 && (
            <div key="paso-1" className="space-y-4 animate-in fade-in duration-200">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Tipo de Actividad Ambiental
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {tiposOpciones.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTipoActividad(t.id)}
                      className={`py-2 px-2.5 rounded-xl border text-center font-bold transition cursor-pointer ${
                        tipoActividad === t.id
                          ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Comunidad o Cantón
                  </label>
                  <input
                    type="text"
                    value={comunidad}
                    onChange={(e) => setComunidad(e.target.value)}
                    placeholder="Ej. Cantón San Pedro"
                    required
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Sector o Pasaje
                  </label>
                  <input
                    type="text"
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    placeholder="Ej. Pasaje Los Mangos"
                    required
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Referencia Territorial de la Zona (Opcional)
                </label>
                <input
                  type="text"
                  value={referencia}
                  onChange={(e) => setReferencia(e.target.value)}
                  placeholder="Ej. Cerca de la ermita o quebrada / Viviendas 1 a 12"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Home className="w-4 h-4 text-emerald-700" />
                  <span>Cobertura de la Intervención</span>
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      Viviendas Inspeccionadas
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={viviendasInspeccionadas}
                      onChange={(e) => setViviendasInspeccionadas(Math.max(1, parseInt(e.target.value, 10) || 1))}
                      required
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-rose-700 block mb-1">
                      Con Criaderos / Hallazgos
                    </label>
                    <input
                      type="number"
                      min="0"
                      max={viviendasInspeccionadas}
                      value={viviendasConHallazgos}
                      onChange={(e) =>
                        setViviendasConHallazgos(
                          Math.min(
                            viviendasInspeccionadas,
                            Math.max(0, parseInt(e.target.value, 10) || 0)
                          )
                        )
                      }
                      required
                      className="w-full px-3 py-2 text-xs bg-white border border-rose-300 rounded-xl focus:outline-none focus:border-rose-500 font-bold text-rose-700"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PASO 2 */}
          {paso === 2 && (
            <div key="paso-2" className="space-y-4 animate-in fade-in duration-200">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-800 block">
                    Hallazgos de Criaderos Identificados
                  </label>
                  <span className="text-[10px] font-bold text-rose-600">
                    {hallazgos.length} marcados
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {opcionesHallazgos.map((h) => {
                    const isChecked = hallazgos.includes(h);
                    return (
                      <div
                        key={h}
                        onClick={() => toggleArrayItem(setHallazgos, h)}
                        className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 cursor-pointer transition select-none ${
                          isChecked
                            ? 'bg-rose-50/70 border-rose-300 text-rose-900 font-bold'
                            : 'bg-slate-50/60 border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          readOnly
                          className="rounded text-rose-600 focus:ring-0 shrink-0 pointer-events-none"
                        />
                        <span className="leading-tight">{h}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-800 block">
                    Acciones de Control y Saneamiento Realizadas
                  </label>
                  <span className="text-[10px] font-bold text-emerald-700">
                    {acciones.length} marcadas
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {opcionesAcciones.map((a) => {
                    const isChecked = acciones.includes(a);
                    return (
                      <div
                        key={a}
                        onClick={() => toggleArrayItem(setAcciones, a)}
                        className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 cursor-pointer transition select-none ${
                          isChecked
                            ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 font-bold'
                            : 'bg-slate-50/60 border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          readOnly
                          className="rounded text-emerald-700 focus:ring-0 shrink-0 pointer-events-none"
                        />
                        <span className="leading-tight">{a}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* PASO 3 */}
          {paso === 3 && (
            <div key="paso-3" className="space-y-4 animate-in fade-in duration-200">
              <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-emerald-900 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{comunidad} • {sector}</span>
                  </span>
                  <span className="text-slate-500 font-semibold">{fecha}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-700">
                  <span>
                    Inspeccionadas: <strong>{viviendasInspeccionadas} viv.</strong>
                  </span>
                  <span className={viviendasConHallazgos > 0 ? 'text-rose-700 font-bold' : ''}>
                    Con criaderos: <strong>{viviendasConHallazgos}</strong>
                  </span>
                </div>
              </div>

              {/* Guías de dengue exclusivas */}
              <div className="p-3.5 rounded-2xl bg-teal-50/60 border border-teal-200 space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold text-[#166E7A] cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={incluirEducacionSimultanea}
                    onChange={(e) => setIncluirEducacionSimultanea(e.target.checked)}
                    className="rounded text-[#166E7A] focus:ring-0"
                  />
                  <span>Vincular orientación sanitaria sobre prevención de dengue</span>
                </label>
                {incluirEducacionSimultanea && (
                  <div className="pl-6 space-y-1 text-[11px] text-teal-900">
                    <p className="font-semibold">Se vincularán las guías oficiales de control de vectores:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <span className="px-2 py-0.5 rounded-md bg-white text-[#166E7A] border border-teal-200 font-bold flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        <span>Dengue: cómo prevenirlo desde casa</span>
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-white text-[#166E7A] border border-teal-200 font-bold flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        <span>Criaderos de zancudos: qué revisar en tu hogar</span>
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Seguimiento */}
              <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold text-amber-900 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={requiereSeguimiento}
                    onChange={(e) => setRequiereSeguimiento(e.target.checked)}
                    className="rounded text-amber-600 focus:ring-0"
                  />
                  <span>Requiere visita de seguimiento / reinspección territorial</span>
                </label>

                {requiereSeguimiento && (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <label className="text-[10.5px] font-bold text-slate-600 block mb-0.5">
                        Motivo del Seguimiento
                      </label>
                      <input
                        type="text"
                        value={motivoSeguimiento}
                        onChange={(e) => setMotivoSeguimiento(e.target.value)}
                        placeholder="Ej. Reinspección de foco larvario"
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-amber-300 rounded-xl focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10.5px] font-bold text-slate-600 block mb-0.5">
                        Fecha Propuesta
                      </label>
                      <input
                        type="date"
                        value={fechaPropuestaSeguimiento}
                        onChange={(e) => setFechaPropuestaSeguimiento(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-amber-300 rounded-xl focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Observaciones Ambientales
                </label>
                <textarea
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  rows={2}
                  placeholder="Detalles sobre acumulación de agua, colaboración de vecinos o acuerdos..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>
          )}
        </div>

        {/* Pie Fijo */}
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
              Cancelar
            </button>
          )}

          {paso < 3 ? (
            <button
              type="button"
              disabled={paso === 1 ? !paso1Valido : !paso2Valido}
              onClick={() => setPaso((p) => p + 1)}
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition active:scale-95 disabled:opacity-40 cursor-pointer"
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
              <span>{guardando ? 'Guardando...' : 'Guardar Control'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalNuevoControlVectores;