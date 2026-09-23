// =========================================================================
// ARCHIVO: apps/api/src/scripts/seed-pregnancy-control.ts
// DESCRIPCIÓN: Asigna especialidades médicas reales, activa un embarazo
//              con hitos clínicos diferenciados por trimestre y citas vinculadas.
// =========================================================================

import { prisma } from '../config/prisma.js';

async function main() {
  const db = prisma as any;
  console.log('🩺 Configurando datos obstétricos y especialidades médicas...');

  // 1. Asignar especialidades reales a los médicos del sistema
  await db.user.updateMany({
    where: {
      OR: [
        { firstName: { contains: 'Carlos', mode: 'insensitive' } },
        { lastName: { contains: 'Mendoza', mode: 'insensitive' } },
      ],
    },
    data: { specialty: 'Ginecología y Obstetricia' },
  });

  await db.user.updateMany({
    where: {
      OR: [
        { firstName: { contains: 'Elena', mode: 'insensitive' } },
        { lastName: { contains: 'Martínez', mode: 'insensitive' } },
      ],
    },
    data: { specialty: 'Medicina Familiar y Comunitaria' },
  });

  // 2. Localizar paciente activa
  const patient = await db.patient.findFirst({
    where: {
      deletedAt: null,
      OR: [
        { firstName: { contains: 'María', mode: 'insensitive' } },
        { firstName: { contains: 'Karla', mode: 'insensitive' } },
        { sex: 'FEMALE' },
      ],
    },
    include: { clinicalRecord: true },
  });

  if (!patient) {
    console.error('❌ No se encontró ninguna paciente en la base de datos.');
    return;
  }

  console.log(`✅ Paciente seleccionada: ${patient.firstName} ${patient.lastName}`);

  // 3. Obtener al ginecólogo responsable
  let doctor = await db.user.findFirst({
    where: {
      role: 'DOCTOR',
      deletedAt: null,
      OR: [
        { firstName: { contains: 'Carlos', mode: 'insensitive' } },
        { lastName: { contains: 'Mendoza', mode: 'insensitive' } },
      ],
    },
  });

  if (!doctor) {
    doctor = await db.user.findFirst({
      where: { role: 'DOCTOR', deletedAt: null },
    });
  }

  if (!doctor) {
    console.error('❌ Se requiere al menos un médico en el sistema.');
    return;
  }

  // 4. Asegurar ClinicalRecord
  let clinicalRecord = patient.clinicalRecord;
  if (!clinicalRecord) {
    clinicalRecord = await db.clinicalRecord.create({
      data: {
        patientId: patient.id,
        bloodType: 'O_POSITIVE',
        originDeviceId: 'SERVER_LOCAL',
        lastModifiedByDeviceId: 'SERVER_LOCAL',
      },
    });
  }

  // 5. Limpieza previa de datos de prueba obstétricos para evitar acumulaciones
  await db.vitalSigns.deleteMany({
    where: {
      patientId: patient.id,
      consultation: { diagnosisCode: 'Z34.0' },
    },
  });

  await db.consultation.deleteMany({
    where: {
      patientId: patient.id,
      diagnosisCode: 'Z34.0',
    },
  });

  await db.diagnosis.deleteMany({
    where: {
      patientId: patient.id,
      code: 'Z34.0',
    },
  });

  await db.appointment.deleteMany({
    where: {
      patientId: patient.id,
      reason: { contains: 'prenatal', mode: 'insensitive' },
    },
  });

  // 6. Diagnóstico Obstétrico Activo
  const diagnosisDate = new Date();
  diagnosisDate.setDate(diagnosisDate.getDate() - 215); // ~30 semanas atrás

  await db.diagnosis.create({
    data: {
      patientId: patient.id,
      code: 'Z34.0',
      description: 'Supervisión de primer embarazo normal',
      status: 'ACTIVE',
      notes: 'Control prenatal de bajo riesgo obstétrico. FUR referida concordante con ultrasonografía.',
      diagnosedAt: diagnosisDate,
      originDeviceId: 'SERVER_LOCAL',
      lastModifiedByDeviceId: 'SERVER_LOCAL',
    },
  });

  // 7. Controles Prenatales con Hitos y Notas Clínicas Especializadas
  const controles = [
    {
      daysAgo: 6, // Semana ~30 (Tercer Trimestre)
      bpSys: 118,
      bpDia: 75,
      weight: 64.2,
      hr: 78,
      fcf: 144,
      au: 28,
      complaint: 'Control de Tercer Trimestre: Monitoreo Fetal y Evaluación de AU',
      exam: 'Abdomen grávido, AU: 28 cm. FCF: 144 lpm audible, rítmica y reactiva. Movimientos fetales activos percibidos en consulta. Sin edemas periféricos.',
      plan: 'Mantener Sulfato Ferroso 300 mg + Ácido Fólico 1 mg diario. Aplicación pautada de vacuna Tdap e indicación de biometría hemática de control. Próxima cita en 3 semanas.',
    },
    {
      daysAgo: 36, // Semana ~25 (Segundo Trimestre)
      bpSys: 115,
      bpDia: 72,
      weight: 62.8,
      hr: 76,
      fcf: 140,
      au: 23,
      complaint: 'Control de Segundo Trimestre: Revisión de Ultrasonografía Morfológica',
      exam: 'Abdomen grávido, AU: 23 cm. FCF: 140 lpm con Doppler fetal. Se evalúa reporte ecográfico sin alteraciones anatómicas ni cromosómicas fetales.',
      plan: 'Pauta dietética fraccionada para manejo de pirosis fisiológica. Continuar suplementación con hierro. Cita en 4 semanas.',
    },
    {
      daysAgo: 66, // Semana ~21 (Segundo Trimestre)
      bpSys: 110,
      bpDia: 70,
      weight: 61.5,
      hr: 80,
      fcf: 148,
      au: 19,
      complaint: 'Control Inicial de Segundo Trimestre: Antropometría y Suplementación',
      exam: 'Fondo uterino palpable a nivel de cicatriz umbilical (AU: 19 cm). FCF: 148 lpm audible. Cifras de presión arterial normales.',
      plan: 'Inicio de suplementación diaria con hierro y ácido fólico. Solicitud de ecografía de detalle anatómico y urocultivo. Cita en 4 semanas.',
    },
  ];

  for (const c of controles) {
    const consultDate = new Date();
    consultDate.setDate(consultDate.getDate() - c.daysAgo);

    const consult = await db.consultation.create({
      data: {
        patientId: patient.id,
        doctorId: doctor.id,
        clinicalRecordId: clinicalRecord.id,
        status: 'COMPLETED',
        chiefComplaint: c.complaint,
        physicalExam: c.exam,
        diagnosisCode: 'Z34.0',
        diagnosisDesc: 'Supervisión de embarazo normal',
        treatmentPlan: c.plan,
        consultationDate: consultDate,
        originDeviceId: 'SERVER_LOCAL',
        lastModifiedByDeviceId: 'SERVER_LOCAL',
      },
    });

    await db.vitalSigns.create({
      data: {
        patientId: patient.id,
        consultationId: consult.id,
        temperature: 36.6,
        heartRate: c.hr,
        oxygenSat: 98,
        systolic: c.bpSys,
        diastolic: c.bpDia,
        weight: c.weight,
        height: 1.62,
        originDeviceId: 'SERVER_LOCAL',
        lastModifiedByDeviceId: 'SERVER_LOCAL',
      },
    });
  }

  // 8. Próxima Cita Prenatal con Especialidad y Hito
  const nextAppDate = new Date();
  nextAppDate.setDate(nextAppDate.getDate() + 13);
  nextAppDate.setHours(9, 30, 0, 0);

  const establishment = await db.establishment.findFirst({
    where: { deletedAt: null },
  });

  await db.appointment.create({
    data: {
      patientId: patient.id,
      doctorId: doctor.id,
      establishmentId: establishment?.id || null,
      appointmentDate: nextAppDate,
      durationMinutes: 30,
      reason: 'Control Obstétrico de Tercer Trimestre • Evaluación Fetal y Plan de Parto',
      status: 'CONFIRMED',
      modality: 'PRESENTIAL',
      originDeviceId: 'SERVER_LOCAL',
      lastModifiedByDeviceId: 'SERVER_LOCAL',
    },
  });

  console.log('🎉 Base de datos actualizada con especialidades y citas enriquecidas.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });