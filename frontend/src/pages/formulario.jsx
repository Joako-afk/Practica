import { useSolicitudes } from "../context/solicitudes";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/sesion";

export default function NuevaSolicitud() {
   const { cargarSolicitudes } = useSolicitudes();
  const { user } = useAuth();
  const navigate = useNavigate();
    
  // Datos del formulario
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

  // contador de caracteres
  const [descripcionCount, setDescripcionCount] = useState(0);

  // Listas reales del backend
  const [listas, setListas] = useState({
    solicitante: [],
    prioridad: [],
    motivos: [],
    detalles: [],
  });

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

  // Cargar listas desde backend
  useEffect(() => {
    fetch("http://localhost:5000/api/opciones")
      .then((res) => res.json())
      .then((data) => {
        console.log(" Listas desde backend:", data);
        setListas(data);
      })
      .catch((err) => console.error(" Error al cargar listas:", err));
  }, []);

  // Manejar cambios
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };


  const obtenerUltimaJerarquia = () => {
    if (form.atributo) return form.atributo;
    if (form.sector) return form.sector;
    if (form.subsistema) return form.subsistema;
    if (form.sistema) return form.sistema;
  }
  // Enviar solicitud al backend
  const enviarSolicitud = async () => {
    try {
      const token = localStorage.getItem("token");

      // Obtener la jerarquía final seleccionada
      const idJerarquiaFinal = obtenerUltimaJerarquia();

      // Crear cuerpo para enviar al backend
      const body = {
        nombre_solicitante: form.nombre_solicitante,
        motivo: form.motivo,
        prioridad: form.prioridad,
        descripcion: form.descripcion,

        sistema: form.sistema,
        subsistema: form.subsistema,
        sector: form.sector,
        atributo: form.atributo,

        jerarquia: idJerarquiaFinal
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

      if (!res.ok) throw new Error(data.message);

      return true;
    } catch (err) {
      alert("Error al enviar solicitud");
      return false;
    }
  };

  // Enviar y volver
  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await enviarSolicitud();
    if (ok) {
      await cargarSolicitudes(); 
      navigate("/principal", { replace: true });
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

        {/* GRID DE 2 COLUMNAS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

          {/* Solicitante */}
          <div>
            <label className="label">Solicitante</label>
            <select
              name="nombre_solicitante"
              value={form.nombre_solicitante}
              onChange={handleChange}
              className="input w-full"
              required
            >
              <option value="">Selecciona...</option>
              {listas.solicitante.map((u) => (
                <option key={u.rut} value={u.rut}>
                  {u.nombre} {u.apellido}
                </option>
              ))}
            </select>
          </div>

          {/* Prioridad */}
          <div>
            <label className="label">Prioridad</label>
            <select
              name="prioridad"
              value={form.prioridad}
              onChange={handleChange}
              className="input w-full"
              required
            >
              <option value="">Selecciona...</option>
              {listas.prioridad.map((p) => (
                <option key={p.id_prioridad} value={p.id_prioridad}>
                  {p.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Motivo */}
          <div className="sm:col-span-2">
            <label className="label">Motivo</label>
            <select
              name="motivo"
              value={form.motivo}
              onChange={handleChange}
              className="input w-full"
              required
            >
              <option value="">Selecciona...</option>
              {listas.motivos.map((m) => (
                <option key={m.id_cambio} value={m.id_cambio}>
                  {m.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Sistema */}
          <div>
            <label className="label">Sistema</label>
            <select
              name="sistema"
              value={form.sistema}
              onChange={handleChange}
              className="input w-full"
            >
              <option value="">Selecciona...</option>
              {sistemas.map((s) => (
                <option key={s.id_jerarquia} value={s.id_jerarquia}>
                  {s.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* SubSistema */}
          <div>
            <label className="label">SubSistema</label>
            <select
              name="subsistema"
              value={form.subsistema}
              onChange={handleChange}
              className="input w-full"
              disabled={!form.sistema}
            >
              <option value="">Selecciona...</option>
              {subsistemasFiltrados.map((sub) => (
                <option key={sub.id_jerarquia} value={sub.id_jerarquia}>
                  {sub.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Sector */}
          <div>
            <label className="label">Sector</label>
            <select
              name="sector"
              value={form.sector}
              onChange={handleChange}
              className="input w-full"
              disabled={!form.subsistema}
            >
              <option value="">Selecciona...</option>
              {sectoresFiltrados.map((sec) => (
                <option key={sec.id_jerarquia} value={sec.id_jerarquia}>
                  {sec.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Atributo */}
          <div>
            <label className="label">Atributo</label>
            <select
              name="atributo"
              value={form.atributo}
              onChange={handleChange}
              className="input w-full"
              disabled={!form.sector}
            >
              <option value="">Selecciona...</option>
              {atributosFiltrados.map((a) => (
                <option key={a.id_jerarquia} value={a.id_jerarquia}>
                  {a.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>


        {/* BLOQUE COMENTARIO + BOTONES LATERALES */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:col-span-2">

          {/* DESCRIPCIÓN (ocupa 2 columnas en pantallas grandes) */}
          <div className="sm:col-span-2">
            <label className="label">Descripción detallada</label>

            <textarea
              name="descripcion"
              value={form.descripcion}
              rows={5}
              maxLength={500}
              onChange={(e) => {
                const value = e.target.value.slice(0, 500);
                setForm((prev) => ({ ...prev, descripcion: value }));
                setDescripcionCount(value.length);
              }}
              className="textarea w-full"
              placeholder="Máximo 500 caracteres..."
            />

            {/* contador */}
            <p className="text-sm text-gray-500 text-right">
              {descripcionCount}/500
            </p>
          </div>

          {/* BOTONES: en columna */}
          <div className="flex flex-col gap-3 justify-center">

            {/* Enviar y volver */}
            <button type="submit" className="btn-primary w-full">
              Enviar y volver
            </button>

            {/* Enviar y crear otra */}
            <button
              type="button"
              onClick={async () => {
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
              }}
              className="btn-secondary w-full"
            >
              Enviar y crear otra
            </button>

            {/* Cancelar */}
            <button
              type="button"
              onClick={() => navigate("/principal", { replace: true })}
              className="btn-danger w-full"
            >
              Cancelar
            </button>

          </div>
        </div>

      </form>
    </div>
  );
}
