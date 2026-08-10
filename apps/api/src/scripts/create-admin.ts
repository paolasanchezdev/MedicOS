import { PrismaClient, Role, UserStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('❌ ERROR: No se encontró DATABASE_URL en el archivo .env');
  process.exit(1);
}

const pool = new pg.Pool({
  connectionString: databaseUrl,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

async function ask(question: string): Promise<string> {
  const rl = readline.createInterface({
    input,
    output,
  });

  const answer = await rl.question(question);

  rl.close();

  return answer.trim();
}

async function main() {
  console.log('');
  console.log('==========================================');
  console.log('       CONFIGURACIÓN INICIAL - MedicOS');
  console.log('==========================================');
  console.log('');
  console.log('Crea el usuario administrador inicial.');
  console.log('');

  const name = await ask('👤 Nombre del administrador: ');

  if (!name) {
    console.error('❌ El nombre no puede estar vacío.');
    process.exit(1);
  }

  const password = await ask('🔐 Contraseña: ');

  if (!password) {
    console.error('❌ La contraseña no puede estar vacía.');
    process.exit(1);
  }

  if (password.length < 6) {
    console.error('❌ La contraseña debe tener al menos 6 caracteres.');
    process.exit(1);
  }

  const email = `admin@medicos.local`;

  const hashedPassword = await bcrypt.hash(password, 10);

  const existingAdmin = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  let admin;

  if (existingAdmin) {
    admin = await prisma.user.update({
      where: {
        email,
      },
      data: {
        firstName: name,
        lastName: '',
        passwordHash: hashedPassword,
        role: Role.ADMIN,
        status: UserStatus.ACTIVE,
        deletedAt: null,
      },
    });
  } else {
    admin = await prisma.user.create({
      data: {
        email,
        firstName: name,
        lastName: '',
        passwordHash: hashedPassword,
        role: Role.ADMIN,
        status: UserStatus.ACTIVE,
      },
    });
  }

  console.log('');
  console.log('==========================================');
  console.log('       ✅ ADMINISTRADOR CONFIGURADO');
  console.log('==========================================');
  console.log('');
  console.log(`👤 Nombre: ${admin.firstName}`);
  console.log(`📧 Usuario: ${admin.email}`);
  console.log(`🔐 Contraseña: configurada`);
  console.log(`🛡️ Rol: ${admin.role}`);
  console.log('');
  console.log('MedicOS está listo para utilizarse.');
  console.log('==========================================');
}

main()
  .catch((error) => {
    console.error('');
    console.error('❌ Error al crear el administrador:');
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
