import { pool } from "../config/db.js";

export const obtenerListas = async (req, res) => {
  try {
    const [solicitante, prioridad, motivo, detalles] = await Promise.all([
      pool.query("SELECT rut, nombre, apellido from usuario"),
      pool.query("SELECT id_prioridad, nombre from prioridad"),
      pool.query("SELECT id_cambio, nombre from cambio"),
      pool.query("SELECT id_jerarquia, nombre, tipo, id_padre from jerarquia"),
    ]);

    res.json({
      solicitante: solicitante.rows,
      prioridad: prioridad.rows,
      motivos: motivo.rows,
      detalles: detalles.rows,
    });
  } catch (error) {
    // Sin console.error: solo respondemos al cliente
    res.status(500).json({ message: "Error al obtener listas" });
  }
};
