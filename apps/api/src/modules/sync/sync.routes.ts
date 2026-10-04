// ============================================================================
// MedicOS - Rutas de sincronización
// Archivo: apps/api/src/modules/sync/sync.routes.ts
// ============================================================================

import { Router } from 'express';

import {
  checkDeviceAuth,
  type DeviceAuthenticatedRequest,
} from '../../middleware/device-auth.middleware.js';

import {
  syncService,
  type SyncPushInput,
} from './sync.service.js';

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

    if (!authenticatedRequest.deviceAuth) {
      response.status(401).json({
        ok: false,
        message: 'Dispositivo no autenticado.',
      });
      return;
    }

    response.status(200).json({
      ok: true,
      message: 'Dispositivo autenticado correctamente.',
      device: authenticatedRequest.deviceAuth,
      timestamp: new Date().toISOString(),
    });
  },
);

/**
 * Recibe operaciones del Transactional Outbox de una estación.
 *
 * La autenticación Ed25519 ya fue realizada por checkDeviceAuth.
 */
router.post(
  '/push',
  checkDeviceAuth,
  async (request, response, next) => {
    try {
      const authenticatedRequest =
        request as DeviceAuthenticatedRequest;

      if (!authenticatedRequest.deviceAuth) {
        response.status(401).json({
          ok: false,
          message: 'Dispositivo no autenticado.',
        });
        return;
      }

      const input = request.body as SyncPushInput;

      const result = await syncService.push(
        authenticatedRequest.deviceAuth.deviceId,
        input,
      );

      response.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
);

export const syncRoutes = router;
