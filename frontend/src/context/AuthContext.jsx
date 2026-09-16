import { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;

  const verificarUsuario = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/auth/me`, {
        credentials: "include",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (res.ok) {
        const data = await res.json();
        setUsuario(data.usuario);
      } else {
        // El token guardado ya no sirve (venció, o el back reinició el JWT_SECRET, etc.)
        localStorage.removeItem("token");
        setUsuario(null);
      }
    } catch (error) {
      console.error("Error al verificar identidad:", error);
    } finally {
      setCargando(false);
    }
  };

  // Se llama después de un login/register exitoso. Guarda el token (respaldo
  // para navegadores que bloquean la cookie cross-site, típicamente en mobile)
  // y actualiza el estado global sin depender de un segundo round-trip.
  const iniciarSesion = (token, usuarioData) => {
    if (token) {
      localStorage.setItem("token", token);
    }
    setUsuario(usuarioData);
  };

  const cerrarSesion = () => {
    fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    }).catch(() => {});
    localStorage.removeItem("token");
    setUsuario(null);
  };

  useEffect(() => {
    verificarUsuario();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider
      value={{ usuario, setUsuario, cargando, verificarUsuario, iniciarSesion, cerrarSesion }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);