import { addSolicitud, getSolicitudesCompleto, actualizarEstadoBD } from "../models/solicitudModel.js";

export const crearSolicitud = async (req, res) => {
  try {
    const datos = req.body;

    if (
      !datos.nombre_solicitante ||
      !datos.motivo ||
      !datos.prioridad ||
      !datos.descripcion
    ) {
      return res.status(400).json({ message: "Faltan campos requeridos" });
    }

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
    res.status(500).json({ message: "Error al insertar solicitud" });
  }
};

export const obtenerSolicitudes = async (req, res) => {
  try {
    const solicitudes = await getSolicitudesCompleto();
    res.json(solicitudes);
  } catch (error) {
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
      solicitud: actualizado,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar estado" });
  }
};
