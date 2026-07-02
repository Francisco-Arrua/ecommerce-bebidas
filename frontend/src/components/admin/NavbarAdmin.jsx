import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function NavbarAdmin() {
  const navigate = useNavigate();
  // Extraemos usuario y la función para desloguear del contexto
  const { usuario, cerrarSesion } = useAuth(); 

  const handleLogout = () => {
    cerrarSesion();
    navigate("/"); // Redirige a la tienda o al login una vez cerrada la sesión
  };

  return (
    <header
      style={{
        background: "#ffffff",
        padding: "16px 32px",
        fontFamily: "'Inter', system-ui, sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        zIndex: 90,
        boxSizing: "border-box",
        borderBottom: "1px solid #e2e8f0", // Separador sutil con el fondo claro
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)"
      }}
    >
      {/* Título unificado */}
      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "#0f172a", letterSpacing: "-0.025em" }}>
          Panel de Administración
        </h2>
        <span style={{ fontSize: "12px", fontWeight: 500, color: "#64748b" }}>
          Gestión de contenidos
        </span>
      </div>

      {/* Lado derecho: Acciones y Usuario */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        
        {/* BOTÓN: Ver Tienda (Estilo claro e integrado) */}
        <button
          onClick={() => navigate("/")}
          style={{
            background: "#ffffff",
            border: "1px solid #c084fc", // Un toque violeta/azul para mantener identidad sin saturar
            color: "#7c3aed",
            padding: "8px 16px",
            borderRadius: "10px",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#f5f3ff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#ffffff";
          }}
        >
          Ver Tienda
        </button>

        {/* Separador vertical */}
        <div style={{ width: "1px", height: "24px", background: "#e2e8f0" }} />

        {/* Info Usuario estilo badge */}
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "10px", 
          background: "#f8fafc", 
          padding: "6px 14px 6px 8px", 
          borderRadius: "20px", 
          border: "1px solid #e2e8f0" 
        }}>
          <div style={{ 
            width: "28px", 
            height: "28px", 
            borderRadius: "50%", 
            background: "linear-gradient(135deg, #2563eb, #1d4ed8)", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            color: "#ffffff", 
            fontSize: "11px", 
            fontWeight: 700 
          }}>
            {usuario?.nombre ? usuario.nombre.charAt(0).toUpperCase() : "A"}
          </div>
          <span style={{ color: "#475569", fontSize: "13px", fontWeight: 500 }}>
            Hola, <strong style={{ color: "#0f172a", fontWeight: 600 }}>{usuario?.nombre?.split(" ")[0] || "Admin"}</strong>
          </span>
        </div>

        {/* BOTÓN NUEVO: Cerrar Sesión */}
        <button
          onClick={handleLogout}
          title="Cerrar sesión"
          style={{
            background: "transparent",
            border: "1px solid #e2e8f0",
            color: "#64748b",
            padding: "8px",
            borderRadius: "10px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#fee2e2"; // Fondo rojo sutil
            e.currentTarget.style.color = "#dc2626"; // Icono rojo
            e.currentTarget.style.borderColor = "#fca5a5";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#64748b";
            e.currentTarget.style.borderColor = "#e2e8f0";
          }}
        >
          <svg 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </button>

      </div>
    </header>
  );
}