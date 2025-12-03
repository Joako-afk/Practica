import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/sesion";
import PrivateLayout from "./layouts/PrivateLayout";
import Tablero from "./pages/principal";
import NuevaSolicitud from "./pages/formulario";
import Historial from "./pages/historial";
import Login from "./pages/login"; 
import Register from "./pages/registro";

function PrivateRoute({ children }) {
  const { user } = useAuth();
  const hasToken = !!localStorage.getItem("token");

  // Verificar si el usuario está autenticado
  if (!user && hasToken) {
    return children; // Permitir acceso si hay token (se cargará el usuario en otro lugar)
  }

  return <Navigate to="/login" replace />;
}


export default function App() {
  return (
    <>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Register />} />

      {/* Rutas privadas bajo el layout */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <PrivateLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Tablero />} />
        <Route path="principal" element={<Tablero />} />
        <Route path="formulario" element={<NuevaSolicitud />} />
        <Route path="historial" element={<Historial />} />
      </Route>
    </Routes>
    </>
  );
}
