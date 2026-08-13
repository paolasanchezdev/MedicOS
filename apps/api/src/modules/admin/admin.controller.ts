import { Request, Response, NextFunction } from 'express';
import { adminService, AuditLogFilters } from './admin.service.js';

export class AdminController {
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
}

export const adminController = new AdminController();