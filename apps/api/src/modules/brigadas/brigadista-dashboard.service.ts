// =========================================================================
// ARCHIVO: apps/api/src/modules/brigadas/brigadista-dashboard.service.ts
// DESCRIPCIÓN: Servicio para agregación de métricas, resumen y actividad operacional del Brigadista con exclusión de eliminados lógicos.
// =========================================================================

import { prisma } from '../../config/prisma.js';
import { BrigadeStatus, SessionStatus, QueueStatus, Prisma, UserStatus } from '@prisma/client';

export interface ActividadQueryFilters {
  search?: string | undefined;
  tipo?: string | undefined;
  estado?: string | undefined;
  temporalidad?: 'HOY' | 'JORNADA' | 'TODAS' | undefined;
  startDate?: string | undefined;
  endDate?: string | undefined;
}

export class BrigadistaDashboardService {
  /**
   * Resumen ejecutivo del Dashboard del Brigadista
   */
  async getResumenDashboard(brigadistaId: string) {
    const ahora = new Date();
    const inicioHoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate(), 0, 0, 0, 0);
    const finHoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate(), 23, 59, 59, 999);

    const jornadaActiva = await prisma.workSession.findFirst({
      where: {
        brigadistaId: brigadistaId,
        status: SessionStatus.STARTED,
      },
      include: {
        brigade: true,
      },
    });

    const triajesHoy = await prisma.vitalSigns.findMany({
      where: {
        createdAt: {
          gte: inicioHoy,
          lte: finHoy,
        },
        deletedAt: null,
        patient: {
          deletedAt: null,
          user: {
            status: UserStatus.ACTIVE,
            deletedAt: null,
          },
        },
      },
      include: {
        patient: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const totalTriajes = triajesHoy.length;

    const alertasTriaje = triajesHoy.filter(
      (vs) =>
        vs.systolic >= 140 ||
        vs.diastolic >= 90 ||
        vs.temperature >= 38.0 ||
        vs.oxygenSat <= 90
    );

    const pacientesRegistradosHoy = await prisma.patient.findMany({
      where: {
        createdAt: {
          gte: inicioHoy,
          lte: finHoy,
        },
        deletedAt: null,
        user: {
          status: UserStatus.ACTIVE,
          deletedAt: null,
        },
      },
      include: {
        vitalSigns: {
          where: {
            createdAt: {
              gte: inicioHoy,
              lte: finHoy,
            },
            deletedAt: null,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const pacientesPendientesTriaje = pacientesRegistradosHoy.filter(
      (p) => p.vitalSigns.length === 0
    );

    const pendientesCount = pacientesPendientesTriaje.length;

    const proximoPacienteRaw = pacientesPendientesTriaje[0];
    const proximoPaciente = proximoPacienteRaw
      ? {
          id: proximoPacienteRaw.id,
          hora: new Date(proximoPacienteRaw.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          paciente: `${proximoPacienteRaw.firstName} ${proximoPacienteRaw.lastName}`,
          dui: proximoPacienteRaw.dui || 'Sin DUI registrado',
          motivo: 'Pendiente de toma de signos vitales (Triaje inicial)',
        }
      : null;

    const ultimoTriaje = triajesHoy[0];
    const ultimoPaciente = ultimoTriaje && ultimoTriaje.patient
      ? {
          id: ultimoTriaje.patient.id,
          nombre: `${ultimoTriaje.patient.firstName} ${ultimoTriaje.patient.lastName}`,
          dui: ultimoTriaje.patient.dui || 'Sin DUI registrado',
          hora: new Date(ultimoTriaje.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          signosVitales: {
            pa: `${ultimoTriaje.systolic}/${ultimoTriaje.diastolic}`,
            fc: ultimoTriaje.heartRate,
            temp: ultimoTriaje.temperature,
            spo2: ultimoTriaje.oxygenSat,
          },
        }
      : null;

    const alertasClinicas = alertasTriaje.slice(0, 5).map((vs) => {
      let titulo = 'Signos vitales alterados';
      if (vs.systolic >= 140 || vs.diastolic >= 90) {
        titulo = `Presión arterial elevada (${vs.systolic}/${vs.diastolic} mmHg)`;
      } else if (vs.temperature >= 38.0) {
        titulo = `Fiebre elevada (${vs.temperature} °C)`;
      } else if (vs.oxygenSat <= 90) {
        titulo = `Saturación O2 crítica (${vs.oxygenSat}%)`;
      }

      return {
        id: vs.id,
        prioridad: 'alta' as const,
        titulo,
        paciente: vs.patient
          ? `${vs.patient.firstName} ${vs.patient.lastName}`
          : 'Paciente Desconocido',
        pacienteCodigo: vs.patient?.dui || 'P-REG',
        tiempo: new Date(vs.createdAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
    });

    const pacientesEnEspera = pacientesPendientesTriaje.slice(0, 5).map((p) => ({
      id: p.id,
      nombre: `${p.firstName} ${p.lastName}`,
      tipo: 'triaje' as const,
      detalle: 'Esperando registro de constantes vitales',
      hora: new Date(p.createdAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    }));

    let estadoJornada = {
      jornadaActiva: false,
      nombreBrigada: 'Brigada Médica',
      ubicacion: undefined as string | undefined,
      horaInicio: undefined as string | undefined,
      totalPacientesAtendidos: totalTriajes,
    };

    if (jornadaActiva) {
      const brigade = jornadaActiva.brigade;
      const nombreBrigada = brigade
        ? `${brigade.name} (${brigade.municipality}, ${brigade.department})`
        : 'Brigada Activa';
      const ubicacion = brigade
        ? `${brigade.name}, ${brigade.municipality}, ${brigade.department}`
        : 'Ubicación no especificada';

      estadoJornada = {
        jornadaActiva: true,
        nombreBrigada,
        ubicacion,
        horaInicio: new Date(jornadaActiva.startedAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        totalPacientesAtendidos: totalTriajes,
      };
    }

    const triajesRecientes = triajesHoy.slice(0, 5).map((vs) => ({
      id: vs.id,
      paciente: vs.patient
        ? `${vs.patient.firstName} ${vs.patient.lastName}`
        : 'Paciente Desconocido',
      fechaHora: new Date(vs.createdAt).toLocaleString([], {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
      detalles: `PA: ${vs.systolic}/${vs.diastolic} mmHg | Temp: ${vs.temperature}°C | FC: ${vs.heartRate} bpm | SpO2: ${vs.oxygenSat}%`,
      estado: 'Completado',
    }));

    return {
      resumenTriajes: {
        total: totalTriajes,
        completados: Math.max(0, totalTriajes - alertasTriaje.length),
        pendientes: pendientesCount,
        alertas: alertasTriaje.length,
      },
      proximoPaciente,
      ultimoPaciente,
      alertasClinicasData: {
        totalAlertas: alertasTriaje.length,
        altaPrioridadCount: alertasTriaje.length,
        seguimientoCount: 0,
        alertas: alertasClinicas,
      },
      pacientesEnEspera,
      estadoJornada,
      triajesRecientes,
    };
  }

  /**
   * Centro Operativo y Bitácora de Actividad del Brigadista con soporte de histórico y filtros
   */
  async getActividadDashboard(brigadistaId: string, filters: ActividadQueryFilters = {}) {
    const ahora = new Date();
    const inicioHoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate(), 0, 0, 0, 0);
    const finHoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate(), 23, 59, 59, 999);

    const sesionActiva = await prisma.workSession.findFirst({
      where: {
        brigadistaId,
        status: SessionStatus.STARTED,
      },
      include: {
        brigade: true,
      },
      orderBy: { startedAt: 'desc' },
    });

    let brigadaReferencia = sesionActiva?.brigade;

    if (!brigadaReferencia) {
      const brigadaAsignada = await prisma.brigadeMember.findFirst({
        where: {
          userId: brigadistaId,
          brigade: { status: BrigadeStatus.ACTIVE },
        },
        include: { brigade: true },
      });
      brigadaReferencia = brigadaAsignada?.brigade;
    }

    const territorioNombre = brigadaReferencia
      ? `${brigadaReferencia.municipality}, ${brigadaReferencia.department}`
      : 'San Miguel Tepezontes, La Paz';

    const nombreJornada = brigadaReferencia
      ? brigadaReferencia.name
      : 'Jornada Comunitaria Territorial';

    let dateFilter: Prisma.DateTimeFilter | undefined;

    if (filters.startDate || filters.endDate) {
      const gte = filters.startDate ? new Date(`${filters.startDate}T00:00:00.000Z`) : undefined;
      const lte = filters.endDate ? new Date(`${filters.endDate}T23:59:59.999Z`) : undefined;
      dateFilter = {};
      if (gte) dateFilter.gte = gte;
      if (lte) dateFilter.lte = lte;
    } else if (filters.temporalidad === 'TODAS') {
      dateFilter = undefined;
    } else if (filters.temporalidad === 'JORNADA' && sesionActiva) {
      dateFilter = { gte: sesionActiva.startedAt };
    } else if (filters.temporalidad === 'HOY' || !filters.temporalidad) {
      dateFilter = { gte: inicioHoy, lte: finHoy };
    }

    const vitalSignsWhere: Prisma.VitalSignsWhereInput = { 
      deletedAt: null,
      patient: {
        deletedAt: null,
        user: { status: UserStatus.ACTIVE, deletedAt: null }
      }
    };
    if (dateFilter) vitalSignsWhere.createdAt = dateFilter;

    const patientWhere: Prisma.PatientWhereInput = { 
      deletedAt: null,
      user: { status: UserStatus.ACTIVE, deletedAt: null }
    };
    if (dateFilter) patientWhere.createdAt = dateFilter;

    const patientVitalSignsWhere: Prisma.VitalSignsWhereInput = { deletedAt: null };
    if (dateFilter) patientVitalSignsWhere.createdAt = dateFilter;

    const consultationWhere: Prisma.ConsultationWhereInput = { 
      deletedAt: null,
      patient: {
        deletedAt: null,
        user: { status: UserStatus.ACTIVE, deletedAt: null }
      }
    };
    if (dateFilter) consultationWhere.createdAt = dateFilter;

    const workSessionWhere: Prisma.WorkSessionWhereInput = { brigadistaId };
    if (dateFilter) workSessionWhere.startedAt = dateFilter;

    const [evaluaciones, pacientes, consultasBrigada, outboxPendientes, sesiones] = await Promise.all([
      prisma.vitalSigns.findMany({
        where: vitalSignsWhere,
        include: { patient: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.patient.findMany({
        where: patientWhere,
        include: {
          vitalSigns: {
            where: patientVitalSignsWhere,
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.consultation.findMany({
        where: consultationWhere,
        include: { patient: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.syncQueue.count({
        where: { status: QueueStatus.PENDING },
      }),
      prisma.workSession.findMany({
        where: workSessionWhere,
        include: { brigade: true },
        orderBy: { startedAt: 'desc' },
      }),
    ] as const);

    const totalEvaluaciones = evaluaciones.length;
    const riesgosFisiologicos = evaluaciones.filter(
      (vs) =>
        vs.systolic >= 140 ||
        vs.diastolic >= 90 ||
        vs.temperature >= 38.0 ||
        vs.oxygenSat <= 90
    );
    const totalPersonas = pacientes.length;
    const totalVisitas = Math.max(sesiones.length, Math.ceil(totalPersonas / 2));
    const totalReferencias = consultasBrigada.length;

    type ItemOperativo = {
      id: string;
      hora: string;
      fecha: string;
      titulo: string;
      tipo: 'VISITA_DOMICILIARIA' | 'EVALUACION_SIGNOS' | 'EDUCACION_COMUNITARIA' | 'SEGUIMIENTO' | 'REFERENCIA' | 'ACTIVIDAD_COMUNITARIA';
      estado: 'COMPLETADA' | 'EN_CURSO' | 'PENDIENTE' | 'CANCELADA' | 'PENDIENTE_SYNC';
      sujeto: string;
      comunidad: string;
      resultado: string;
      tieneRiesgo?: boolean;
      requiereSeguimiento?: boolean;
      referenciaGenerada?: boolean;
      detalles?: string;
      sincronizado: boolean;
      rawDate: Date;
    };

    const eventosReales: ItemOperativo[] = [];

    sesiones.forEach((s) => {
      eventosReales.push({
        id: `sesion-${s.id}`,
        hora: new Date(s.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        fecha: new Date(s.startedAt).toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' }),
        titulo: 'Apertura de Jornada Operativa',
        tipo: 'ACTIVIDAD_COMUNITARIA',
        estado: s.status === SessionStatus.STARTED ? 'EN_CURSO' : 'COMPLETADA',
        sujeto: s.brigade?.name || 'Equipo de Brigada',
        comunidad: s.brigade ? `${s.brigade.municipality}, ${s.brigade.department}` : territorioNombre,
        resultado: s.status === SessionStatus.STARTED ? 'Jornada activa en terreno' : 'Turno finalizado',
        detalles: `Estación local operando en ${s.brigade?.municipality || 'campo'}.`,
        sincronizado: true,
        rawDate: s.startedAt,
      });
    });

    evaluaciones.forEach((vs) => {
      const tieneRiesgo =
        vs.systolic >= 140 ||
        vs.diastolic >= 90 ||
        vs.temperature >= 38.0 ||
        vs.oxygenSat <= 90;

      let resultadoDetalle = `PA: ${vs.systolic}/${vs.diastolic} mmHg | FC: ${vs.heartRate} bpm | Temp: ${vs.temperature}°C`;
      if (tieneRiesgo) {
        resultadoDetalle += ' (Parámetro fuera de rango)';
      }

      eventosReales.push({
        id: `vs-${vs.id}`,
        hora: new Date(vs.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        fecha: new Date(vs.createdAt).toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' }),
        titulo: 'Evaluación de Signos Vitales',
        tipo: 'EVALUACION_SIGNOS',
        estado: 'COMPLETADA',
        sujeto: vs.patient
          ? `${vs.patient.firstName} ${vs.patient.lastName} (${vs.patient.dui || 'Sin DUI'})`
          : 'Persona en Padrón',
        comunidad: vs.patient?.address || territorioNombre,
        resultado: resultadoDetalle,
        tieneRiesgo,
        requiereSeguimiento: tieneRiesgo,
        detalles: `SpO2: ${vs.oxygenSat}%${vs.weight ? ` | Peso: ${vs.weight} kg` : ''}${vs.height ? ` | Talla: ${vs.height} cm` : ''}.`,
        sincronizado: vs.syncStatus === 'SYNCED',
        rawDate: vs.createdAt,
      });
    });

    pacientes.forEach((p) => {
      eventosReales.push({
        id: `pat-${p.id}`,
        hora: new Date(p.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        fecha: new Date(p.createdAt).toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' }),
        titulo: 'Registro de Persona en Padrón',
        tipo: 'VISITA_DOMICILIARIA',
        estado: 'COMPLETADA',
        sujeto: `${p.firstName} ${p.lastName}`,
        comunidad: p.address || territorioNombre,
        resultado: 'Ficha territorial inicial creada',
        detalles: `DUI: ${p.dui || 'No especificado'} | Tel: ${p.phone || 'No registrado'}.`,
        sincronizado: p.syncStatus === 'SYNCED',
        rawDate: p.createdAt,
      });
    });

    consultasBrigada.forEach((c) => {
      eventosReales.push({
        id: `con-${c.id}`,
        hora: new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        fecha: new Date(c.createdAt).toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' }),
        titulo: 'Referencia / Consulta Médica',
        tipo: 'REFERENCIA',
        estado: c.status === 'COMPLETED' ? 'COMPLETADA' : 'EN_CURSO',
        sujeto: c.patient ? `${c.patient.firstName} ${c.patient.lastName}` : 'Persona Derivada',
        comunidad: c.patient?.address || territorioNombre,
        resultado: c.diagnosisDesc || 'Atención médica en terreno',
        referenciaGenerada: true,
        detalles: `Motivo: ${c.chiefComplaint}. Plan: ${c.treatmentPlan}.`,
        sincronizado: c.syncStatus === 'SYNCED',
        rawDate: c.createdAt,
      });
    });

    eventosReales.sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime());

    const pacienteSinTriaje = pacientes.find((p) => p.vitalSigns.length === 0);
    const proximaActividad = pacienteSinTriaje
      ? {
          tipo: 'Evaluación de Signos Vitales',
          sujeto: `${pacienteSinTriaje.firstName} ${pacienteSinTriaje.lastName}`,
          hora: new Date(pacienteSinTriaje.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          territorio: pacienteSinTriaje.address || territorioNombre,
          motivo: 'Persona registrada pendiente de toma de constantes físicas iniciales.',
          rutaEjecucion: '/brigadista/evaluacion/signos-vitales',
        }
      : {
          tipo: 'Visita Domiciliaria / Censo',
          sujeto: 'Sector Asignado',
          hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          territorio: territorioNombre,
          motivo: 'Continuar empadronamiento territorial e identificación de personas.',
          rutaEjecucion: '/brigadista/pacientes/registrar',
        };

    return {
      contexto: {
        nombreJornada,
        territorio: territorioNombre,
        fecha: new Date().toLocaleDateString('es-SV', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
        jornadaActiva: Boolean(sesionActiva),
      },
      metricas: {
        visitas: totalVisitas,
        personas: totalPersonas,
        evaluaciones: totalEvaluaciones,
        riesgos: riesgosFisiologicos.length,
        referencias: totalReferencias,
      },
      proximaActividad,
      atencionInmediata: {
        seguimientosAtrasados: riesgosFisiologicos.length,
        referenciasPendientes: totalReferencias,
        pendientesSync: outboxPendientes,
      },
      actividades: eventosReales.map(({ rawDate, ...resto }) => resto),
    };
  }
}

export const brigadistaDashboardService = new BrigadistaDashboardService();