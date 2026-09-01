// =========================================================================
// ARCHIVO: apps/api/src/modules/vaccinations/vaccinations.controller.ts
// DESCRIPCIÓN: Controlador HTTP para el módulo de vacunación territorial.
// =========================================================================

import { Request, Response } from 'express';
import { vaccinationsService } from './vaccinations.service.js';
import { createVaccinationSchema } from './vaccinations.schema.js';
import type { CreateVaccinationDTO } from './vaccinations.types.js';

export class VaccinationsController {
  // GET /vaccinations/catalog
  getCatalog(_req: Request, res: Response): void {
    const catalog = vaccinationsService.getCatalog();
    res.json({ success: true, data: catalog });
  }

  // POST /vaccinations
  async create(req: Request, res: Response): Promise<void> {
    try {
      const parsedBody = createVaccinationSchema.parse(req.body);
      const doctorId = parsedBody.doctorId || req.user?.id;

      const payload: CreateVaccinationDTO = {
        patientId: parsedBody.patientId,
        vaccineCode: parsedBody.vaccineCode,
        vaccineName: parsedBody.vaccineName,
        doseNumber: parsedBody.doseNumber,
        totalDoses: parsedBody.totalDoses,
        lotNumber: parsedBody.lotNumber,
        expirationDate: parsedBody.expirationDate,
        administrationRoute: parsedBody.administrationRoute,
        anatomicalSite: parsedBody.anatomicalSite,
        administeredAt: parsedBody.administeredAt || new Date(),
        notes: parsedBody.notes ?? null,
        adverseReactions: parsedBody.adverseReactions ?? null,
        brigadeId: parsedBody.brigadeId ?? null,
        doctorId: doctorId ?? null,
        originDeviceId: 'WEB_PORTAL',
      };

      const record = await vaccinationsService.createVaccination(payload);
      res.status(201).json({ success: true, data: record });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Error al registrar la vacuna';
      res.status(400).json({ success: false, error: msg });
    }
  }

  // GET /vaccinations/patient/:patientId
  async getByPatient(req: Request, res: Response): Promise<void> {
    try {
      const { patientId } = req.params;
      if (!patientId) {
        res.status(400).json({ success: false, error: 'ID de paciente no proporcionado.' });
        return;
      }

      const records = await vaccinationsService.getVaccinationsByPatient(patientId);
      res.json({ success: true, data: records });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Error al consultar vacunas del paciente';
      res.status(500).json({ success: false, error: msg });
    }
  }

  // GET /vaccinations/:id
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ success: false, error: 'ID de registro no proporcionado.' });
        return;
      }

      const record = await vaccinationsService.getVaccinationById(id);
      res.json({ success: true, data: record });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Error al consultar registro de vacuna';
      res.status(404).json({ success: false, error: msg });
    }
  }

  // GET /vaccinations
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const {
        patientId,
        vaccineCode,
        brigadeId,
        startDate,
        endDate,
        search,
        page,
        limit,
      } = req.query;

      const result = await vaccinationsService.getAllVaccinations({
        patientId: patientId ? String(patientId) : undefined,
        vaccineCode: vaccineCode ? String(vaccineCode) : undefined,
        brigadeId: brigadeId ? String(brigadeId) : undefined,
        startDate: startDate ? String(startDate) : undefined,
        endDate: endDate ? String(endDate) : undefined,
        search: search ? String(search) : undefined,
        page: page ? parseInt(String(page), 10) : undefined,
        limit: limit ? parseInt(String(limit), 10) : undefined,
      });

      res.json({ success: true, data: result });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Error al consultar historial de vacunación';
      res.status(500).json({ success: false, error: msg });
    }
  }

  // GET /vaccinations/summary
  async getSummary(req: Request, res: Response): Promise<void> {
    try {
      const { brigadeId } = req.query;
      const summary = await vaccinationsService.getVaccinationSummary(
        brigadeId ? String(brigadeId) : undefined
      );
      res.json({ success: true, data: summary });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Error al consultar resumen de vacunación';
      res.status(500).json({ success: false, error: msg });
    }
  }
}

export const vaccinationsController = new VaccinationsController();