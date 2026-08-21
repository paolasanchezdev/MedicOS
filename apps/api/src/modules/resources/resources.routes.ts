// apps/api/src/modules/resources/resources.routes.ts
import { Router } from 'express';
import { resourcesController } from './resources.controller.js';

const router = Router();

// Recursos e Inventario (Catálogo y Lotes de Stock)
router.get('/resources', resourcesController.getResources);
router.get('/resources/:id', resourcesController.getResourceById);
router.post('/resources', resourcesController.createResource);
router.put('/resources/:id', resourcesController.updateResource);
router.delete('/resources/:id', resourcesController.deleteResource);

// Stock y Lotes Físicos
router.post('/resources/stock', resourcesController.createResourceStock);
router.get('/resources/:id/stocks', resourcesController.getResourceStocks);

// Equipamiento e Instrumental Médico
router.get('/equipments', resourcesController.getEquipments);
router.get('/equipments/:id', resourcesController.getEquipmentById);
router.post('/equipments', resourcesController.createEquipment);
router.put('/equipments/:id', resourcesController.updateEquipment);
router.patch('/equipments/:id/status', resourcesController.updateEquipmentStatus);
router.delete('/equipments/:id', resourcesController.deleteEquipment);

// Hardware y Dispositivos Tecnológicos
router.get('/devices', resourcesController.getDevices);
router.get('/devices/:id', resourcesController.getDeviceById);
router.post('/devices', resourcesController.createDevice);
router.put('/devices/:id', resourcesController.updateDevice);
router.patch('/devices/:id/status', resourcesController.updateDeviceStatus);
router.delete('/devices/:id', resourcesController.deleteDevice);

// Dotación y Despacho a Brigadas
router.get('/dotation', resourcesController.getDotations);
router.get('/dotation/:brigadeId', resourcesController.getDotationDetails);
router.post('/dotation', resourcesController.createDotation);
router.post('/dotation/:brigadeId/liquidate', resourcesController.liquidateDotation);

export const resourcesRoutes = router;
export default router;