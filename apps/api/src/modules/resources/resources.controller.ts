// apps/api/src/modules/resources/resources.controller.ts
import { Request, Response, NextFunction } from 'express';
import { resourcesService, ResourceFiltersInput } from './services/resources.service.js';
import { equipmentService, EquipmentFiltersInput } from './services/equipment.service.js';
import { devicesService, DeviceFiltersInput } from './services/devices.service.js';
import { dotationService, DotationFiltersInput } from './services/dotation.service.js';
import { ResourceCategory, EquipmentStatus, DeviceStatus } from '@prisma/client';

export class ResourcesController {
  // ======================================================
  // 1. RECURSOS (FÁRMACOS E INSUMOS)
  // ======================================================

  async getResources(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { category, search, stockStatus, isActive } = req.query;

      const filters: ResourceFiltersInput = {
        category: category ? (String(category) as ResourceCategory) : undefined,
        search: search ? String(search) : undefined,
        stockStatus: stockStatus ? (String(stockStatus) as ResourceFiltersInput['stockStatus']) : undefined,
        isActive: isActive !== undefined ? isActive === 'true' : undefined,
      };

      const resources = await resourcesService.getResources(filters);
      res.status(200).json(resources);
    } catch (error) {
      next(error);
    }
  }

  async getResourceById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params['id'];
      if (!id) {
        res.status(400).json({ message: 'El ID del recurso es requerido.' });
        return;
      }

      const resource = await resourcesService.getResourceById(id);
      if (!resource) {
        res.status(404).json({ message: 'Recurso no encontrado.' });
        return;
      }

      res.status(200).json(resource);
    } catch (error) {
      next(error);
    }
  }

  async createResource(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = (req as unknown as { user?: { id: string } }).user;
      const resource = await resourcesService.createResource(
        req.body,
        user?.id ?? 'SYSTEM_USER'
      );
      res.status(201).json(resource);
    } catch (error) {
      next(error);
    }
  }

  async updateResource(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params['id'];
      if (!id) {
        res.status(400).json({ message: 'El ID del recurso es requerido.' });
        return;
      }

      const user = (req as unknown as { user?: { id: string } }).user;
      const resource = await resourcesService.updateResource(
        id,
        req.body,
        user?.id ?? 'SYSTEM_USER'
      );
      res.status(200).json(resource);
    } catch (error) {
      next(error);
    }
  }

  async deleteResource(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params['id'];
      if (!id) {
        res.status(400).json({ message: 'El ID del recurso es requerido.' });
        return;
      }

      const user = (req as unknown as { user?: { id: string } }).user;
      await resourcesService.deleteResource(id, user?.id ?? 'SYSTEM_USER');
      res.status(200).json({ message: 'Recurso dado de baja exitosamente.' });
    } catch (error) {
      next(error);
    }
  }

  async createResourceStock(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = (req as unknown as { user?: { id: string } }).user;
      const stock = await resourcesService.createResourceStock(
        req.body,
        user?.id ?? 'SYSTEM_USER'
      );
      res.status(201).json(stock);
    } catch (error) {
      next(error);
    }
  }

  async getResourceStocks(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const resourceId = req.params['id'];
      if (!resourceId) {
        res.status(400).json({ message: 'El ID del recurso es requerido.' });
        return;
      }

      const stocks = await resourcesService.getResourceStocks(resourceId);
      res.status(200).json(stocks);
    } catch (error) {
      next(error);
    }
  }

  // ======================================================
  // 2. EQUIPAMIENTO E INSTRUMENTAL MÉDICO
  // ======================================================

  async getEquipments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status, search } = req.query;

      const filters: EquipmentFiltersInput = {
        status: status ? (String(status) as EquipmentStatus) : undefined,
        search: search ? String(search) : undefined,
      };

      const equipments = await equipmentService.getEquipments(filters);
      res.status(200).json(equipments);
    } catch (error) {
      next(error);
    }
  }

  async getEquipmentById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params['id'];
      if (!id) {
        res.status(400).json({ message: 'El ID del equipo médico es requerido.' });
        return;
      }

      const equipment = await equipmentService.getEquipmentById(id);
      if (!equipment) {
        res.status(404).json({ message: 'Equipo médico no encontrado.' });
        return;
      }

      res.status(200).json(equipment);
    } catch (error) {
      next(error);
    }
  }

  async createEquipment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = (req as unknown as { user?: { id: string } }).user;
      const equipment = await equipmentService.createEquipment(
        req.body,
        user?.id ?? 'SYSTEM_USER'
      );
      res.status(201).json(equipment);
    } catch (error) {
      next(error);
    }
  }

  async updateEquipment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params['id'];
      if (!id) {
        res.status(400).json({ message: 'El ID del equipo médico es requerido.' });
        return;
      }

      const user = (req as unknown as { user?: { id: string } }).user;
      const equipment = await equipmentService.updateEquipment(
        id,
        req.body,
        user?.id ?? 'SYSTEM_USER'
      );
      res.status(200).json(equipment);
    } catch (error) {
      next(error);
    }
  }

  async updateEquipmentStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params['id'];
      if (!id) {
        res.status(400).json({ message: 'El ID del equipo médico es requerido.' });
        return;
      }

      const { status } = req.body;
      const user = (req as unknown as { user?: { id: string } }).user;
      const equipment = await equipmentService.updateEquipmentStatus(
        id,
        status as EquipmentStatus,
        user?.id ?? 'SYSTEM_USER'
      );
      res.status(200).json(equipment);
    } catch (error) {
      next(error);
    }
  }

  async deleteEquipment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params['id'];
      if (!id) {
        res.status(400).json({ message: 'El ID del equipo médico es requerido.' });
        return;
      }

      const user = (req as unknown as { user?: { id: string } }).user;
      await equipmentService.deleteEquipment(id, user?.id ?? 'SYSTEM_USER');
      res.status(200).json({ message: 'Equipo médico dado de baja exitosamente.' });
    } catch (error) {
      next(error);
    }
  }

  // ======================================================
  // 3. HARDWARE Y DISPOSITIVOS TECNOLÓGICOS
  // ======================================================

  async getDevices(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status, search } = req.query;

      const filters: DeviceFiltersInput = {
        status: status ? (String(status) as DeviceStatus) : undefined,
        search: search ? String(search) : undefined,
      };

      const devices = await devicesService.getDevices(filters);
      res.status(200).json(devices);
    } catch (error) {
      next(error);
    }
  }

  async getDeviceById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params['id'];
      if (!id) {
        res.status(400).json({ message: 'El ID del dispositivo es requerido.' });
        return;
      }

      const device = await devicesService.getDeviceById(id);
      if (!device) {
        res.status(404).json({ message: 'Dispositivo no encontrado.' });
        return;
      }

      res.status(200).json(device);
    } catch (error) {
      next(error);
    }
  }

  async createDevice(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const device = await devicesService.createDevice(req.body);
      res.status(201).json(device);
    } catch (error) {
      next(error);
    }
  }

  async updateDevice(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params['id'];
      if (!id) {
        res.status(400).json({ message: 'El ID del dispositivo es requerido.' });
        return;
      }

      const device = await devicesService.updateDevice(id, req.body);
      res.status(200).json(device);
    } catch (error) {
      next(error);
    }
  }

  async updateDeviceStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params['id'];
      if (!id) {
        res.status(400).json({ message: 'El ID del dispositivo es requerido.' });
        return;
      }

      const { status } = req.body;
      const device = await devicesService.updateDeviceStatus(id, status as DeviceStatus);
      res.status(200).json(device);
    } catch (error) {
      next(error);
    }
  }

  async deleteDevice(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params['id'];
      if (!id) {
        res.status(400).json({ message: 'El ID del dispositivo es requerido.' });
        return;
      }

      await devicesService.deleteDevice(id);
      res.status(200).json({ message: 'Dispositivo retirado del sistema exitosamente.' });
    } catch (error) {
      next(error);
    }
  }

  // ======================================================
  // 4. DOTACIÓN Y DESPACHO A BRIGADAS
  // ======================================================

  async getDotations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { search, status, department } = req.query;

      const filters: DotationFiltersInput = {
        search: search ? String(search) : undefined,
        status: status ? String(status) : undefined,
        department: department ? String(department) : undefined,
      };

      const dotations = await dotationService.getDotations(filters);
      res.status(200).json(dotations);
    } catch (error) {
      next(error);
    }
  }

  async getDotationDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const brigadeId = req.params['brigadeId'];
      if (!brigadeId) {
        res.status(400).json({ message: 'El ID de la brigada es requerido.' });
        return;
      }

      const details = await dotationService.getDotationDetails(brigadeId);
      res.status(200).json(details);
    } catch (error) {
      next(error);
    }
  }

  async createDotation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = (req as unknown as { user?: { id: string } }).user;
      const result = await dotationService.createDotation(
        req.body,
        user?.id ?? 'SYSTEM_USER'
      );
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async liquidateDotation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const brigadeId = req.params['brigadeId'];
      if (!brigadeId) {
        res.status(400).json({ message: 'El ID de la brigada es requerido.' });
        return;
      }

      const user = (req as unknown as { user?: { id: string } }).user;
      const result = await dotationService.liquidateDotation(
        brigadeId,
        req.body,
        user?.id ?? 'SYSTEM_USER'
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

export const resourcesController = new ResourcesController();