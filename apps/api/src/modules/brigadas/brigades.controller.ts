// =========================================================================
// ARCHIVO: apps/api/src/modules/brigadas/brigades.controller.ts
// DESCRIPCIÓN: Controlador para operaciones, jornadas y pacientes de brigadas.
// =========================================================================

import { Request, Response, NextFunction } from 'express';
import {
  brigadesService,
  type BrigadeFilters,
  type UpdateBrigadeDTO,
} from './brigades.service.js';
import {
  brigadistaDashboardService,
  type ActividadQueryFilters,
} from './brigadista-dashboard.service.js';
import { prisma } from '../../config/prisma.js';
import { SessionStatus, BrigadeStatus } from '@prisma/client';

export class BrigadesController {
  async getBrigades(req: Request, res: Response, next: NextFunction) {
    try {
      const { search, status, department } = req.query;

      const filters: BrigadeFilters = {
        search: typeof search === 'string' ? search : undefined,
        status: typeof status === 'string' ? (status as BrigadeStatus | 'ALL') : undefined,
        department: typeof department === 'string' ? department : undefined,
      };

      const brigades = await brigadesService.getAllBrigades(filters);
      res.json({ success: true, data: brigades });
    } catch (error) {
      next(error);
    }
  }

  async getResumenBrigada(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as unknown as { user?: { id: string } }).user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Usuario no autenticado' });
        return;
      }
      const resumen = await brigadesService.getResumenBrigada(userId);
      res.json({ success: true, data: resumen });
    } catch (error) {
      next(error);
    }
  }

  async getJornadaBrigada(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as unknown as { user?: { id: string } }).user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Usuario no autenticado' });
        return;
      }
      const jornada = await brigadesService.getJornadaBrigada(userId);
      if (!jornada) {
        res.status(404).json({ success: false, message: 'No hay jornada activa asignada.' });
        return;
      }
      res.json({ success: true, data: jornada });
    } catch (error) {
      next(error);
    }
  }

  async getPacientesBrigada(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as unknown as { user?: { id: string } }).user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Usuario no autenticado' });
        return;
      }
      const pacientes = await brigadesService.getPacientesBrigada(userId);
      if (!pacientes) {
        res.status(404).json({ success: false, message: 'No se encontró la brigada asignada.' });
        return;
      }
      res.json({ success: true, data: pacientes });
    } catch (error) {
      next(error);
    }
  }

  async getDashboardResumen(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as unknown as { user?: { id: string } }).user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Usuario no autenticado' });
        return;
      }
      const resumen = await brigadistaDashboardService.getResumenDashboard(userId);
      res.json({ success: true, data: resumen });
    } catch (error) {
      next(error);
    }
  }

  async getDashboardActividad(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as unknown as { user?: { id: string } }).user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Usuario no autenticado' });
        return;
      }

      const { search, tipo, estado, temporalidad, startDate, endDate } = req.query;

      const filters: ActividadQueryFilters = {
        search: typeof search === 'string' ? search : undefined,
        tipo: typeof tipo === 'string' ? tipo : undefined,
        estado: typeof estado === 'string' ? estado : undefined,
        temporalidad: (typeof temporalidad === 'string' && ['HOY', 'JORNADA', 'TODAS'].includes(temporalidad))
          ? (temporalidad as 'HOY' | 'JORNADA' | 'TODAS')
          : undefined,
        startDate: typeof startDate === 'string' ? startDate : undefined,
        endDate: typeof endDate === 'string' ? endDate : undefined,
      };

      const actividad = await brigadistaDashboardService.getActividadDashboard(userId, filters);
      res.json({ success: true, data: actividad });
    } catch (error) {
      next(error);
    }
  }

  async iniciarJornada(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as unknown as { user?: { id: string } }).user;
      const userId = user?.id;
      const deviceId = userId ?? 'SERVER_CENTRAL';
      const brigadeId = req.body.brigadeId as string | undefined;

      if (!userId) {
        res.status(401).json({ success: false, message: 'Usuario no autenticado' });
        return;
      }

      const sesionActiva = await prisma.workSession.findFirst({
        where: { brigadistaId: userId, status: SessionStatus.STARTED },
      });

      if (sesionActiva) {
        res.status(400).json({ success: false, message: 'Ya existe una jornada activa.' });
        return;
      }

      let targetBrigadeId = brigadeId;
      if (!targetBrigadeId) {
        const asignada = await prisma.brigadeMember.findFirst({
          where: { userId },
          include: { brigade: true },
        });
        targetBrigadeId = asignada?.brigadeId;
      }

      if (!targetBrigadeId) {
        const primera = await prisma.brigade.findFirst({
          where: { deletedAt: null },
          orderBy: { startDate: 'desc' },
        });
        targetBrigadeId = primera?.id;
      }

      if (!targetBrigadeId) {
        res.status(400).json({ success: false, message: 'No se encontró una brigada para iniciar turno.' });
        return;
      }

      const nuevaSesion = await prisma.workSession.create({
        data: {
          brigadistaId: userId,
          brigadeId: targetBrigadeId,
          status: SessionStatus.STARTED,
          startedAt: new Date(),
          originDeviceId: deviceId,
          lastModifiedByDeviceId: deviceId,
        },
        include: { brigade: true },
      });

      await prisma.brigade.update({
        where: { id: targetBrigadeId },
        data: {
          status: BrigadeStatus.ACTIVE,
          version: { increment: 1 },
          lastModifiedByDeviceId: deviceId,
        },
      });

      res.status(201).json({ success: true, data: nuevaSesion });
    } catch (error) {
      next(error);
    }
  }

  async finalizarJornada(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as unknown as { user?: { id: string } }).user;
      const userId = user?.id;
      const deviceId = userId ?? 'SERVER_CENTRAL';

      if (!userId) {
        res.status(401).json({ success: false, message: 'Usuario no autenticado' });
        return;
      }

      const sesionActiva = await prisma.workSession.findFirst({
        where: { brigadistaId: userId, status: SessionStatus.STARTED },
      });

      if (!sesionActiva) {
        res.status(404).json({ success: false, message: 'No hay jornada activa para finalizar.' });
        return;
      }

      const sesionFinalizada = await prisma.workSession.update({
        where: { id: sesionActiva.id },
        data: {
          status: SessionStatus.ENDED,
          endedAt: new Date(),
          version: { increment: 1 },
          lastModifiedByDeviceId: deviceId,
        },
      });

      res.json({ success: true, data: sesionFinalizada });
    } catch (error) {
      next(error);
    }
  }

  async getBrigadeById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const brigade = await brigadesService.getBrigadeById(id);
      if (!brigade) {
        res.status(404).json({ success: false, message: 'Brigada no encontrada' });
        return;
      }
      res.json({ success: true, data: brigade });
    } catch (error) {
      next(error);
    }
  }

  async createBrigade(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as unknown as { user?: { id: string } }).user;
      const newBrigade = await brigadesService.createBrigade({
        ...req.body,
        originDeviceId: user?.id ?? 'SERVER_CENTRAL',
      });
      res.status(201).json({ success: true, data: newBrigade });
    } catch (error) {
      next(error);
    }
  }

  async updateBrigade(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const user = (req as unknown as { user?: { id: string } }).user;
      const updated = await brigadesService.updateBrigade(id, {
        ...(req.body as UpdateBrigadeDTO),
        originDeviceId: user?.id ?? 'SERVER_CENTRAL',
      });
      res.json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  }

  async updateBrigadeStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { status } = req.body;
      const user = (req as unknown as { user?: { id: string } }).user;

      const updated = await brigadesService.updateBrigadeStatus(
        id,
        status as BrigadeStatus,
        user?.id ?? 'SERVER_CENTRAL'
      );
      res.json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  }

  async assignLeader(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { leaderId } = req.body;
      const user = (req as unknown as { user?: { id: string } }).user;

      const updated = await brigadesService.assignLeader(
        id,
        leaderId ?? null,
        user?.id ?? 'SERVER_CENTRAL'
      );
      res.json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  }

  async addMembers(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { userIds } = req.body;

      if (!Array.isArray(userIds) || userIds.length === 0) {
        res.status(400).json({ success: false, message: 'Lista de usuarios requerida.' });
        return;
      }

      const result = await brigadesService.addMembers(id, userIds);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async removeMember(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, userId } = req.params;
      if (!id || !userId) {
        res.status(400).json({ success: false, message: 'ID de brigada y usuario requeridos.' });
        return;
      }

      const result = await brigadesService.removeMember(id, userId);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async deleteBrigade(id: string, deviceId: string = 'SERVER_CENTRAL') {
    try {
      const idParam = id;
      const user = (deviceId as unknown as { user?: { id: string } })?.user;
      await brigadesService.deleteBrigade(idParam, user?.id ?? 'SERVER_CENTRAL');
    } catch (error) {
      // Ignored
    }
  }

  async getPersonnel(_req: Request, res: Response, next: NextFunction) {
    try {
      const personnel = await brigadesService.getEligiblePersonnel();
      res.json({ success: true, data: personnel });
    } catch (error) {
      next(error);
    }
  }
}

export const brigadesController = new BrigadesController();