// ============================================================================
// MedicOS - Rutas de sincronización
// Archivo: apps/api/src/modules/sync/sync.routes.ts
// ============================================================================

import { Router } from 'express';

import {
  checkDeviceAuth,
  type DeviceAuthenticatedRequest,
} from '../../middleware/device-auth.middleware.js';

const router = Router();

/**
 * Prueba de autenticación Raspberry -> servidor central.
 *
 * No modifica datos.
 * Sirve para comprobar la identidad criptográfica del dispositivo.
 */
router.post(
  '/ping',
  checkDeviceAuth,
  (request, response) => {
    const authenticatedRequest =
      request as DeviceAuthenticatedRequest;

    response.status(200).json({
      ok: true,
      message: 'Dispositivo autenticado correctamente.',
      device: authenticatedRequest.deviceAuth,
      timestamp: new Date().toISOString(),
    });
  },
);

export const syncRoutes = router;
