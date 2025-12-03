import { useState } from "react";
import Modal from "../components/modal";
import { useSolicitudes } from "../context/solicitudes";
import HistorialPorDia from "../components/historial";

export default function Historial() {
  const { solicitudes } = useSolicitudes();
  const [selectedCard, setSelectedCard] = useState(null);


  // Agrupar solicitudes por fecha (cada día distinto)
  const fechasUnicas = [...new Set(solicitudes.map((s) => s.fechaActualizacion || s.fecha))].sort(
    (a, b) => new Date(b) - new Date(a) // más recientes primero
  );

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
        Historial por Fecha
      </h1>

      {fechasUnicas.map((fecha) => {
        const datos = solicitudes.filter((s) => (s.fechaActualizacion || s.fecha) === fecha);
        const titulo =
          fecha === new Date().toISOString().split("T")[0]
            ? "Hoy"
            : `Historial del ${fecha}`;
        return <HistorialPorDia key={fecha} titulo={titulo} datos={datos} />;
      })}
    </div>
  );
}

