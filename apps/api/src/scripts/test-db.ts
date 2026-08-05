/// <reference types="node" />
import { prisma } from '../config/prisma.js';

async function testConnection() {
  try {
    console.log('⏳ Conectando con PostgreSQL y verificando tablas de MedicOS...');
    
    // Intenta realizar un conteo rápido en la tabla de usuarios recién creada
    const usersCount = await prisma.user.count();
    
    console.log('✅ ¡Conexión exitosa con la base de datos de MedicOS!');
    console.log(`📊 Tabla "User" lista. Total de usuarios registrados: ${usersCount}`);
    
  } catch (error) {
    console.error('❌ Error crítico al conectar con la base de datos de MedicOS:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();