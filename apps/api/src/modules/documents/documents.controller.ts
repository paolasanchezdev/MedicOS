// =========================================================================
// ARCHIVO: apps/api/src/modules/documents/documents.controller.ts
// DESCRIPCIÓN: Controlador para peticiones HTTP de documentos y auditoría.
// =========================================================================

import { Request, Response } from 'express';
import { documentsService } from './documents.service.js';
import { prisma } from '../../config/prisma.js';

export class DocumentsController {
  async getMyCertificates(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({ success: false, error: 'No autorizado' });
        return;
      }

      const certificates = await documentsService.getCertificatesByUserId(userId);
      res.json({ success: true, data: certificates });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message || 'Error al obtener constancias' });
    }
  }

  async auditCertificateAccess(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { code, action } = req.body; // action: VIEW | DOWNLOAD

      if (userId && code) {
        await prisma.auditLog.create({
          data: {
            userId: userId ?? null,
            action: action === 'DOWNLOAD' ? 'DOWNLOAD_MEDICAL_CERTIFICATE' : 'VIEW_MEDICAL_CERTIFICATE',
            entity: 'MedicalCertificate',
            entityId: code,
            ipAddress: req.ip ?? null,
          },
        });
      }

      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  async verifyQr(req: Request, res: Response): Promise<void> {
    try {
      const hash = req.params.hash;
      if (!hash) {
        res.status(400).json({ success: false, error: 'Código QR no proporcionado' });
        return;
      }

      const result = await documentsService.verifyCertificateByQr(hash);
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }
}

export const documentsController = new DocumentsController();