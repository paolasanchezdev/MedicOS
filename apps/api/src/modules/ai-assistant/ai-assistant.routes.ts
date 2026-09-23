// =========================================================================
// ARCHIVO: apps/api/src/modules/ai-assistant/ai-assistant.routes.ts
// DESCRIPCIÓN: Enrutador Express protegido para el Asistente Clínico IA.
// =========================================================================

import { Router } from 'express';
import { aiAssistantController } from './ai-assistant.controller.js';
import { checkAuth, checkRole } from '../../middleware/auth.middleware.js';

const router = Router();

// Consultar datos clínicos autorizables para adjuntar como contexto
router.get(
  '/contexts',
  checkAuth,
  checkRole('PATIENT', 'DOCTOR', 'BRIGADISTA', 'ADMIN'),
  (req, res, next) => {
    Promise.resolve(aiAssistantController.getContexts(req, res)).catch(next);
  }
);

// Enviar pregunta y recibir explicación pedagógica de salud
router.post(
  '/chat',
  checkAuth,
  checkRole('PATIENT', 'DOCTOR', 'BRIGADISTA', 'ADMIN'),
  (req, res, next) => {
    Promise.resolve(aiAssistantController.sendMessage(req, res)).catch(next);
  }
);

export const aiAssistantRoutes = router;
export default router;