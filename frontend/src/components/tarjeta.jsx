//frontend/src/components/tarjeta.jsx
import { ESTADOS } from "../utils/constants";
import { getPrioridadColor, normalizeEstado } from "../utils/helpers";

export default function Card({ card, onClick }) {
  const prioridadBg = getPrioridadColor(card.prioridad);
  const prioridadLetra = (card.prioridad?.[0] || "").toUpperCase();
  const showExecRow = normalizeEstado(card.estado) === ESTADOS[2]; // Solo en Revisión

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md border cursor-pointer hover:shadow-lg transition overflow-hidden"
    >
      <div className="p-2 space-y-0.5">
        
        {/* Solicitante - Franja amarilla */}
        <div className="bg-[#d4c210] text-black font-semibold px-2 py-1 truncate text-center">
          {card.solicitante || "—"}
        </div>

        {/* Fecha de ingreso */}
        <div className="bg-[#4472c4] text-white font-semibold px-2 py-1 text-xs text-center">
          {card.fechaIngreso || card.fecha || ""}
        </div>

        {/* Prioridad + Motivo */}
        <div className="grid grid-cols-6 gap-0.5 items-stretch">

          {/* Cuadro de prioridad */}
          <div className="col-span-1 flex items-stretch justify-center">
            <div
              className={`w-12 h-full min-h-12 flex items-center justify-center font-extrabold text-lg border-2 ${prioridadBg}`}
            >
              {prioridadLetra || "?"}
            </div>
          </div>

          {/* MOTIVO (reemplaza Objetivo) */}
          <div className="col-span-5 bg-[#3cc6a4] text-black px-2 py-2">
            <div className="font-bold">Motivo</div>
            <div className="text-sm line-clamp-2">{card.motivo}</div>
          </div>

        </div>

      </div>
    </div>
  );
}
