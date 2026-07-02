import { createContext, useContext, useState, useEffect } from "react";

// ✅ Agregamos el export por si requiere importación directa en algún lado
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

  useEffect(() => {
    verificarUsuario();
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, setUsuario, cargando, verificarUsuario }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);