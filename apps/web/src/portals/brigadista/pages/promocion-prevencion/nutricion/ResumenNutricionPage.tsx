// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/promocion-prevencion/nutricion/ResumenNutricionPage.tsx
// DESCRIPCIÓN: Panel principal de Vigilancia Nutricional Comunitaria con soporte
//              para ver/editar fichas y tipado estricto sin tipos any.
// =========================================================================

import React, { useState, useMemo } from 'react';
import { useVigilanciaNutricional } from '../../../../../modules/nutrition/hooks/useVigilanciaNutricional';
import type { PersonaVigilanciaItem } from '../../../../../modules/nutrition/types/nutrition.types';
import { NutricionHeader } from './components/NutricionHeader';
import { NutricionAccionesRapidas } from './components/NutricionAccionesRapidas';
import { NutricionMetricas, type NutricionTabType } from './components/NutricionMetricas';
import { NutricionAlertas } from './components/NutricionAlertas';
import { ModalRegistrarControlNutricional } from './components/ModalRegistrarControlNutricional';
import { ModalInscribirSeguimiento } from './components/ModalInscribirSeguimiento';
import { ModalHistorialNutricional } from './components/ModalHistorialNutricional';
import { ModalFichaNutricional } from './components/ModalFichaNutricional';
import {
  Users,
  Scale,
  CheckCircle2,
  History,
  TrendingUp,
  TrendingDown,
  Calendar,
  AlertTriangle,
  User,
  Plus,
  FileText,
} from 'lucide-react';

interface TabItem {
  id: NutricionTabType;
  label: string;
}

interface CensoNutriStorageRecord {
  grupo?: string;
  motivo?: string;
  proximoControl?: string;
  tutorNombre?: string;
  enSeguimiento?: boolean;
}

export const ResumenNutricionPage: React.FC = () => {
  const {
    pacientesPadron,
    personasVigilancia,
    metricas,
    loading,
    filtroTexto,
    inscribirSeguimiento,
    registrarControl,
    recargar,
  } = useVigilanciaNutricional();

  const [activeTab, setActiveTab] = useState<NutricionTabType>('todos');
  const [isInscribirModalOpen, setIsInscribirModalOpen] = useState<boolean>(false);

  // Modal: Registrar Control Nutricional
  const [modalControl, setModalControl] = useState<{
    isOpen: boolean;
    pacienteId: string;
    pacienteNombre: string;
    expediente?: string;
    pesoAnteriorKg?: number | null;
    grupoEtario?: string;
    edadTexto?: string;
  }>({
    isOpen: false,
    pacienteId: '',
    pacienteNombre: '',
  });

  // Modal: Historial Nutricional
  const [personaHistorial, setPersonaHistorial] = useState<PersonaVigilanciaItem | null>(null);

  // Modal: Ficha Completa y Edición
  const [personaFicha, setPersonaFicha] = useState<PersonaVigilanciaItem | null>(null);

  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  const notificar = (msg: string) => {
    setMensajeExito(msg);
    setTimeout(() => setMensajeExito(null), 3500);
  };

  const personasFiltradas = useMemo(() => {
    const q = filtroTexto.toLowerCase().trim();
    if (!q) return personasVigilancia;
    return personasVigilancia.filter(
      (p) =>
        p.nombreCompleto.toLowerCase().includes(q) ||
        p.expediente.toLowerCase().includes(q) ||
        (p.tutorNombre && p.tutorNombre.toLowerCase().includes(q))
    );
  }, [personasVigilancia, filtroTexto]);

  const personasEnSeguimiento = useMemo(
    () => personasFiltradas.filter((p) => p.enSeguimientoActivo),
    [personasFiltradas]
  );

  const personasAlerta = useMemo(
    () => personasFiltradas.filter((p) => p.requiereAtencion),
    [personasFiltradas]
  );

  const abrirControl = (
    pacienteId: string,
    nombre: string,
    expediente: string,
    pesoAnterior?: number | null,
    grupoEtario?: string,
    edadTexto?: string
  ) => {
    setModalControl({
      isOpen: true,
      pacienteId,
      pacienteNombre: nombre,
      expediente,
      pesoAnteriorKg: pesoAnterior,
      grupoEtario,
      edadTexto,
    });
  };

  // Función para editar la ficha nutricional
  const actualizarFichaNutricional = async (
    pacienteId: string,
    datos: {
      grupoEtario?: string;
      motivoIngreso?: string;
      proximoControl?: string;
      tutorNombre?: string;
      enSeguimientoActivo?: boolean;
    }
  ): Promise<boolean> => {
    try {
      const rawNutri = localStorage.getItem('medicos_nutricion_seguimiento_territorio');
      let censoMap: Record<string, CensoNutriStorageRecord> = {};
      if (rawNutri) {
        try {
          censoMap = JSON.parse(rawNutri);
        } catch {
          // parse fallback
        }
      }

      const prev = censoMap[pacienteId] || {};
      censoMap[pacienteId] = {
        ...prev,
        grupo: datos.grupoEtario || prev.grupo || 'PRIMERA_INFANCIA',
        motivo: datos.motivoIngreso || prev.motivo || 'Vigilancia nutricional',
        proximoControl: datos.proximoControl || prev.proximoControl || '2026-10-15',
        tutorNombre: datos.tutorNombre !== undefined ? datos.tutorNombre : prev.tutorNombre || '',
        enSeguimiento: datos.enSeguimientoActivo !== undefined ? datos.enSeguimientoActivo : true,
      };

      localStorage.setItem('medicos_nutricion_seguimiento_territorio', JSON.stringify(censoMap));
      await recargar();
      notificar('Ficha nutricional actualizada exitosamente.');
      return true;
    } catch {
      return false;
    }
  };

  const tabs: TabItem[] = [
    { id: 'todos', label: `Censo General (${personasVigilancia.length})` },
    { id: 'seguimiento', label: `En Seguimiento Activo (${metricas.enSeguimientoTotal})` },
    { id: 'alertas', label: `Alertas Nutricionales (${metricas.alertasTotal})` },
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
      <NutricionHeader
        loading={loading}
        onActualizar={() => void recargar()}
        onInscribir={() => setIsInscribirModalOpen(true)}
        onNuevoControl={() => {
          if (personasVigilancia.length > 0) {
            const p = personasVigilancia[0];
            if (p) abrirControl(p.pacienteId, p.nombreCompleto, p.expediente, p.pesoActualKg, p.grupoEtario, p.edadTexto);
          } else {
            setIsInscribirModalOpen(true);
          }
        }}
      />

      {/* 2. Barra de 4 Acciones Rápidas */}
      <NutricionAccionesRapidas
        onNuevoControl={() => {
          if (personasVigilancia.length > 0) {
            const p = personasVigilancia[0];
            if (p) abrirControl(p.pacienteId, p.nombreCompleto, p.expediente, p.pesoActualKg, p.grupoEtario, p.edadTexto);
          } else {
            setIsInscribirModalOpen(true);
          }
        }}
        onInscribir={() => setIsInscribirModalOpen(true)}
      />

      {/* 3. 4 Paneles de Métricas */}
      <NutricionMetricas
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
        <div className="p-8 text-center text-xs text-slate-400">Cargando vigilancia comunitaria...</div>
      ) : activeTab === 'alertas' ? (
        <NutricionAlertas
          personasAlerta={personasAlerta}
          onRegistrarControl={(pId, nombre, exp) => abrirControl(pId, nombre, exp)}
          onVerHistorial={(persona) => setPersonaHistorial(persona)}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          
          {/* COLUMNA 1: EN SEGUIMIENTO ACTIVO */}
          <div className="bg-white rounded-3xl border border-[#D3E8EC] shadow-2xs overflow-hidden flex flex-col">
            <div className="px-4 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/90">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-teal-50 text-[#166E7A] border border-teal-200 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-[#1A282D] uppercase tracking-wider">
                    En Seguimiento Activo ({personasEnSeguimiento.length})
                  </h3>
                  <span className="text-[10px] text-medicos-muted font-medium block">
                    Personas en control periódico por peso o vulnerabilidad
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsInscribirModalOpen(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-teal-50 hover:bg-teal-100 text-[#166E7A] border border-teal-200 text-xs font-bold transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Enrolar</span>
              </button>
            </div>

            {personasEnSeguimiento.length === 0 ? (
              <div className="p-10 text-center space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-slate-50 text-slate-400 border border-slate-200 flex items-center justify-center mx-auto">
                  <Users className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-slate-700">Sin personas en seguimiento activo</p>
                <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                  Enrola a personas del padrón con bajo peso o desnutrición para programar su vigilancia periódica.
                </p>
              </div>
            ) : (
              <div className="p-3.5 space-y-3 max-h-130 overflow-y-auto bg-[#FAF8F5]/60">
                {personasEnSeguimiento.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 rounded-2xl bg-white border border-[#D3E8EC] shadow-2xs hover:shadow-xs transition space-y-3"
                  >
                    {/* Fila 1: Nombre, Expediente y Badge de Alerta */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-black text-[#1A282D] truncate">
                            {p.nombreCompleto}
                          </h4>
                          <span className="font-mono text-[10px] font-bold text-[#166E7A] bg-teal-50 px-2 py-0.5 rounded border border-teal-200 shrink-0">
                            {p.expediente}
                          </span>
                        </div>
                        <p className="text-xs text-medicos-muted font-semibold flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{p.edadTexto}</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-[#166E7A] font-bold">{p.grupoEtario}</span>
                        </p>
                      </div>

                      {p.requiereAtencion && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9.5px] font-black uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200 shrink-0">
                          <AlertTriangle className="w-3 h-3 text-rose-600" />
                          <span>Alerta</span>
                        </span>
                      )}
                    </div>

                    {/* Fila 2: Indicadores Antropométricos */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                      <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/70">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Peso Actual
                        </span>
                        <span className="text-xs font-black text-slate-800">
                          {p.pesoActualKg ? `${p.pesoActualKg} kg` : 'Sin registro'}
                        </span>
                      </div>

                      <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/70">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          IMC / Estado
                        </span>
                        <span className="text-xs font-black text-slate-800">
                          {p.imcActual ? `IMC: ${p.imcActual}` : 'Pendiente'}
                        </span>
                      </div>

                      <div className="p-2 rounded-xl bg-teal-50/70 border border-teal-200/80 col-span-2 sm:col-span-1">
                        <span className="text-[10px] font-bold text-[#166E7A] uppercase tracking-wider block">
                          Próximo Control
                        </span>
                        <span className="text-xs font-black text-[#166E7A] flex items-center gap-1 truncate">
                          <Calendar className="w-3 h-3 shrink-0" />
                          <span className="truncate">{p.proximoControl || 'Por agendar'}</span>
                        </span>
                      </div>
                    </div>

                    {/* Fila 3: Motivo de Vigilancia */}
                    {p.motivoIngreso && (
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-700 space-y-0.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Condición o Motivo de Ingreso:
                        </span>
                        <p className="font-semibold text-slate-800 leading-snug">
                          {p.motivoIngreso}
                        </p>
                      </div>
                    )}

                    {/* Fila 4: Botones con Ver/Editar Ficha */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => setPersonaFicha(p)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-[#166E7A] border border-slate-200 text-xs font-bold transition cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-[#166E7A]" />
                        <span>Ver / Editar Ficha</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setPersonaHistorial(p)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition cursor-pointer shadow-2xs"
                        >
                          <History className="w-3.5 h-3.5 text-slate-500" />
                          <span>Historial</span>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            abrirControl(
                              p.pacienteId,
                              p.nombreCompleto,
                              p.expediente,
                              p.pesoActualKg,
                              p.grupoEtario,
                              p.edadTexto
                            )
                          }
                          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#166E7A] hover:bg-[#105F68] text-white text-xs font-black transition shadow-xs active:scale-95 cursor-pointer"
                        >
                          <Scale className="w-3.5 h-3.5" />
                          <span>+ Registrar Control</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* COLUMNA 2: CENSO Y EVALUACIONES */}
          <div className="bg-white rounded-3xl border border-[#D3E8EC] shadow-2xs overflow-hidden flex flex-col">
            <div className="px-4 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/90">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
                  <Scale className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-[#1A282D] uppercase tracking-wider">
                    Censo y Evaluaciones ({personasFiltradas.length})
                  </h3>
                  <span className="text-[10px] text-medicos-muted font-medium block">
                    Padrón poblacional y registros antropométricos
                  </span>
                </div>
              </div>
              <span className="font-mono text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Padrón Nominal
              </span>
            </div>

            {personasFiltradas.length === 0 ? (
              <div className="p-10 text-center space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-slate-50 text-slate-400 border border-slate-200 flex items-center justify-center mx-auto">
                  <Scale className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-slate-700">Sin personas en este filtro</p>
                <p className="text-[11px] text-slate-400">
                  No se encontraron registros para el criterio de búsqueda seleccionado.
                </p>
              </div>
            ) : (
              <div className="p-3.5 space-y-3 max-h-130 overflow-y-auto bg-[#FAF8F5]/60">
                {personasFiltradas.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 rounded-2xl bg-white border border-[#D3E8EC] shadow-2xs hover:shadow-xs transition space-y-3"
                  >
                    {/* Fila 1: Nombre, Expediente y Badge de Estado */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-black text-[#1A282D] truncate">
                            {p.nombreCompleto}
                          </h4>
                          <span className="font-mono text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 shrink-0">
                            {p.expediente}
                          </span>
                        </div>
                        <p className="text-xs text-medicos-muted font-semibold flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{p.edadTexto}</span>
                          {p.grupoEtario && (
                            <>
                              <span className="text-slate-300">•</span>
                              <span className="text-slate-700 font-bold">{p.grupoEtario}</span>
                            </>
                          )}
                        </p>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded-md text-[9.5px] font-black uppercase tracking-wider border shrink-0 ${
                          p.enSeguimientoActivo
                            ? 'bg-teal-50 text-[#166E7A] border-teal-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {p.enSeguimientoActivo ? 'En Seguimiento' : 'Censo General'}
                      </span>
                    </div>

                    {/* Fila 2: Última Evaluación y Variación */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-0.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Último Control Realizado
                        </span>
                        <span className="text-xs font-bold text-slate-800 block truncate">
                          {p.ultimoControl}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-0.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Variación Ponderal
                        </span>
                        {p.cambioUltimoControlKg !== null && p.cambioUltimoControlKg !== undefined ? (
                          p.cambioUltimoControlKg > 0 ? (
                            <span className="text-xs font-black text-emerald-700 flex items-center gap-1">
                              <TrendingUp className="w-3.5 h-3.5" /> +{p.cambioUltimoControlKg} kg
                            </span>
                          ) : p.cambioUltimoControlKg < 0 ? (
                            <span className="text-xs font-black text-rose-700 flex items-center gap-1">
                              <TrendingDown className="w-3.5 h-3.5" /> {p.cambioUltimoControlKg} kg
                            </span>
                          ) : (
                            <span className="text-xs font-bold text-slate-600">Sin variación (0 kg)</span>
                          )
                        ) : (
                          <span className="text-xs font-medium text-slate-400">Sin evaluación previa</span>
                        )}
                      </div>
                    </div>

                    {/* Fila 3: Botones de Acción con Ver Ficha */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => setPersonaFicha(p)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-[#166E7A] border border-slate-200 text-xs font-bold transition cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-[#166E7A]" />
                        <span>Ver Ficha</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setPersonaHistorial(p)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition cursor-pointer shadow-2xs"
                        >
                          <History className="w-3.5 h-3.5 text-slate-500" />
                          <span>Historial</span>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            abrirControl(
                              p.pacienteId,
                              p.nombreCompleto,
                              p.expediente,
                              p.pesoActualKg,
                              p.grupoEtario,
                              p.edadTexto
                            )
                          }
                          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black transition shadow-xs active:scale-95 cursor-pointer"
                        >
                          <Scale className="w-3.5 h-3.5" />
                          <span>+ Control</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modales */}
      <ModalInscribirSeguimiento
        isOpen={isInscribirModalOpen}
        onClose={() => setIsInscribirModalOpen(false)}
        pacientesDisponibles={pacientesPadron}
        onInscribir={async (dto) => {
          const ok = await inscribirSeguimiento(dto);
          if (ok) notificar('Persona enrolada exitosamente en vigilancia nutricional activa.');
          return ok;
        }}
      />

      <ModalRegistrarControlNutricional
        isOpen={modalControl.isOpen}
        onClose={() => setModalControl((prev) => ({ ...prev, isOpen: false }))}
        pacienteId={modalControl.pacienteId}
        pacienteNombre={modalControl.pacienteNombre}
        expediente={modalControl.expediente}
        pesoAnteriorKg={modalControl.pesoAnteriorKg}
        grupoEtario={modalControl.grupoEtario}
        edadTexto={modalControl.edadTexto}
        onGuardar={async (dto) => {
          const ok = await registrarControl(dto);
          if (ok) notificar('Control nutricional registrado e integrado a la jornada.');
          return ok;
        }}
      />

      <ModalHistorialNutricional
        isOpen={personaHistorial !== null}
        onClose={() => setPersonaHistorial(null)}
        persona={personaHistorial}
        onNuevoControl={() => {
          if (personaHistorial) {
            abrirControl(
              personaHistorial.pacienteId,
              personaHistorial.nombreCompleto,
              personaHistorial.expediente,
              personaHistorial.pesoActualKg,
              personaHistorial.grupoEtario,
              personaHistorial.edadTexto
            );
          }
        }}
      />

      {/* Modal Ficha Completa y Edición */}
      <ModalFichaNutricional
        isOpen={personaFicha !== null}
        onClose={() => setPersonaFicha(null)}
        persona={personaFicha}
        onActualizarFicha={actualizarFichaNutricional}
        onAbrirControl={(pId, nom, exp, pAnt, grp, eda) => {
          abrirControl(pId, nom, exp, pAnt, grp, eda);
        }}
      />
    </div>
  );
};

export default ResumenNutricionPage;