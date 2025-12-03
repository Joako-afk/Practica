import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSolicitudes } from "../context/solicitudes";

export default function Login() {
  const [form, setForm] = useState({ rut: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { cargarSolicitudes } = useSolicitudes();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

  try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

    const data = await res.json();

    if (!res.ok){
      setError(data.message || "Credenciales incorrectas ");
      return;
    }

    localStorage.setItem("token", data.token);

    // Guardar usuario y redirigir
      console.log("Login exitoso:", data.usuario);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));

      await cargarSolicitudes();
      navigate("/principal"); //  cambio de pantalla

    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Panel izquierdo con logo o imagen */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 items-center justify-center text-white p-10">
        <div className="text-center">
          <img
            src="\src\assets\icono\logoCLL.png"
            alt="Logo"
            className="w-24 h-24 mx-auto mb-6 rounded-full shadow-lg border-2 border-white"
          />
          <h1 className="text-4xl font-extrabold mb-3">
            Plataforma de Control de Cambios
          </h1>
          <p className="text-gray-200 text-lg">
            Ingresa para gestionar tus solicitudes
          </p>
        </div>
      </div>

      {/* Panel derecho con formulario */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white">
        <div className="max-w-md w-full px-8 py-10 bg-white rounded-2xl shadow-2xl">
          <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">
            Iniciar Sesión
          </h2>

          {error && (
            <div className="bg-red-100 text-red-700 border border-red-300 rounded-md p-2 mb-3 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* RUT */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                RUT
              </label>
              <input
                type="text"
                name="rut"
                value={form.rut}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="12345678-9"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Formato: 12345678-9</p>
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Botón de inicio */}
            <button
              type="submit"
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 rounded-lg transition"
            >
              Ingresar
            </button>
          </form>

          {/* Separador */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="px-3 text-gray-400 text-sm">ó</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          {/* Enlace a registro */}
          <p className="text-center text-sm text-gray-600">
            ¿No tienes una cuenta?{" "}
            <Link
              to="/registro"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
