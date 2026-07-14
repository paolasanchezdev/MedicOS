import dotenv from "dotenv";
import app from "./app.js";
import { Patient } from "@medicos/shared-types";

// Testigo técnico de tipos compartidos
const testPatient: Patient = {
  id: "test-123",
  fullName: "Sistema de Prueba MedicOS",
  dateOfBirth: "2026-07-14",
  createdAt: "2026-07-14"
};

console.log(`[Validación Monorepo] Tipo cargado para: ${testPatient.fullName}`);

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 MedicOS API funcionando en puerto ${PORT}`);
});