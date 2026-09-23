// =========================================================================
// ARCHIVO: apps/api/src/modules/medico/medico.controller.ts
// DESCRIPCIÓN: Controlador para operaciones y disponibilidad del Médico.
// =========================================================================

import { Request, Response } from 'express';
import { MedicoService } from './medico.service.js';
import { MedicoDashboardService } from './medico-dashboard.service.js';
import { clinicalMessagesService, type DoctorAvailability } from '../clinical-messages/clinical-messages.service.js';

export class MedicoController {
  private medicoService = new MedicoService();
  private dashboardService = new MedicoDashboardService();

  async getDashboardResumen(req: Request, res: Response) {
    try {
      const medicoId = (req as any).user?.id as string | undefined;
      if (!medicoId) {
        return res.status(401).json({ success: false, error: 'Usuario no autenticado' });
      }
      const data = await this.dashboardService.getResumenDashboard(medicoId);
      return res.json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  async getActividad(req: Request, res: Response) {
    try {
      const medicoId = (req as any).user?.id as string | undefined;
      if (!medicoId) {
        return res.status(401).json({ success: false, error: 'Usuario no autenticado' });
      }

      const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
      const limit = Math.max(1, parseInt(req.query.limit as string, 10) || 10);
      const search = typeof req.query.search === 'string' ? req.query.search.trim() : undefined;
      const status = typeof req.query.status === 'string' ? req.query.status.trim() : undefined;
      const action = typeof req.query.action === 'string' ? req.query.action.trim() : undefined;
      const startDate = typeof req.query.startDate === 'string' ? req.query.startDate.trim() : undefined;

      const options: {
        page: number;
        limit: number;
        search?: string;
        action?: string;
        status?: string;
        startDate?: string;
      } = { page, limit };

      if (search) options.search = search;
      if (status) options.status = status;
      if (action) options.action = action;
      if (startDate) options.startDate = startDate;

      const data = await this.dashboardService.getActividadClinica(medicoId, options);
      return res.json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  async getPerfil(req: Request, res: Response) {
    try {
      const medicoId = (req as any).user?.id as string | undefined;
      if (!medicoId) {
        return res.status(401).json({ success: false, error: 'Usuario no autenticado' });
      }
      const data = await this.medicoService.getPerfilMedico(medicoId);
      return res.json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  async getDisponibilidad(req: Request, res: Response) {
    try {
      const medicoId = (req as any).user?.id as string | undefined;
      if (!medicoId) {
        return res.status(401).json({ success: false, error: 'Usuario no autenticado' });
      }
      const status = clinicalMessagesService.getDoctorAvailability(medicoId);
      return res.json({ success: true, data: { doctorId: medicoId, status } });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  async updateDisponibilidad(req: Request, res: Response) {
    try {
      const medicoId = (req as any).user?.id as string | undefined;
      const { status } = req.body as { status: DoctorAvailability };

      if (!medicoId) {
        return res.status(401).json({ success: false, error: 'Usuario no autenticado' });
      }
      if (!status) {
        return res.status(400).json({ success: false, error: 'Estado de disponibilidad requerido' });
      }

      const result = clinicalMessagesService.updateDoctorAvailability(medicoId, status);
      return res.json({ success: true, data: result });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }
}