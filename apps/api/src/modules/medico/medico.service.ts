// =========================================================================
// ARCHIVO: apps/api/src/modules/medico/medico.service.ts
// DESCRIPCIÓN: Servicio backend para la gestión de perfil y operaciones del Médico.
// =========================================================================

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class MedicoService {
  async getPerfilMedico(medicoId: string) {
    const usuario = await prisma.user.findUnique({
      where: { id: medicoId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!usuario) {
      throw new Error('Médico no encontrado');
    }

    return usuario;
  }
}