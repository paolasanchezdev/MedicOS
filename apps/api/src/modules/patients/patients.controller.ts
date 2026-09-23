// =========================================================================
// ARCHIVO: apps/api/src/modules/patients/patients.controller.ts
// DESCRIPCIÓN: Controlador para endpoints de Pacientes, Signos Vitales,
//              Contactos de Emergencia, Validaciones, Notificaciones y Mensajería.
// =========================================================================

import { Request, Response } from 'express';
import { patientsService } from './patients.service.js';
import { patientDashboardService } from './patient-dashboard.service.js';
import { patientNotificationsService } from './patient-notifications.service.js';
import { clinicalMessagesService, type ClinicalMessageType, type ClinicalMessagePayload } from '../clinical-messages/clinical-messages.service.js';

export class PatientsController {
  async getAllPatients(req: Request, res: Response) {
    try {
      const search = (req.query.search as string) || (req.query.q as string) || '';
      const patients = await patientsService.getAllPatients(search);
      return res.json({ success: true, data: patients });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  async checkDui(req: Request, res: Response) {
    try {
      const dui = (req.query.dui as string) || '';
      const result = await patientsService.checkDuiAvailability(dui);
      return res.json({ success: true, ...result });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  async checkEmail(req: Request, res: Response) {
    try {
      const email = (req.query.email as string) || '';
      const result = await patientsService.checkEmailAvailability(email);
      return res.json({ success: true, ...result });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  async getPatientById(req: Request, res: Response) {
    try {
      const id = req.params.id || (req as any).user?.id;
      if (!id) {
        return res.status(400).json({ success: false, error: 'Identificador de paciente no proporcionado' });
      }

      const patient = await patientsService.getPatientById(id);
      if (!patient) {
        return res.status(404).json({ success: false, error: 'Paciente no encontrado' });
      }
      return res.json({ success: true, data: patient });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  async getPatientHistory(req: Request, res: Response) {
    try {
      const id = req.params.id || (req as any).user?.id;
      if (!id) {
        return res.status(400).json({ success: false, error: 'Identificador de paciente no proporcionado' });
      }

      const history = await patientsService.getPatientHistory(id);
      if (!history) {
        return res.status(404).json({ success: false, error: 'Historial del paciente no encontrado' });
      }
      return res.json({ success: true, data: history });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  async getPatientSummary(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id || req.params.id || (req.query.userId as string);
      const summary = await patientDashboardService.getPatientSummary(userId);
      return res.json({ success: true, data: summary });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  async getPatientActivity(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id || req.params.id || (req.query.userId as string);
      const { category, search, startDate, endDate } = req.query;

      const activityData = await patientDashboardService.getPatientActivity(userId, {
        category: category as string,
        search: search as string,
        startDate: startDate as string,
        endDate: endDate as string,
      });

      return res.json({
        success: true,
        data: activityData,
        total: activityData.total,
        items: activityData.items,
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  async getPatientNotifications(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id as string | undefined;
      const queryUserId = req.query.userId as string | undefined;
      const targetUserId = userId || queryUserId;
      const notifications = await patientNotificationsService.getPatientNotifications(targetUserId);
      return res.json(notifications);
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  async markNotificationAsRead(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id as string | undefined;
      const { notificationId } = req.params;

      if (!userId) {
        return res.status(401).json({ success: false, error: 'Usuario no autenticado' });
      }
      if (!notificationId) {
        return res.status(400).json({ success: false, error: 'ID de notificación no proporcionado' });
      }

      const result = await patientNotificationsService.markAsRead(userId, notificationId);
      return res.json({ success: true, data: result });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  async markAllNotificationsAsRead(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id as string | undefined;
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Usuario no autenticado' });
      }

      const result = await patientNotificationsService.markAllAsRead(userId);
      return res.json({ success: true, data: result });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  // =========================================================================
  // MENSAJERÍA CLÍNICA PACIENTE <-> MÉDICO
  // =========================================================================

  async getConversations(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id as string | undefined;
      const threads = await clinicalMessagesService.getPatientConversations(userId);
      return res.json(threads);
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  async getConversationMessages(req: Request, res: Response) {
    try {
      const { threadId } = req.params;
      if (!threadId) {
        return res.status(400).json({ success: false, error: 'ID de conversación requerido' });
      }
      const messages = await clinicalMessagesService.getConversationMessages(threadId);
      return res.json(messages);
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  async postPatientMessage(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id as string | undefined;
      const { threadId } = req.params;
      const { content, type, payload } = req.body as {
        content: string;
        type?: ClinicalMessageType;
        payload?: ClinicalMessagePayload;
      };

      if (!userId) {
        return res.status(401).json({ success: false, error: 'Usuario no autenticado' });
      }
      if (!threadId || !content) {
        return res.status(400).json({ success: false, error: 'Contenido y conversación requeridos' });
      }

      const message = await clinicalMessagesService.postMessage(
        threadId,
        userId,
        'PATIENT',
        'Tú',
        type || 'TEXT',
        content,
        payload
      );
      return res.status(201).json(message);
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  async editPatientMessage(req: Request, res: Response) {
    try {
      const { threadId, messageId } = req.params;
      const { content } = req.body as { content: string };

      if (!threadId || !messageId || !content) {
        return res.status(400).json({ success: false, error: 'Datos incompletos para editar' });
      }

      const updated = await clinicalMessagesService.editMessage(threadId, messageId, content.trim());
      if (!updated) {
        return res.status(404).json({ success: false, error: 'Mensaje no encontrado' });
      }

      return res.json(updated);
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  async deletePatientMessage(req: Request, res: Response) {
    try {
      const { threadId, messageId } = req.params;

      if (!threadId || !messageId) {
        return res.status(400).json({ success: false, error: 'Parámetros insuficientes' });
      }

      const deleted = await clinicalMessagesService.deleteMessage(threadId, messageId);
      return res.json({ success: deleted });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  // =========================================================================
  // GESTIÓN DE CONTACTOS DE EMERGENCIA DEL PACIENTE
  // =========================================================================

  async getEmergencyContacts(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Usuario no autenticado' });
      }

      const contacts = await patientsService.getEmergencyContacts(userId);
      return res.json({ success: true, data: contacts });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  async createEmergencyContact(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Usuario no autenticado' });
      }

      const newContact = await patientsService.createEmergencyContact(userId, req.body);
      return res.status(201).json({ success: true, data: newContact });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  async updateEmergencyContact(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const contactId = req.params.contactId || req.params.id;

      if (!userId) {
        return res.status(401).json({ success: false, error: 'Usuario no autenticado' });
      }
      if (!contactId) {
        return res.status(400).json({ success: false, error: 'ID de contacto no proporcionado' });
      }

      const updatedContact = await patientsService.updateEmergencyContact(userId, contactId, req.body);
      return res.json({ success: true, data: updatedContact });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  async deleteEmergencyContact(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const contactId = req.params.contactId || req.params.id;

      if (!userId) {
        return res.status(401).json({ success: false, error: 'Usuario no autenticado' });
      }
      if (!contactId) {
        return res.status(400).json({ success: false, error: 'ID de contacto no proporcionado' });
      }

      const result = await patientsService.deleteEmergencyContact(userId, contactId);
      return res.json(result);
    } catch (error: any) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  async setPrimaryEmergencyContact(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const contactId = req.params.contactId || req.params.id;

      if (!userId) {
        return res.status(401).json({ success: false, error: 'Usuario no autenticado' });
      }
      if (!contactId) {
        return res.status(400).json({ success: false, error: 'ID de contacto no proporcionado' });
      }

      const updated = await patientsService.setPrimaryEmergencyContact(userId, contactId);
      return res.json({ success: true, data: updated });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  // =========================================================================
  // CREACIÓN Y ACTUALIZACIÓN GENERAL DE PACIENTE
  // =========================================================================

  async createPatient(req: Request, res: Response) {
    try {
      const newPatient = await patientsService.createPatient(req.body);
      return res.status(201).json({ success: true, data: newPatient });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  async updateProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Usuario no autenticado' });
      }

      const updated = await patientsService.updatePatientProfile(userId, req.body);
      return res.json({ success: true, data: updated });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  async createVitalSigns(req: Request, res: Response) {
    try {
      const patientId = req.params.id || req.body.patientId;
      if (!patientId) {
        return res.status(400).json({ success: false, error: 'El ID del paciente es obligatorio.' });
      }

      const { systolic, diastolic, heartRate, temperature, oxygenSat, oxygenSaturation, weight, height } = req.body;

      if (!systolic || !diastolic || !heartRate || !temperature || (!oxygenSat && !oxygenSaturation)) {
        return res.status(400).json({
          success: false,
          error: 'Faltan parámetros obligatorios: presión sistólica, diastólica, FC, temperatura y SpO2.',
        });
      }

      const vitals = await patientsService.createVitalSigns(patientId, {
        systolic: Number(systolic),
        diastolic: Number(diastolic),
        heartRate: Number(heartRate),
        temperature: Number(temperature),
        oxygenSat: Number(oxygenSat || oxygenSaturation),
        weight: weight ? Number(weight) : null,
        height: height ? Number(height) : null,
        originDeviceId: req.body.originDeviceId || 'WEB_CLIENT',
      });

      return res.status(201).json({ success: true, data: vitals });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  async getTodayVitalSigns(_req: Request, res: Response) {
    try {
      const vitals = await patientsService.getTodayVitalSigns();
      return res.json({ success: true, data: vitals });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }
}

export const patientsController = new PatientsController();