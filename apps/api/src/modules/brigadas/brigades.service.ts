// =========================================================================
// ARCHIVO: apps/api/src/modules/brigadas/brigades.service.ts
// DESCRIPCIÓN: Servicio para gestión, resumen, jornada y padrón de pacientes
//              100% PostgreSQL con exclusión de eliminados lógicos y registros web.
// =========================================================================

import { prisma } from '../../config/prisma.js';
import { BaseService } from '../../services/base.service.js';
import { BrigadeStatus, Role, UserStatus, SyncStatus, Prisma, type Brigade } from '@prisma/client';

export interface CreateBrigadeDTO {
  name: string;
  department: string;
  municipality: string;
  latitude?: number | null | undefined;
  longitude?: number | null | undefined;
  startDate: string;
  endDate?: string | null | undefined;
  leaderId?: string | null | undefined;
  originDeviceId?: string | undefined;
  memberIds?: string[] | undefined;
}

export interface UpdateBrigadeDTO {
  name?: string | undefined;
  department?: string | undefined;
  municipality?: string | undefined;
  latitude?: number | null | undefined;
  longitude?: number | null | undefined;
  startDate?: string | undefined;
  endDate?: string | null | undefined;
  leaderId?: string | null | undefined;
  status?: BrigadeStatus | undefined;
  originDeviceId?: string | undefined;
}

export interface BrigadeFilters {
  search?: string | undefined;
  department?: string | undefined;
  status?: BrigadeStatus | 'ALL' | undefined;
}

const DISPOSITIVOS_WEB_EXCLUIDOS = ['WEB_PORTAL', 'WEB_PORTAL_BACKFILL'];

const brigadeJornadaInclude = {
  leader: true,
  members: {
    include: {
      user: true,
    },
  },
  supplyItems: {
    include: {
      stock: {
        include: {
          resource: true,
        },
      },
    },
  },
  equipmentItems: {
    include: {
      equipment: true,
    },
  },
  devices: {
    include: {
      device: true,
    },
  },
} as const;

type BrigadeJornadaPayload = Prisma.BrigadeGetPayload<{
  include: typeof brigadeJornadaInclude;
}>;

function esReferenciaMedica(consulta: { treatmentPlan: string; diagnosisDesc: string; chiefComplaint: string }): boolean {
  const textoCompleto = `${consulta.treatmentPlan} ${consulta.diagnosisDesc} ${consulta.chiefComplaint}`.toLowerCase();
  const palabrasClaveReferencia = [
    'refer',
    'hospital',
    'unidad de salud',
    'minsal',
    'isss',
    'segundo nivel',
    'tercer nivel',
    'especialista',
    'traslado',
    'derivaci',
    'urgencia',
    'emergencia',
  ];
  return palabrasClaveReferencia.some((palabra) => textoCompleto.includes(palabra));
}

export class BrigadesService extends BaseService {
  /**
   * Obtiene el padrón de pacientes vinculados a la brigada excluyendo eliminados lógicamente y cuentas web no atendidas
   */
  async getPacientesBrigada(userId: string) {
    const ahora = new Date();

    const sesionActiva = await prisma.workSession.findFirst({
      where: {
        brigadistaId: userId,
        status: 'STARTED',
      },
      include: { brigade: true },
      orderBy: { startedAt: 'desc' },
    });

    let brigada: Brigade | null = sesionActiva?.brigade ?? null;

    if (!brigada) {
      const miembro = await prisma.brigadeMember.findFirst({
        where: {
          userId,
          brigade: { status: BrigadeStatus.ACTIVE, deletedAt: null },
        },
        include: { brigade: true },
      });
      brigada = miembro?.brigade ?? null;
    }

    if (!brigada) {
      brigada = await prisma.brigade.findFirst({
        where: {
          deletedAt: null,
          status: { in: [BrigadeStatus.ACTIVE, BrigadeStatus.PLANNED] },
        },
        orderBy: { startDate: 'desc' },
      });
    }

    if (!brigada) {
      brigada = await prisma.brigade.findFirst({
        where: { deletedAt: null },
        orderBy: { startDate: 'desc' },
      });
    }

    if (!brigada) {
      return null;
    }

    const enCurso = brigada.status === BrigadeStatus.ACTIVE || Boolean(sesionActiva);

    // Solo pacientes censados en terreno o que tengan consultas registradas en esta brigada
    const pacientes = await prisma.patient.findMany({
      where: { 
        deletedAt: null,
        user: {
          status: UserStatus.ACTIVE,
          deletedAt: null,
        },
        OR: [
          {
            consultations: {
              some: {
                brigadeId: brigada.id,
                deletedAt: null,
              },
            },
          },
          {
            originDeviceId: {
              notIn: DISPOSITIVOS_WEB_EXCLUIDOS,
            },
          },
        ],
      },
      include: {
        vitalSigns: {
          where: { deletedAt: null },
          orderBy: { createdAt: 'desc' },
        },
        consultations: {
          where: { 
            deletedAt: null,
            status: { in: ['COMPLETED', 'IN_PROGRESS'] }
          },
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    let evaluadosCount = 0;
    let pendientesCount = 0;
    let referidosCount = 0;
    let seguimientosCount = 0;

    const listaPacientes = pacientes.map((p) => {
      const tieneSignos = p.vitalSigns.length > 0;
      const tieneConsultaValida = p.consultations.length > 0;
      const ultimaEvaluacion = p.vitalSigns[0] ?? null;
      const ultimaConsulta = p.consultations[0] ?? null;

      const tieneRiesgo = ultimaEvaluacion
        ? ultimaEvaluacion.systolic >= 140 ||
          ultimaEvaluacion.diastolic >= 90 ||
          ultimaEvaluacion.temperature >= 38.0 ||
          ultimaEvaluacion.oxygenSat <= 90
        : false;

      const esReferido = ultimaConsulta ? esReferenciaMedica(ultimaConsulta) : false;

      let estadoBrigada: 'EVALUADO' | 'PENDIENTE' | 'SEGUIMIENTO' | 'REFERIDO' = 'PENDIENTE';

      if (!tieneSignos && !tieneConsultaValida) {
        estadoBrigada = 'PENDIENTE';
        pendientesCount++;
      } else if (esReferido) {
        estadoBrigada = 'REFERIDO';
        referidosCount++;
      } else if (tieneRiesgo) {
        estadoBrigada = 'SEGUIMIENTO';
        seguimientosCount++;
      } else {
        estadoBrigada = 'EVALUADO';
        evaluadosCount++;
      }

      const fechaNac = new Date(p.dateOfBirth);
      let edad = ahora.getFullYear() - fechaNac.getFullYear();
      const mesDiff = ahora.getMonth() - fechaNac.getMonth();
      if (mesDiff < 0 || (mesDiff === 0 && ahora.getDate() < fechaNac.getDate())) {
        edad--;
      }

      let ultimaAtencionFormatted = '—';
      if (tieneConsultaValida && ultimaConsulta) {
        ultimaAtencionFormatted = new Date(ultimaConsulta.createdAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });
      } else if (tieneSignos && ultimaEvaluacion) {
        ultimaAtencionFormatted = new Date(ultimaEvaluacion.createdAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });
      }

      return {
        id: p.id,
        dui: p.dui || 'Sin DUI',
        nombreCompleto: `${p.firstName} ${p.lastName}`,
        primerNombre: p.firstName,
        primerApellido: p.lastName,
        edad: Math.max(0, edad),
        sexo: p.sex,
        telefono: p.phone,
        direccion: p.address,
        estadoBrigada,
        tieneRiesgo,
        tieneReferencia: esReferido,
        ultimaActividad: ultimaAtencionFormatted,
        ultimaEvaluacion: ultimaEvaluacion
          ? {
              pa: `${ultimaEvaluacion.systolic}/${ultimaEvaluacion.diastolic} mmHg`,
              fc: `${ultimaEvaluacion.heartRate} bpm`,
              temp: `${ultimaEvaluacion.temperature} °C`,
              spo2: `${ultimaEvaluacion.oxygenSat} %`,
              fecha: new Date(ultimaEvaluacion.createdAt).toLocaleDateString([], {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              }),
            }
          : null,
        referencia: ultimaConsulta
          ? {
              motivo: ultimaConsulta.chiefComplaint,
              diagnostico: ultimaConsulta.diagnosisDesc,
              plan: ultimaConsulta.treatmentPlan,
              fecha: new Date(ultimaConsulta.createdAt).toLocaleDateString([], {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              }),
            }
          : null,
      };
    });

    const fechaFormateada = ahora.toLocaleDateString('es-SV', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    return {
      identificacion: {
        id: brigada.id,
        nombre: brigada.name,
        comunidad: `${brigada.municipality}, ${brigada.department}`,
        municipio: brigada.municipality,
        departamento: brigada.department,
        fecha: fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1),
        enCurso,
      },
      resumen: {
        totalPacientes: pacientes.length,
        evaluados: evaluadosCount,
        pendientes: pendientesCount,
        referidos: referidosCount,
        seguimientos: seguimientosCount,
      },
      pacientes: listaPacientes,
    };
  }

  /**
   * Obtiene los datos detallados de la Jornada Territorial activa excluyendo eliminados
   */
  async getJornadaBrigada(userId: string) {
    const ahora = new Date();

    const sesionActiva = await prisma.workSession.findFirst({
      where: {
        brigadistaId: userId,
        status: 'STARTED',
      },
      include: {
        brigade: {
          include: brigadeJornadaInclude,
        },
      },
      orderBy: { startedAt: 'desc' },
    });

    let brigada: BrigadeJornadaPayload | null = sesionActiva?.brigade ?? null;

    if (!brigada) {
      const miembro = await prisma.brigadeMember.findFirst({
        where: {
          userId,
          brigade: {
            status: BrigadeStatus.ACTIVE,
            deletedAt: null,
          },
        },
        include: {
          brigade: {
            include: brigadeJornadaInclude,
          },
        },
      });
      brigada = miembro?.brigade ?? null;
    }

    if (!brigada) {
      brigada = await prisma.brigade.findFirst({
        where: {
          deletedAt: null,
          status: { in: [BrigadeStatus.ACTIVE, BrigadeStatus.PLANNED] },
        },
        include: brigadeJornadaInclude,
        orderBy: { startDate: 'desc' },
      });
    }

    if (!brigada) {
      brigada = await prisma.brigade.findFirst({
        where: { deletedAt: null },
        include: brigadeJornadaInclude,
        orderBy: { startDate: 'desc' },
      });
    }

    if (!brigada) {
      return null;
    }

    const estaEnCurso = Boolean(sesionActiva) || (brigada.status === BrigadeStatus.ACTIVE && !brigada.endDate);
    const estaFinalizada = brigada.status === BrigadeStatus.COMPLETED || (!sesionActiva && Boolean(brigada.endDate));

    let tiempoTranscurrido = '0 h 0 min';
    let horaInicioFormatted = '';
    let horaFinFormatted: string | null = null;

    if (sesionActiva) {
      const inicio = new Date(sesionActiva.startedAt);
      const diffMs = Math.max(0, ahora.getTime() - inicio.getTime());
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      tiempoTranscurrido = `${diffHrs} h ${diffMins} min`;
      horaInicioFormatted = inicio.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      horaFinFormatted = null;
    } else if (estaEnCurso) {
      const inicio = new Date(brigada.startDate);
      const diffMs = Math.max(0, ahora.getTime() - inicio.getTime());
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      tiempoTranscurrido = `${diffHrs} h ${diffMins} min`;
      horaInicioFormatted = inicio.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      horaFinFormatted = null;
    } else if (estaFinalizada) {
      const inicio = new Date(brigada.startDate);
      const fin = brigada.endDate ? new Date(brigada.endDate) : ahora;
      const diffMs = Math.max(0, fin.getTime() - inicio.getTime());
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      tiempoTranscurrido = `${diffHrs} h ${diffMins} min`;
      horaInicioFormatted = inicio.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      horaFinFormatted = fin.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      const inicio = new Date(brigada.startDate);
      horaInicioFormatted = inicio.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      tiempoTranscurrido = '0 h 0 min';
      horaFinFormatted = null;
    }

    const [evaluaciones, pacientes, consultas, sesiones] = await Promise.all([
      prisma.vitalSigns.findMany({
        where: { 
          deletedAt: null,
          patient: {
            deletedAt: null,
            user: { status: UserStatus.ACTIVE, deletedAt: null },
            originDeviceId: { notIn: DISPOSITIVOS_WEB_EXCLUIDOS },
          },
        },
        include: { patient: true },
        orderBy: { createdAt: 'desc' },
        take: 15,
      }),
      prisma.patient.findMany({
        where: { 
          deletedAt: null,
          user: { status: UserStatus.ACTIVE, deletedAt: null },
          originDeviceId: { notIn: DISPOSITIVOS_WEB_EXCLUIDOS },
        },
        orderBy: { createdAt: 'desc' },
        take: 15,
      }),
      prisma.consultation.findMany({
        where: { 
          deletedAt: null,
          brigadeId: brigada.id,
          patient: { deletedAt: null, user: { status: UserStatus.ACTIVE, deletedAt: null } },
        },
        include: { patient: true, doctor: true },
        orderBy: { createdAt: 'desc' },
        take: 15,
      }),
      prisma.workSession.findMany({
        where: { brigadeId: brigada.id },
        include: { brigadista: true },
        orderBy: { startedAt: 'desc' },
        take: 5,
      }),
    ]);

    type ActividadItem = {
      id: string;
      hora: string;
      fecha: string;
      tipo: string;
      titulo: string;
      lugar: string;
      estado: 'COMPLETADA' | 'EN_CURSO' | 'PENDIENTE';
      responsable: string;
      rawDate: Date;
    };

    const actividades: ActividadItem[] = [];

    sesiones.forEach((s) => {
      actividades.push({
        id: `ses-${s.id}`,
        hora: new Date(s.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        fecha: new Date(s.startedAt).toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' }),
        tipo: 'SESION',
        titulo: `Apertura de Turno Operativo (${s.brigadista.firstName} ${s.brigadista.lastName})`,
        lugar: `${brigada.municipality}, ${brigada.department}`,
        estado: s.status === 'STARTED' ? 'EN_CURSO' : 'COMPLETADA',
        responsable: `${s.brigadista.firstName} ${s.brigadista.lastName}`,
        rawDate: s.startedAt,
      });
    });

    evaluaciones.forEach((vs) => {
      actividades.push({
        id: `vs-${vs.id}`,
        hora: new Date(vs.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        fecha: new Date(vs.createdAt).toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' }),
        tipo: 'EVALUACION',
        titulo: `Toma de Signos Vitales (${vs.systolic}/${vs.diastolic} mmHg, ${vs.temperature}°C, ${vs.oxygenSat}% SpO2)`,
        lugar: vs.patient?.address || `${brigada.municipality}, ${brigada.department}`,
        estado: 'COMPLETADA',
        responsable: vs.patient ? `${vs.patient.firstName} ${vs.patient.lastName}` : 'Persona en Padrón',
        rawDate: vs.createdAt,
      });
    });

    pacientes.forEach((p) => {
      actividades.push({
        id: `pat-${p.id}`,
        hora: new Date(p.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        fecha: new Date(p.createdAt).toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' }),
        tipo: 'VISITA',
        titulo: `Empadronamiento Territorial (${p.firstName} ${p.lastName})`,
        lugar: p.address || `${brigada.municipality}, ${brigada.department}`,
        estado: 'COMPLETADA',
        responsable: `DUI: ${p.dui || 'Sin registrar'}`,
        rawDate: p.createdAt,
      });
    });

    consultas.forEach((c) => {
      const esRef = esReferenciaMedica(c);
      actividades.push({
        id: `con-${c.id}`,
        hora: new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        fecha: new Date(c.createdAt).toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' }),
        tipo: esRef ? 'REFERENCIA' : 'CONSULTA',
        titulo: esRef ? `Referencia Médica: ${c.chiefComplaint}` : `Consulta Médica: ${c.chiefComplaint}`,
        lugar: c.patient?.address || `${brigada.municipality}, ${brigada.department}`,
        estado: c.status === 'COMPLETED' ? 'COMPLETADA' : 'EN_CURSO',
        responsable: `Dr(a). ${c.doctor.firstName} ${c.doctor.lastName}`,
        rawDate: c.createdAt,
      });
    });

    actividades.sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime());

    const equipo = [
      ...(brigada.leader
        ? [
            {
              id: brigada.leader.id,
              nombre: `${brigada.leader.firstName} ${brigada.leader.lastName}`,
              rol: brigada.leader.role === Role.DOCTOR ? 'Médico Responsable' : 'Coordinador de Brigada',
              email: brigada.leader.email,
              telefono: brigada.leader.phone,
              estado: brigada.leader.status === UserStatus.ACTIVE ? 'Activo en terreno' : 'Inactivo',
              esLider: true,
            },
          ]
        : []),
      ...brigada.members
        .filter((m) => m.user.id !== brigada.leaderId)
        .map((m) => ({
          id: m.user.id,
          nombre: `${m.user.firstName} ${m.user.lastName}`,
          rol:
            m.user.role === Role.DOCTOR
              ? 'Médico General'
              : m.user.role === Role.ADMIN
              ? 'Administrador Operativo'
              : 'Brigadista Comunitario',
          email: m.user.email,
          telefono: m.user.phone,
          estado: m.user.status === UserStatus.ACTIVE ? 'Activo en terreno' : 'Inactivo',
          esLider: false,
        })),
    ];

    type RecursoReal = {
      id: string;
      tipo: 'INSUMO' | 'EQUIPO' | 'DISPOSITIVO';
      nombre: string;
      detalle: string;
      estado: string;
    };

    const recursos: RecursoReal[] = [];

    brigada.supplyItems.forEach((s) => {
      const disponible = s.quantitySupplied - s.quantityDispensed - s.quantityWasted;
      recursos.push({
        id: `sup-${s.id}`,
        tipo: 'INSUMO',
        nombre: s.stock.resource.name,
        detalle: `Lote: ${s.stock.lotNumber} | Suministrado: ${s.quantitySupplied} ${s.stock.resource.unit} (Disp: ${disponible})`,
        estado: disponible > 0 ? 'DISPONIBLE' : 'AGOTADO',
      });
    });

    brigada.equipmentItems.forEach((eq) => {
      recursos.push({
        id: `eq-${eq.id}`,
        tipo: 'EQUIPO',
        nombre: eq.equipment.name,
        detalle: `Código: ${eq.equipment.code}${eq.equipment.model ? ` | Modelo: ${eq.equipment.model}` : ''} | Condición: ${eq.conditionOut}`,
        estado: eq.returnedAt ? 'DEVUELTO' : 'EN_USO',
      });
    });

    brigada.devices.forEach((dev) => {
      recursos.push({
        id: `dev-${dev.id}`,
        tipo: 'DISPOSITIVO',
        nombre: dev.device.name,
        detalle: `S/N: ${dev.device.serialNumber} | OS: ${dev.device.operatingSystem} | App: v${dev.device.appVersion}`,
        estado: dev.device.status,
      });
    });

    const fechaFormateada = ahora.toLocaleDateString('es-SV', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const estadoFinal: 'PROGRAMADA' | 'EN_CURSO' | 'FINALIZADA' = estaFinalizada
      ? 'FINALIZADA'
      : estaEnCurso
      ? 'EN_CURSO'
      : 'PROGRAMADA';

    return {
      identificacion: {
        id: brigada.id,
        nombre: brigada.name,
        comunidad: `${brigada.municipality}, ${brigada.department}`,
        municipio: brigada.municipality,
        departamento: brigada.department,
        fecha: fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1),
        estado: estadoFinal,
      },
      informacion: {
        nombreBrigada: brigada.name,
        departamento: brigada.department,
        municipio: brigada.municipality,
        coordenadas:
          brigada.latitude !== null && brigada.longitude !== null
            ? `${brigada.latitude.toFixed(4)}, ${brigada.longitude.toFixed(4)}`
            : null,
        fechaInicio: new Date(brigada.startDate).toLocaleDateString('es-SV', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }),
        fechaFin: brigada.endDate
          ? new Date(brigada.endDate).toLocaleDateString('es-SV', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })
          : null,
        responsable: brigada.leader ? `${brigada.leader.firstName} ${brigada.leader.lastName}` : 'No asignado',
        estadoBrigada: brigada.status,
      },
      control: {
        sesionId: sesionActiva?.id ?? null,
        estado: estadoFinal,
        horaInicio: horaInicioFormatted,
        horaFin: horaFinFormatted,
        tiempoTranscurrido,
        puedeIniciar: !sesionActiva && brigada.status !== BrigadeStatus.COMPLETED,
        puedeFinalizar: Boolean(sesionActiva),
      },
      actividades: actividades.map(({ rawDate, ...resto }) => resto),
      equipo,
      recursos,
    };
  }

  /**
   * Resumen colectivo de la Brigada Médica excluyendo pacientes eliminados lógicamente y registros web
   */
  async getResumenBrigada(userId: string) {
    const ahora = new Date();
    const inicioHoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate(), 0, 0, 0, 0);

    const sesionActiva = await prisma.workSession.findFirst({
      where: {
        brigadistaId: userId,
        status: 'STARTED',
      },
      include: {
        brigade: true,
      },
      orderBy: { startedAt: 'desc' },
    });

    let brigada: Brigade | null = sesionActiva?.brigade ?? null;

    if (!brigada) {
      const miembro = await prisma.brigadeMember.findFirst({
        where: {
          userId,
          brigade: {
            status: BrigadeStatus.ACTIVE,
            deletedAt: null,
          },
        },
        include: { brigade: true },
      });
      brigada = miembro?.brigade ?? null;
    }

    if (!brigada) {
      brigada = await prisma.brigade.findFirst({
        where: {
          deletedAt: null,
          status: { in: [BrigadeStatus.ACTIVE, BrigadeStatus.PLANNED] },
        },
        orderBy: { startDate: 'desc' },
      });
    }

    if (!brigada) {
      brigada = await prisma.brigade.findFirst({
        where: { deletedAt: null },
        orderBy: { startDate: 'desc' },
      });
    }

    if (!brigada) {
      return {
        identificacion: {
          id: '',
          nombre: 'Brigada Médica Territorial',
          comunidad: 'Territorio en Campo',
          municipio: 'San Miguel Tepezontes',
          departamento: 'La Paz',
          fecha: ahora.toLocaleDateString('es-SV', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }),
          enCurso: false,
        },
        metricas: {
          pacientes: 0,
          evaluaciones: 0,
          seguimientos: 0,
          referidos: 0,
        },
        estado: {
          enCurso: false,
          horaInicio: '08:00 AM',
          tiempoTranscurrido: '0 h 0 min',
          evaluacionesRealizadas: 0,
          totalPacientes: 0,
        },
        requiereAtencion: {
          seguimientosPendientes: 0,
          referenciasRealizadas: 0,
        },
      };
    }

    const enCurso = brigada.status === BrigadeStatus.ACTIVE || Boolean(sesionActiva);

    const [evaluaciones, pacientes, consultas] = await Promise.all([
      prisma.vitalSigns.findMany({
        where: { 
          deletedAt: null,
          patient: {
            deletedAt: null,
            user: { status: UserStatus.ACTIVE, deletedAt: null },
            originDeviceId: { notIn: DISPOSITIVOS_WEB_EXCLUIDOS },
          },
        },
        include: { patient: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.patient.findMany({
        where: { 
          deletedAt: null,
          user: { status: UserStatus.ACTIVE, deletedAt: null },
          OR: [
            {
              consultations: {
                some: {
                  brigadeId: brigada.id,
                  deletedAt: null,
                },
              },
            },
            {
              originDeviceId: {
                notIn: DISPOSITIVOS_WEB_EXCLUIDOS,
              },
            },
          ],
        },
        include: {
          vitalSigns: { where: { deletedAt: null } },
          consultations: { where: { deletedAt: null } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.consultation.findMany({
        where: { 
          deletedAt: null,
          brigadeId: brigada.id,
          patient: { deletedAt: null, user: { status: UserStatus.ACTIVE, deletedAt: null } },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ] as const);

    const riesgos = evaluaciones.filter(
      (vs) =>
        vs.systolic >= 140 ||
        vs.diastolic >= 90 ||
        vs.temperature >= 38.0 ||
        vs.oxygenSat <= 90
    );

    const totalReferenciasReales = consultas.filter((c) => esReferenciaMedica(c)).length;

    const fechaInicioTurno = sesionActiva?.startedAt || new Date(inicioHoy.getTime() + 8 * 60 * 60 * 1000);
    const diffMs = enCurso ? Math.max(0, ahora.getTime() - new Date(fechaInicioTurno).getTime()) : 0;
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const tiempoTranscurrido = `${diffHrs} h ${diffMins} min`;
    const horaInicio = new Date(fechaInicioTurno).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    const fechaFormateada = ahora.toLocaleDateString('es-SV', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    return {
      identificacion: {
        id: brigada.id,
        nombre: brigada.name,
        comunidad: `${brigada.municipality}, ${brigada.department}`,
        municipio: brigada.municipality,
        departamento: brigada.department,
        fecha: fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1),
        enCurso,
      },
      metricas: {
        pacientes: pacientes.length,
        evaluaciones: evaluaciones.length,
        seguimientos: riesgos.length,
        referidos: totalReferenciasReales,
      },
      estado: {
        enCurso,
        horaInicio,
        tiempoTranscurrido: enCurso ? tiempoTranscurrido : '0 h 0 min',
        evaluacionesRealizadas: evaluaciones.length,
        totalPacientes: pacientes.length,
      },
      requiereAtencion: {
        seguimientosPendientes: riesgos.length,
        referenciasRealizadas: totalReferenciasReales,
      },
    };
  }

  async getAllBrigades(filters?: BrigadeFilters) {
    const where: Prisma.BrigadeWhereInput = {
      deletedAt: null,
    };

    if (filters?.department && filters.department !== 'ALL') {
      where.department = { equals: filters.department, mode: 'insensitive' };
    }

    if (filters?.status && filters.status !== 'ALL') {
      where.status = filters.status;
    }

    if (filters?.search?.trim()) {
      const q = filters.search.trim();
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { department: { contains: q, mode: 'insensitive' } },
        { municipality: { contains: q, mode: 'insensitive' } },
      ];
    }

    const brigades = await prisma.brigade.findMany({
      where,
      include: {
        leader: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            role: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                role: true,
                status: true,
              },
            },
          },
        },
        _count: {
          select: {
            consultations: true,
            workSessions: true,
            supplyItems: true,
            equipmentItems: true,
            devices: true,
          },
        },
      },
      orderBy: { startDate: 'desc' },
    });

    return brigades.map((b) => ({
      id: b.id,
      name: b.name,
      department: b.department,
      municipality: b.municipality,
      latitude: b.latitude,
      longitude: b.longitude,
      status: b.status,
      startDate: b.startDate.toISOString(),
      endDate: b.endDate ? b.endDate.toISOString() : null,
      leaderId: b.leaderId,
      leader: b.leader
        ? {
            id: b.leader.id,
            fullName: `${b.leader.firstName} ${b.leader.lastName}`,
            email: b.leader.email,
            phone: b.leader.phone,
            role: b.leader.role,
          }
        : null,
      membersCount: b.members.length,
      members: b.members.map((m) => ({
        id: m.id,
        userId: m.user.id,
        fullName: `${m.user.firstName} ${m.user.lastName}`,
        email: m.user.email,
        phone: m.user.phone,
        role: m.user.role,
        status: m.user.status,
        joinedAt: m.joinedAt.toISOString(),
      })),
      totalConsultations: b._count.consultations,
      totalWorkSessions: b._count.workSessions,
      totalSuppliesAssigned: b._count.supplyItems,
      totalEquipmentAssigned: b._count.equipmentItems,
      totalDevicesAssigned: b._count.devices,
      createdAt: b.createdAt.toISOString(),
      updatedAt: b.updatedAt.toISOString(),
    }));
  }

  async getBrigadeById(id: string) {
    const b = await prisma.brigade.findFirst({
      where: { id, deletedAt: null },
      include: {
        leader: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            role: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                role: true,
                status: true,
              },
            },
          },
        },
        workSessions: {
          where: { status: 'STARTED' },
          include: {
            brigadista: {
              select: { id: true, firstName: true, lastName: true, email: true },
            },
          },
        },
        _count: {
          select: {
            consultations: true,
            workSessions: true,
            supplyItems: true,
            equipmentItems: true,
            devices: true,
          },
        },
      },
    });

    if (!b) return null;

    return {
      id: b.id,
      name: b.name,
      department: b.department,
      municipality: b.municipality,
      latitude: b.latitude,
      longitude: b.longitude,
      status: b.status,
      startDate: b.startDate.toISOString(),
      endDate: b.endDate ? b.endDate.toISOString() : null,
      leaderId: b.leaderId,
      leader: b.leader
        ? {
            id: b.leader.id,
            fullName: `${b.leader.firstName} ${b.leader.lastName}`,
            email: b.leader.email,
            phone: b.leader.phone,
            role: b.leader.role,
          }
        : null,
      members: b.members.map((m) => ({
        id: m.id,
        userId: m.user.id,
        fullName: `${m.user.firstName} ${m.user.lastName}`,
        email: m.user.email,
        phone: m.user.phone,
        role: m.user.role,
        status: m.user.status,
        joinedAt: m.joinedAt.toISOString(),
      })),
      activeWorkSessions: b.workSessions.map((ws) => ({
        id: ws.id,
        brigadistaId: ws.brigadistaId,
        brigadistaName: `${ws.brigadista.firstName} ${ws.brigadista.lastName}`,
        startedAt: ws.startedAt.toISOString(),
      })),
      totalConsultations: b._count.consultations,
      totalWorkSessions: b._count.workSessions,
      totalSuppliesAssigned: b._count.supplyItems,
      totalEquipmentAssigned: b._count.equipmentItems,
      totalDevicesAssigned: b._count.devices,
      createdAt: b.createdAt.toISOString(),
      updatedAt: b.updatedAt.toISOString(),
    };
  }

  async createBrigade(data: CreateBrigadeDTO) {
    const deviceId = data.originDeviceId || 'SERVER_CENTRAL';

    return prisma.$transaction(async (tx) => {
      if (data.leaderId) {
        const leader = await tx.user.findUnique({ where: { id: data.leaderId } });
        if (!leader || leader.deletedAt || leader.status !== UserStatus.ACTIVE) {
          throw new Error('El responsable seleccionado no es válido o está inactivo.');
        }
      }

      const brigade = await tx.brigade.create({
        data: {
          name: data.name.trim(),
          department: data.department.trim(),
          municipality: data.municipality.trim(),
          latitude: data.latitude ?? null,
          longitude: data.longitude ?? null,
          status: BrigadeStatus.PLANNED,
          startDate: new Date(data.startDate),
          endDate: data.endDate ? new Date(data.endDate) : null,
          leaderId: data.leaderId ?? null,
          syncStatus: SyncStatus.SYNCED,
          version: 1,
          originDeviceId: deviceId,
          lastModifiedByDeviceId: deviceId,
        },
      });

      const membersToInsert = new Set<string>(data.memberIds || []);
      if (data.leaderId) {
        membersToInsert.add(data.leaderId);
      }

      if (membersToInsert.size > 0) {
        await tx.brigadeMember.createMany({
          data: Array.from(membersToInsert).map((userId) => ({
            brigadeId: brigade.id,
            userId,
          })),
          skipDuplicates: true,
        });
      }

      return brigade;
    });
  }

  async updateBrigade(id: string, data: UpdateBrigadeDTO) {
    const deviceId = data.originDeviceId || 'SERVER_CENTRAL';

    return prisma.$transaction(async (tx) => {
      const existing = await tx.brigade.findUnique({ where: { id } });
      if (!existing || existing.deletedAt) {
        throw new Error('La brigada no existe.');
      }

      if (data.leaderId) {
        const leader = await tx.user.findUnique({ where: { id: data.leaderId } });
        if (!leader || leader.deletedAt) {
          throw new Error('El líder especificado no existe.');
        }
      }

      return tx.brigade.update({
        where: { id },
        data: {
          ...(data.name && { name: data.name.trim() }),
          ...(data.department && { department: data.department.trim() }),
          ...(data.municipality && { municipality: data.municipality.trim() }),
          ...(data.latitude !== undefined && { latitude: data.latitude }),
          ...(data.longitude !== undefined && { longitude: data.longitude }),
          ...(data.startDate && { startDate: new Date(data.startDate) }),
          ...(data.endDate !== undefined && {
            endDate: data.endDate ? new Date(data.endDate) : null,
          }),
          ...(data.leaderId !== undefined && { leaderId: data.leaderId }),
          ...(data.status && { status: data.status }),
          version: { increment: 1 },
          lastModifiedByDeviceId: deviceId,
        },
      });
    });
  }

  async updateBrigadeStatus(id: string, status: BrigadeStatus, deviceId: string = 'SERVER_CENTRAL') {
    const brigade = await prisma.brigade.findUnique({ where: { id } });
    if (!brigade || brigade.deletedAt) {
      throw new Error('La brigada no existe.');
    }

    return prisma.brigade.update({
      where: { id },
      data: {
        status,
        ...(status === BrigadeStatus.COMPLETED && !brigade.endDate ? { endDate: new Date() } : {}),
        version: { increment: 1 },
        lastModifiedByDeviceId: deviceId,
      },
    });
  }

  async assignLeader(brigadeId: string, leaderId: string | null, deviceId: string = 'SERVER_CENTRAL') {
    return prisma.$transaction(async (tx) => {
      const brigade = await tx.brigade.findUnique({ where: { id: brigadeId } });
      if (!brigade || brigade.deletedAt) {
        throw new Error('La brigada no existe.');
      }

      if (leaderId) {
        const user = await tx.user.findUnique({ where: { id: leaderId } });
        if (!user || user.deletedAt || user.status !== UserStatus.ACTIVE) {
          throw new Error('El usuario designado como líder no es válido o está inactivo.');
        }

        await tx.brigadeMember.upsert({
          where: {
            userId_brigadeId: {
              userId: leaderId,
              brigadeId,
            },
          },
          create: { userId: leaderId, brigadeId },
          update: {},
        });
      }

      return tx.brigade.update({
        where: { id: brigadeId },
        data: {
          leaderId,
          version: { increment: 1 },
          lastModifiedByDeviceId: deviceId,
        },
      });
    });
  }

  async addMembers(brigadeId: string, userIds: string[]) {
    return prisma.$transaction(async (tx) => {
      const brigade = await tx.brigade.findUnique({ where: { id: brigadeId } });
      if (!brigade || brigade.deletedAt) {
        throw new Error('La brigada no existe.');
      }

      const validUsers = await tx.user.findMany({
        where: {
          id: { in: userIds },
          deletedAt: null,
          status: UserStatus.ACTIVE,
        },
      });

      if (validUsers.length === 0) {
        throw new Error('No se encontraron usuarios válidos para asignar.');
      }

      await tx.brigadeMember.createMany({
        data: validUsers.map((u) => ({
          brigadeId,
          userId: u.id,
        })),
        skipDuplicates: true,
      });

      return { success: true, count: validUsers.length };
    });
  }

  async removeMember(brigadeId: string, userId: string) {
    return prisma.$transaction(async (tx) => {
      const brigade = await tx.brigade.findUnique({ where: { id: brigadeId } });
      if (brigade?.leaderId === userId) {
        await tx.brigade.update({
          where: { id: brigadeId },
          data: { leaderId: null },
        });
      }

      await tx.brigadeMember.deleteMany({
        where: { brigadeId, userId },
      });

      return { success: true };
    });
  }

  async deleteBrigade(id: string, deviceId: string = 'SERVER_CENTRAL') {
    return prisma.brigade.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        status: BrigadeStatus.CANCELLED,
        version: { increment: 1 },
        lastModifiedByDeviceId: deviceId,
      },
    });
  }

  async getEligiblePersonnel() {
    return prisma.user.findMany({
      where: {
        deletedAt: null,
        status: UserStatus.ACTIVE,
        role: { in: [Role.DOCTOR, Role.BRIGADISTA, Role.ADMIN] },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        status: true,
      },
      orderBy: [{ role: 'asc' }, { lastName: 'asc' }],
    });
  }
}

export const brigadesService = new BrigadesService();