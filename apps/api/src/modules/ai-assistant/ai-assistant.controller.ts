// =========================================================================
// ARCHIVO: apps/api/src/modules/ai-assistant/ai-assistant.controller.ts
// DESCRIPCIÓN: Controlador HTTP para el Asistente Educativo de Salud con IA.
// =========================================================================

import { Request, Response } from 'express';
import { aiAssistantService } from './ai-assistant.service.js';

export class AIAssistantController {
  // GET /ai-assistant/contexts
  async getContexts(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, error: 'Usuario no autenticado.' });
        return;
      }

      const data = await aiAssistantService.getAvailableClinicalContexts(userId);
      res.json({ success: true, data });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Error al consultar contextos clínicos';
      res.status(500).json({ success: false, error: msg });
    }
  }

  // POST /ai-assistant/chat
  async sendMessage(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, error: 'Usuario no autenticado.' });
        return;
      }

      const { message, contextType, contextItemId, conversationHistory } = req.body;
      if (!message || typeof message !== 'string' || !message.trim()) {
        res.status(400).json({ success: false, error: 'El mensaje no puede estar vacío.' });
        return;
      }

      const data = await aiAssistantService.processUserMessage(userId, {
        message: message.trim(),
        contextType,
        contextItemId,
        conversationHistory,
      });

      res.json({ success: true, data });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Error al procesar consulta con IA';
      res.status(500).json({ success: false, error: msg });
    }
  }
}

export const aiAssistantController = new AIAssistantController();