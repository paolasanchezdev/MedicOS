import { Request, Response, NextFunction } from 'express';
import { reportsService } from './reports.service.js';

export class ReportsController {
  async getSummary(_req: Request, res: Response, next: NextFunction) {
    try {
      const summary = await reportsService.getExecutiveSummary();
      res.json({ success: true, data: summary });
    } catch (error) {
      next(error);
    }
  }
}

export const reportsController = new ReportsController();