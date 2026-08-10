import { Request, Response, NextFunction } from 'express';
import { brigadesService } from './brigades.service.js';

export class BrigadesController {
  async getBrigades(_req: Request, res: Response, next: NextFunction) {
    try {
      const brigades = await brigadesService.getAllBrigades();
      res.json({ success: true, data: brigades });
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
      const newBrigade = await brigadesService.createBrigade(req.body);
      res.status(201).json({ success: true, data: newBrigade });
    } catch (error) {
      next(error);
    }
  }
}

export const brigadesController = new BrigadesController();