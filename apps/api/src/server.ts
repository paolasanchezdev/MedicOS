// =========================================================================
// ARCHIVO: apps/api/src/server.ts
// DESCRIPCIÓN: Punto de entrada del servidor API de MedicOS con carga robusta
//              de variables de entorno para monorepo, verificación de base
//              de datos, estado del motor de IA y Graceful Shutdown.
// =========================================================================

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Resolución de rutas absolutas para garantizar la lectura de .env en Monorepo Turborepo
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Carga el .env propio de apps/api
dotenv.config({ path: path.resolve(__dirname, "../.env") });
// 2. Carga el .env de la raíz del proyecto como respaldo
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import type { Server } from "http";
import app from "./app.js";
import { Patient } from "@medicos/shared-types";
import { prisma, pool } from "./config/prisma.js";

// Validar integración con el paquete de tipos compartidos
const testPatient: Patient = {
  id: "test-123",
  fullName: "Sistema de Prueba MedicOS",
  dateOfBirth: "2026-07-14",
  createdAt: "2026-07-14",
};

console.log(`[Validación Monorepo] Tipo cargado para: ${testPatient.fullName}`);

const PORT = Number(process.env.PORT) || 3000;
let server: Server;

// =========================================================================
// VERIFICACIÓN PREVENTIVA DE INTEGRIDAD DE BASE DE DATOS
// =========================================================================
async function verifyDatabaseReadiness(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    const userCount = await prisma.user.count();
    const establishmentCount = await prisma.establishment.count();

    console.log(
      `✅ PostgreSQL conectado y sincronizado (Usuarios: ${userCount}, Establecimientos: ${establishmentCount})`
    );
    return true;
  } catch (error: unknown) {
    const prismaError = error as { code?: string; message?: string };
    if (prismaError.code === "P2021") {
      console.warn(
        "⚠️ ADVERTENCIA: La base de datos no tiene todas las tablas sincronizadas. Ejecuta: 'npm run db:setup' dentro de apps/api."
      );
    } else {
      console.error(
        "❌ ERROR: No se pudo conectar a PostgreSQL. Verifica que el servicio esté activo y las credenciales en .env sean correctas:",
        prismaError.message || error
      );
    }
    return false;
  }
}

// =========================================================================
// VERIFICACIÓN DEL MOTOR DE INTELIGENCIA ARTIFICIAL (GEMINI)
// =========================================================================
function verifyAIEngineConfig(): void {
  const geminiKey =
    process.env.GEMINI_API_KEY?.trim() ||
    process.env.GOOGLE_API_KEY?.trim() ||
    process.env.VITE_GEMINI_API_KEY?.trim();

  if (geminiKey && geminiKey.length > 10) {
    const maskedKey = `${geminiKey.substring(0, 6)}...${geminiKey.slice(-4)}`;
    console.log(`🧠 Motor IA Gemini: Configurado y activo con credencial (${maskedKey})`);
  } else {
    console.warn(
      "⚠️ Motor IA Gemini: GEMINI_API_KEY no detectada en .env. El Asistente Educativo operará con respuestas clínicas de contingencia local."
    );
  }
}

// =========================================================================
// ARRANQUE DEL SERVIDOR
// =========================================================================
async function bootstrap() {
  await verifyDatabaseReadiness();
  verifyAIEngineConfig();

  server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 API de MedicOS ejecutándose en http://localhost:${PORT}`);
  });
}

bootstrap();

// =========================================================================
// GESTIÓN DE CIERRE LIMPIO DE RECURSOS (Graceful Shutdown)
// =========================================================================
const handleShutdown = async (signal: string) => {
  console.log(`\n🛑 Recibida señal [${signal}]. Cerrando servidor HTTP y liberando conexiones...`);

  if (server) {
    server.close(async () => {
      console.log("🔒 Servidor HTTP cerrado correctamente.");
      try {
        await prisma.$disconnect();
        await pool.end();
        console.log("🔌 Pool de PostgreSQL y Prisma Client desconectados.");
        process.exit(0);
      } catch (error) {
        console.error("❌ Error al cerrar conexiones de base de datos:", error);
        process.exit(1);
      }
    });
  } else {
    await prisma.$disconnect();
    await pool.end();
    process.exit(0);
  }

  // Timeout preventivo para forzar salida si alguna conexión no responde
  setTimeout(() => {
    console.error("⚠️ Cierre forzado por timeout de seguridad (5s).");
    process.exit(1);
  }, 5000);
};

process.on("SIGINT", () => handleShutdown("SIGINT"));
process.on("SIGTERM", () => handleShutdown("SIGTERM"));