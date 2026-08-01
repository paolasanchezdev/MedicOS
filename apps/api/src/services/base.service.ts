// apps/api/src/services/base.service.ts
import { prisma } from "../config/prisma.js"; // <-- Clave: extensión .js
import { PrismaClient } from "@prisma/client";

export class BaseService {
  protected db: PrismaClient;

  // Si no se le inyecta un cliente diferente, por defecto utiliza tu instancia global
  constructor(databaseClient: PrismaClient = prisma) {
    this.db = databaseClient;
  }

  // Método de prueba para verificar que la base de datos responde
  async verificarConexionDB() {
    // Hace una consulta rápida a la tabla "user" que configuraste ayer
    return await this.db.user.findMany({
      take: 1,
    });
  }
}