import { pool } from "../config/db.js";

export const getSolicitudes = async () => {
  const result = await pool.query("SELECT * FROM solicitud ORDER BY id_solicitud ASC");
  return result.rows;
};

export const addSolicitud = async ({ solicitante, prioridad, motivo, descripcion, jerarquia }) => {
  //inserta nueva solicitud
  const result = await pool.query(
    `
    INSERT INTO solicitud 
    (fecha_solicitud, hora_solicitud, usuario, prioridad, cambio, comentarios, id_jerarquia)
    VALUES (CURRENT_DATE, CURRENT_TIME, $1 , $2, $3, $4, $5)
    RETURNING *
    `,
    [solicitante, prioridad, motivo, descripcion, jerarquia]
  );

  const nueva = result.rows[0];

  //crear nuevo registro en el historial
  await pool.query(
    `insert into historial(fecha_registro, hora_registro, solicitud, estado)
    values (CURRENT_DATE,CURRENT_TIME, $1, 4)`,
    [nueva.numero_solicitud]
  );

  return nueva;

};

export const getSolicitudesCompleto = async () => {
  const result = await pool.query(`
    SELECT 
      s.numero_solicitud AS id,
      s.fecha_solicitud,
      s.hora_solicitud,
      s.comentarios,
      s.usuario,

      -- Solicitante
      u.nombre || ' ' || u.apellido AS solicitante,

      
      d.nombre AS departamento,

      s.ejecutor,
      p.nombre AS prioridad,
      c.nombre AS motivo,
      s.id_jerarquia,

      -- Último estado del historial
      h.estado AS estado_id,
      e.nombre AS estado

    FROM solicitud s

    JOIN usuario u ON u.rut = s.usuario

    LEFT JOIN departamento d ON d.id_depa = u.departamento

    JOIN prioridad p ON p.id_prioridad = s.prioridad
    JOIN cambio c ON c.id_cambio = s.cambio

    LEFT JOIN LATERAL (
      SELECT *
      FROM historial
      WHERE solicitud = s.numero_solicitud
      ORDER BY numero_registro DESC
      LIMIT 1
    ) h ON TRUE

    LEFT JOIN estado e ON e.id_estado = h.estado

    ORDER BY s.numero_solicitud DESC
  `);

  return result.rows;
};

export const actualizarEstadoBD = async (idSolicitud, nuevoEstado) => {
  const result = await pool.query(
    `INSERT INTO historial (fecha_registro, hora_registro, solicitud, estado)
     VALUES (CURRENT_DATE, CURRENT_TIME, $1, $2)
     RETURNING *`,
    [idSolicitud, nuevoEstado]
  );

  return result.rows[0];
};