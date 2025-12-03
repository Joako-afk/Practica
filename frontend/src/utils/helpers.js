// Colores de prioridad
const PRIORIDAD_POR_ID = {
  1: "Baja",
  2: "Mediana",
  3: "Alta",
  4: "Urgente",
};

export const ESTADOS_ID = {
  "Recibido": 4,
  "En espera": 3,
  "Ejecutando": 2,
  "Finalizado": 1,
};


const PRIORIDAD_STYLES = {
  bajo: "bg-green-600 border-green-800 text-white",
  baja: "bg-green-600 border-green-800 text-white",
  media: "bg-yellow-500 border-yellow-700 text-black",
  mediana: "bg-yellow-500 border-yellow-700 text-black",
  alta: "bg-red-600 border-red-800 text-white",
  urgente: "bg-purple-600 border-purple-800 text-white",
  urgencia: "bg-purple-600 border-purple-800 text-white",
};

export function getPrioridadColor(prioridad) {
  const nombre = (PRIORIDAD_POR_ID[prioridad] || prioridad || "")
    .toString()
    .trim()
    .toLowerCase();
  return PRIORIDAD_STYLES[nombre] || PRIORIDAD_STYLES.bajo;
}
// Normaliza estados a valores canónicos en ESTADOS
export function normalizeEstado(estado) {
  if (!estado) return "";

  const s = estado.toString().trim().toLowerCase();

  if (s.includes("recib")) return "Recibido";
  if (s.includes("espera")) return "En espera";
  if (s.includes("ejecut")) return "Ejecutando";
  if (s.includes("final")) return "Finalizado";
  if (s.includes("rechaz")) return "Rechazado";

  if (s==="1") return "Finalizado";
  if (s==="2") return "Ejecutando";
  if (s==="3") return "En espera";
  if (s==="4") return "Recibido";
  if (s==="5") return "Rechazado";
  return estado;
}
// Colores de estado
export function getEstadoColor(estado) {
  const map = {
    "Recibido": "bg-gray-300 text-gray-800",
    "En espera": "bg-blue-300 text-blue-800",
    "Ejecutando": "bg-yellow-300 text-yellow-800",
    "Finalizado": "bg-green-300 text-green-800",
    "Rechazado": "bg-red-300 text-red-800",
  };
  return map[estado] || "bg-gray-200 text-gray-700";
}

// Helper para generar fechas en formato YYYY-MM-DD
export function getFecha(daysAgo = 0) {
  const date = new Date(Date.now() - daysAgo * 86400000);
  return date.toISOString().split("T")[0];
}

// Formatear fecha larga: "Martes, 18 de Noviembre de 2025"
export function formatearFechaLarga(fechaISO) {
  if (!fechaISO) return "";

  const fecha = new Date(fechaISO);

  const opciones = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  };

  return fecha
    .toLocaleDateString("es-ES", opciones)
    .replace(/^\w/, c => c.toUpperCase()); // Primera letra mayúscula
}
