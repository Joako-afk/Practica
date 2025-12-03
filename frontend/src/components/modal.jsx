import { useEffect, useState } from "react";
import { useAuth } from "../context/sesion";
import { getEstadoColor, normalizeEstado } from "../utils/helpers";
import { ESTADOS } from "../utils/constants";

export default function Modal({ card, moverTarjeta, onClose }) {
  const { user } = useAuth();
  const [rutaCambio, setRutaCambio] = useState("Cargando...");

  if (!card) return null;

  // calcular siguiente estado (para el botón "Mover a ...")
  const idx = ESTADOS.indexOf(normalizeEstado(card.estado));
  const nextEstado =
    idx > -1 && idx < ESTADOS.length - 1 ? ESTADOS[idx + 1] : null;

  const handleMover = () => {
    if (!nextEstado || !moverTarjeta) return;
    moverTarjeta(nextEstado, user?.name || null);
  };

  // Cerrar con ESC
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // 🔹 Construir RUTA DEL CAMBIO a partir de id_jerarquia
  useEffect(() => {
    const obtenerRuta = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/opciones");
        const data = await res.json();
        const jerarquias = data.detalles || [];

        let ruta = [];
        let actual = jerarquias.find(
          (j) => j.id_jerarquia === card.id_jerarquia
        );

        // subimos por los padres hasta que no haya más
        while (actual) {
          ruta.push(actual.nombre);
          if (!actual.id_padre) break;
          actual = jerarquias.find(
            (j) => j.id_jerarquia === actual.id_padre
          );
        }

        ruta.reverse(); // para que quede Sistema → SubSistema → Sector → Atributo
        setRutaCambio(ruta.join(" → "));
      } catch (err) {
        console.error("Error cargando ruta del cambio:", err);
        setRutaCambio("No disponible");
      }
    };

    if (card.id_jerarquia) {
      obtenerRuta();
    } else {
      setRutaCambio("No definida");
    }
  }, [card.id_jerarquia]);

  // formatear hora cortita HH:MM
  const horaCorta = card.hora_solicitud
    ? card.hora_solicitud.toString().slice(0, 5)
    : "—";

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-3xl p-6"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* TÍTULO NUEVO */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            Solicitud de {card.solicitante} del departamento de {card.departamento || "sin departamento"}
          </h2>
        </div>

        {/*FILA 1*/}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm font-semibold text-gray-700">
              Ruta del cambio
            </p>
            <p className="text-gray-900 font-medium">
              {rutaCambio || "—"}
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-700">Motivo</p>
            <p className="text-gray-900 font-medium">
              {card.motivo || "—"}
            </p>
          </div>
        </div>

        {/*FILA 2*/}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm font-semibold text-gray-700">
              Fecha ingreso
            </p>
            <p className="text-gray-900 font-medium">
              {card.fechaIngreso || card.fecha || "—"}
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-700">
              Hora ingreso
            </p>
            <p className="text-gray-900 font-medium">{horaCorta}</p>
          </div>
        </div>

        {/*FILA 3*/}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm font-semibold text-gray-700">
              Prioridad
            </p>
            <p className="text-gray-900 font-medium">
              {card.prioridad || "—"}
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-700">
              Estado
            </p>
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getEstadoColor(
                normalizeEstado(card.estado)
              )}`}
            >
              {normalizeEstado(card.estado) || "—"}
            </span>
          </div>
        </div>

        {/* DESCRIPCIÓN */}
        <div className="mb-6">
          <p className="font-semibold text-gray-900 border-b pb-1">
            Descripción
          </p>

          <div
            className="
              mt-2
              max-h-24
              overflow-y-auto
              overflow-x-hidden
              pr-2
              rounded
              bg-gray-50
              p-3
              border
            "
          >
            <p className="text-gray-700 whitespace-pre-wrap break-words leading-normal">
              {card.comentarios || "Sin descripción entregada."}
            </p>
          </div>
        </div>

        {/* FOOTER: BOTÓN MOVER + CERRAR */}
        <div className="mt-6 flex justify-end gap-3">
          {nextEstado &&
            typeof moverTarjeta === "function" &&
            normalizeEstado(card.estado) !== ESTADOS[ESTADOS.length - 1] && (
              <button
                type="button"
                onClick={handleMover}
                className="btn-primary"
              >
                Mover a {nextEstado}
              </button>
            )}

          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
