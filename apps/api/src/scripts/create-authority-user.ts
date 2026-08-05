import { PrismaClient, Role, UserStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Cargar variables de entorno (.env)
dotenv.config();

// Configuración para Prisma 7.x
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const plainPassword = 'Autoridad@2026';
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  // Asegúrate de usar el valor exacto definido en tu enum 'Role' de schema.prisma 
  // (ej. Role.AUTHORITY, Role.HEALTH_AUTHORITY o Role.AUTORIDAD)
  const authorityUser = await prisma.user.upsert({
    where: { email: 'autoridad@medicos.com' },
    update: {
      role: Role.AUTHORITY,
      status: UserStatus.ACTIVE,
      passwordHash: hashedPassword,
    },
    create: {
      email: 'autoridad@medicos.com',
      firstName: 'Paola',
      lastName: 'Sánchez',
      passwordHash: hashedPassword,
      role: Role.AUTHORITY,
      status: UserStatus.ACTIVE,
    },
  });

  console.log('-------------------------------------------');
  console.log('✅ USUARIO AUTORIDAD DE SALUD CREADO / ACTUALIZADO:');
  console.log('Correo:    ', authorityUser.email);
  console.log('Contraseña:', plainPassword);
  console.log('Rol:       ', authorityUser.role);
  console.log('-------------------------------------------');
}

main()
  .catch((e) => {
    console.error('❌ Error al crear usuario de Autoridad:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });