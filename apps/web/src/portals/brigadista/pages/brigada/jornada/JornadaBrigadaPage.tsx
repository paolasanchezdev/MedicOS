// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/brigada/jornada/JornadaBrigadaPage.tsx
// DESCRIPCIÓN: Centro operativo de la Jornada Territorial del brigadista.
//              Muestra 100% datos reales del día en curso sin fallbacks ni mockups.
// =========================================================================

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJornadaBrigada, usePacientesBrigada } from '../../../../../modules/brigades';
import {
  Database,
  RefreshCw,
  QrCode,
  UserSearch,
  PlusCircle,
  PlayCircle,
  StopCircle,
  Clock,
  CheckCircle2,
  Users,
  Activity,
  HeartPulse,
  AlertTriangle,
  ArrowRight,
  User,
} from 'lucide-react';

import {
  JornadaHeader,
  JornadaControlCard,
  JornadaActividadesTimeline,
  JornadaEquipoCard,
  JornadaRecursosCard,
  RegistrarActividadModal,
} from './components';

export const JornadaBrigadaPage: React.FC = () => {
  const navigate = useNavigate();

  const {
    data,
    loading: jornadaLoading,
    error: jornadaError,
    refreshing: jornadaRefreshing,
    actionLoading,
    refresh: refreshJornada,
    iniciarJornada,
    finalizarJornada,
  } = useJornadaBrigada();

  const {
    data: pacientesData,
    loading: pacientesLoading,
    refresh: refreshPacientes,
  } = usePacientesBrigada();

  const [modalActividadOpen, setModalActividadOpen] = useState<boolean>(false);

  const loading = jornadaLoading || pacientesLoading;
  const refreshing = jornadaRefreshing;

  const handleRefreshAll = async () => {
    await Promise.all([refreshJornada(), refreshPacientes()]);
  };

  // Pacientes en espera del turno actual
  const pacientesPendientes = useMemo(() => {
    if (!pacientesData?.pacientes) return [];
    return pacientesData.pacientes.filter((p) => p.estadoBrigada === 'PENDIENTE');
  }, [pacientesData]);

  const pacientesConRiesgoCount = useMemo(() => {
    if (!pacientesData?.pacientes) return 0;
    return pacientesData.pacientes.filter((p) => p.tieneRiesgo).length;
  }, [pacientesData]);

  // FILTRADO ESTRICTO DE ACTIVIDADES:
  // Solo eventos que correspondan a la fecha de hoy. Si no hay nada, retorna [] (sin mockups).
  const actividadesDeHoy = useMemo(() => {
    if (!data?.actividades || data.actividades.length === 0) return [];

    const hoy = new Date();
    const hoyDia = String(hoy.getDate()).padStart(2, '0');
    const hoyMes = String(hoy.getMonth() + 1).padStart(2, '0');
    const hoyAnio = String(hoy.getFullYear());

    return data.actividades.filter((a) => {
      if (!a.fecha) return false;
      const partes = a.fecha.split(/[-/]/);
      if (partes.length < 3) return false;

      if (partes[0].length === 4) {
        return partes[0] === hoyAnio && partes[1] === hoyMes && partes[2] === hoyDia;
      }

      const coincideAnio = partes[2] === hoyAnio;
      const coincideDiaMes =
        (partes[0].padStart(2, '0') === hoyDia && partes[1].padStart(2, '0') === hoyMes) ||
        (partes[1].padStart(2, '0') === hoyDia && partes[0].padStart(2, '0') === hoyMes);

      return coincideAnio && coincideDiaMes;
    });
  }, [data]);

  if (loading) {
    return (
      <div className="w-full p-6 space-y-6 animate-pulse max-w-[1700px] mx-auto">
        <div className="h-8 bg-slate-200/60 rounded-xl w-48" />
        <div className="h-32 bg-slate-200/60 rounded-2xl" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="h-28 bg-white rounded-2xl border border-slate-200/80" />
          <div className="h-28 bg-white rounded-2xl border border-slate-200/80" />
          <div className="h-28 bg-white rounded-2xl border border-slate-200/80" />
          <div className="h-28 bg-white rounded-2xl border border-slate-200/80" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 h-72 bg-white rounded-2xl border border-slate-200/80" />
          <div className="lg:col-span-5 h-72 bg-white rounded-2xl border border-slate-200/80" />
        </div>
      </div>
    );
  }

  if (jornadaError || !data) {
    return (
      <div className="p-8 max-w-lg mx-auto text-center my-12 bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="w-12 h-12 bg-teal-50 text-[#2B7A78] rounded-2xl flex items-center justify-center mx-auto border border-teal-100 shadow-xs">
          <Database className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-slate-900">Sin conexión con la Base de Datos</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            {jornadaError || 'No se pudo obtener la información operativa de la jornada.'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => void handleRefreshAll()}
          disabled={refreshing}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2B7A78] hover:bg-[#236866] text-white text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Reintentar Conexión</span>
        </button>
      </div>
    );
  }

  const enCurso = data.control.estado === 'EN_CURSO';
  const finalizada = data.control.estado === 'FINALIZADA';
  const evaluadosHoy = pacientesData?.resumen.evaluados ?? 0;

  return (
    <div className="w-full p-4 sm:p-6 space-y-6 max-w-[1700px] mx-auto animate-in fade-in duration-200">
      {/* 1. Encabezado de la Jornada Territorial con Título "Jornada de Hoy" */}
      <JornadaHeader
        nombreBrigada={data.identificacion.nombre}
        comunidad={data.identificacion.comunidad}
        fecha={data.identificacion.fecha}
        estado={data.identificacion.estado}
        onRefresh={() => void handleRefreshAll()}
        isRefreshing={refreshing}
      />

      {/* 2. Barra de Control Operativo y Acciones Inmediatas de Triage */}
      <div className="p-4 bg-white/90 backdrop-blur-xl rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              enCurso
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/80'
                : finalizada
                ? 'bg-slate-100 text-slate-700 border border-slate-200'
                : 'bg-slate-100 text-slate-500 border border-slate-200'
            }`}
          >
            {enCurso ? <Clock className="w-5 h-5 animate-pulse" /> : <Clock className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                {enCurso
                  ? 'Turno en Operación'
                  : finalizada
                  ? 'Turno de Hoy Concluido'
                  : 'Jornada Sin Iniciar'}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  enCurso
                    ? 'bg-emerald-100 text-emerald-800'
                    : finalizada
                    ? 'bg-slate-200 text-slate-700'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {enCurso
                  ? `Duración: ${data.control.tiempoTranscurrido}`
                  : finalizada
                  ? `Cierre: ${data.control.horaFin || 'Registrado'}`
                  : 'Esperando apertura'}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {enCurso
                ? `Inicio registrado a las ${data.control.horaInicio}. Registrando atenciones nominales.`
                : finalizada
                ? `Turno cerrado con ${data.control.tiempoTranscurrido} de labor. Puedes iniciar una nueva sesión si el operativo continúa.`
                : 'Inicia el turno operativo para comenzar a registrar atenciones de campo.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end flex-wrap">
          {enCurso ? (
            <>
              <button
                type="button"
                onClick={() => navigate('/brigadista/pacientes/escanear')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer active:scale-95"
              >
                <QrCode className="w-4 h-4 text-[#2B7A78]" />
                <span>Escanear QR</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/brigadista/pacientes/buscar')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer active:scale-95"
              >
                <UserSearch className="w-4 h-4 text-[#2B7A78]" />
                <span>Padrón</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/brigadista/atencion/nueva')}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2B7A78] hover:bg-[#236866] text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Nueva Atención</span>
              </button>
              <button
                type="button"
                onClick={() => void finalizarJornada()}
                disabled={actionLoading}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl transition cursor-pointer active:scale-95 disabled:opacity-50"
              >
                <StopCircle className="w-4 h-4 text-rose-600" />
                <span>Finalizar Turno</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => void iniciarJornada()}
              disabled={actionLoading}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2B7A78] hover:bg-[#236866] text-white text-xs font-extrabold rounded-xl shadow-sm transition active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <PlayCircle className="w-4 h-4" />
              <span>{finalizada ? 'Iniciar Nuevo Turno' : 'Iniciar Jornada de Hoy'}</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. Métricas Rápidas del Turno de Hoy */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Estado de Sesión
            </span>
            <Activity className="w-4 h-4 text-[#2B7A78]" />
          </div>
          <p className="text-lg font-black text-slate-900">
            {enCurso ? 'En Turno' : finalizada ? 'Concluido' : 'Programada'}
          </p>
          <p className="text-[11px] text-slate-500 font-medium">
            {enCurso
              ? `Inicio: ${data.control.horaInicio}`
              : finalizada
              ? `Cierre: ${data.control.horaFin}`
              : 'Sin apertura registrada'}
          </p>
        </div>

        <div className="p-4 bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Atendidos Hoy
            </span>
            <HeartPulse className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-lg font-black text-slate-900">{evaluadosHoy}</p>
          <p className="text-[11px] text-slate-500 font-medium">Pacientes evaluados en consulta</p>
        </div>

        <div className="p-4 bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              En Espera
            </span>
            <Users className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-lg font-black text-slate-900">{pacientesPendientes.length}</p>
          <p className="text-[11px] text-slate-500 font-medium">
            {pacientesConRiesgoCount > 0 ? (
              <span className="text-rose-600 font-bold">
                {pacientesConRiesgoCount} con alerta clínica
              </span>
            ) : (
              'Esperando atención o triage'
            )}
          </p>
        </div>

        <div className="p-4 bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Equipo Desplegado
            </span>
            <CheckCircle2 className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-lg font-black text-slate-900">{data.equipo.length}</p>
          <p className="text-[11px] text-slate-500 font-medium">Personal activo en comunidad</p>
        </div>
      </div>

      {/* 4. Núcleo Operativo Nivelado: Sala de Espera Viva (Izquierda) + Control de Turno (Derecha) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between overflow-hidden">
          <div>
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#2B7A78]">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Sala de Espera del Día
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Pacientes en turno pendientes de consulta clínica
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate('/brigadista/brigada/pacientes')}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#2B7A78] hover:text-[#1B5250] transition cursor-pointer"
              >
                <span>Ver todos ({pacientesData?.resumen.totalPacientes ?? 0})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-4 sm:p-5 space-y-2.5">
              {pacientesPendientes.length === 0 ? (
                <div className="py-8 text-center space-y-2">
                  <CheckCircle2 className="w-7 h-7 text-emerald-500 mx-auto" />
                  <p className="text-xs font-bold text-slate-800">
                    No hay pacientes en espera en este momento
                  </p>
                  <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                    Escanea el carnet QR de un paciente o búscalo en el padrón para agregarlo a la fila del turno.
                  </p>
                </div>
              ) : (
                pacientesPendientes.slice(0, 4).map((p) => (
                  <div
                    key={p.id}
                    className="p-3 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/60 hover:bg-slate-50 flex items-center justify-between gap-3 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-white border border-slate-200/70 flex items-center justify-center text-slate-600 font-bold shrink-0">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900 truncate">
                            {p.nombreCompleto}
                          </span>
                          {p.tieneRiesgo && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200">
                              <AlertTriangle className="w-2.5 h-2.5 text-rose-600" />
                              Alerta
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                          <span className="font-mono">DUI: {p.dui}</span>
                          <span>&bull;</span>
                          <span>{p.edad} años</span>
                          {p.ultimaEvaluacion && (
                            <>
                              <span>&bull;</span>
                              <span className="font-mono text-slate-600">
                                PA: {p.ultimaEvaluacion.pa}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/brigadista/atencion/nueva?patientId=${p.id}&nombre=${encodeURIComponent(
                            p.nombreCompleto
                          )}&dui=${encodeURIComponent(p.dui)}`
                        )
                      }
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#2B7A78] hover:bg-[#236866] text-white rounded-xl text-xs font-bold transition shadow-2xs active:scale-95 cursor-pointer shrink-0"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Atender</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="px-5 py-3 bg-slate-50/60 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Pacientes en sala de espera activa</span>
            <span className="font-bold text-slate-700">{pacientesPendientes.length} en fila</span>
          </div>
        </div>

        {/* Control Oficial de Turno */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <JornadaControlCard control={data.control} />
        </div>
      </div>

      {/* 5. Timeline de Actividades de la Jornada (Filtrado estricto a Hoy) */}
      <JornadaActividadesTimeline
        actividades={actividadesDeHoy}
        onRegistrarActividad={() => setModalActividadOpen(true)}
        enCurso={enCurso}
      />

      {/* 6. Dotación de Recursos y Equipo Desplegado */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-6">
          <JornadaEquipoCard equipo={data.equipo} />
        </div>

        <div className="lg:col-span-6">
          <JornadaRecursosCard recursos={data.recursos} />
        </div>
      </div>

      {/* Modal de Registro de Actividad Rápida */}
      <RegistrarActividadModal
        isOpen={modalActividadOpen}
        onClose={() => setModalActividadOpen(false)}
        onRegistrado={() => void handleRefreshAll()}
      />
    </div>
  );
};

export default JornadaBrigadaPage;