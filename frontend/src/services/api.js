//front/src/services/api.js
// Capa de servicio (stub) para futura integración con backend
// Reemplaza estos métodos con fetch/axios cuando tengas la API lista.

export async function fetchSolicitudes() {
  // Ejemplo: const res = await fetch('/api/solicitudes'); return res.json();
  return Promise.resolve([]);
}

export async function crearSolicitud(payload) {
  // Ejemplo: await fetch('/api/solicitudes', { method: 'POST', body: JSON.stringify(payload) })
  return Promise.resolve({ ok: true });
}

export async function actualizarSolicitud(id, cambios) {
  // Ejemplo: await fetch(`/api/solicitudes/${id}`, { method: 'PATCH', body: JSON.stringify(cambios) })
  return Promise.resolve({ ok: true });
}

