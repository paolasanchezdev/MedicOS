// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/promocion-prevencion/educacion-prevencion/ResumenEducacionPrevencionPage.tsx
// DESCRIPCIÓN: Panel principal rediseñado con tarjetas limpias y modal de detalle.
// =========================================================================

import React, { useState, useMemo } from 'react';
import { useEducacionPrevencion } from '../../../../../modules/health-education/hooks/useEducacionPrevencion';
import type {
  ActividadEducativaItem,
  ControlVectoresItem,
  ArticuloGuiaRef,
} from '../../../../../modules/health-education/types/health-education.types';
import { EducacionPrevencionHeader } from './components/EducacionPrevencionHeader';
import { EducacionPrevencionAccionesRapidas } from './components/EducacionPrevencionAccionesRapidas';
import { EducacionPrevencionMetricas, type EducacionTabType } from './components/EducacionPrevencionMetricas';
import { ModalNuevaActividadEducativa } from './components/ModalNuevaActividadEducativa';
import { ModalNuevoControlVectores } from './components/ModalNuevoControlVectores';
import { ModalDetalleActividad } from './components/ModalDetalleActividad';
import { ModalGuiaArticulo } from './components/ModalGuiaArticulo';
import {
  BookOpen,
  Bug,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Users,
  MapPin,
  Trash2,
  Eye,
  Home,
} from 'lucide-react';

interface TabItem {
  id: EducacionTabType;
  label: string;
}

type DetalleSeleccionado =
  | { tipo: 'educacion'; data: ActividadEducativaItem }
  | { tipo: 'vectores'; data: ControlVectoresItem };

export const ResumenEducacionPrevencionPage: React.FC = () => {
  const {
    pacientesPadron,
    actividadesEducativas,
    controlesVectores,
    metricas,
    loading,
    filtroTexto,
    registrarActividadEducativa,
    registrarControlVectores,
    eliminarActividad,
    recargar,
  } = useEducacionPrevencion();

  const [activeTab, setActiveTab] = useState<EducacionTabType>('todos');
  const [isModalEduOpen, setIsModalEduOpen] = useState<boolean>(false);
  const [isModalVecOpen, setIsModalVecOpen] = useState<boolean>(false);

  // Estados de modales de detalle y guía
  const [detalleActividad, setDetalleActividad] = useState<DetalleSeleccionado | null>(null);
  const [articuloGuiaModal, setArticuloGuiaModal] = useState<ArticuloGuiaRef | null>(null);

  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  const notificar = (msg: string) => {
    setMensajeExito(msg);
    setTimeout(() => setMensajeExito(null), 3500);
  };

  const eduFiltradas = useMemo(() => {
    const q = filtroTexto.toLowerCase().trim();
    if (!q) return actividadesEducativas;
    return actividadesEducativas.filter(
      (a) =>
        a.lugar.toLowerCase().includes(q) ||
        a.temasAbordados.some((t) => t.toLowerCase().includes(q)) ||
        (a.pacienteNombre && a.pacienteNombre.toLowerCase().includes(q))
    );
  }, [actividadesEducativas, filtroTexto]);

  const vecFiltrados = useMemo(() => {
    const q = filtroTexto.toLowerCase().trim();
    if (!q) return controlesVectores;
    return controlesVectores.filter(
      (v) =>
        v.comunidad.toLowerCase().includes(q) ||
        v.sector.toLowerCase().includes(q) ||
        v.hallazgos.some((h) => h.toLowerCase().includes(q))
    );
  }, [controlesVectores, filtroTexto]);

  const pendientesVectores = useMemo(
    () => controlesVectores.filter((v) => v.requiereSeguimiento),
    [controlesVectores]
  );

  const tabs: TabItem[] = [
    { id: 'todos', label: 'Resumen General' },
    { id: 'educacion', label: `Educación Sanitaria (${actividadesEducativas.length})` },
    { id: 'vectores', label: `Control de Vectores (${controlesVectores.length})` },
    { id: 'pendientes', label: `Pendientes de Seguimiento (${pendientesVectores.length})` },
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {mensajeExito && (
        <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{mensajeExito}</span>
        </div>
      )}

      {/* 1. Header Oficial */}
      <EducacionPrevencionHeader
        loading={loading}
        onActualizar={() => void recargar()}
        onNuevaEducacion={() => setIsModalEduOpen(true)}
        onNuevoVector={() => setIsModalVecOpen(true)}
      />

      {/* 2. Barra de 4 Acciones Rápidas */}
      <EducacionPrevencionAccionesRapidas
        onNuevaEducacion={() => setIsModalEduOpen(true)}
        onNuevoVector={() => setIsModalVecOpen(true)}
      />

      {/* 3. 4 Paneles de Métricas Reales */}
      <EducacionPrevencionMetricas
        metricas={metricas}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* 4. Selector de Pestañas */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 pb-1.5">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id)}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer ${
              activeTab === t.id
                ? 'bg-[#166E7A] text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 5. Vistas Específicas */}
      {loading ? (
        <div className="p-6 text-center text-xs text-slate-400">Cargando intervenciones territoriales...</div>
      ) : activeTab === 'pendientes' ? (
        /* VISTA DE PENDIENTES */
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                Sectores con Reinspección Ambiental Pendiente ({pendientesVectores.length})
              </h3>
            </div>
            <span className="text-[10px] font-bold text-slate-400">Vigilancia programada en territorio</span>
          </div>

          {pendientesVectores.length === 0 ? (
            <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center space-y-2 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-100">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-slate-800">No hay sectores pendientes de seguimiento</h4>
              <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                Todos los focos larvarios identificados han sido neutralizados y no requieren reinspección activa.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {pendientesVectores.map((v) => (
                <div
                  key={v.id}
                  className="p-4 rounded-2xl border border-rose-200 bg-rose-50/40 hover:bg-rose-50/70 transition shadow-2xs flex items-center justify-between gap-3"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase bg-rose-100 text-rose-700 border border-rose-200">
                        Reinspección
                      </span>
                      <span className="text-[11px] font-bold text-slate-500">{v.fecha}</span>
                    </div>

                    <h4 className="text-xs font-black text-slate-900 truncate">
                      {v.comunidad} • <span className="text-slate-600 font-semibold">{v.sector}</span>
                    </h4>

                    <p className="text-[11px] text-rose-900 font-medium truncate flex items-center gap-1">
                      <Clock className="w-3 h-3 text-rose-600 shrink-0" />
                      <span>{v.motivoSeguimiento || 'Condiciones ambientales por verificar'}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => setDetalleActividad({ tipo: 'vectores', data: v })}
                      className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition cursor-pointer flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <span>Detalle</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsModalVecOpen(true)}
                      className="px-3 py-1.5 rounded-xl bg-[#166E7A] hover:bg-[#105F68] text-white text-xs font-bold transition shadow-2xs cursor-pointer"
                    >
                      Reinspeccionar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* VISTA GENERAL / EDUCACIÓN / VECTORES CON TARJETAS LIMPIAS */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          
          {/* COLUMNA 1: EDUCACIÓN SANITARIA LIMPIA */}
          {(activeTab === 'todos' || activeTab === 'educacion') && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col">
              <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#166E7A]" />
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                    Educación Sanitaria ({eduFiltradas.length})
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalEduOpen(true)}
                  className="text-[11px] font-bold text-[#166E7A] hover:underline cursor-pointer"
                >
                  + Nueva Actividad
                </button>
              </div>

              {eduFiltradas.length === 0 ? (
                <div className="p-8 text-center space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#166E7A] flex items-center justify-center mx-auto border border-teal-100">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-800">No hay actividades registradas</h4>
                  <p className="text-[10.5px] text-slate-400 max-w-xs mx-auto">
                    Registra orientaciones individuales o charlas comunitarias con el catálogo oficial de guías.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsModalEduOpen(true)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#166E7A] text-white text-[11px] font-bold hover:bg-[#105F68] transition cursor-pointer"
                  >
                    <BookOpen className="w-3 h-3" />
                    <span>Registrar Actividad</span>
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 max-h-100 overflow-y-auto">
                  {eduFiltradas.map((e) => (
                    <div
                      key={e.id}
                      className="p-3.5 hover:bg-slate-50/70 transition flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-0.5 rounded-md text-[9px] font-extrabold bg-teal-50 text-[#166E7A] border border-teal-200">
                            {e.modalidad}
                          </span>
                          <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-1 truncate">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{e.lugar}</span>
                          </h4>
                          {e.sector && (
                            <span className="text-[10px] text-slate-400 truncate">({e.sector})</span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-[11px] text-slate-600">
                          <span className="flex items-center gap-1 font-semibold text-slate-700">
                            <Users className="w-3.5 h-3.5 text-purple-600" />
                            <span>{e.cantidadPersonas} personas</span>
                          </span>
                          <span className="text-slate-400">•</span>
                          <span className="text-slate-500 truncate">
                            {e.articulosGuia && e.articulosGuia.length > 0
                              ? `${e.articulosGuia.length} guía(s) oficial(es)`
                              : `${e.temasAbordados.length} tema(s)`}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] font-bold text-slate-400 hidden sm:inline">
                          {e.fecha}
                        </span>

                        <button
                          type="button"
                          onClick={() => setDetalleActividad({ tipo: 'educacion', data: e })}
                          className="px-2.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-500" />
                          <span>Ver Detalle</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => void eliminarActividad('educacion', e.id)}
                          title="Eliminar registro"
                          className="p-1.5 rounded-lg text-slate-300 hover:text-rose-600 transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* COLUMNA 2: CONTROL DE VECTORES LIMPIO */}
          {(activeTab === 'todos' || activeTab === 'vectores') && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col">
              <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                <div className="flex items-center gap-1.5">
                  <Bug className="w-3.5 h-3.5 text-emerald-700" />
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                    Control de Vectores ({vecFiltrados.length})
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalVecOpen(true)}
                  className="text-[11px] font-bold text-emerald-700 hover:underline cursor-pointer"
                >
                  + Nuevo Control
                </button>
              </div>

              {vecFiltrados.length === 0 ? (
                <div className="p-8 text-center space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-100">
                    <Bug className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-800">No hay controles de vectores registrados</h4>
                  <p className="text-[10.5px] text-slate-400 mt-0.5 max-w-xs mx-auto">
                    Registra inspecciones territoriales, eliminación de criaderos o saneamiento de focos.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsModalVecOpen(true)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-700 text-white text-[11px] font-bold hover:bg-emerald-800 transition cursor-pointer"
                  >
                    <Bug className="w-3 h-3" />
                    <span>Registrar Control</span>
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 max-h-100 overflow-y-auto">
                  {vecFiltrados.map((v) => (
                    <div
                      key={v.id}
                      className="p-3.5 hover:bg-slate-50/70 transition flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-0.5 rounded-md text-[9px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {v.tipoActividad.replace(/_/g, ' ')}
                          </span>
                          <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-1 truncate">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{v.comunidad}</span>
                          </h4>
                          <span className="text-[10px] text-slate-400 truncate">({v.sector})</span>
                        </div>

                        <div className="flex items-center gap-3 text-[11px] text-slate-600">
                          <span className="flex items-center gap-1 font-semibold text-slate-700">
                            <Home className="w-3.5 h-3.5 text-slate-500" />
                            <span>{v.viviendasInspeccionadas} viviendas</span>
                          </span>
                          <span className="text-slate-400">•</span>
                          <span
                            className={
                              v.viviendasConHallazgos > 0
                                ? 'font-bold text-rose-600'
                                : 'font-semibold text-emerald-700'
                            }
                          >
                            {v.viviendasConHallazgos > 0
                              ? `⚠️ ${v.viviendasConHallazgos} con criaderos`
                              : '✓ Sin criaderos'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] font-bold text-slate-400 hidden sm:inline">
                          {v.fecha}
                        </span>

                        <button
                          type="button"
                          onClick={() => setDetalleActividad({ tipo: 'vectores', data: v })}
                          className="px-2.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-500" />
                          <span>Ver Detalle</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => void eliminarActividad('vectores', v.id)}
                          title="Eliminar registro"
                          className="p-1.5 rounded-lg text-slate-300 hover:text-rose-600 transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Modales de Registro */}
      <ModalNuevaActividadEducativa
        isOpen={isModalEduOpen}
        onClose={() => setIsModalEduOpen(false)}
        pacientesPadron={pacientesPadron}
        onGuardar={async (dto) => {
          const ok = await registrarActividadEducativa(dto);
          if (ok) notificar('Actividad educativa registrada exitosamente.');
          return ok;
        }}
      />

      <ModalNuevoControlVectores
        isOpen={isModalVecOpen}
        onClose={() => setIsModalVecOpen(false)}
        onGuardar={async (dto) => {
          const ok = await registrarControlVectores(dto);
          if (ok) notificar('Control de vectores registrado e integrado a la jornada.');
          return ok;
        }}
      />

      {/* Modal para Consultar Ficha Completa */}
      <ModalDetalleActividad
        isOpen={detalleActividad !== null}
        onClose={() => setDetalleActividad(null)}
        item={detalleActividad}
        onAbrirGuiaArticulo={(art) => setArticuloGuiaModal(art)}
      />

      {/* Modal Guía Rápida de Artículo */}
      <ModalGuiaArticulo
        isOpen={articuloGuiaModal !== null}
        onClose={() => setArticuloGuiaModal(null)}
        articulo={articuloGuiaModal}
      />
    </div>
  );
};

export default ResumenEducacionPrevencionPage;