// =========================================================================
// ARCHIVO: apps/api/src/modules/documents/documents.routes.ts
// DESCRIPCIÓN: Rutas protegidas y públicas para el módulo documental oficial.
// =========================================================================

import { Router } from 'express';
import { documentsController } from './documents.controller.js';
import { checkAuth } from '../../middleware/auth.middleware.js';

const router = Router();

// Rutas protegidas para el paciente autenticado
router.get('/constancias', checkAuth, (req, res, next) => {
  documentsController.getMyCertificates(req, res).catch(next);
});

router.post('/constancias/auditar', checkAuth, (req, res, next) => {
  documentsController.auditCertificateAccess(req, res).catch(next);
});

// Ruta pública para verificación externa por QR
router.get('/constancias/verificar/:hash', (req, res, next) => {
  documentsController.verifyQr(req, res).catch(next);
});

export const documentRoutes = router;