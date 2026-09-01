// =========================================================================
// ARCHIVO: apps/api/src/scripts/test-db.ts
// DESCRIPCIÓN: Script de diagnóstico e integridad de base de datos para MedicOS.
// =========================================================================

/// <reference types="node" />
import { prisma, pool } from '../config/prisma.js';

async function testConnection() {
  try {
    console.log('⏳ Conectando con PostgreSQL y verificando integridad de MedicOS...');

    // 1. Verificación de conectividad TCP
    await prisma.$queryRaw`SELECT 1`;

    // 2. Diagnóstico de tablas y modelos críticos
    const [usersCount, establishmentsCount, brigadesCount, patientsCount] = await Promise.all([
      prisma.user.count(),
      prisma.establishment.count(),
      prisma.brigade.count(),
      prisma.patient.count(),
    ]);

    console.log('\n✅ ¡Conexión exitosa con la base de datos de MedicOS!');
    console.log('──────────────────────────────────────────────────────────');
    console.log(`👤 Usuarios registrados:         ${usersCount}`);
    console.log(`🏥 Establecimientos de salud:    ${establishmentsCount}`);
    console.log(`🚑 Brigadas activas/registradas: ${brigadesCount}`);
    console.log(`📋 Pacientes con expediente:     ${patientsCount}`);
    console.log('──────────────────────────────────────────────────────────');
    console.log('🚀 El esquema y los datos del sistema están totalmente sincronizados.\n');
  } catch (error: unknown) {
    const prismaError = error as { code?: string; message?: string };

    console.error('\n❌ Error crítico al conectar con la base de datos:');
    if (prismaError.code === 'P2021') {
      console.error('⚠️ Faltan tablas en PostgreSQL. El esquema no está sincronizado.');
      console.error('💡 Solución: Ejecuta "npm run db:setup" en la raíz del proyecto.\n');
    } else {
      console.error(prismaError.message || error);
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

testConnection();