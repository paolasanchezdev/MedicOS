// =========================================================================
// ARCHIVO: apps/api/src/config/prisma.ts
// DESCRIPCIÓN: Instancia Singleton de Prisma Client con adaptador Driver Pg
//              y configuración de resiliencia TCP para conexiones en reposo.
// =========================================================================

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const connectionString = process.env.DATABASE_URL;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pgPool: pg.Pool | undefined;
};

// Se mantiene un pool único de conexiones con Keep-Alive y reciclaje de sockets
export const pool =
  globalForPrisma.pgPool ??
  new pg.Pool({
    connectionString,
    max: 10,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 5000,
    keepAlive: true,
    keepAliveInitialDelayMillis: 10000,
  });

pool.on('error', (err) => {
  console.error('❌ Error en el pool de PostgreSQL (socket reciclado):', err.message);
});

const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.pgPool = pool;
  globalForPrisma.prisma = prisma;
}

export default prisma;