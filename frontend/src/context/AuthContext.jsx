import { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  const verificarUsuario = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUsuario(null);
      setCargando(false);
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });

      if (res.ok) {
        const data = await res.json();
        setUsuario(data.usuario);
      } else {
        localStorage.removeItem("token");
        setUsuario(null);
      }
    } catch (error) {
      console.error("Error al verificar identidad:", error);
    } finally {
      setCargando(false);
    }
  };


  const cerrarSesion = () => {
    localStorage.removeItem("token"); // Borra el token del almacenamiento
    setUsuario(null); // Limpia el estado del usuario inmediatamente
  };

  useEffect(() => {
    verificarUsuario();
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, setUsuario, cargando, verificarUsuario, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);