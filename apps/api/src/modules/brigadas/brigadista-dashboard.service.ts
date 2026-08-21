// =========================================================================
// ARCHIVO: apps/api/src/modules/brigades/brigadista-dashboard.service.ts
// DESCRIPCIÓN: Servicio para agregación de métricas y resumen del Brigadista.
// =========================================================================

import { prisma } from '../../config/prisma.js';
import { BrigadeStatus, SessionStatus } from '@prisma/client';

export class BrigadistaDashboardService {
  async getResumenDashboard(brigadistaId: string) {
    // 1. Definir rango temporal del día de hoy
    const ahora = new Date();
    const inicioHoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate(), 0, 0, 0, 0);
    const finHoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate(), 23, 59, 59, 999);

    // 2. Buscar jornada activa del brigadista
    const jornadaActiva = await prisma.workSession.findFirst({
      where: {
        brigadistaId: brigadistaId,
        status: SessionStatus.STARTED,
      },
      include: {
        brigade: true,
      },
    });

    // 3. Obtener ID de brigada (desde la jornada activa o desde la pertenencia)
    let activeBrigadeId = jornadaActiva?.brigadeId;

    if (!activeBrigadeId) {
      const brigadaMiembro = await prisma.brigadeMember.findFirst({
        where: {
          userId: brigadistaId,
          brigade: { status: BrigadeStatus.ACTIVE },
        },
        select: { brigadeId: true },
      });
      activeBrigadeId = brigadaMiembro?.brigadeId;
    }

    // 4. Obtener tomas de signos vitales / triajes del día
    const triajesHoy = await prisma.vitalSigns.findMany({
      where: {
        createdAt: {
          gte: inicioHoy,
          lte: finHoy,
        },
        deletedAt: null,
      },
      include: {
        patient: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const totalTriajes = triajesHoy.length;

    // Filtrar signos vitales con parámetros fuera de rango
    const alertasTriaje = triajesHoy.filter(
      (vs) =>
        vs.systolic >= 140 ||
        vs.diastolic >= 90 ||
        vs.temperature >= 38.0 ||
        vs.oxygenSat <= 90
    );

    // 5. Consultar pacientes registrados hoy pendientes de triaje
    const pacientesRegistradosHoy = await prisma.patient.findMany({
      where: {
        createdAt: {
          gte: inicioHoy,
          lte: finHoy,
        },
        deletedAt: null,
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

    // 6. Mapear próximo paciente en lista de espera
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

    // 7. Mapear último paciente atendido
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

    // 8. Mapear alertas clínicas
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

    // 9. Mapear cola de pacientes en espera
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

    // 10. Estado de la Jornada activa con verificación nula segura
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

    // 11. Historial reciente
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
}

export const brigadistaDashboardService = new BrigadistaDashboardService();