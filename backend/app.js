import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Conexión a la base
import { pool } from "./src/config/db.js";


// Rutas
import usuarioRoutes from "./src/routes/usuario.js";
import departamentoRoutes from "./src/routes/departamento.js";
import solicitudesRoutes from "./src/routes/solicitudes.js";
import authRouter from "./src/routes/authRoutes.js";
import opcionesRoutes from "./src/routes/opcionesRoutes.js"

dotenv.config();

const app = express();

//  Middlewares globales
app.use(cors());
app.use(express.json());

//  Rutas principales
app.use("/api/usuario", usuarioRoutes);
app.use("/api/solicitudes", solicitudesRoutes);
app.use("/api/auth", authRouter);
app.use("/api/departamento", departamentoRoutes);
app.use("/api/opciones", opcionesRoutes);

export default app;