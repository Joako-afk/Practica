//frontend/src/components/tablero.jsx
import { getEstadoColor, normalizeEstado } from "../utils/helpers";
import { useState } from "react";
import { useSolicitudes } from "../context/solicitudes";
import { useAuth } from "../context/sesion"; //  se importa el usuario actual
import Card from "./tarjeta";
import Modal from "./modal";
import { ESTADOS } from "../utils/constants";

export default function Board() {
  const { solicitudes, actualizarEstado } = useSolicitudes();
  const { user } = useAuth(); // obtener el usuario logueado
  const [selectedCard, setSelectedCard] = useState(null);

  const columnas = ESTADOS;

  //  mover tarjeta entre columnas
  const moverSiguiente = (card, nuevoEstado = null, ejecutor = null) => {
    const indice = columnas.indexOf(normalizeEstado(card.estado));
    const siguiente = nuevoEstado || columnas[indice + 1];
    actualizarEstado(card.id, siguiente, ejecutor);
    setSelectedCard(null);
  };

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {columnas.map((estado) => (
        <div
          key={estado}
          className="bg-gray-100 border border-gray-300 rounded-xl p-4 shadow-sm flex flex-col"
        >
          <h2 className={`text-lg font-bold text-center border-b pb-2 ${getEstadoColor(estado)}`}>
            {estado}
          </h2>


          <div className="flex-1 flex flex-col gap-3">
            {solicitudes.filter((s) => normalizeEstado(s.estado) === estado).length > 0 ? (
              solicitudes
                .filter((s) => normalizeEstado(s.estado) === estado)
                .map((card) => (
                  <Card
                    key={card.id}
                    card={card}
                    onClick={() => setSelectedCard(card)}
                  />
                ))
            ) : (
              <p className="text-sm text-gray-400 text-center">(Sin tarjetas)</p>
            )}
          </div>
        </div>
      ))}

      {/* Modal */}
      {selectedCard && (
        <Modal
          card={selectedCard}
          moverTarjeta={(nuevoEstado, ejecutor) =>
            moverSiguiente(selectedCard, nuevoEstado, ejecutor)
          }
          onClose={() => setSelectedCard(null)}
        />
      )}
    </div>
  );
}




