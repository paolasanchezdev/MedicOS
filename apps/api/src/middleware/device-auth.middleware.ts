// ============================================================================
// MedicOS - Autenticación de dispositivos
// Archivo: apps/api/src/middleware/device-auth.middleware.ts
//
// Autenticación Ed25519 para Raspberry/estaciones MedicOS.
// NO reemplaza ni modifica la autenticación JWT de usuarios.
// ============================================================================

import crypto from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';

import { prisma } from '../config/prisma.js';

const MAX_CLOCK_SKEW_MS = 5 * 60 * 1000;

export interface DeviceAuthContext {
  deviceId: string;
  serialNumber: string;
}

export interface DeviceAuthenticatedRequest extends Request {
  deviceAuth?: DeviceAuthContext;
}

function getSingleHeader(
  request: Request,
  name: string,
): string | undefined {
  const value = request.header(name);

  if (!value) {
    return undefined;
  }

  return value.trim() || undefined;
}

function getRequestBodyHash(request: Request): string {
  const body =
    request.body === undefined || request.body === null
      ? ''
      : JSON.stringify(request.body);

  return crypto
    .createHash('sha256')
    .update(body, 'utf8')
    .digest('hex');
}

function buildSigningMessage(
  request: Request,
  deviceSerial: string,
  timestamp: string,
  nonce: string,
): string {
  const method = request.method.toUpperCase();
  const path = request.originalUrl.split('?')[0] ?? request.path;
  const bodyHash = getRequestBodyHash(request);

  return [
    method,
    path,
    deviceSerial,
    timestamp,
    nonce,
    bodyHash,
  ].join('\n');
}

function verifySignature(
  publicKeyPem: string,
  signatureBase64: string,
  message: string,
): boolean {
  try {
    const publicKey = crypto.createPublicKey(publicKeyPem);
    const signature = Buffer.from(signatureBase64, 'base64');

    if (signature.length !== 64) {
      return false;
    }

    return crypto.verify(
      null,
      Buffer.from(message, 'utf8'),
      publicKey,
      signature,
    );
  } catch {
    return false;
  }
}

export async function checkDeviceAuth(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const deviceId = getSingleHeader(request, 'X-Device-ID');
    const timestamp = getSingleHeader(request, 'X-Device-Timestamp');
    const nonce = getSingleHeader(request, 'X-Device-Nonce');
    const signature = getSingleHeader(request, 'X-Device-Signature');

    if (!deviceId || !timestamp || !nonce || !signature) {
      response.status(401).json({
        ok: false,
        statusCode: 401,
        message: 'Credenciales de dispositivo incompletas.',
      });
      return;
    }

    if (!/^\d+$/.test(timestamp)) {
      response.status(401).json({
        ok: false,
        statusCode: 401,
        message: 'Marca de tiempo del dispositivo inválida.',
      });
      return;
    }

    const timestampMs = Number(timestamp);

    if (!Number.isSafeInteger(timestampMs)) {
      response.status(401).json({
        ok: false,
        statusCode: 401,
        message: 'Marca de tiempo del dispositivo inválida.',
      });
      return;
    }

    const clockDifference = Math.abs(Date.now() - timestampMs);

    if (clockDifference > MAX_CLOCK_SKEW_MS) {
      response.status(401).json({
        ok: false,
        statusCode: 401,
        message: 'La solicitud del dispositivo está fuera de ventana temporal.',
      });
      return;
    }

    if (nonce.length < 16 || nonce.length > 128) {
      response.status(401).json({
        ok: false,
        statusCode: 401,
        message: 'Nonce del dispositivo inválido.',
      });
      return;
    }

    const device = await prisma.device.findUnique({
      where: {
        id: deviceId,
      },
      select: {
        id: true,
        serialNumber: true,
        publicKey: true,
        status: true,
        deletedAt: true,
      },
    });

    if (!device || device.deletedAt) {
      response.status(401).json({
        ok: false,
        statusCode: 401,
        message: 'Dispositivo no registrado.',
      });
      return;
    }

    if (device.status !== 'ACTIVE') {
      response.status(403).json({
        ok: false,
        statusCode: 403,
        message: 'El dispositivo no está activo.',
      });
      return;
    }

    if (!device.publicKey) {
      response.status(401).json({
        ok: false,
        statusCode: 401,
        message: 'El dispositivo no tiene una clave pública registrada.',
      });
      return;
    }

    const signingMessage = buildSigningMessage(
      request,
      device.serialNumber,
      timestamp,
      nonce,
    );

    const validSignature = verifySignature(
      device.publicKey,
      signature,
      signingMessage,
    );

    if (!validSignature) {
      response.status(401).json({
        ok: false,
        statusCode: 401,
        message: 'Firma del dispositivo inválida.',
      });
      return;
    }

    const authenticatedRequest =
      request as DeviceAuthenticatedRequest;

    authenticatedRequest.deviceAuth = {
      deviceId: device.id,
      serialNumber: device.serialNumber,
    };

    next();
  } catch (error) {
    console.error(
      '❌ Error autenticando dispositivo:',
      error instanceof Error ? error.message : error,
    );

    response.status(500).json({
      ok: false,
      statusCode: 500,
      message: 'No fue posible validar el dispositivo.',
    });
  }
}
