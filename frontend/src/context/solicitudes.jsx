// frontend/src/context/solicitudes.jsx
import { createContext, useState, useContext, useEffect } from "react";
import { formatearFechaLarga } from "../utils/helpers";
import { ESTADOS_ID } from "../utils/helpers"; // Asegúrate que ESTADOS_ID esté exportado allí o en estadosMap.js

const SolicitudesContext = createContext();

export function SolicitudesProvider({ children }) {
  const [solicitudes, setSolicitudes] = useState([]);

  // Cargar todas las solicitudes desde el backend
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
      console.log("Datos crudos:", data);

      if (Array.isArray(data)) {
        const normalizado = data.map((s) => ({
          ...s,
          id: s.id,
          fecha: formatearFechaLarga(s.fecha_solicitud),
          fechaIngreso: formatearFechaLarga(s.fecha_solicitud),
          estado: s.estado || "Recibido",
        }));

        console.log("Normalizado:", normalizado);
        setSolicitudes(normalizado);
      }
    } catch (error) {
      console.error("Error cargando solicitudes:", error);
    }
  };

  // Ejecutar al montar
  useEffect(() => {
    cargarSolicitudes();
  }, []);

  // Cambiar estado de una solicitud
  const actualizarEstado = async (id, nuevoEstado, ejecutor = null) => {
    try {
      const token = localStorage.getItem("token");

      // Convertir texto → id numérico para el backend
      const idEstado = ESTADOS_ID[nuevoEstado];

      console.log("Estado enviado al backend:", nuevoEstado, "→", idEstado);

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

      if (!res.ok) {
        throw new Error("Error al actualizar estado");
      }

      await cargarSolicitudes();
    } catch (error) {
      console.error("Error al actualizar estado:", error);
    }
  };

  return (
    <SolicitudesContext.Provider
      value={{
        solicitudes,
        cargarSolicitudes,
        actualizarEstado,
      }}
    >
      {children}
    </SolicitudesContext.Provider>
  );
}

export function useSolicitudes() {
  return useContext(SolicitudesContext);
}
