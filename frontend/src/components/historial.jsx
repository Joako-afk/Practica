import { useState } from "react";
import Modal from "../components/modal";
import { getEstadoColor } from "../utils/helpers";
import { useSolicitudes } from "../context/solicitudes";

export default function HistorialPorDia({ titulo, datos }) {
  const [selectedCard, setSelectedCard] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const { actualizarEstado } = useSolicitudes();

  const LIMITE = 3;
  const visibles = expanded ? datos : datos.slice(0, LIMITE);

  return (
    <div className="mb-10">

      {/* TÍTULO DEL DÍA */}
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{titulo}</h2>

      {datos.length === 0 ? (
        <p className="text-gray-500 italic">Sin registros.</p>
      ) : (
        <div className="overflow-x-auto">

          <table className="min-w-full border-separate border-spacing-0 bg-white shadow-lg rounded-xl overflow-hidden text-sm">

            {/* ENCABEZADOS */}
            <thead>
              <tr className="bg-gray-100 text-gray-700 border-b">
                <th className="py-3 px-4 font-semibold text-left">#</th>
                <th className="py-3 px-4 font-semibold text-left">Solicitante</th>
                <th className="py-3 px-4 font-semibold text-left">Ejecutor</th>
                <th className="py-3 px-4 font-semibold text-left">Descripción</th>
                <th className="py-3 px-4 font-semibold text-left">Estado</th>
                <th className="py-3 px-5 font-semibold text-center">Fecha</th>
              </tr>
            </thead>

            {/* FILAS */}
            <tbody className="transition-all duration-500 ease-in-out">
              {visibles.map((s, i) => (
                <tr
                  key={s.id}
                  onClick={() => setSelectedCard(s)}
                  className="
                    cursor-pointer 
                    transition-colors
                    hover:bg-blue-50 
                    border-b 
                    border-gray-200
                  "
                >
                  <td className="py-3 px-4 font-medium text-gray-700">
                    {i + 1}
                  </td>

                  <td className="py-3 px-4 text-gray-800">
                    {s.solicitante || "—"}
                  </td>

                  <td className="py-3 px-4 text-gray-700">
                    {s.ejecutor || "—"}
                  </td>

                  <td className="py-3 px-4 max-w-[220px] truncate text-gray-600" title={s.descripcion}>
                    {s.descripcion}
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getEstadoColor(
                        s.estado
                      )}`}
                    >
                      {s.estado}
                    </span>
                  </td>

                  <td className="py-3 px-5 text-center text-gray-700 truncate">
                    {s.fechaActualizacion || s.fecha}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* BOTÓN VER MÁS / VER MENOS */}
          {datos.length > LIMITE && (
            <div className="text-center mt-3">
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
              >
                {expanded ? "▲ Ver menos" : "▼ Ver más"}
              </button>
            </div>
          )}

        </div>
      )}

      {/* MODAL */}
      {selectedCard && (
        <Modal card={selectedCard} onClose={() => setSelectedCard(null)} />
      )}
    </div>
  );
}
