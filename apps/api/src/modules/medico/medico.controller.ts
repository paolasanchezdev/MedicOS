// =========================================================================
// ARCHIVO: apps/api/src/modules/medico/medico.controller.ts
// DESCRIPCIÓN: Controlador para el manejo de rutas del Dashboard y perfil del Médico.
// =========================================================================

import { Request, Response } from 'express';
import { MedicoDashboardService } from './medico-dashboard.service.js';
import { MedicoService } from './medico.service.js';

const dashboardService = new MedicoDashboardService();
const medicoService = new MedicoService();

export class MedicoController {
  async getDashboardResumen(req: Request, res: Response): Promise<void> {
    try {
      const medicoId = req.user?.id;
      if (!medicoId) {
        res.status(401).json({ error: 'No se encontró la identidad del médico en la sesión' });
        return;
      }
      const resumen = await dashboardService.getResumenDashboard(medicoId);
      res.json(resumen);
    } catch (error) {
      console.error('Error en MedicoController.getDashboardResumen:', error);
      res.status(500).json({ error: 'Error interno al obtener el resumen' });
    }
  }

  async getActividad(req: Request, res: Response): Promise<void> {
    try {
      const medicoId = req.user?.id;
      if (!medicoId) {
        res.status(401).json({ error: 'No autorizado' });
        return;
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      // Llamada al servicio que debe existir en MedicoDashboardService
      const actividad = await dashboardService.getActividadClinica(medicoId, {
        page,
        limit,
        search: req.query.search as string,
        action: req.query.action as string,
        status: req.query.status as string,
      });

      res.json(actividad);
    } catch (error) {
      console.error('Error en MedicoController.getActividad:', error);
      res.status(500).json({ error: 'Error al obtener bitácora de actividad' });
    }
  }

  async getPerfil(req: Request, res: Response): Promise<void> {
    try {
      const medicoId = req.user?.id;
      if (!medicoId) {
        res.status(401).json({ error: 'Usuario no autenticado' });
        return;
      }
      const perfil = await medicoService.getPerfilMedico(medicoId);
      res.json(perfil);
    } catch (error) {
      console.error('Error en MedicoController.getPerfil:', error);
      res.status(500).json({ error: 'Error interno al consultar el perfil' });
    }
  }
}