import express from "express";
import { loginUsuario } from "../controllers/usuariocontroller.js";

const router = express.Router();

//  Ruta de inicio de sesión
router.post("/login", loginUsuario);

export default router;
