import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation(); // saber qué página está activa

  const linkClass = (path) =>
    `px-10 py-2 rounded-4xl transition ${
      location.pathname === path
        ? "bg-pink-700 text-white"
        : "hover:bg-pink-900 text-gray-200 "
    }`;

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-slate-500 text-white ">
      <h1 className="text-2xl font-bold">Mi Proyecto</h1>

      <div className="flex gap-20">
        <Link to="/principal" className={linkClass("/principal")}>
          Tablero
        </Link>
        <Link to="/formulario" className={linkClass("/formulario")}>
          Nueva Solicitud
        </Link>
        <Link to="/historial" className={linkClass("/historial")}>
          Historial
        </Link>
      </div>
    </nav>
  );
}
