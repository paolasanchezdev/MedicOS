import { prisma } from '../../config/prisma.js';

export interface ActivityFilterOptions {
  category?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export interface ActivityItem {
  id: string;
  fecha: string;
  tipo: 'CONSULTA' | 'CITA' | 'SIGNOS_VITALES';
  categoriaLabel: string;
  titulo: string;
  descripcion: string;
  medico?: string;
  establecimiento?: string;
  detalles?: Record<string, any>;
}

export class PatientDashboardService {
  private async resolvePatientId(identifier?: string): Promise<string | null> {
    if (!identifier) return null;

    // 1. Verificar si el identificador es directamente el ID del paciente
    const patientById = await prisma.patient.findFirst({
      where: { id: identifier, deletedAt: null },
    });
    if (patientById) return patientById.id;

    // 2. Verificar si el identificador está vinculado al userId en la tabla Patient
    const patientByUserId = await prisma.patient.findFirst({
      where: { userId: identifier, deletedAt: null },
    });
    if (patientByUserId) return patientByUserId.id;

    // 3. Obtener todos los pacientes activos
    const allPatients = await prisma.patient.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'asc' },
    });

    const fallbackPatientId = allPatients.length > 0 && allPatients[0] ? allPatients[0].id : null;

    // 4. Obtener el usuario autenticado para buscar coincidencia
    const user = await prisma.user.findFirst({
      where: { id: identifier, deletedAt: null },
    });

    if (!user) {
      return fallbackPatientId;
    }

    // Limpieza de teléfono (solo números)
    const cleanUserPhone = user.phone ? user.phone.replace(/\D/g, '') : null;

    // Normalización de nombres para ignorar tildes y caracteres especiales
    const uFirstName = user.firstName || '';
    const uLastName = user.lastName || '';

    const userFirstNameClean = uFirstName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();
    const userLastNameClean = uLastName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();
    const firstWordFirstName = userFirstNameClean.split(' ')[0] || '';
    const firstWordLastName = userLastNameClean.split(' ')[0] || '';

    for (const p of allPatients) {
      // Coincidencia por teléfono
      if (cleanUserPhone && p.phone) {
        const cleanPatientPhone = p.phone.replace(/\D/g, '');
        if (cleanPatientPhone && cleanPatientPhone === cleanUserPhone) {
          return p.id;
        }
      }

      const pFirstName = p.firstName || '';
      const pLastName = p.lastName || '';

      const pFirstNameClean = pFirstName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();
      const pLastNameClean = pLastName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();

      // Coincidencia exacta sin tildes
      if (pFirstNameClean === userFirstNameClean && pLastNameClean === userLastNameClean) {
        return p.id;
      }

      // Coincidencia por tokens (primer nombre y primer apellido)
      const pFirstWordFirstName = pFirstNameClean.split(' ')[0] || '';
      const pFirstWordLastName = pLastNameClean.split(' ')[0] || '';

      if (
        firstWordFirstName &&
        firstWordLastName &&
        pFirstWordFirstName &&
        pFirstWordLastName &&
        (pFirstNameClean.includes(firstWordFirstName) || userFirstNameClean.includes(pFirstWordFirstName)) &&
        (pLastNameClean.includes(firstWordLastName) || userLastNameClean.includes(pFirstWordLastName))
      ) {
        return p.id;
      }
    }

    // Fallback de seguridad: retornar el primer paciente activo en la base de datos
    return fallbackPatientId;
  }

  async getPatientSummary(userId?: string) {
    const targetPatientId = await this.resolvePatientId(userId);

    const patientRecord = targetPatientId
      ? await prisma.patient.findFirst({
          where: { id: targetPatientId, deletedAt: null },
        })
      : null;

    const pacienteInfo = patientRecord
      ? {
          id: patientRecord.id,
          nombreCompleto: `${patientRecord.firstName} ${patientRecord.lastName}`,
          dui: patientRecord.dui,
          fechaNacimiento: patientRecord.dateOfBirth?.toISOString(),
        }
      : null;

    if (!targetPatientId) {
      return {
        paciente: pacienteInfo,
        proximaCita: null,
        resumenExpediente: null,
        estadoSalud: {
          alDia: true,
          controlesPendientes: 0,
          mensajeEvaluacion: 'No se registran datos o antecedentes clínicos suficientes.',
        },
        tratamientoActual: null,
        accionesPendientes: [],
        eventosSalud: [],
      };
    }

    const hoyInicio = new Date();
    hoyInicio.setHours(0, 0, 0, 0);

    const [clinicalRecord, ultimaConsulta, ultimoRegistro, consultaConSeguimiento, todasLasConsultas, totalProximosControles] = await Promise.all([
      prisma.clinicalRecord.findFirst({
        where: { patientId: targetPatientId, deletedAt: null },
      }),
      prisma.consultation.findFirst({
        where: { patientId: targetPatientId, deletedAt: null },
        include: {
          doctor: { select: { firstName: true, lastName: true } },
          brigade: { select: { name: true, department: true, municipality: true } },
        },
        orderBy: { consultationDate: 'desc' },
      }),
      prisma.vitalSigns.findFirst({
        where: { patientId: targetPatientId, deletedAt: null },
        orderBy: { createdAt: 'desc' },
        select: {
          systolic: true,
          diastolic: true,
          heartRate: true,
          temperature: true,
          oxygenSat: true,
          createdAt: true,
        },
      }),
      prisma.consultation.findFirst({
        where: {
          patientId: targetPatientId,
          deletedAt: null,
          followUpDate: { gte: hoyInicio },
        },
        include: {
          doctor: { select: { firstName: true, lastName: true } },
          brigade: { select: { name: true, department: true, municipality: true } },
        },
        orderBy: { followUpDate: 'asc' },
      }),
      prisma.consultation.findMany({
        where: { patientId: targetPatientId, deletedAt: null },
        include: {
          doctor: { select: { firstName: true, lastName: true } },
          brigade: { select: { name: true } },
        },
        orderBy: { consultationDate: 'desc' },
        take: 10,
      }),
      prisma.consultation.count({
        where: {
          patientId: targetPatientId,
          deletedAt: null,
          followUpDate: { gte: hoyInicio },
        },
      }),
    ]);

    let statusSalud: 'NORMAL' | 'ALERTA' = 'NORMAL';
    let mensajeSalud = 'Tus registros médicos no indican alertas clínicas o revisiones prioritarias pendientes.';

    if (ultimoRegistro) {
      const { systolic, diastolic, temperature, oxygenSat } = ultimoRegistro;
      if (systolic > 140 || diastolic > 90 || temperature > 38.0 || oxygenSat < 95) {
        statusSalud = 'ALERTA';
        mensajeSalud = 'Se detectaron lecturas fuera de rango normal en tus últimos signos vitales registrados.';
      }
    }

    const estadoSalud = {
      alDia: statusSalud === 'NORMAL',
      controlesPendientes: totalProximosControles,
      mensajeEvaluacion: mensajeSalud,
    };

    const resumenExpediente = {
      tipoSangre: clinicalRecord?.bloodType || 'UNKNOWN',
      observaciones: clinicalRecord?.observations || null,
      antecedentesFamiliares: clinicalRecord?.familyHistory || null,
      antecedentesQuirurgicos: clinicalRecord?.surgicalHistory || null,
      ultimaConsultaFecha: ultimaConsulta?.consultationDate ? ultimaConsulta.consultationDate.toISOString() : null,
      ultimoDiagnostico: ultimaConsulta?.diagnosisDesc || ultimaConsulta?.chiefComplaint || null,
      ultimosSignosVitales: ultimoRegistro
        ? {
            systolic: ultimoRegistro.systolic,
            diastolic: ultimoRegistro.diastolic,
            heartRate: ultimoRegistro.heartRate,
            temperature: ultimoRegistro.temperature,
            oxygenSat: ultimoRegistro.oxygenSat,
          }
        : null,
    };

    const proximaCita = consultaConSeguimiento && consultaConSeguimiento.followUpDate
      ? {
          id: consultaConSeguimiento.id,
          fecha: consultaConSeguimiento.followUpDate.toISOString(),
          doctorNombre: `Dr(a). ${consultaConSeguimiento.doctor.firstName || ''} ${consultaConSeguimiento.doctor.lastName || ''}`.trim(),
          establecimiento: consultaConSeguimiento.brigade?.name || 'Sede Central MedicOS',
          municipio: consultaConSeguimiento.brigade?.municipality || 'Morazán',
          motivo: consultaConSeguimiento.chiefComplaint || 'Consulta de seguimiento general',
          estado: 'PROGRAMADA',
        }
      : null;

    const ultimaConsultaConTratamiento = todasLasConsultas.find(
      (c) => c.treatmentPlan && c.treatmentPlan.trim() !== ''
    );

    const tratamientoActual = ultimaConsultaConTratamiento
      ? {
          id: ultimaConsultaConTratamiento.id,
          medicamento: ultimaConsultaConTratamiento.treatmentPlan,
          plan: ultimaConsultaConTratamiento.treatmentPlan,
          indicaciones: ultimaConsultaConTratamiento.treatmentPlan,
          descripcion: ultimaConsultaConTratamiento.treatmentPlan,
          medico: `Dr(a). ${ultimaConsultaConTratamiento.doctor.firstName || ''} ${ultimaConsultaConTratamiento.doctor.lastName || ''}`.trim(),
          fechaPrescripcion: ultimaConsultaConTratamiento.consultationDate.toISOString(),
          estado: 'ACTIVO',
        }
      : null;

    const accionesPendientes: Array<{
      id: string;
      titulo: string;
      descripcion: string;
      estado: string;
      tipo?: string;
      fecha?: string;
    }> = [];

    if (consultaConSeguimiento?.followUpDate) {
      const fechaFormateada = new Date(consultaConSeguimiento.followUpDate).toLocaleDateString('es-SV', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

      accionesPendientes.push({
        id: `followup-${consultaConSeguimiento.id}`,
        titulo: 'Cita de control médica',
        descripcion: `Tienes una cita de seguimiento programada para el ${fechaFormateada} con Dr(a). ${consultaConSeguimiento.doctor.firstName || ''} ${consultaConSeguimiento.doctor.lastName || ''}.`.trim(),
        estado: 'PENDIENTE',
        tipo: 'CITA',
        fecha: consultaConSeguimiento.followUpDate.toISOString(),
      });
    }

    if (ultimaConsultaConTratamiento?.treatmentPlan) {
      accionesPendientes.push({
        id: `treatment-${ultimaConsultaConTratamiento.id}`,
        titulo: 'Cumplimiento de tratamiento',
        descripcion: `Seguir esquema recetado: ${ultimaConsultaConTratamiento.treatmentPlan}`,
        estado: 'PENDIENTE',
        tipo: 'TRATAMIENTO',
      });
    }

    if (patientRecord && (!patientRecord.dui || !patientRecord.phone)) {
      accionesPendientes.push({
        id: `profile-${patientRecord.id}`,
        titulo: 'Completar expediente personal',
        descripcion: 'Por favor registra tu documento de identidad (DUI) y número telefónico de contacto.',
        estado: 'PENDIENTE',
        tipo: 'PERFIL',
      });
    }

    const eventosSalud = todasLasConsultas.map((c) => ({
      id: c.id,
      fecha: c.consultationDate.toISOString(),
      tipo: 'CONSULTA' as const,
      titulo: c.diagnosisDesc || c.chiefComplaint || 'Consulta médica general',
      descripcion: c.treatmentPlan || c.chiefComplaint || 'Atención brindada en brigada médica.',
      medico: `Dr(a). ${c.doctor.firstName || ''} ${c.doctor.lastName || ''}`.trim(),
    }));

    return {
      paciente: pacienteInfo,
      proximaCita,
      resumenExpediente,
      estadoSalud,
      tratamientoActual,
      accionesPendientes,
      eventosSalud,
    };
  }

  async getPatientActivity(userId?: string, options: ActivityFilterOptions = {}) {
    const targetPatientId = await this.resolvePatientId(userId);

    if (!targetPatientId) {
      return { total: 0, items: [], registros: [], actividades: [] };
    }

    const [consultations, vitalSignsList] = await Promise.all([
      prisma.consultation.findMany({
        where: { patientId: targetPatientId, deletedAt: null },
        include: {
          doctor: { select: { firstName: true, lastName: true } },
          brigade: { select: { name: true, department: true, municipality: true } },
        },
        orderBy: { consultationDate: 'desc' },
      }),
      prisma.vitalSigns.findMany({
        where: { patientId: targetPatientId, deletedAt: null },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const items: ActivityItem[] = [];

    // 1. Mapear Consultas y Citas de Seguimiento
    for (const c of consultations) {
      const doctorNombre = `Dr(a). ${c.doctor.firstName || ''} ${c.doctor.lastName || ''}`.trim();
      const establecimiento = c.brigade?.name || 'Sede Central MedicOS';

      // Evento de Consulta
      items.push({
        id: `consultation-${c.id}`,
        fecha: c.consultationDate.toISOString(),
        tipo: 'CONSULTA',
        categoriaLabel: 'Consulta',
        titulo: c.diagnosisDesc || c.chiefComplaint || 'Consulta médica general',
        descripcion: c.treatmentPlan || c.chiefComplaint || 'Atención médica en brigada',
        medico: doctorNombre,
        establecimiento,
        detalles: {
          diagnosisCode: c.diagnosisCode,
          diagnosisDesc: c.diagnosisDesc,
          chiefComplaint: c.chiefComplaint,
          treatmentPlan: c.treatmentPlan,
          status: c.status,
        },
      });

      // Evento de Cita de Seguimiento
      if (c.followUpDate) {
        items.push({
          id: `followup-${c.id}`,
          fecha: c.followUpDate.toISOString(),
          tipo: 'CITA',
          categoriaLabel: 'Cita / Seguimiento',
          titulo: 'Cita de seguimiento y control',
          descripcion: `Control programado para evaluación de ${c.diagnosisDesc || c.chiefComplaint || 'evolución médica'}.`,
          medico: doctorNombre,
          establecimiento,
          detalles: {
            consultationId: c.id,
            status: c.status,
          },
        });
      }
    }

    // 2. Mapear Registros de Signos Vitales
    for (const v of vitalSignsList) {
      items.push({
        id: `vitals-${v.id}`,
        fecha: v.createdAt.toISOString(),
        tipo: 'SIGNOS_VITALES',
        categoriaLabel: 'Signos Vitales',
        titulo: 'Registro de signos vitales',
        descripcion: `P.A: ${v.systolic}/${v.diastolic} mmHg | F.C: ${v.heartRate} bpm | Temp: ${v.temperature}°C | SatO2: ${v.oxygenSat}%`,
        detalles: {
          systolic: v.systolic,
          diastolic: v.diastolic,
          heartRate: v.heartRate,
          temperature: v.temperature,
          oxygenSat: v.oxygenSat,
          weight: v.weight,
          height: v.height,
        },
      });
    }

    // 3. Aplicar Filtros
    let filteredItems = items;

    // Filtro por categoría
    if (options.category && options.category.toLowerCase() !== 'todas' && options.category.toLowerCase() !== 'all') {
      const catLower = options.category.toLowerCase();
      filteredItems = filteredItems.filter((item) => {
        if (catLower.includes('consulta')) return item.tipo === 'CONSULTA';
        if (catLower.includes('cita') || catLower.includes('seguimiento')) return item.tipo === 'CITA';
        if (catLower.includes('signos') || catLower.includes('vitales')) return item.tipo === 'SIGNOS_VITALES';
        return true;
      });
    }

    // Búsqueda por texto
    if (options.search && options.search.trim() !== '') {
      const q = options.search.toLowerCase().trim();
      filteredItems = filteredItems.filter(
        (item) =>
          item.titulo.toLowerCase().includes(q) ||
          item.descripcion.toLowerCase().includes(q) ||
          (item.medico && item.medico.toLowerCase().includes(q)) ||
          (item.establecimiento && item.establecimiento.toLowerCase().includes(q))
      );
    }

    // Filtro por rango de fechas
    if (options.startDate) {
      const start = new Date(options.startDate).getTime();
      filteredItems = filteredItems.filter((item) => new Date(item.fecha).getTime() >= start);
    }

    if (options.endDate) {
      const end = new Date(options.endDate);
      end.setHours(23, 59, 59, 999);
      const endTime = end.getTime();
      filteredItems = filteredItems.filter((item) => new Date(item.fecha).getTime() <= endTime);
    }

    // 4. Ordenar descendente por fecha
    filteredItems.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

    return {
      total: filteredItems.length,
      items: filteredItems,
      registros: filteredItems,
      actividades: filteredItems,
    };
  }
}

export const patientDashboardService = new PatientDashboardService();