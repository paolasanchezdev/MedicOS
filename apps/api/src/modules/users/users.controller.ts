import { Request, Response, NextFunction } from 'express';
import { usersService } from './users.service.js';

export class UsersController {
  async getUsers(_req: Request, res: Response, next: NextFunction) {
    try {
      const users = await usersService.getAllUsers();
      res.json({ success: true, data: users });
    } catch (error) {
      next(error);
    }
  }

  async updateRole(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { role } = req.body;
      const updatedUser = await usersService.updateUserRole(id, role);
      res.json({ success: true, data: updatedUser });
    } catch (error) {
      next(error);
    }
  }
}

export const usersController = new UsersController();