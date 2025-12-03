import { createContext, useContext, useState, useEffect } from "react";
import { ESTADOS_ID, formatearFechaLarga } from "../utils/helpers";

const SolicitudesContext = createContext();

export function SolicitudesProvider({ children }) {
  const [solicitudes, setSolicitudes] = useState([]);

  const cargarSolicitudes = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setSolicitudes([]);
        return;
      }

      const res = await fetch("http://localhost:5000/api/solicitudes", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (Array.isArray(data)) {
        const normalizado = data.map((s) => ({
          ...s,
          id: s.id,
          fecha: formatearFechaLarga(s.fecha_solicitud),
          fechaIngreso: formatearFechaLarga(s.fecha_solicitud),
          estado: s.estado || "Recibido",
        }));

        setSolicitudes(normalizado);
      }
    } catch (error) {
      // silencioso para prod
    }
  };

  const actualizarEstado = async (id, nuevoEstado, ejecutor = null) => {
    try {
      const token = localStorage.getItem("token");
      const idEstado = ESTADOS_ID[nuevoEstado];

      const res = await fetch(
        `http://localhost:5000/api/solicitudes/${id}/estado`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nuevoEstado: idEstado,
            ejecutor,
          }),
        }
      );

      if (!res.ok) return;

      await cargarSolicitudes();
    } catch (error) {
      // silencioso
    }
  };

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  return (
    <SolicitudesContext.Provider
      value={{ solicitudes, cargarSolicitudes, actualizarEstado }}
    >
      {children}
    </SolicitudesContext.Provider>
  );
}

export const useSolicitudes = () => useContext(SolicitudesContext);
