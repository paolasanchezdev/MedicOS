// =========================================================================
// ARCHIVO: apps/api/src/server.ts
// DESCRIPCIÓN: Punto de entrada del servidor API de MedicOS.
// =========================================================================

import dotenv from "dotenv";
dotenv.config(); 

import app from "./app.js";
import { Patient } from "@medicos/shared-types";

// Validar integración con el paquete de tipos compartidos
const testPatient: Patient = {
  id: "test-123",
  fullName: "Sistema de Prueba MedicOS",
  dateOfBirth: "2026-07-14",
  createdAt: "2026-07-14"
};

console.log(`[Validación Monorepo] Tipo cargado para: ${testPatient.fullName}`);

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 API de MedicOS ejecutándose en http://localhost:${PORT}`);
});