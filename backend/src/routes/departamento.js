import express from "express";
import { pool } from "../config/db.js";


const router = express.Router();

//  GET /api/departamento
router.get("/", async (req, res) => {
  try {
    // nota: usamos alias para compatibilidad con el front
    const result = await pool.query("SELECT id_depa AS id, nombre FROM departamento");
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener departamentos:", error);
    res.status(500).json({ error: "Error al obtener los departamentos" });
  }
});

export default router;
