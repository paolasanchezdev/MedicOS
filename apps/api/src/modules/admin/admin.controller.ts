// apps/api/src/modules/admin/admin.controller.ts
import { Request, Response, NextFunction } from 'express';
import {
  adminService,
  AuditLogFilters,
  EstablishmentFiltersInput,
} from './admin.service.js';
import {
  EstablishmentStatus,
  EstablishmentType,
  EstablishmentLevel,
} from '@prisma/client';

export class AdminController {
  // ======================================================
  // DASHBOARD Y AUDITORÍA
  // ======================================================

  async getSummary(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const summary = await adminService.getDashboardSummary();
      res.status(200).json({
        ok: true,
        data: summary,
        ...summary,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAuditLogs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { entity, userId, role, action, startDate, endDate, page, limit } = req.query;

      const filters: AuditLogFilters = {
        entity: entity ? String(entity) : undefined,
        userId: userId ? String(userId) : undefined,
        role: role ? String(role) : undefined,
        action: action ? String(action) : undefined,
        startDate: startDate ? String(startDate) : undefined,
        endDate: endDate ? String(endDate) : undefined,
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 15,
      };

      const result = await adminService.getAuditLogs(filters);

      res.status(200).json({
        ok: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  // ======================================================
  // ESTABLECIMIENTOS (RED DE SALUD)
  // ======================================================

  async getEstablishments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { type, department, status, level, search } = req.query;

      const filters: EstablishmentFiltersInput = {
        type: type ? (String(type) as EstablishmentType) : undefined,
        department: department ? String(department) : undefined,
        status: status ? (String(status) as EstablishmentStatus) : undefined,
        level: level ? (String(level) as EstablishmentLevel) : undefined,
        search: search ? String(search) : undefined,
      };

      const establishments = await adminService.getEstablishments(filters);
      res.status(200).json(establishments);
    } catch (error) {
      next(error);
    }
  }

  async createEstablishment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = (req as unknown as { user?: { id: string } }).user;
      const establishment = await adminService.createEstablishment(
        req.body,
        user?.id ?? 'ADMIN_DASHBOARD'
      );
      res.status(201).json(establishment);
    } catch (error) {
      next(error);
    }
  }

  async updateEstablishment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params['id'];
      if (!id) {
        res.status(400).json({ message: 'El ID del establecimiento es requerido.' });
        return;
      }

      const user = (req as unknown as { user?: { id: string } }).user;
      const establishment = await adminService.updateEstablishment(
        id,
        req.body,
        user?.id ?? 'ADMIN_DASHBOARD'
      );
      res.status(200).json(establishment);
    } catch (error) {
      next(error);
    }
  }

  async updateEstablishmentStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params['id'];
      if (!id) {
        res.status(400).json({ message: 'El ID del establecimiento es requerido.' });
        return;
      }

      const { status } = req.body;
      const user = (req as unknown as { user?: { id: string } }).user;
      const establishment = await adminService.updateEstablishmentStatus(
        id,
        status as EstablishmentStatus,
        user?.id ?? 'ADMIN_DASHBOARD'
      );
      res.status(200).json(establishment);
    } catch (error) {
      next(error);
    }
  }
}

export const adminController = new AdminController();