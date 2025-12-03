import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Al iniciar la app → cargar usuario desde localStorage si existe
  useEffect(() => {
    const saved = localStorage.getItem("app_user");
    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  // Cuando user cambia → persistirlo
  useEffect(() => {
    if (user) {
      localStorage.setItem("app_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("app_user");
    }
  }, [user]);

  // Login recibe un OBJETO con rut, nombre, apellido y rol
  const login = (usuario) => {
    setUser(usuario);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
