// =========================================================================
// ARCHIVO: apps/api/src/routes/index.ts
// DESCRIPCIÓN: Enrutador principal de la API con montaje de documentRoutes,
//              maternalHealthRoutes y clinicalKnowledgeRoutes.
// =========================================================================

import { Router } from 'express';
import healthRoutes from './health.routes.js';
import authRoutes from '../modules/auth/auth.routes.js';
import { userRoutes } from '../modules/users/users.routes.js';
import { brigadeRoutes } from '../modules/brigadas/brigades.routes.js';
import { patientRoutes } from '../modules/patients/patients.routes.js';
import { appointmentRoutes } from '../modules/appointments/appointments.routes.js';
import { consultationRoutes } from '../modules/consultations/consultations.routes.js';
import { diagnosisRoutes } from '../modules/diagnoses/diagnoses.routes.js';
import { clinicalHistoryRoutes } from '../modules/clinical-history/clinical-history.routes.js';
import { vaccinationRoutes } from '../modules/vaccinations/vaccinations.routes.js';
import { prescriptionRoutes } from '../modules/prescriptions/prescriptions.routes.js';
import { medicationRoutes } from '../modules/medications/medications.routes.js';
import { laboratoryRoutes } from '../modules/laboratory/laboratory.routes.js';
import { medicalImagingRoutes } from '../modules/medical-imaging/medical-imaging.routes.js';
import { vitalSignsRoutes } from '../modules/vital-signs/vital-signs.routes.js';
import { lifestyleRoutes } from '../modules/lifestyle/lifestyle.routes.js';
import { aiAssistantRoutes } from '../modules/ai-assistant/ai-assistant.routes.js';
import { personalizedAdviceRoutes } from '../modules/personalized-advice/personalized-advice.routes.js';
import { maternalHealthRoutes } from '../modules/maternal-health/maternal-health.routes.js';
import { reportRoutes } from '../modules/reports/reports.routes.js';
import { adminRoutes } from '../modules/admin/admin.routes.js';
import medicoRoutes from '../modules/medico/medico.routes.js';
import clinicalKnowledgeRoutes from '../modules/clinical-knowledge/clinical-knowledge.routes.js';
import { documentRoutes } from '../modules/documents/documents.routes.js';
import { patientsController } from '../modules/patients/patients.controller.js';
import { checkAuth, checkRole } from '../middleware/auth.middleware.js';

const router = Router();

// ==========================================
// RUTAS PRINCIPALES DEL SISTEMA
// ==========================================
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/patients', patientRoutes);
router.use('/brigades', brigadeRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/consultations', consultationRoutes);
router.use('/diagnoses', diagnosisRoutes);
router.use('/clinical-history', clinicalHistoryRoutes);
router.use('/vaccinations', vaccinationRoutes);
router.use('/prescriptions', prescriptionRoutes);
router.use('/medications', medicationRoutes);
router.use('/laboratory', laboratoryRoutes);
router.use('/medical-imaging', medicalImagingRoutes);
router.use('/vital-signs', vitalSignsRoutes);
router.use('/lifestyle', lifestyleRoutes);
router.use('/ai-assistant', aiAssistantRoutes);
router.use('/personalized-advice', personalizedAdviceRoutes);
router.use('/maternal-health', maternalHealthRoutes);
router.use('/reports', reportRoutes);
router.use('/admin', adminRoutes);
router.use('/medico', medicoRoutes);
router.use('/clinical-knowledge', clinicalKnowledgeRoutes);
router.use('/documents', documentRoutes);

// ==========================================
// ALIAS DE COMPATIBILIDAD (ESPAÑOL)
// ==========================================
router.use('/brigadas', brigadeRoutes);
router.use('/citas', appointmentRoutes);
router.use('/consultas', consultationRoutes);
router.use('/diagnosticos', diagnosisRoutes);
router.use('/historial-clinico', clinicalHistoryRoutes);
router.use('/vacunacion', vaccinationRoutes);
router.use('/recetas', prescriptionRoutes);
router.use('/medicamentos', medicationRoutes);
router.use('/laboratorio', laboratoryRoutes);
router.use('/estudios-imagen', medicalImagingRoutes);
router.use('/signos-vitales', vitalSignsRoutes);
router.use('/estilo-vida', lifestyleRoutes);
router.use('/asistente-ia', aiAssistantRoutes);
router.use('/consejos-personalizados', personalizedAdviceRoutes);
router.use('/salud-materna', maternalHealthRoutes);
router.use('/conocimiento-clinico', clinicalKnowledgeRoutes);
router.use('/documentos', documentRoutes);

// Endpoint de resumen clínico rápido para pacientes
router.get(
  '/paciente/resumen',
  checkAuth,
  checkRole('ADMIN', 'DOCTOR', 'BRIGADISTA', 'PATIENT'),
  (req, res, next) => {
    Promise.resolve(patientsController.getPatientSummary(req, res)).catch(next);
  }
);

export default router;