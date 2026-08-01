// apps/api/src/server.ts (o index.ts)
import dotenv from "dotenv";
dotenv.config(); // 👈 1. Cargamos las variables de entorno AL PRINCIPIO

import app from "./app.js"; // 👈 2. Importamos app DESPUÉS de dotenv
import { Patient } from "@medicos/shared-types";

// Testigo técnico de tipos compartidos
const testPatient: Patient = {
  id: "test-123",
  fullName: "Sistema de Prueba MedicOS",
  dateOfBirth: "2026-07-14",
  createdAt: "2026-07-14"
};

console.log(`[Validación Monorepo] Tipo cargado para: ${testPatient.fullName}`);

const PORT = process.env.PORT || 3000;

app.listen(3000, '0.0.0.0', () => {
  console.log('API ejecutándose en el puerto 3000')
})