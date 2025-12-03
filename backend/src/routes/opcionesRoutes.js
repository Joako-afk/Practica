import express from "express";
import { obtenerListas } from "../controllers/opcionesController.js";
const router = express.Router();

//  Esta ruta devolverá todas las listas necesarias
router.get("/", obtenerListas);

export default router;
