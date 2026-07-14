import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useEffect, useState, useRef } from "react";

export default function NavbarAdmin({ seccion, setSeccion }) {
  const navigate = useNavigate();
  const { usuario, cerrarSesion } = useAuth(); 
  const [esMovil, setEsMovil] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const dropdownRef = useRef(null);

  // Escuchar el tamaño de pantalla para adaptar la UI
  useEffect(() => {
    const checkResponsive = () => {
      const movil = window.innerWidth < 1024;
      setEsMovil(movil);
      if (!movil) setMenuAbierto(false); // Cerrar menú si pasa a escritorio
    };
    checkResponsive();
    window.addEventListener("resize", checkResponsive);
    return () => window.removeEventListener("resize", checkResponsive);
  }, []);

  // Cerrar el menú flotante si el usuario hace clic afuera de él
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuAbierto(false);
      }
    };
    if (menuAbierto) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [menuAbierto]);

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    cerrarSesion();
    navigate("/");
    window.location.reload();
  };

  // Lista de navegación con los SVGs minimalistas idénticos a tu Sidebar
  const opcionesNav = [
    { 
      id: "dashboard", 
      label: "Dashboard", 
      icono: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>
      )
    },
    { 
      id: "productos", 
      label: "Productos", 
      icono: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
      )
    },
    { 
      id: "categorias", 
      label: "Categorías", 
      icono: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
      )
    },
    { 
      id: "subcategorias", 
      label: "Subcategorías", 
      icono: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 22v-7a5 5 0 0 1 10 0v7"></path><path d="M7 15v7"></path><path d="M12 15a5 5 0 0 1 10 0v7"></path><path d="M17 15v7"></path></svg>
      )
    },
    { 
      id: "hero", 
      label: "Hero Banners", 
      icono: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
      )
    },
    { 
      id: "banner", 
      label: "Banner Secondary", 
      icono: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="9" x2="20" y2="9"></line><line x1="4" y1="15" x2="20" y2="15"></line><line x1="10" y1="3" x2="10" y2="21"></line><line x1="14" y1="3" x2="14" y2="21"></line></svg>
      )
    },
    { 
      id: "colecciones", 
      label: "Colecciones", 
      icono: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
      )
    },
    { 
      id: "configuracion", 
      label: "Configuración", 
      icono: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
      )
    },
    { 
      id: "paginas", 
      label: "Páginas", 
      icono: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
      )
    },
    {
      id: "clientes", 
      label: "Clientes",
      icono: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-3-3.87"></path><path d="M4 21v-2a4 4 0 0 1 3-3.87"></path><circle cx="12" cy="7" r="4"></circle></svg>
      )
    }
  ];

  // Encontrar la sección actualmente activa para mostrar su icono y título en el header móvil
  const seccionActiva = opcionesNav.find((opt) => opt.id === seccion) || opcionesNav[0];

  return (
    <header
      style={{
        background: "#ffffff",
        padding: esMovil ? "12px 16px" : "16px 32px",
        fontFamily: "'Inter', system-ui, sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        position: "relative",
        zIndex: 99,
        boxSizing: "border-box",
        borderBottom: "1px solid #e2e8f0",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)"
      }}
    >
      {/* LADO IZQUIERDO: Título en escritorio / Menú Sándwich en Móvil */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {!esMovil ? (
          // Vista Escritorio: Título clásico
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "#0f172a", letterSpacing: "-0.025em" }}>
              Panel de Administración
            </h2>
            <span style={{ fontSize: "12px", fontWeight: 500, color: "#64748b" }}>
              Gestión de contenidos
            </span>
          </div>
        ) : (
          // Vista Móvil: Botón de Sándwich interactivo con Dropdown flotante
          <div ref={dropdownRef} style={{ position: "relative" }}>
            <button
              onClick={() => setMenuAbierto(!menuAbierto)}
              style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "10px",
                padding: "8px 14px",
                fontSize: "14px",
                fontWeight: 600,
                color: "#1e293b",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                outline: "none",
                userSelect: "none"
              }}
            >
              {/* Icono de Sándwich de 3 líneas que cambia a una "X" si se abre */}
              <div style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                width: "16px",
                height: "12px",
                position: "relative"
              }}>
                <span style={{
                  width: "100%",
                  height: "2px",
                  background: "#1e293b",
                  borderRadius: "2px",
                  transition: "all 0.2s ease",
                  transform: menuAbierto ? "rotate(45deg) translate(3px, 4px)" : "none"
                }} />
                <span style={{
                  width: "100%",
                  height: "2px",
                  background: "#1e293b",
                  borderRadius: "2px",
                  transition: "all 0.2s ease",
                  opacity: menuAbierto ? 0 : 1
                }} />
                <span style={{
                  width: "100%",
                  height: "2px",
                  background: "#1e293b",
                  borderRadius: "2px",
                  transition: "all 0.2s ease",
                  transform: menuAbierto ? "rotate(-45deg) translate(3px, -4px)" : "none"
                }} />
              </div>
              
              {/* SVG de la sección activa + Nombre de la sección */}
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "8px", 
                color: "#2563eb" // Resalta la sección activa en azul
              }}>
                {seccionActiva.icono}
                <span style={{ color: "#1e293b", fontSize: "14px", fontWeight: 600 }}>
                  {seccionActiva.label}
                </span>
              </div>
            </button>

            {/* Menú Desplegable Flotante */}
            {menuAbierto && (
              <div style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                left: "0",
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
                width: "220px",
                padding: "6px",
                display: "flex",
                flexDirection: "column",
                gap: "2px",
                zIndex: 100
              }}>
                {opcionesNav.map((opc) => {
                  const estaActivo = opc.id === seccion;
                  return (
                    <button
                      key={opc.id}
                      onClick={() => {
                        setSeccion(opc.id);
                        setMenuAbierto(false);
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "10px 12px",
                        borderRadius: "8px",
                        border: "none",
                        background: estaActivo ? "rgba(37, 99, 235, 0.08)" : "transparent",
                        color: estaActivo ? "#2563eb" : "#475569",
                        fontSize: "14px",
                        fontWeight: estaActivo ? 600 : 500,
                        textAlign: "left",
                        cursor: "pointer",
                        width: "100%",
                        transition: "all 0.2s ease"
                      }}
                      onMouseEnter={(e) => {
                        if (!estaActivo) {
                          e.currentTarget.style.background = "#f1f5f9";
                          e.currentTarget.style.color = "#0f172a";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!estaActivo) {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.color = "#475569";
                        }
                      }}
                    >
                      <span style={{ 
                        display: "flex", 
                        alignItems: "center",
                        color: estaActivo ? "#2563eb" : "#64748b"
                      }}>
                        {opc.icono}
                      </span>
                      <span>{opc.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* LADO DERECHO: Acciones y Usuario */}
      <div style={{ display: "flex", alignItems: "center", gap: esMovil ? "8px" : "16px" }}>
        
        {/* BOTÓN: Ver Tienda */}
        <button
          onClick={() => navigate("/")}
          style={{
            background: "#ffffff",
            border: "1px solid #c084fc",
            color: "#7c3aed",
            padding: esMovil ? "8px 12px" : "8px 16px",
            borderRadius: "10px",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#f5f3ff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#ffffff";
          }}
        >
          {esMovil ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          ) : (
            "Ver Tienda"
          )}
        </button>

        {!esMovil && (
          <div style={{ width: "1px", height: "24px", background: "#e2e8f0" }} />
        )}

        {/* Info Usuario */}
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: esMovil ? "0px" : "10px", 
          background: esMovil ? "transparent" : "#f8fafc", 
          padding: esMovil ? "0" : "6px 14px 6px 8px", 
          borderRadius: "20px", 
          border: esMovil ? "none" : "1px solid #e2e8f0" 
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
          
          {!esMovil && (
            <span style={{ color: "#475569", fontSize: "13px", fontWeight: 500 }}>
              Hola, <strong style={{ color: "#0f172a", fontWeight: 600 }}>{usuario?.nombre?.split(" ")[0] || "Admin"}</strong>
            </span>
          )}
        </div>

        {/* BOTÓN: Cerrar Sesión */}
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
            e.currentTarget.style.background = "#fee2e2";
            e.currentTarget.style.color = "#dc2626";
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