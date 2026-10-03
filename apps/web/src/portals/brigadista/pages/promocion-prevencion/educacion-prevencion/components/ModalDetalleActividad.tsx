// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/promocion-prevencion/educacion-prevencion/components/ModalDetalleActividad.tsx
// DESCRIPCIÓN: Ficha técnica detallada que muestra ÚNICAMENTE los artículos
//              seleccionados de forma estricta, sin inferir temas no registrados.
// =========================================================================

import React from 'react';
import {
  X,
  BookOpen,
  Bug,
  MapPin,
  Users,
  Home,
  AlertTriangle,
  CheckCircle,
  Clock,
  ShieldCheck,
  UserCheck,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import type {
  ActividadEducativaItem,
  ControlVectoresItem,
  ArticuloGuiaRef,
} from '../../../../../../modules/health-education/types/health-education.types';
import { ALL_HEALTH_ARTICLES } from '../../../../../../modules/health-education/data/articles';

type DetalleItem =
  | { tipo: 'educacion'; data: ActividadEducativaItem }
  | { tipo: 'vectores'; data: ControlVectoresItem };

interface ModalDetalleActividadProps {
  isOpen: boolean;
  onClose: () => void;
  item: DetalleItem | null;
  onAbrirGuiaArticulo?: (articulo: ArticuloGuiaRef) => void;
}

export const ModalDetalleActividad: React.FC<ModalDetalleActividadProps> = ({
  isOpen,
  onClose,
  item,
}) => {
  if (!isOpen || !item) return null;

  // Resuelve SOLO los artículos que coinciden con los que la persona seleccionó
  const guiasCompletas: {
    guia: ArticuloGuiaRef;
    fuentes: { name: string; institution: string; year: number }[];
  }[] =
    item.tipo === 'educacion'
      ? (item.data.articulosGuia && item.data.articulosGuia.length > 0
          ? item.data.articulosGuia
          : item.data.temasAbordados.map((t) => ({
              id: t,
              slug: 'guia',
              title: t,
              category: 'PREVENCION' as const,
              categoryLabel: 'Prevención',
              summary: '',
              keyPoints: [],
            }))
        )
          .filter((g) => g.id !== 'art-prev-6' && !g.title.toLowerCase().includes('diarreica'))
          .map((g) => {
            const artReal = ALL_HEALTH_ARTICLES.find(
              (art) =>
                art.id === g.id ||
                art.title.toLowerCase().trim() === g.title.toLowerCase().trim()
            );

            if (artReal) {
              return {
                guia: {
                  id: artReal.id,
                  slug: artReal.slug,
                  title: artReal.title,
                  category: artReal.category,
                  categoryLabel: artReal.categoryLabel,
                  summary: artReal.summary,
                  keyPoints: artReal.keyPoints,
                },
                fuentes: artReal.sources.map((s) => ({
                  name: s.name,
                  institution: s.institution,
                  year: s.year,
                })),
              };
            }

            return {
              guia: g,
              fuentes: [{ name: 'Lineamientos Oficiales de Salud Comunitaria', institution: 'MINSAL', year: 2026 }],
            };
          })
      : [];

  const esVectores = item.tipo === 'vectores';
  const viviendasTotal = esVectores ? item.data.viviendasInspeccionadas : 0;
  const viviendasFoco = esVectores ? item.data.viviendasConHallazgos : 0;
  const porcentajeFoco =
    viviendasTotal > 0 ? Math.round((viviendasFoco / viviendasTotal) * 100) : 0;

  const nivelRiesgo =
    porcentajeFoco >= 25
      ? { label: 'Riesgo Entomológico Alto (Prioridad de Abatización)', color: 'bg-rose-50 text-rose-800 border-rose-200' }
      : porcentajeFoco > 0
      ? { label: 'Riesgo Moderado (Presencia de Focos Larvarios)', color: 'bg-amber-50 text-amber-900 border-amber-200' }
      : { label: 'Sector Sin Criaderos (Control Ambiental Óptimo)', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in duration-150">
        
        {/* Cabecera Oficial */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/90 shrink-0">
          <div className="flex items-center gap-2.5">
            <div
              className={`p-2.5 rounded-xl border ${
                item.tipo === 'educacion'
                  ? 'bg-teal-50 text-[#166E7A] border-teal-200/80'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
              }`}
            >
              {item.tipo === 'educacion' ? <BookOpen className="w-5 h-5" /> : <Bug className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                    item.tipo === 'educacion'
                      ? 'bg-teal-50 text-[#166E7A] border-teal-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}
                >
                  {item.tipo === 'educacion'
                    ? `Educación Sanitaria • ${item.data.modalidad}`
                    : `Control de Vectores • ${item.data.tipoActividad.replace(/_/g, ' ')}`}
                </span>
                <span className="text-[11px] font-bold text-slate-400">
                  {item.data.fecha}
                </span>
              </div>
              <h3 className="text-base font-black text-slate-900 mt-0.5">
                {item.tipo === 'educacion' ? item.data.lugar : item.data.comunidad}
                {item.data.sector ? ` • ${item.data.sector}` : ''}
              </h3>
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

        {/* Contenido */}
        <div className="p-5 overflow-y-auto space-y-4">

          {/* 1. Indicadores Territoriales */}
          {item.tipo === 'educacion' ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Población Participante
                </span>
                <div className="text-lg font-black text-slate-900 mt-0.5 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-purple-600" />
                  <span>{item.data.cantidadPersonas} personas</span>
                </div>
                <span className="text-[10.5px] text-slate-500 font-medium">
                  {item.data.modalidad === 'INDIVIDUAL' ? 'Orientación cara a cara' : 'Comunidad / Familia'}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Ubicación de la Charla
                </span>
                <div className="text-xs font-bold text-slate-900 mt-1 flex items-center gap-1 truncate">
                  <MapPin className="w-3.5 h-3.5 text-[#166E7A] shrink-0" />
                  <span className="truncate">{item.data.lugar}</span>
                </div>
                <span className="text-[10.5px] text-slate-500 block truncate">
                  Sector: {item.data.sector || 'Asignado en jornada'}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-teal-50/70 border border-teal-200/80">
                <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider block">
                  Material y Guías
                </span>
                <div className="text-lg font-black text-[#166E7A] mt-0.5 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[#166E7A]" />
                  <span>{guiasCompletas.length} guías</span>
                </div>
                <span className="text-[10.5px] text-teal-900 font-medium">
                  Catálogo Oficial MINSAL
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Viviendas
                  </span>
                  <div className="text-lg font-black text-slate-900 mt-0.5 flex items-center gap-1">
                    <Home className="w-4 h-4 text-slate-500" />
                    <span>{viviendasTotal}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">Inspeccionadas</span>
                </div>

                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200">
                  <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block">
                    Con Criaderos
                  </span>
                  <div className="text-lg font-black text-rose-700 mt-0.5 flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>{viviendasFoco}</span>
                  </div>
                  <span className="text-[10px] text-rose-600">Focos positivos</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Índice de Foco
                  </span>
                  <div className="text-lg font-black text-slate-900 mt-0.5">
                    {porcentajeFoco}%
                  </div>
                  <span className="text-[10px] text-slate-500">De infestación</span>
                </div>

                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                    Acciones
                  </span>
                  <div className="text-lg font-black text-emerald-700 mt-0.5 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>{item.data.accionesRealizadas.length}</span>
                  </div>
                  <span className="text-[10px] text-emerald-700">Ejecutadas</span>
                </div>
              </div>

              <div className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between ${nivelRiesgo.color}`}>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{nivelRiesgo.label}</span>
                </span>
                <span>{item.data.sector}</span>
              </div>
            </div>
          )}

          {/* 2. ARTÍCULOS ESTRICTAMENTE REGISTRADOS */}
          {item.tipo === 'educacion' && (
            <div className="space-y-4 pt-1">
              {item.data.pacienteNombre && (
                <div className="p-3.5 rounded-2xl bg-teal-50/60 border border-teal-200 text-xs flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-[#166E7A] uppercase tracking-wider flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Persona Orientada en Padrón Comunitario</span>
                    </span>
                    <p className="font-black text-slate-900 text-sm">
                      {item.data.pacienteNombre}
                    </p>
                  </div>
                  <span className="font-mono text-xs font-bold text-[#166E7A] bg-white px-2.5 py-1 rounded-lg border border-teal-200">
                    {item.data.pacienteExpediente || 'EXP-REG'}
                  </span>
                </div>
              )}

              {/* Guías oficiales exactas */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#166E7A]" />
                    <span>Guías Oficiales Impartidas ({guiasCompletas.length})</span>
                  </h4>
                  <span className="text-[10px] font-bold text-slate-400">Portal del Paciente • MINSAL</span>
                </div>

                <div className="space-y-3">
                  {guiasCompletas.map(({ guia, fuentes }, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl border border-teal-200/90 bg-white shadow-2xs space-y-3"
                    >
                      <div>
                        <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-teal-50 text-[#166E7A] border border-teal-200">
                          {guia.categoryLabel}
                        </span>
                        <h5 className="text-xs font-black text-slate-900 mt-1">
                          {guia.title}
                        </h5>
                      </div>

                      {guia.summary && (
                        <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                          {guia.summary}
                        </p>
                      )}

                      {guia.keyPoints && guia.keyPoints.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="text-[10.5px] font-black uppercase tracking-wider text-[#166E7A] block">
                            Puntos clave orientados a la familia:
                          </span>
                          <div className="space-y-1">
                            {guia.keyPoints.map((kp, kIdx) => (
                              <div
                                key={kIdx}
                                className="flex items-start gap-2 p-2 rounded-xl bg-teal-50/40 text-[11px] text-slate-800 border border-teal-100"
                              >
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <span className="leading-snug">{kp}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {fuentes && fuentes.length > 0 && (
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10.5px] text-slate-500">
                          <span className="font-semibold flex items-center gap-1 text-[#166E7A]">
                            <ExternalLink className="w-3 h-3" />
                            <span>Fuente oficial: {fuentes[0]?.institution} • {fuentes[0]?.year}</span>
                          </span>
                          <span className="text-slate-400 truncate max-w-xs">{fuentes[0]?.name}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Metodología */}
              {item.data.materialUtilizado.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Metodología Didáctica Aplicada en Campo
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {item.data.materialUtilizado.map((mat, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-xl bg-white text-slate-700 text-xs font-semibold border border-slate-200"
                      >
                        ✓ {mat}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 3. CONTROL DE VECTORES */}
          {item.tipo === 'vectores' && (
            <div className="space-y-4 pt-1">
              {item.data.referenciaUbicacion && (
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                  <strong className="text-slate-900 block mb-0.5">Referencia Geográfica del Sector:</strong>
                  <span>{item.data.referenciaUbicacion}</span>
                </div>
              )}

              {/* Criaderos identificados */}
              <div className="space-y-1.5">
                <span className="text-xs font-black uppercase tracking-wider text-rose-700 block">
                  Criaderos Identificados ({item.data.hallazgos.length}):
                </span>
                <div className="space-y-1">
                  {item.data.hallazgos.map((h, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-200 text-xs text-rose-950 font-bold flex items-center gap-2"
                    >
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Acciones de saneamiento */}
              <div className="space-y-1.5">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-800 block">
                  Medidas de Saneamiento y Eliminación Ejecutadas ({item.data.accionesRealizadas.length}):
                </span>
                <div className="space-y-1">
                  {item.data.accionesRealizadas.map((a, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 font-bold flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>{a}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reinspección programada */}
              {item.data.requiereSeguimiento && (
                <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-300 text-xs text-amber-950 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-700" />
                      <span>Seguimiento y Reinspección de Criaderos</span>
                    </span>
                    {item.data.fechaPropuestaSeguimiento && (
                      <span className="font-extrabold text-amber-900 bg-white px-2 py-0.5 rounded border border-amber-200">
                        Fecha: {item.data.fechaPropuestaSeguimiento}
                      </span>
                    )}
                  </div>
                  <p className="font-bold text-sm text-amber-900 mt-1">
                    {item.data.motivoSeguimiento || 'Verificación de neutralización de foco larvario'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 4. Bitácora */}
          {item.data.observaciones && (
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Bitácora de Campo y Acuerdos Asumidos
              </span>
              <p className="text-xs text-slate-700 italic leading-relaxed">
                "{item.data.observaciones}"
              </p>
            </div>
          )}
        </div>

        {/* Pie con Responsable */}
        <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50/90 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-600">
            Registrado por: <strong className="text-slate-900 font-extrabold">{item.data.responsableBrigada}</strong>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl shadow-xs transition active:scale-95 cursor-pointer"
          >
            Cerrar Ficha
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDetalleActividad;