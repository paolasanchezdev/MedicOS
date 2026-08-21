//apps/api/src/modules/users/users.controller.ts
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

  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const newUser = await usersService.createUser(req.body);
      res.status(201).json({ success: true, data: newUser });
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

  async updateCredentials(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { password } = req.body;
      const updatedUser = await usersService.updateUserCredentials(id, password);
      res.json({
        success: true,
        data: updatedUser,
        message: 'Credenciales actualizadas exitosamente.',
      });
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { status } = req.body;
      const updatedUser = await usersService.updateUserStatus(id, status);
      res.json({ success: true, data: updatedUser });
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const deletedUser = await usersService.deleteUser(id);
      res.json({
        success: true,
        data: deletedUser,
        message: 'Acceso de usuario revocado correctamente.',
      });
    } catch (error) {
      next(error);
    }
  }
}

export const usersController = new UsersController();