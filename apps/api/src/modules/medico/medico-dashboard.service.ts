// =========================================================================
// ARCHIVO: apps/api/src/modules/medico/medico-dashboard.service.ts
// DESCRIPCIÓN: Servicio para la agregación de métricas, resumen y actividad del Médico.
// =========================================================================

import { PrismaClient, ConsultationStatus, BrigadeStatus } from '@prisma/client';

const prisma = new PrismaClient();

export class MedicoDashboardService {
  async getResumenDashboard(medicoId: string) {
    // 1. Rango del día actual contemplando margen de zonas horarias
    const ahora = new Date();
    const inicioHoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate(), 0, 0, 0, 0);
    const finHoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate(), 23, 59, 59, 999);

    // 2. Buscar brigada activa asignada al médico
    const brigadaMiembro = await prisma.brigadeMember.findFirst({
      where: {
        userId: medicoId,
        brigade: {
          status: BrigadeStatus.ACTIVE,
        },
      },
      include: {
        brigade: true,
      },
    });

    const activeBrigadeId = brigadaMiembro?.brigadeId;

    // 3. Consultas del día (asignadas al médico o pertenecientes a su brigada activa)
    const consultasHoy = await prisma.consultation.findMany({
      where: {
        OR: [
          {
            doctorId: medicoId,
            consultationDate: {
              gte: inicioHoy,
              lte: finHoy,
            },
          },
          ...(activeBrigadeId
            ? [
                {
                  brigadeId: activeBrigadeId,
                  createdAt: {
                    gte: inicioHoy,
                    lte: finHoy,
                  },
                },
              ]
            : []),
        ],
      },
      include: {
        patient: true,
      },
      orderBy: {
        consultationDate: 'asc',
      },
    });

    // Mapeo y filtrado por estado
    const total = consultasHoy.length;
    const atendidas = consultasHoy.filter((c) => c.status === ConsultationStatus.COMPLETED).length;
    const pendientesList = consultasHoy.filter(
      (c) => c.status === ConsultationStatus.DRAFT || c.status === ConsultationStatus.IN_PROGRESS
    );
    const pendientes = pendientesList.length;
    const canceladas = consultasHoy.filter((c) => c.status === ConsultationStatus.CANCELLED).length;

    // 4. Pacientes pendientes
    const pacientesPendientes = pendientesList.map((c) => ({
      id: c.id,
      nombre: c.patient ? `${c.patient.firstName} ${c.patient.lastName}` : 'Paciente no registrado',
      tipo: 'consulta' as const,
      detalle: c.chiefComplaint || 'Consulta pendiente de atención',
      hora: c.consultationDate
        ? new Date(c.consultationDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }));

    // 5. Próxima consulta y siguientes en agenda
    const proximaConsultaRaw = pendientesList[0];
    const proxima = proximaConsultaRaw
      ? {
          id: proximaConsultaRaw.id,
          hora: proximaConsultaRaw.consultationDate
            ? new Date(proximaConsultaRaw.consultationDate).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })
            : new Date(proximaConsultaRaw.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              }),
          paciente: proximaConsultaRaw.patient
            ? `${proximaConsultaRaw.patient.firstName} ${proximaConsultaRaw.patient.lastName}`
            : 'Paciente Desconocido',
          tipo: 'Consulta Médica General',
          motivo: proximaConsultaRaw.chiefComplaint || 'Atención médica',
        }
      : null;

    const siguientes = pendientesList.slice(1, 4).map((c) => ({
      hora: c.consultationDate
        ? new Date(c.consultationDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      paciente: c.patient ? `${c.patient.firstName} ${c.patient.lastName}` : 'Paciente Desconocido',
    }));

    // 6. Alertas clínicas (Signos vitales alterados registrados hoy)
    const signosAnormales = await prisma.vitalSigns.findMany({
      where: {
        createdAt: { gte: inicioHoy },
        OR: [
          { systolic: { gte: 140 } },
          { diastolic: { gte: 90 } },
          { temperature: { gte: 38.0 } },
          { oxygenSat: { lte: 90 } },
        ],
      },
      include: {
        patient: true,
      },
      take: 5,
      orderBy: { createdAt: 'desc' },
    });

    const alertasClinicas = signosAnormales.map((vs) => {
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
        paciente: vs.patient ? `${vs.patient.firstName} ${vs.patient.lastName}` : 'Paciente Desconocido',
        tiempo: new Date(vs.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
    });

    // 7. Construcción de información del Estado de Jornada
    let estadoJornada = {
      activa: false,
      brigadaNombre: '',
      inicio: '',
      atendidos: 0,
      pendientes: 0,
      ubicacion: undefined as string | undefined,
      latitud: undefined as number | undefined,
      longitud: undefined as number | undefined,
    };

    if (brigadaMiembro) {
      const brigade = brigadaMiembro.brigade;
      const consultasBrigadaTotal = await prisma.consultation.count({
        where: { brigadeId: brigade.id },
      });
      const atendidasBrigada = await prisma.consultation.count({
        where: { brigadeId: brigade.id, status: ConsultationStatus.COMPLETED },
      });
      const canceladasBrigada = await prisma.consultation.count({
        where: { brigadeId: brigade.id, status: ConsultationStatus.CANCELLED },
      });

      estadoJornada = {
        activa: true,
        brigadaNombre: `${brigade.name} (${brigade.municipality}, ${brigade.department})`,
        inicio: new Date(brigade.startDate).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        atendidos: atendidasBrigada,
        pendientes: Math.max(0, consultasBrigadaTotal - atendidasBrigada - canceladasBrigada),
        ubicacion: `${(brigade as any).location || brigade.name}, ${brigade.municipality}, ${brigade.department}`,
        latitud: (brigade as any).latitude ?? undefined,
        longitud: (brigade as any).longitude ?? undefined,
      };
    }

    // 8. Seguimientos pendientes
    const seguimientosRaw = await prisma.consultation.findMany({
      where: {
        doctorId: medicoId,
        followUpDate: {
          not: null,
        },
        status: ConsultationStatus.COMPLETED,
      },
      include: {
        patient: true,
      },
      orderBy: {
        followUpDate: 'asc',
      },
      take: 5,
    });

    const seguimientosPendientes = seguimientosRaw.map((s) => {
      const hoyStr = new Date().toDateString();
      const fechaSegStr = s.followUpDate ? new Date(s.followUpDate).toDateString() : '';
      let vencimiento = 'Programado';

      if (s.followUpDate) {
        if (fechaSegStr === hoyStr) {
          vencimiento = 'Hoy';
        } else if (new Date(s.followUpDate) < new Date()) {
          vencimiento = 'Vencido';
        } else {
          vencimiento = new Date(s.followUpDate).toLocaleDateString();
        }
      }

      return {
        id: s.id,
        paciente: s.patient ? `${s.patient.firstName} ${s.patient.lastName}` : 'Paciente Desconocido',
        motivo: s.diagnosisDesc || s.chiefComplaint || 'Seguimiento clínico',
        vencimiento,
      };
    });

    // 9. Consultas recientes completadas
    const consultasRecientesRaw = await prisma.consultation.findMany({
      where: {
        doctorId: medicoId,
        status: ConsultationStatus.COMPLETED,
      },
      include: {
        patient: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      take: 5,
    });

    const consultasRecientes = consultasRecientesRaw.map((c) => ({
      id: c.id,
      paciente: c.patient ? `${c.patient.firstName} ${c.patient.lastName}` : 'Paciente Desconocido',
      fechaHora: new Date(c.updatedAt).toLocaleString([], {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
      estado: 'Completada',
    }));

    return {
      resumenConsultas: {
        total,
        atendidas,
        pendientes,
        canceladas,
      },
      pacientesPendientes,
      alertasClinicas,
      agendaProxima: {
        proxima,
        siguientes,
      },
      estadoJornada,
      seguimientosPendientes,
      consultasRecientes,
    };
  }

  async getActividadClinica(medicoId: string, options: { page: number; limit: number; search?: string; action?: string; status?: string; startDate?: string }) {
    const { page, limit, search, status } = options;
    const skip = (page - 1) * limit;

    const whereClause: any = {
      doctorId: medicoId,
    };

    if (status) {
      whereClause.status = status;
    }

    if (search) {
      whereClause.OR = [
        { patient: { firstName: { contains: search, mode: 'insensitive' } } },
        { patient: { lastName: { contains: search, mode: 'insensitive' } } },
        { patient: { dui: { contains: search, mode: 'insensitive' } } },
        { diagnosisDesc: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [totalItems, consultations] = await Promise.all([
      prisma.consultation.count({ where: whereClause }),
      prisma.consultation.findMany({
        where: whereClause,
        include: { patient: true },
        orderBy: { consultationDate: 'asc' }, // Orden cronológico correcto de la jornada
        skip,
        take: limit,
      }),
    ]);

    const items = consultations.map((c) => ({
      id: c.id,
      action: c.status === ConsultationStatus.COMPLETED ? 'Consulta Completada' : 'Atención en Proceso',
      actionLabel: c.status,
      description: c.diagnosisDesc || c.chiefComplaint || 'Sin observaciones registradas',
      patientName: c.patient ? `${c.patient.firstName} ${c.patient.lastName}` : 'Paciente no registrado',
      patientDui: c.patient?.dui || 'N/D',
      status: c.status,
      createdAt: (c.consultationDate || c.createdAt).toISOString(),
    }));

    const totalPages = Math.ceil(totalItems / limit) || 1;

    return {
      items,
      meta: {
        totalItems,
        currentPage: page,
        totalPages,
        itemsPerPage: limit,
      },
    };
  }
}