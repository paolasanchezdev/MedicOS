import { PrismaClient, Role, UserStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Cargar variables de entorno (.env)
dotenv.config();

// Configuración requerida para Prisma 7.x
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // 👈 AQUÍ ESTABA EL ERROR: Cambiamos 'admin123' por la contraseña real
  const plainPassword = 'MedicOS@2026';
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: 'paola@medicos.com' },
    update: {
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
      passwordHash: hashedPassword, // Aseguramos que se actualice también si ya existía
    },
    create: {
      email: 'paola@medicos.com',
      firstName: 'Paola',
      lastName: 'Rodríguez',
      passwordHash: hashedPassword,
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
    },
  });

  console.log('-------------------------------------------');
  console.log('✅ USUARIO ADMINISTRADOR CREADO / ACTUALIZADO:');
  console.log('Correo:    ', admin.email);
  console.log('Contraseña:', plainPassword);
  console.log('Rol:       ', admin.role);
  console.log('-------------------------------------------');
}

main()
  .catch((e) => {
    console.error('❌ Error al crear usuario:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });