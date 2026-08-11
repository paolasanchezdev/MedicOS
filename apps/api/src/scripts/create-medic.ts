import { PrismaClient, Role, UserStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// 1. Obtener equivalente a __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 2. Cargar explícitamente el archivo .env de apps/api/
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('❌ DATABASE_URL no está definida en el archivo .env');
}

// Configuración para Prisma 7.x
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const plainPassword = 'Medico@2026';
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const doctorUser = await prisma.user.upsert({
    where: { email: 'medico@medicos.com' },
    update: {
      role: Role.DOCTOR,
      status: UserStatus.ACTIVE,
      passwordHash: hashedPassword,
    },
    create: {
      email: 'medico@medicos.com',
      firstName: 'Carlos',
      lastName: 'Mendoza',
      passwordHash: hashedPassword,
      role: Role.DOCTOR,
      status: UserStatus.ACTIVE,
    },
  });

  console.log('-------------------------------------------');
  console.log('✅ USUARIO MÉDICO CREADO / ACTUALIZADO:');
  console.log('Correo:    ', doctorUser.email);
  console.log('Contraseña:', plainPassword);
  console.log('Rol:       ', doctorUser.role);
  console.log('-------------------------------------------');
}

main()
  .catch((e) => {
    console.error('❌ Error al crear usuario de Médico:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });