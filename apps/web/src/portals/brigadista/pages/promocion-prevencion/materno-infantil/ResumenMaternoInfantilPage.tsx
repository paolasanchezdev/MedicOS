// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/promocion-prevencion/materno-infantil/ResumenMaternoInfantilPage.tsx
// DESCRIPCIÓN: Panel operativo de Control Materno-Infantil de alta densidad:
//              sin duplicación, sin scroll forzado y con separación estricta de vistas.
// =========================================================================

import React, { useState, useMemo } from 'react';
import { useMaternoInfantil } from '../../../../../modules/maternal-health/hooks/useMaternoInfantil';
import type {
  TipoControlMaternoInfantil,
  AtencionPreventivaItem,
} from '../../../../../modules/maternal-health/types/materno-infantil.types';
import { MaternoInfantilHeader } from './components/MaternoInfantilHeader';
import { MaternoInfantilAccionesRapidas } from './components/MaternoInfantilAccionesRapidas';
import { MaternoInfantilMetricas, type TabType } from './components/MaternoInfantilMetricas';
import { MaternoInfantilAlertas } from './components/MaternoInfantilAlertas';
import { ModalCaptarGestante } from './components/ModalCaptarGestante';
import { ModalRegistrarNino } from './components/ModalRegistrarNino';
import { ModalRegistrarControl } from './components/ModalRegistrarControl';
import { ModalHistorialControles } from './components/ModalHistorialControles';
import { Users, Baby, CheckCircle2, UserPlus, History, Clock } from 'lucide-react';

interface TabItem {
  id: TabType;
  label: string;
}

function formatearFechaHumana(fechaStr?: string): string {
  if (!fechaStr) return '';
  const d = new Date(fechaStr);
  if (isNaN(d.getTime())) return fechaStr;
  return d.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export const ResumenMaternoInfantilPage: React.FC = () => {
  const {
    gestantes,
    ninos,
    candidatasGestantes,
    adultosTutoresDisponibles,
    historialGlobal,
    metricas,
    loading,
    filtroTexto,
    captarGestante,
    registrarNino,
    registrarControl,
    recargar,
  } = useMaternoInfantil();

  const [activeTab, setActiveTab] = useState<TabType>('todos');
  const [isCaptarModalOpen, setIsCaptarModalOpen] = useState<boolean>(false);
  const [isRegistrarNinoModalOpen, setIsRegistrarNinoModalOpen] = useState<boolean>(false);

  // Modal: Registrar Control
  const [modalControl, setModalControl] = useState<{
    isOpen: boolean;
    tipo: TipoControlMaternoInfantil;
    pacienteId: string;
    pacienteNombre: string;
    expediente?: string;
    semanasActuales?: number;
  }>({
    isOpen: false,
    tipo: 'materno',
    pacienteId: '',
    pacienteNombre: '',
  });

  // Modal: Historial de Controles
  const [modalHistorial, setModalHistorial] = useState<{
    isOpen: boolean;
    nombrePaciente: string;
    expediente: string;
    subtitulo: string;
    atenciones: AtencionPreventivaItem[];
    tipo: TipoControlMaternoInfantil;
    pacienteId: string;
  }>({
    isOpen: false,
    nombrePaciente: '',
    expediente: '',
    subtitulo: '',
    atenciones: [],
    tipo: 'materno',
    pacienteId: '',
  });

  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  const notificar = (msg: string) => {
    setMensajeExito(msg);
    setTimeout(() => setMensajeExito(null), 3500);
  };

  const gestantesFiltradas = useMemo(() => {
    const q = filtroTexto.toLowerCase().trim();
    if (!q) return gestantes;
    return gestantes.filter(
      (g) => g.nombreCompleto.toLowerCase().includes(q) || g.dui.includes(q)
    );
  }, [gestantes, filtroTexto]);

  const ninosFiltrados = useMemo(() => {
    const q = filtroTexto.toLowerCase().trim();
    if (!q) return ninos;
    return ninos.filter(
      (n) =>
        n.nombreCompleto.toLowerCase().includes(q) ||
        n.tutorNombre.toLowerCase().includes(q) ||
        n.expediente.toLowerCase().includes(q)
    );
  }, [ninos, filtroTexto]);

  const gestantesPendientes = useMemo(
    () => gestantes.filter((g) => g.requiereAtencion),
    [gestantes]
  );
  const ninosPendientes = useMemo(
    () => ninos.filter((n) => n.requiereAtencion),
    [ninos]
  );

  const abrirControl = (
    tipo: TipoControlMaternoInfantil,
    pacienteId: string,
    nombre: string,
    expediente?: string,
    semanas?: number
  ) => {
    setModalControl({
      isOpen: true,
      tipo,
      pacienteId,
      pacienteNombre: nombre,
      expediente,
      semanasActuales: semanas,
    });
  };

  const abrirHistorial = (
    tipo: TipoControlMaternoInfantil,
    pacienteId: string,
    nombre: string,
    expediente: string,
    subtitulo: string
  ) => {
    const atenciones = historialGlobal.filter((a) => a.pacienteId === pacienteId);
    setModalHistorial({
      isOpen: true,
      nombrePaciente: nombre,
      expediente,
      subtitulo,
      atenciones,
      tipo,
      pacienteId,
    });
  };

  const tabs: TabItem[] = [
    { id: 'todos', label: 'Resumen General' },
    { id: 'materno', label: `Gestantes (${gestantes.length})` },
    { id: 'infantil', label: `Niños (${ninos.length})` },
    { id: 'alertas', label: `Alertas y Pendientes (${metricas.controlesPendientes})` },
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {mensajeExito && (
        <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{mensajeExito}</span>
        </div>
      )}

      {/* 1. Header Oficial Compacto */}
      <MaternoInfantilHeader
        loading={loading}
        onActualizar={() => void recargar()}
        onCaptarGestante={() => setIsCaptarModalOpen(true)}
        onRegistrarNino={() => setIsRegistrarNinoModalOpen(true)}
        onNuevoControl={() => {
          if (gestantes.length > 0) {
            const g = gestantes[0];
            if (g) abrirControl('materno', g.pacienteId, g.nombreCompleto, g.expediente, g.semanasGestacion);
          } else if (ninos.length > 0) {
            const n = ninos[0];
            if (n) abrirControl('infantil', n.pacienteId, n.nombreCompleto, n.expediente);
          } else {
            setIsCaptarModalOpen(true);
          }
        }}
      />

      {/* 2. Barra de 4 Acciones Rápidas */}
      <MaternoInfantilAccionesRapidas
        onCaptarGestante={() => setIsCaptarModalOpen(true)}
        onRegistrarNino={() => setIsRegistrarNinoModalOpen(true)}
      />

      {/* 3. Métricas Oficiales de 4 Paneles */}
      <MaternoInfantilMetricas
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

      {/* 5. VISTA ESPECÍFICA (SIN DUPLICACIONES) */}
      {loading ? (
        <div className="p-6 text-center text-xs text-slate-400">Cargando censo territorial...</div>
      ) : activeTab === 'alertas' ? (
        /* VISTA 1: EXCLUSIVA PARA ALERTAS Y PENDIENTES */
        <MaternoInfantilAlertas
          gestantesPendientes={gestantesPendientes}
          ninosPendientes={ninosPendientes}
          onRegistrarControl={(tipo, id, nombre, exp, sem) => abrirControl(tipo, id, nombre, exp, sem)}
          onVerHistorial={(tipo, id, nombre, exp, sub) => abrirHistorial(tipo, id, nombre, exp, sub)}
        />
      ) : (
        /* VISTA 2: RESUMEN GENERAL, GESTANTES O NIÑOS EN 2 COLUMNAS SIN DUPLICAR */
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* COLUMNA GESTANTES */}
            {(activeTab === 'todos' || activeTab === 'materno') && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col">
                <div className="p-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#166E7A]" />
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                      Control Materno • Gestantes ({gestantesFiltradas.length})
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsCaptarModalOpen(true)}
                    className="text-[11px] font-bold text-[#166E7A] hover:underline cursor-pointer"
                  >
                    + Captar Gestante
                  </button>
                </div>

                {gestantesFiltradas.length === 0 ? (
                  <div className="p-6 text-center space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#166E7A] flex items-center justify-center mx-auto border border-teal-100">
                      <UserPlus className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">No hay gestantes en seguimiento</h4>
                      <p className="text-[10.5px] text-slate-400 mt-0.5">
                        Capta a una paciente femenina del padrón comunitario para iniciar su ficha prenatal.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsCaptarModalOpen(true)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#166E7A] text-white text-[11px] font-bold hover:bg-[#105F68] transition cursor-pointer"
                    >
                      <UserPlus className="w-3 h-3" />
                      <span>Captar Gestante</span>
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
                    {gestantesFiltradas.map((g) => (
                      <div key={g.id} className="p-3 hover:bg-slate-50/80 transition flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="text-xs font-bold text-slate-900 truncate">{g.nombreCompleto}</h4>
                            <span className="font-mono text-[9.5px] font-bold text-[#166E7A] bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200">
                              {g.expediente}
                            </span>
                            {g.requiereAtencion && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-rose-50 text-rose-600 border border-rose-200">
                                Alerta
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                            {g.edad} años • <strong className="text-[#166E7A]">{g.semanasGestacion} sem</strong> • FPP: {formatearFechaHumana(g.fechaProbableParto)}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate mt-0.5">
                            {g.direccion} • Controles: <strong className="text-slate-700">{g.totalControlesRealizados}</strong>
                          </p>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() =>
                              abrirHistorial(
                                'materno',
                                g.pacienteId,
                                g.nombreCompleto,
                                g.expediente,
                                `${g.edad} años • Gestante (${g.semanasGestacion} sem)`
                              )
                            }
                            className="px-2 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-[11px] font-semibold transition cursor-pointer flex items-center gap-1"
                          >
                            <History className="w-3 h-3 text-slate-500" />
                            <span>Historial</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => abrirControl('materno', g.pacienteId, g.nombreCompleto, g.expediente, g.semanasGestacion)}
                            className="px-2.5 py-1 rounded-lg bg-[#166E7A] hover:bg-[#105F68] text-white text-[11px] font-bold transition shadow-2xs cursor-pointer"
                          >
                            + Control
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* COLUMNA NIÑOS CON EXPEDIENTE Y TUTOR */}
            {(activeTab === 'todos' || activeTab === 'infantil') && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col">
                <div className="p-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                  <div className="flex items-center gap-1.5">
                    <Baby className="w-3.5 h-3.5 text-emerald-700" />
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                      Control Infantil • Expedientes ({ninosFiltrados.length})
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsRegistrarNinoModalOpen(true)}
                    className="text-[11px] font-bold text-emerald-700 hover:underline cursor-pointer"
                  >
                    + Inscribir Niño
                  </button>
                </div>

                {ninosFiltrados.length === 0 ? (
                  <div className="p-6 text-center space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-100">
                      <Baby className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">No hay niños inscritos con tutor</h4>
                      <p className="text-[10.5px] text-slate-400 mt-0.5">
                        Inscribe a un menor conectándolo formalmente a un adulto autorizado del padrón.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsRegistrarNinoModalOpen(true)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-700 text-white text-[11px] font-bold hover:bg-emerald-800 transition cursor-pointer"
                    >
                      <Baby className="w-3 h-3" />
                      <span>Inscribir Niño</span>
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
                    {ninosFiltrados.map((n) => (
                      <div key={n.id} className="p-3 hover:bg-slate-50/80 transition flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="text-xs font-bold text-slate-900 truncate">{n.nombreCompleto}</h4>
                            <span className="font-mono text-[9.5px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                              {n.expediente}
                            </span>
                            {n.requiereAtencion && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-amber-50 text-amber-700 border border-amber-200">
                                Pendiente
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-600 mt-0.5 truncate">
                            Edad: <strong className="text-emerald-700">{n.edadTexto}</strong> ({formatearFechaHumana(n.fechaNacimiento)})
                          </p>
                          <p className="text-[10.5px] text-slate-500 font-medium mt-0.5 flex items-center gap-1 truncate">
                            <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 text-[9.5px] font-semibold">
                              {n.tutorParentesco}
                            </span>
                            <span>Tutor: {n.tutorNombre}</span>
                            <span className="text-slate-400 font-normal">• Tel: {n.tutorTelefono}</span>
                          </p>
                          <p className="text-[10px] text-slate-400 truncate mt-0.5">
                            {n.direccion} • Controles: <strong className="text-slate-700">{n.totalControlesRealizados}</strong>
                          </p>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() =>
                              abrirHistorial(
                                'infantil',
                                n.pacienteId,
                                n.nombreCompleto,
                                n.expediente,
                                `Edad: ${n.edadTexto} • Tutor: ${n.tutorNombre} (${n.tutorParentesco})`
                              )
                            }
                            className="px-2 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-[11px] font-semibold transition cursor-pointer flex items-center gap-1"
                          >
                            <History className="w-3 h-3 text-slate-500" />
                            <span>Historial</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => abrirControl('infantil', n.pacienteId, n.nombreCompleto, n.expediente)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold transition shadow-2xs cursor-pointer"
                          >
                            + Control
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Historial General Compacto */}
          {historialGlobal.length > 0 && activeTab === 'todos' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-3.5 space-y-2">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#166E7A]" />
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                  Últimas Atenciones Preventivas en Territorio
                </h3>
              </div>

              <div className="divide-y divide-slate-100">
                {historialGlobal.slice(0, 4).map((atn) => (
                  <div key={atn.id} className="py-2 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-800 mr-2">
                        {atn.tipo === 'materno' ? '🤰 Control Prenatal' : '👶 Control Pediátrico'}
                      </span>
                      <span className="text-slate-400 text-[11px]">{atn.fechaControl}</span>
                      {atn.observaciones && <p className="text-slate-500 text-[10.5px] italic mt-0.5">{atn.observaciones}</p>}
                    </div>
                    <span className="px-2 py-0.5 rounded-md text-[9.5px] font-bold bg-slate-100 text-slate-700">
                      {atn.desenlace}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modales */}
      <ModalCaptarGestante
        isOpen={isCaptarModalOpen}
        onClose={() => setIsCaptarModalOpen(false)}
        candidatas={candidatasGestantes}
        onCaptar={async (dto) => {
          const ok = await captarGestante(dto);
          if (ok) notificar('Gestante incorporada exitosamente al seguimiento prenatal.');
          return ok;
        }}
      />

      <ModalRegistrarNino
        isOpen={isRegistrarNinoModalOpen}
        onClose={() => setIsRegistrarNinoModalOpen(false)}
        tutoresDisponibles={adultosTutoresDisponibles}
        onRegistrar={async (dto) => {
          const ok = await registrarNino(dto);
          if (ok) notificar('Expediente pediátrico registrado y vinculado al tutor autorizado.');
          return ok;
        }}
      />

      <ModalRegistrarControl
        isOpen={modalControl.isOpen}
        onClose={() => setModalControl((prev) => ({ ...prev, isOpen: false }))}
        tipo={modalControl.tipo}
        pacienteId={modalControl.pacienteId}
        pacienteNombre={modalControl.pacienteNombre}
        expediente={modalControl.expediente}
        semanasActuales={modalControl.semanasActuales}
        onGuardar={async (dto) => {
          const ok = await registrarControl(dto);
          if (ok) notificar('Atención preventiva registrada y sincronizada en el expediente.');
          return ok;
        }}
      />

      <ModalHistorialControles
        isOpen={modalHistorial.isOpen}
        onClose={() => setModalHistorial((prev) => ({ ...prev, isOpen: false }))}
        nombrePaciente={modalHistorial.nombrePaciente}
        expediente={modalHistorial.expediente}
        subtitulo={modalHistorial.subtitulo}
        atenciones={modalHistorial.atenciones}
        onNuevoControl={() => {
          abrirControl(modalHistorial.tipo, modalHistorial.pacienteId, modalHistorial.nombrePaciente, modalHistorial.expediente);
        }}
      />
    </div>
  );
};

export default ResumenMaternoInfantilPage;