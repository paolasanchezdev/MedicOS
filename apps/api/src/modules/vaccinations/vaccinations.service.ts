// =========================================================================
// ARCHIVO: apps/api/src/modules/vaccinations/vaccinations.service.ts
// DESCRIPCIÓN: Servicio de negocio con catálogo oficial Esquema MINSAL 2026,
//              persistencia en PostgreSQL (Prisma), auditoría y métricas reales.
// =========================================================================

import { prisma } from '../../config/prisma.js';
import { BaseService } from '../../services/base.service.js';
import type {
  VaccineCatalogItem,
  CreateVaccinationDTO,
  VaccinationRecord,
  VaccinationSummaryDTO,
  GetAllVaccinationsFilters,
  AdministrationRoute,
  AnatomicalSite,
  RegistrationTrendDay,
} from './vaccinations.types.js';

// =========================================================================
// CATÁLOGO OFICIAL: ESQUEMA NACIONAL DE VACUNACIÓN MINSAL 2026 (EL SALVADOR)
// =========================================================================
const MINSAL_VACCINE_CATALOG_2026: VaccineCatalogItem[] = [
  // 1. RECIÉN NACIDOS/AS
  {
    id: 'minsal-hb-rn',
    code: 'HB_RN',
    name: 'Hepatitis B Pediátrica (Dosis de Recién Nacido)',
    targetDisease: 'Hepatitis B / Prevención de transmisión vertical perinatal',
    minAgeMonths: 0,
    maxAgeMonths: 1,
    doseNumber: 1,
    totalDoses: 1,
    route: 'INTRAMUSCULAR',
    anatomicalSiteDefault: 'VASTO_LATERAL_IZQUIERDO',
    isRequired: true,
    description: 'Primeras 12 a 24 horas de vida del recién nacido.',
  },
  {
    id: 'minsal-bcg',
    code: 'BCG',
    name: 'BCG (Bacilo de Calmette-Guérin)',
    targetDisease: 'Formas graves de Tuberculosis (Miliar y Meníngea)',
    minAgeMonths: 0,
    maxAgeMonths: 11,
    doseNumber: 1,
    totalDoses: 1,
    route: 'INTRADERMAL',
    anatomicalSiteDefault: 'DELTOIDES_DERECHO',
    isRequired: true,
    description: 'Dosis única desde el nacimiento hasta los 11 meses de vida.',
  },

  // 2. LACTANTES (2, 4 Y 6 MESES)
  {
    id: 'minsal-hexavalente',
    code: 'HEXAVALENTE',
    name: 'Hexavalente (DTP + Polio IPV + Hib + HepB)',
    targetDisease: 'Difteria, Tosferina, Tétanos, Poliomielitis, Haemophilus Influenzae tipo b y Hepatitis B',
    minAgeMonths: 2,
    maxAgeMonths: 23,
    doseNumber: 1,
    totalDoses: 4,
    route: 'INTRAMUSCULAR',
    anatomicalSiteDefault: 'VASTO_LATERAL_DERECHO',
    isRequired: true,
    description: 'Esquema a los 2, 4 y 6 meses. Primer refuerzo a los 18 meses.',
  },
  {
    id: 'minsal-rotavirus',
    code: 'ROTAVIRUS',
    name: 'Rotavirus (Vacuna Oral Atenuada)',
    targetDisease: 'Diarrea severa y deshidratación por Rotavirus',
    minAgeMonths: 2,
    maxAgeMonths: 7,
    doseNumber: 1,
    totalDoses: 2,
    route: 'ORAL',
    anatomicalSiteDefault: 'ORAL',
    isRequired: true,
    description: '2 dosis: administradas a los 2 y 4 meses de edad.',
  },
  {
    id: 'minsal-neumococo-20v-ped',
    code: 'NEUMOCOCO_20V_PED',
    name: 'Neumococo 20 Valente (Pediátrico)',
    targetDisease: 'Meningitis, Neumonía y Otitis media por serotipos de Streptococcus pneumoniae',
    minAgeMonths: 2,
    maxAgeMonths: 24,
    doseNumber: 1,
    totalDoses: 3,
    route: 'INTRAMUSCULAR',
    anatomicalSiteDefault: 'VASTO_LATERAL_IZQUIERDO',
    isRequired: true,
    description: '2 dosis (2 y 4 meses) + Refuerzo a los 12 meses de edad.',
  },

  // 3. 12 A 18 MESES
  {
    id: 'minsal-spr',
    code: 'SPR',
    name: 'Triple Viral (SPR - Sarampión, Paperas, Rubéola)',
    targetDisease: 'Sarampión, Parotiditis (Paperas) y Rubéola',
    minAgeMonths: 12,
    maxAgeMonths: 120,
    doseNumber: 1,
    totalDoses: 2,
    route: 'SUBCUTANEOUS',
    anatomicalSiteDefault: 'DELTOIDES_IZQUIERDO',
    isRequired: true,
    description: '1ª dosis a los 12 meses. 2ª dosis a los 18 meses de edad.',
  },
  {
    id: 'minsal-hepa-ped',
    code: 'HEPATITIS_A',
    name: 'Hepatitis A (Pediátrica)',
    targetDisease: 'Hepatitis Viral tipo A',
    minAgeMonths: 15,
    maxAgeMonths: 24,
    doseNumber: 1,
    totalDoses: 1,
    route: 'INTRAMUSCULAR',
    anatomicalSiteDefault: 'DELTOIDES_IZQUIERDO',
    isRequired: true,
    description: 'Dosis única a los 15 meses de edad.',
  },
  {
    id: 'minsal-varicela',
    code: 'VARICELA',
    name: 'Varicela (Virus Atenuado)',
    targetDisease: 'Varicela y sus complicaciones sistémicas',
    minAgeMonths: 15,
    maxAgeMonths: 72,
    doseNumber: 1,
    totalDoses: 2,
    route: 'SUBCUTANEOUS',
    anatomicalSiteDefault: 'DELTOIDES_DERECHO',
    isRequired: true,
    description: '1ª dosis a los 15 meses. 2ª dosis de refuerzo a los 4 años.',
  },

  // 4. 4 AÑOS
  {
    id: 'minsal-dpat-ipv',
    code: 'DPAT_IPV',
    name: 'DPaT - IPV (Refuerzo 4 Años)',
    targetDisease: 'Difteria, Tosferina, Tétanos y Poliomielitis',
    minAgeMonths: 48,
    maxAgeMonths: 71,
    doseNumber: 1,
    totalDoses: 1,
    route: 'INTRAMUSCULAR',
    anatomicalSiteDefault: 'DELTOIDES_IZQUIERDO',
    isRequired: true,
    description: 'Dosis de refuerzo a los 4 años de edad.',
  },

  // 5. NIÑAS, NIÑOS Y ADULTAS (VPH)
  {
    id: 'minsal-vph-fem',
    code: 'VPH_FEM',
    name: 'VPH Cuadrivalente (Niñas y Adolescentes 9 a 18 años)',
    targetDisease: 'Cáncer cervicouterino y lesiones precancerosas por VPH',
    minAgeMonths: 108,
    maxAgeMonths: 216,
    doseNumber: 1,
    totalDoses: 1,
    route: 'INTRAMUSCULAR',
    anatomicalSiteDefault: 'DELTOIDES_IZQUIERDO',
    isRequired: true,
    description: 'Dosis única en niñas y adolescentes de 9 a 18 años.',
  },
  {
    id: 'minsal-vph-masc',
    code: 'VPH_MASC',
    name: 'VPH Cuadrivalente (Niños 9 a 11 años)',
    targetDisease: 'Infección por VPH, verrugas genitales y cáncer anogenital',
    minAgeMonths: 108,
    maxAgeMonths: 143,
    doseNumber: 1,
    totalDoses: 1,
    route: 'INTRAMUSCULAR',
    anatomicalSiteDefault: 'DELTOIDES_IZQUIERDO',
    isRequired: true,
    description: 'Dosis única en niños de 9 a 11 años.',
  },
  {
    id: 'minsal-vph-adult',
    code: 'VPH_ADULT',
    name: 'VPH (Mujeres de 19 a 45 años)',
    targetDisease: 'Cáncer de cérvix o cuello de matriz causado por el VPH',
    minAgeMonths: 228,
    maxAgeMonths: 540,
    doseNumber: 1,
    totalDoses: 1,
    route: 'INTRAMUSCULAR',
    anatomicalSiteDefault: 'DELTOIDES_IZQUIERDO',
    isRequired: false,
    description: 'Prevención de cáncer cervicouterino en mujeres adultas.',
  },

  // 6. ADOLESCENTES Y ADULTOS
  {
    id: 'minsal-td-adult',
    code: 'TD_ADULTO',
    name: 'Td (Tétanos y Difteria - Adultos y Adolescentes)',
    targetDisease: 'Tétanos y Difteria',
    minAgeMonths: 120,
    maxAgeMonths: null,
    doseNumber: 1,
    totalDoses: 5,
    route: 'INTRAMUSCULAR',
    anatomicalSiteDefault: 'DELTOIDES_IZQUIERDO',
    isRequired: true,
    description: '1 dosis de refuerzo cada 10 años a partir de los 10 años de edad.',
  },

  // 7. MUJERES EMBARAZADAS
  {
    id: 'minsal-vsr-mat',
    code: 'VSR_MATERNAL',
    name: 'Virus Sincitial Respiratorio (VSR)',
    targetDisease: 'Bronquiolitis y neumonía por VSR en lactantes (< 6 meses)',
    minAgeMonths: 144,
    maxAgeMonths: null,
    doseNumber: 1,
    totalDoses: 1,
    route: 'INTRAMUSCULAR',
    anatomicalSiteDefault: 'DELTOIDES_IZQUIERDO',
    isRequired: true,
    description: '1 dosis entre las semanas 28 a 36 de gestación.',
  },
  {
    id: 'minsal-tdpa-mat',
    code: 'TDPA',
    name: 'Tdpa (Tétanos, Difteria, Tosferina Acelular)',
    targetDisease: 'Protección neonatal contra Tosferina, Tétanos y Difteria',
    minAgeMonths: 144,
    maxAgeMonths: null,
    doseNumber: 1,
    totalDoses: 1,
    route: 'INTRAMUSCULAR',
    anatomicalSiteDefault: 'DELTOIDES_IZQUIERDO',
    isRequired: true,
    description: '1 dosis en cada embarazo a partir de la semana 20 de gestación.',
  },
  {
    id: 'minsal-influenza-mat',
    code: 'INFLUENZA_MAT',
    name: 'Influenza Estacional (Embarazadas)',
    targetDisease: 'Virus de Influenza tipos A y B en la gestación',
    minAgeMonths: 144,
    maxAgeMonths: null,
    doseNumber: 1,
    totalDoses: 1,
    route: 'INTRAMUSCULAR',
    anatomicalSiteDefault: 'DELTOIDES_IZQUIERDO',
    isRequired: true,
    description: 'En el primer control prenatal, sin importar la edad gestacional.',
  },

  // 8. ADULTOS MAYORES, CRÓNICOS Y GRUPOS DE RIESGO
  {
    id: 'minsal-neumo-20v-adult',
    code: 'NEUMOCOCO_20V_ADULT',
    name: 'Neumococo 20 Valente (Adultos y Crónicos)',
    targetDisease: 'Neumonía bacteriana bacteriémica y enfermedad neumocócica invasiva',
    minAgeMonths: 720,
    maxAgeMonths: null,
    doseNumber: 1,
    totalDoses: 1,
    route: 'INTRAMUSCULAR',
    anatomicalSiteDefault: 'DELTOIDES_DERECHO',
    isRequired: true,
    description: 'Adultos mayores de 60 años y personas con enfermedades crónicas.',
  },
  {
    id: 'minsal-influenza-adult',
    code: 'INFLUENZA',
    name: 'Influenza Estacional',
    targetDisease: 'Gripe estacional severa por virus Influenza A y B',
    minAgeMonths: 6,
    maxAgeMonths: null,
    doseNumber: 1,
    totalDoses: 1,
    route: 'INTRAMUSCULAR',
    anatomicalSiteDefault: 'DELTOIDES_IZQUIERDO',
    isRequired: true,
    description: 'Niños de 6 a 59 meses, mayores de 60 años y personal de salud.',
  },
  {
    id: 'minsal-hb-adult',
    code: 'HB_ADULTO',
    name: 'Hepatitis B Adultos',
    targetDisease: 'Hepatitis B crónica y cirrosis hepática',
    minAgeMonths: 216,
    maxAgeMonths: null,
    doseNumber: 1,
    totalDoses: 3,
    route: 'INTRAMUSCULAR',
    anatomicalSiteDefault: 'DELTOIDES_DERECHO',
    isRequired: false,
    description: 'Grupos de riesgo, pacientes crónicos y personal sanitario.',
  },

  // 9. OTRAS VACUNAS, VIAJEROS Y CONTROL DE BROTES
  {
    id: 'minsal-fiebre-amarilla',
    code: 'FIEBRE_AMARILLA',
    name: 'Fiebre Amarilla (Cepa 17D)',
    targetDisease: 'Infección arboviral por virus de la Fiebre Amarilla',
    minAgeMonths: 12,
    maxAgeMonths: 719,
    doseNumber: 1,
    totalDoses: 1,
    route: 'SUBCUTANEOUS',
    anatomicalSiteDefault: 'DELTOIDES_IZQUIERDO',
    isRequired: false,
    description: 'Viajeros a países endémicos (personas de 1 a 59 años).',
  },
  {
    id: 'minsal-antirrabica',
    code: 'ANTIRRABICA_HUMANA',
    name: 'Antirrábica Humana (Cultivo Celular)',
    targetDisease: 'Rabia humana (Preexposición y Postexposición)',
    minAgeMonths: 0,
    maxAgeMonths: null,
    doseNumber: 1,
    totalDoses: 5,
    route: 'INTRAMUSCULAR',
    anatomicalSiteDefault: 'DELTOIDES_IZQUIERDO',
    isRequired: false,
    description: 'Preexposición (veterinarios) y profilaxis postexposición según lineamiento MINSAL.',
  },
  {
    id: 'minsal-sr-adult',
    code: 'SR',
    name: 'SR (Sarampión y Rubéola)',
    targetDisease: 'Sarampión y Rubéola en adolescentes y adultos',
    minAgeMonths: 120,
    maxAgeMonths: null,
    doseNumber: 1,
    totalDoses: 1,
    route: 'SUBCUTANEOUS',
    anatomicalSiteDefault: 'DELTOIDES_IZQUIERDO',
    isRequired: false,
    description: 'Adolescentes y adultos para control de brotes y prevención epidemiológica.',
  },
];

const PEDIATRIC_CODES = [
  'HB_RN',
  'BCG',
  'HEXAVALENTE',
  'ROTAVIRUS',
  'NEUMOCOCO_20V_PED',
  'SPR',
  'HEPATITIS_A',
  'VARICELA',
  'DPAT_IPV',
  'VPH_FEM',
  'VPH_MASC',
];

const MATERNAL_CODES = ['VSR_MATERNAL', 'TDPA', 'INFLUENZA_MAT'];

export class VaccinationsService extends BaseService {
  private async ensureClinicalRecord(patientId: string): Promise<string> {
    const record = await prisma.clinicalRecord.findUnique({
      where: { patientId },
    });

    if (record) return record.id;

    const newRecord = await prisma.clinicalRecord.create({
      data: {
        patientId,
        bloodType: 'UNKNOWN',
        originDeviceId: 'SERVER_CENTRAL',
        lastModifiedByDeviceId: 'SERVER_CENTRAL',
      },
    });

    return newRecord.id;
  }

  private mapConsultationToVaccinationRecord(consultation: any): VaccinationRecord {
    const chiefComplaint = consultation.chiefComplaint || '';
    const physicalExam = consultation.physicalExam || '';
    const treatmentPlan = consultation.treatmentPlan || '';
    const diagnosisDesc = consultation.diagnosisDesc || '';

    // Extracción de código y nombre
    const matchCode = diagnosisDesc.match(/\[(.*?)\]/);
    const vaccineCode = matchCode ? matchCode[1] : (consultation.diagnosisCode || 'VACUNA');

    const matchName = chiefComplaint.match(/\[VACUNACION\]\s*([^|]+)/);
    const vaccineName = matchName ? matchName[1].trim() : (diagnosisDesc || 'Inmunización');

    // Extracción de dosis
    const matchDose = chiefComplaint.match(/Dosis:\s*(\d+)\/(\d+)/);
    const doseNumber = matchDose ? parseInt(matchDose[1], 10) : 1;
    const totalDoses = matchDose ? parseInt(matchDose[2], 10) : 1;

    // Extracción de Lote y Vencimiento
    const matchLot = chiefComplaint.match(/Lote:\s*([^|]+)/);
    const lotNumber = matchLot ? matchLot[1].trim() : 'LOTE-SD';

    const matchExp = chiefComplaint.match(/Exp:\s*([^|]+)/);
    const expirationDate = matchExp ? matchExp[1].trim() : '';

    // Extracción de Vía y Sitio
    const matchRoute = physicalExam.match(/Vía:\s*([^|]+)/);
    const administrationRoute = (matchRoute ? matchRoute[1].trim() : 'INTRAMUSCULAR') as AdministrationRoute;

    const matchSite = physicalExam.match(/Sitio:\s*([^|]+)/);
    const anatomicalSite = (matchSite ? matchSite[1].trim() : 'DELTOIDES_IZQUIERDO') as AnatomicalSite;

    // Extracción de Reacciones y Notas
    const matchReactions = treatmentPlan.match(/Reacciones inmediatas:\s*([^|]+)/);
    const adverseReactions = matchReactions && matchReactions[1].trim() !== 'Ninguna' ? matchReactions[1].trim() : null;

    const matchNotes = treatmentPlan.match(/Notas:\s*(.+)$/);
    const notes = matchNotes && matchNotes[1].trim() !== 'Sin notas' ? matchNotes[1].trim() : null;

    const record: VaccinationRecord = {
      id: consultation.id,
      patientId: consultation.patientId,
      vaccineCode,
      vaccineName,
      doseNumber,
      totalDoses,
      lotNumber,
      expirationDate,
      administrationRoute,
      anatomicalSite,
      administeredAt: consultation.consultationDate || consultation.createdAt,
      notes,
      adverseReactions,
      brigadeId: consultation.brigadeId ?? null,
      doctorId: consultation.doctorId ?? null,
      status: consultation.status === 'CANCELLED' ? 'CANCELLED' : 'COMPLETED',
      syncStatus: consultation.syncStatus === 'SYNCED' ? 'SYNCED' : 'PENDING',
      createdAt: consultation.createdAt,
    };

    if (consultation.patient) {
      record.patient = {
        id: consultation.patient.id,
        firstName: consultation.patient.firstName,
        lastName: consultation.patient.lastName,
        dui: consultation.patient.dui,
        dateOfBirth: consultation.patient.dateOfBirth,
        sex: consultation.patient.sex,
        address: consultation.patient.address,
        phone: consultation.patient.phone,
      };
    }

    if (consultation.doctor) {
      record.doctor = {
        id: consultation.doctor.id,
        firstName: consultation.doctor.firstName,
        lastName: consultation.doctor.lastName,
        role: consultation.doctor.role,
      };
    }

    if (consultation.brigade) {
      record.brigade = {
        id: consultation.brigade.id,
        name: consultation.brigade.name,
        department: consultation.brigade.department,
        municipality: consultation.brigade.municipality,
      };
    }

    return record;
  }

  // 1. Catálogo Oficial MINSAL 2026
  getCatalog(): VaccineCatalogItem[] {
    return MINSAL_VACCINE_CATALOG_2026;
  }

  // 2. Registrar Aplicación de Vacuna en PostgreSQL mediante Prisma
  async createVaccination(data: CreateVaccinationDTO): Promise<VaccinationRecord> {
    const {
      patientId,
      vaccineCode,
      vaccineName,
      doseNumber,
      totalDoses,
      lotNumber,
      expirationDate,
      administrationRoute,
      anatomicalSite,
      administeredAt,
      notes,
      adverseReactions,
      brigadeId,
      doctorId,
      originDeviceId,
    } = data;

    const patient = await prisma.patient.findFirst({
      where: { id: patientId, deletedAt: null },
    });

    if (!patient) {
      throw new Error('El paciente especificado no existe o fue dado de baja.');
    }

    const clinicalRecordId = await this.ensureClinicalRecord(patientId);
    const deviceId = originDeviceId || 'SERVER_CENTRAL';
    const finalDate = administeredAt ? new Date(administeredAt) : new Date();

    const chiefComplaint = `[VACUNACION] ${vaccineName} | Dosis: ${doseNumber}/${totalDoses} | Lote: ${lotNumber} | Exp: ${new Date(expirationDate).toISOString().slice(0, 10)}`;
    const physicalExam = `Vía: ${administrationRoute} | Sitio: ${anatomicalSite}`;
    const diagnosisDesc = `Inmunización: [${vaccineCode}] ${vaccineName} (Dosis ${doseNumber})`;
    const treatmentPlan = `Biológico aplicado: ${vaccineName} | Lote: ${lotNumber} | Reacciones inmediatas: ${adverseReactions || 'Ninguna'} | Notas: ${notes || 'Sin notas'}`;

    const responsibleDoctorId =
      doctorId ||
      (await prisma.user.findFirst({ where: { role: { in: ['ADMIN', 'DOCTOR', 'BRIGADISTA'] } } }))?.id;

    if (!responsibleDoctorId) {
      throw new Error('No se detectó un usuario válido responsable para registrar la aplicación.');
    }

    const consultation = await prisma.consultation.create({
      data: {
        patientId,
        doctorId: responsibleDoctorId,
        clinicalRecordId,
        chiefComplaint,
        physicalExam,
        diagnosisCode: vaccineCode,
        diagnosisDesc,
        treatmentPlan,
        status: 'COMPLETED',
        consultationDate: finalDate,
        startedAt: finalDate,
        completedAt: new Date(),
        ...(brigadeId ? { brigadeId } : {}),
        originDeviceId: deviceId,
        lastModifiedByDeviceId: deviceId,
      },
      include: {
        patient: true,
        doctor: {
          select: { id: true, firstName: true, lastName: true, role: true },
        },
        brigade: {
          select: { id: true, name: true, department: true, municipality: true },
        },
      },
    });

    try {
      await prisma.auditLog.create({
        data: {
          action: 'CREATE_VACCINATION',
          entity: 'Consultation',
          entityId: consultation.id,
          userId: responsibleDoctorId,
          deviceId,
          changedFields: {
            vaccineCode,
            vaccineName,
            doseNumber,
            lotNumber,
            patientId,
          },
        },
      });
    } catch {
      // Continuar si no se pudo registrar el log de auditoría
    }

    return this.mapConsultationToVaccinationRecord(consultation);
  }

  // 3. Historial de Vacunación de un Paciente
  async getVaccinationsByPatient(patientId: string): Promise<VaccinationRecord[]> {
    const consultations = await prisma.consultation.findMany({
      where: {
        patientId,
        deletedAt: null,
        chiefComplaint: { contains: '[VACUNACION]' },
      },
      include: {
        patient: true,
        doctor: { select: { id: true, firstName: true, lastName: true, role: true } },
        brigade: { select: { id: true, name: true, department: true, municipality: true } },
      },
      orderBy: { consultationDate: 'desc' },
    });

    return consultations.map((c) => this.mapConsultationToVaccinationRecord(c));
  }

  // 4. Detalle de Registro de Vacuna por ID
  async getVaccinationById(id: string): Promise<VaccinationRecord> {
    const consultation = await prisma.consultation.findFirst({
      where: { id, deletedAt: null },
      include: {
        patient: true,
        doctor: { select: { id: true, firstName: true, lastName: true, role: true } },
        brigade: { select: { id: true, name: true, department: true, municipality: true } },
      },
    });

    if (!consultation) {
      throw new Error('Registro de vacunación no encontrado.');
    }

    return this.mapConsultationToVaccinationRecord(consultation);
  }

  // 5. Historial General de Vacunación con Filtros y Paginación
  async getAllVaccinations(filters: GetAllVaccinationsFilters = {}) {
    const {
      patientId,
      vaccineCode,
      brigadeId,
      startDate,
      endDate,
      search,
      page = 1,
      limit = 50,
    } = filters;

    const where: any = {
      deletedAt: null,
      chiefComplaint: { contains: '[VACUNACION]' },
    };

    if (patientId) where.patientId = patientId;
    if (brigadeId && brigadeId !== 'ALL') where.brigadeId = brigadeId;

    if (vaccineCode && vaccineCode !== 'ALL') {
      where.diagnosisCode = vaccineCode;
    }

    if (startDate || endDate) {
      where.consultationDate = {};
      if (startDate) {
        const s = new Date(startDate);
        s.setHours(0, 0, 0, 0);
        where.consultationDate.gte = s;
      }
      if (endDate) {
        const e = new Date(endDate);
        e.setHours(23, 59, 59, 999);
        where.consultationDate.lte = e;
      }
    }

    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { chiefComplaint: { contains: q, mode: 'insensitive' } },
        { diagnosisDesc: { contains: q, mode: 'insensitive' } },
        {
          patient: {
            OR: [
              { firstName: { contains: q, mode: 'insensitive' } },
              { lastName: { contains: q, mode: 'insensitive' } },
              { dui: { contains: q, mode: 'insensitive' } },
            ],
          },
        },
      ];
    }

    const skip = (Math.max(1, page) - 1) * limit;

    const [total, items] = await Promise.all([
      prisma.consultation.count({ where }),
      prisma.consultation.findMany({
        where,
        include: {
          patient: true,
          doctor: { select: { id: true, firstName: true, lastName: true, role: true } },
          brigade: { select: { id: true, name: true, department: true, municipality: true } },
        },
        orderBy: { consultationDate: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
      items: items.map((c) => this.mapConsultationToVaccinationRecord(c)),
    };
  }

  // 6. Resumen Operativo con Cálculos y Tendencias Reales desde la BD
  async getVaccinationSummary(brigadeId?: string): Promise<VaccinationSummaryDTO> {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const baseWhere: any = {
      deletedAt: null,
      chiefComplaint: { contains: '[VACUNACION]' },
      ...(brigadeId && brigadeId !== 'ALL' ? { brigadeId } : {}),
    };

    const [
      totalToday,
      allVaccinations,
      activeBrigadesCount,
      recentConsultations,
    ] = await Promise.all([
      prisma.consultation.count({
        where: {
          ...baseWhere,
          consultationDate: { gte: todayStart, lte: todayEnd },
        },
      }),

      prisma.consultation.findMany({
        where: baseWhere,
        select: {
          patientId: true,
          diagnosisCode: true,
          consultationDate: true,
        },
      }),

      prisma.brigade.count({
        where: { status: 'ACTIVE', deletedAt: null },
      }),

      prisma.consultation.findMany({
        where: baseWhere,
        include: {
          patient: true,
          doctor: { select: { id: true, firstName: true, lastName: true, role: true } },
          brigade: { select: { id: true, name: true, department: true, municipality: true } },
        },
        orderBy: { consultationDate: 'desc' },
        take: 6,
      }),
    ]);

    const uniquePatients = new Set(allVaccinations.map((v) => v.patientId));

    let pediatric = 0;
    let adult = 0;
    let maternal = 0;

    allVaccinations.forEach((v) => {
      const code = v.diagnosisCode || '';
      if (PEDIATRIC_CODES.includes(code)) pediatric += 1;
      else if (MATERNAL_CODES.includes(code)) maternal += 1;
      else adult += 1;
    });

    const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const registrationTrend: RegistrationTrendDay[] = [];

    for (let i = 6; i >= 0; i--) {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() - i);
      const dayLabel = i === 0 ? 'Hoy' : dayNames[targetDate.getDay()] || 'Día';

      const dateStart = new Date(targetDate);
      dateStart.setHours(0, 0, 0, 0);

      const dateEnd = new Date(targetDate);
      dateEnd.setHours(23, 59, 59, 999);

      const count = allVaccinations.filter((v) => {
        const cDate = new Date(v.consultationDate);
        return cDate >= dateStart && cDate <= dateEnd;
      }).length;

      registrationTrend.push({ dayLabel, count });
    }

    return {
      totalToday,
      totalVaccinatedPatients: uniquePatients.size,
      activeBrigadesCount,
      pendingFollowUpCount: Math.max(0, uniquePatients.size - totalToday),
      registrationTrend,
      breakdown: {
        pediatric,
        adult,
        maternal,
      },
      recentApplications: recentConsultations.map((c) => this.mapConsultationToVaccinationRecord(c)),
    };
  }
}

export const vaccinationsService = new VaccinationsService();