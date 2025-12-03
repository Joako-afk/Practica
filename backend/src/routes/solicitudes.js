//backend/src/routes/solicitudes
import express from "express";
import { actualizarEstado, crearSolicitud, obtenerSolicitudes} from "../controllers/solicitudesController.js";
import { verificarToken } from "../middleware/verificarToken.js";

const router = express.Router();

router.post("/", verificarToken, crearSolicitud);
router.get("/", verificarToken, obtenerSolicitudes);
router.put("/:id/estado", verificarToken, actualizarEstado);

export default router;
