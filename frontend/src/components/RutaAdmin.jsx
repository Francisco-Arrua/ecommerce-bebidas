import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RutaAdmin() {
  const { usuario, cargando } = useAuth();

  if (cargando) {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0a0c", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff", fontFamily: "Inter" }}>
        Cargando credenciales...
      </div>
    );
  }

  // Comprueba que exista el usuario y que su rol sea estrictamente ADMIN
  if (!usuario || usuario.rol !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />; // Renderiza las pantallas hijas de la carpeta admin
}