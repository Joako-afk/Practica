import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    rut: "",
    email: "",
    password: "",
    departamento: "",
  });

  const [departamento, setDepartamento] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // 🔹 Cargar departamentos desde backend
  useEffect(() => {
    fetch("http://localhost:5000/api/departamento")
      .then((res) => res.json())
      .then((data) => setDepartamento(data))
      .catch(() => {
        setError("Error al cargar departamentos");
      });
  }, []);

  // 🔹 Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "departamento") {
      setForm({ ...form, [name]: Number(value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  //  Enviar datos al backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch("http://localhost:5000/api/usuario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("Usuario registrado correctamente. Redirigiendo al inicio de sesión...");
        // redirección suave al login
        setTimeout(() => navigate("/login"), 800);
      } else {
        setError(data.message || "No se pudo registrar el usuario");
      }
    } catch {
      setError("Error al registrar el usuario");
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Panel izquierdo con logo */}
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
            Crea tu cuenta para gestionar tus solicitudes
          </p>
        </div>
      </div>

      {/* Panel derecho con formulario */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white">
        <form
          onSubmit={handleSubmit}
          className="max-w-md w-full px-8 py-10 bg-white rounded-2xl shadow-2xl"
        >
          <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">
            Registro de Usuario
          </h1>

          {error && (
            <div className="bg-red-100 text-red-700 border border-red-300 rounded-md p-2 mb-3 text-sm text-center">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 text-green-700 border border-green-300 rounded-md p-2 mb-3 text-sm text-center">
              {success}
            </div>
          )}

          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Nombre
            </label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Tu nombre"
              required
            />
          </div>

          {/* Apellido */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Apellido
            </label>
            <input
              type="text"
              name="apellido"
              value={form.apellido}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Tu apellido"
              required
            />
          </div>

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

          {/* Correo */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Correo
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="tucorreo@ejemplo.com"
              required
            />
          </div>

          {/* Departamento */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Departamento
            </label>
            <select
              name="departamento"
              value={form.departamento}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            >
              <option value="">Selecciona tu sector de trabajo</option>
              {departamento.map((dep) => (
                <option key={dep.id} value={dep.id}>
                  {dep.nombre}
                </option>
              ))}
            </select>
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

          {/* Botón */}
          <button
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 rounded-lg transition mt-4"
          >
            Registrarme
          </button>

          {/* Enlace al login */}
          <p className="text-sm text-gray-600 text-center mt-6">
            ¿Ya tienes cuenta?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Inicia sesión aquí
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
