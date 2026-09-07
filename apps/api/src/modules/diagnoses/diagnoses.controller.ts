// =========================================================================
// ARCHIVO: apps/api/src/modules/diagnoses/diagnoses.controller.ts
// DESCRIPCIÓN: Controlador HTTP para gestión de diagnósticos del expediente.
// =========================================================================

import { Request, Response } from 'express';
import { diagnosesService } from './diagnoses.service.js';
import { createDiagnosisSchema, updateDiagnosisStatusSchema } from './diagnoses.schema.js';

export class DiagnosesController {
  // Obtener diagnósticos del paciente autenticado en la sesión
  async getMyDiagnoses(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, error: 'Usuario no autenticado en la sesión.' });
        return;
      }

      const { search, status, code } = req.query;
      const filters = {
        search: search ? String(search) : undefined,
        status: status ? (String(status) as any) : undefined,
        code: code ? String(code) : undefined,
      };

      const diagnoses = await diagnosesService.getDiagnosesForUser(userId, filters);
      res.json({ success: true, data: diagnoses });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Error al consultar diagnósticos';
      res.status(500).json({ success: false, error: msg });
    }
  }

  // Obtener diagnósticos de un paciente por identificador (Personal de salud)
  async getPatientDiagnoses(req: Request, res: Response): Promise<void> {
    try {
      const { patientId } = req.params;
      if (!patientId) {
        res.status(400).json({ success: false, error: 'ID de paciente no especificado.' });
        return;
      }

      const { search, status, code } = req.query;
      const filters = {
        search: search ? String(search) : undefined,
        status: status ? (String(status) as any) : undefined,
        code: code ? String(code) : undefined,
      };

      const diagnoses = await diagnosesService.getPatientDiagnoses(patientId, filters);
      res.json({ success: true, data: diagnoses });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Error al obtener diagnósticos del paciente';
      res.status(500).json({ success: false, error: msg });
    }
  }

  // Obtener detalle de un diagnóstico con control de acceso
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ success: false, error: 'ID de diagnóstico no especificado.' });
        return;
      }

      const requestingUser = req.user
        ? { id: req.user.id, role: req.user.role }
        : undefined;

      const diagnosis = await diagnosesService.getDiagnosisById(id, requestingUser);
      res.json({ success: true, data: diagnosis });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Error al obtener diagnóstico';
      if (msg === 'FORBIDDEN_DIAGNOSIS_ACCESS') {
        res.status(403).json({
          success: false,
          error: 'No tienes autorización para consultar este diagnóstico médico.',
        });
        return;
      }
      res.status(404).json({ success: false, error: msg });
    }
  }

  // Crear un diagnóstico médico
  async create(req: Request, res: Response): Promise<void> {
    try {
      const parsedBody = createDiagnosisSchema.parse(req.body);
      const diagnosis = await diagnosesService.createDiagnosis(parsedBody, 'WEB_PORTAL');
      res.status(201).json({ success: true, data: diagnosis });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Error al registrar el diagnóstico';
      res.status(400).json({ success: false, error: msg });
    }
  }

  // Actualizar estado del diagnóstico clínico
  async updateStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ success: false, error: 'ID de diagnóstico requerido.' });
        return;
      }

      const parsedBody = updateDiagnosisStatusSchema.parse(req.body);
      const updated = await diagnosesService.updateDiagnosisStatus(id, parsedBody, 'WEB_PORTAL');
      res.json({ success: true, data: updated });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Error al actualizar el estado del diagnóstico';
      res.status(400).json({ success: false, error: msg });
    }
  }
}

export const diagnosesController = new DiagnosesController();