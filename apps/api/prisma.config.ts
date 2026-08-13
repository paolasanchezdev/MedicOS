/// <reference types="node" />
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { defineConfig } from '@prisma/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/medicos',
  },
  migrations: {
    seed: 'npx tsx ./prisma/seed.ts',
  },
});