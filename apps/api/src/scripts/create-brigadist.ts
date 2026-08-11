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
  const plainPassword = 'Brigadista@2026';
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  // Nota: Verifica en tu schema.prisma si tu enum se llama Role.BRIGADIST o Role.BRIGADISTA
  const brigadistUser = await prisma.user.upsert({
    where: { email: 'brigadista@medicos.com' },
    update: {
      role: Role.BRIGADISTA,
      status: UserStatus.ACTIVE,
      passwordHash: hashedPassword,
    },
    create: {
      email: 'brigadista@medicos.com',
      firstName: 'Ana',
      lastName: 'Gómez',
      passwordHash: hashedPassword,
      role: Role.BRIGADISTA,
      status: UserStatus.ACTIVE,
    },
  });

  console.log('-------------------------------------------');
  console.log('✅ USUARIO BRIGADISTA CREADO / ACTUALIZADO:');
  console.log('Correo:    ', brigadistUser.email);
  console.log('Contraseña:', plainPassword);
  console.log('Rol:       ', brigadistUser.role);
  console.log('-------------------------------------------');
}

main()
  .catch((e) => {
    console.error('❌ Error al crear usuario de Brigadista:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });