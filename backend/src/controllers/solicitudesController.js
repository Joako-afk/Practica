import { pool } from "../config/db.js";
import { addSolicitud, getSolicitudesCompleto, actualizarEstadoBD} from "../models/solicitudModel.js";

// Crear nueva solicitud
export const crearSolicitud = async (req, res) => {
  try {
    const datos = req.body;

    // Validación básica
    if (
      !datos.nombre_solicitante ||
      !datos.motivo ||
      !datos.prioridad ||
      !datos.descripcion
    ) {
      return res.status(400).json({ message: "Faltan campos requeridos" });
    }

    // Jerarquía: tomamos el nivel más profundo que venga seleccionado
    const jerarquias = [
      datos.atributo,
      datos.sector,
      datos.subsistema,
      datos.sistema,
    ];

    let jerarquiaFinal = null;
    for (const nivel of jerarquias) {
      if (nivel !== "" && nivel !== null && nivel !== undefined) {
        jerarquiaFinal = Number(nivel);
        break;
      }
    }

    //  Insertar en SOLICITUD
    const nueva = await addSolicitud({
      solicitante: datos.nombre_solicitante,
      prioridad: datos.prioridad,
      motivo: datos.motivo,
      descripcion: datos.descripcion,
      jerarquia: jerarquiaFinal,
    });

    res.status(201).json({
      message: "Solicitud creada con éxito",
      solicitud: nueva,
    });
  } catch (error) {
    console.error("Error al crear solicitud:", error);
    res.status(500).json({ message: "Error al insertar solicitud" });
  }
};

// Obtener todas las solicitudes con joins
export const obtenerSolicitudes = async (req, res) => {
  try {
    const solicitudes = await getSolicitudesCompleto();
    res.json(solicitudes);
  } catch (error) {
    console.error("Error al obtener solicitudes:", error);
    res.status(500).json({ message: "Error al obtener solicitudes" });
  }
};

export const actualizarEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { nuevoEstado } = req.body;

    const actualizado = await actualizarEstadoBD(id, nuevoEstado);

    res.json({
      message: "Estado actualizado",
      solicitud: actualizado
    });

  } catch (error) {
    console.error("Error al actualizar estado:", error);
    res.status(500).json({ message: "Error al actualizar estado" });
  }
};