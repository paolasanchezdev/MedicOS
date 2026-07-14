import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import { errorHandler, AppError } from "./middleware/error.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", routes);

// Ruta de prueba temporal para verificar el manejo de errores
app.get("/api/test-error", (_req, _res, next) => {
  next(new AppError("Prueba de error operacional en MedicOS", 400));
});

app.get("/", (_req, res) => {
  res.json({
    name: "MedicOS API",
    version: "1.0.0",
    status: "running"
  });
});

// El middleware de manejo de errores siempre debe ir al final de todos los app.use y rutas
app.use(errorHandler);

export default app;