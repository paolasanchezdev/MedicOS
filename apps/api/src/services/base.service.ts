// =========================================================================
// ARCHIVO: apps/api/src/services/base.service.ts
// DESCRIPCIÓN: Clase base para servicios de negocio en MedicOS con soporte
//              para inyección de dependencias y clientes transaccionales.
// =========================================================================

import { prisma } from "../config/prisma.js";
import { PrismaClient, Prisma } from "@prisma/client";

export type DbClient = PrismaClient | Prisma.TransactionClient;

export abstract class BaseService {
  protected db: DbClient;

  constructor(databaseClient: DbClient = prisma) {
    this.db = databaseClient;
  }

  /**
   * Comprueba la conectividad directa con PostgreSQL mediante una consulta mínima.
   */
  async verificarConexionDB(): Promise<boolean> {
    try {
      await (this.db as PrismaClient).$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }
}