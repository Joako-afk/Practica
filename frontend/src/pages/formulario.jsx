import { useSolicitudes } from "../context/solicitudes";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/sesion";

export default function NuevaSolicitud() {
  const { cargarSolicitudes } = useSolicitudes();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre_solicitante: "",
    motivo: "",
    prioridad: "",
    objetivo: "",
    sistema: "",
    subsistema: "",
    sector: "",
    atributo: "",
    descripcion: "",
  });

  const [descripcionCount, setDescripcionCount] = useState(0);

  const [listas, setListas] = useState({
    solicitante: [],
    prioridad: [],
    motivos: [],
    detalles: [],
  });

  // Mensajes bonitos
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // === Filtrado jerárquico ===
  const sistemas = listas.detalles.filter((d) => d.tipo === "Sistema");
  const subsistemas = listas.detalles.filter((d) => d.tipo === "SubSistema");
  const sectores = listas.detalles.filter((d) => d.tipo === "Sector");
  const atributos = listas.detalles.filter((d) => d.tipo === "Atributo");

  const subsistemasFiltrados = subsistemas.filter(
    (sub) => sub.id_padre === Number(form.sistema)
  );

  const sectoresFiltrados = sectores.filter(
    (sec) => sec.id_padre === Number(form.subsistema)
  );

  const atributosFiltrados = atributos.filter(
    (a) => a.id_padre === Number(form.sector)
  );

  // === Cargar listas desde backend ===
  useEffect(() => {
    fetch("http://localhost:5000/api/opciones")
      .then((res) => res.json())
      .then((data) => setListas(data))
      .catch(() => setError("Error al cargar listas desde el servidor"));
  }, []);

  // === Manejar cambios ===
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "descripcion") {
      setDescripcionCount(value.length);
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Obtener la jerarquía final seleccionada
  const obtenerUltimaJerarquia = () => {
    if (form.atributo) return form.atributo;
    if (form.sector) return form.sector;
    if (form.subsistema) return form.subsistema;
    if (form.sistema) return form.sistema;
    return null;
  };

  // === Enviar solicitud ===
  const enviarSolicitud = async () => {
    try {
      setError("");
      setSuccess("");

      const token = localStorage.getItem("token");

      const idJerarquiaFinal = obtenerUltimaJerarquia();

      const body = {
        nombre_solicitante: form.nombre_solicitante,
        motivo: form.motivo,
        prioridad: form.prioridad,
        descripcion: form.descripcion,
        sistema: form.sistema,
        subsistema: form.subsistema,
        sector: form.sector,
        atributo: form.atributo,
        jerarquia: idJerarquiaFinal,
      };

      const res = await fetch("http://localhost:5000/api/solicitudes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Error al enviar la solicitud");
        return false;
      }

      // ÉXITO
      setSuccess("Solicitud creada correctamente.");
      return true;
    } catch {
      setError("Error al enviar la solicitud");
      return false;
    }
  };

  // === Enviar y volver al tablero ===
  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await enviarSolicitud();
    if (ok) {
      await cargarSolicitudes();
      navigate("/principal", { replace: true });
    }
  };

  // === Enviar y crear otra ===
  const handleEnviarYCrearOtra = async () => {
    const ok = await enviarSolicitud();
    if (ok) {
      setForm({
        nombre_solicitante: "",
        motivo: "",
        prioridad: "",
        objetivo: "",
        sistema: "",
        subsistema: "",
        sector: "",
        atributo: "",
        descripcion: "",
      });
      setDescripcionCount(0);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-8 space-y-8"
      >
        <h1 className="text-3xl font-bold text-center">
          Ingreso de Nueva Solicitud
        </h1>

        {/* ==== BANNERS ==== */}
        {error && (
          <div className="bg-red-100 text-red-700 border border-red-300 rounded-md p-2 mb-2 text-sm text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 text-green-700 border border-green-300 rounded-md p-2 mb-2 text-sm text-center">
            {success}
          </div>
        )}

        {/* ==== FORMULARIO ==== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

          {/* Solicitante */}
          <div>
            <label className="block font-semibold mb-1">
              Nombre del solicitante
            </label>
            <input
              type="text"
              name="nombre_solicitante"
              value={form.nombre_solicitante}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          {/* Motivo */}
          <div>
            <label className="block font-semibold mb-1">Motivo</label>
            <select
              name="motivo"
              value={form.motivo}
              onChange={handleChange}
              className="input"
              required
            >
              <option value="">Selecciona</option>
              {listas.motivos.map((m) => (
                <option key={m.id_cambio} value={m.id_cambio}>
                  {m.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Prioridad */}
          <div>
            <label className="block font-semibold mb-1">Prioridad</label>
            <select
              name="prioridad"
              value={form.prioridad}
              onChange={handleChange}
              className="input"
              required
            >
              <option value="">Selecciona</option>
              {listas.prioridad.map((p) => (
                <option key={p.id_prioridad} value={p.id_prioridad}>
                  {p.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Sistema */}
          <div>
            <label className="block font-semibold mb-1">Sistema</label>
            <select
              name="sistema"
              value={form.sistema}
              onChange={handleChange}
              className="input"
            >
              <option value="">Selecciona</option>
              {sistemas.map((s) => (
                <option key={s.id_jerarquia} value={s.id_jerarquia}>
                  {s.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* SubSistema */}
          <div>
            <label className="block font-semibold mb-1">SubSistema</label>
            <select
              name="subsistema"
              value={form.subsistema}
              onChange={handleChange}
              className="input"
              disabled={!form.sistema}
            >
              <option value="">Selecciona</option>
              {subsistemasFiltrados.map((s) => (
                <option key={s.id_jerarquia} value={s.id_jerarquia}>
                  {s.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Sector */}
          <div>
            <label className="block font-semibold mb-1">Sector</label>
            <select
              name="sector"
              value={form.sector}
              onChange={handleChange}
              className="input"
              disabled={!form.subsistema}
            >
              <option value="">Selecciona</option>
              {sectoresFiltrados.map((s) => (
                <option key={s.id_jerarquia} value={s.id_jerarquia}>
                  {s.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Atributo */}
          <div>
            <label className="block font-semibold mb-1">Atributo</label>
            <select
              name="atributo"
              value={form.atributo}
              onChange={handleChange}
              className="input"
              disabled={!form.sector}
            >
              <option value="">Selecciona</option>
              {atributosFiltrados.map((a) => (
                <option key={a.id_jerarquia} value={a.id_jerarquia}>
                  {a.nombre}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* === Descripción === */}
        <div>
          <label className="block font-semibold mb-1">Descripción</label>
          <textarea
            name="descripcion"
            maxLength="500"
            value={form.descripcion}
            onChange={handleChange}
            className="input h-32"
          />
          <div className="text-sm text-gray-500 text-right">
            {descripcionCount}/500
          </div>
        </div>

        {/* === Botones === */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button type="submit" className="btn-primary w-full">
            Enviar y volver
          </button>

          <button
            type="button"
            onClick={handleEnviarYCrearOtra}
            className="btn-secondary w-full"
          >
            Enviar y crear otra
          </button>
        </div>

      </form>
    </div>
  );
}
