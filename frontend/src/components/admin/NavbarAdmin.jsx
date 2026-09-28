import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useEffect, useState, useRef } from "react";

// Paleta: negro puro, grises neutros y blanco como único acento
const C = {
  bg: "#000000",
  panel: "#0a0a0a",
  borde: "#262626",
  texto: "#fafafa",
  textoSuave: "#a1a1a1",
  hover: "rgba(255, 255, 255, 0.08)",
  activo: "rgba(255, 255, 255, 0.14)",
};

const css = `
  .nav-admin-btn {
    transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
    font-family: inherit;
  }
  .nav-admin-btn:focus-visible {
    outline: 2px solid #ffffff;
    outline-offset: 2px;
  }
  .nav-admin-ghost:hover { background: ${C.hover}; color: ${C.texto}; }
  .nav-admin-tienda:hover { background: #e5e5e5; }
  .nav-admin-salir:hover {
    background: rgba(239, 68, 68, 0.12);
    color: #f87171;
    border-color: rgba(239, 68, 68, 0.4);
  }
  .nav-admin-item:hover:not([data-activo="true"]) { background: ${C.hover}; color: ${C.texto}; }
  @media (prefers-reduced-motion: reduce) {
    .nav-admin-btn, .nav-admin-linea { transition: none !important; }
  }
`;

const Icono = ({ children }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

export default function NavbarAdmin({ seccion, setSeccion }) {
  const navigate = useNavigate();
  const { usuario, cerrarSesion } = useAuth();
  const [esMovil, setEsMovil] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const dropdownRef = useRef(null);

  // Adaptar la UI al tamaño de pantalla
  useEffect(() => {
    const checkResponsive = () => {
      const movil = window.innerWidth < 1024;
      setEsMovil(movil);
      if (!movil) setMenuAbierto(false);
    };
    checkResponsive();
    window.addEventListener("resize", checkResponsive);
    return () => window.removeEventListener("resize", checkResponsive);
  }, []);

  // Cerrar el menú con clic afuera o con Escape
  useEffect(() => {
    if (!menuAbierto) return;
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuAbierto(false);
      }
    };
    const handleEscape = (event) => {
      if (event.key === "Escape") setMenuAbierto(false);
    };
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuAbierto]);

  const handleLogout = () => {
    cerrarSesion();
    navigate("/");
    window.location.reload();
  };

  const opcionesNav = [
    {
      id: "dashboard",
      label: "Dashboard",
      icono: (
        <Icono>
          <rect x="3" y="3" width="7" height="9"></rect>
          <rect x="14" y="3" width="7" height="5"></rect>
          <rect x="14" y="12" width="7" height="9"></rect>
          <rect x="3" y="16" width="7" height="5"></rect>
        </Icono>
      ),
    },
    {
      id: "productos",
      label: "Productos",
      icono: (
        <Icono>
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
          <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </Icono>
      ),
    },
    {
      id: "categorias",
      label: "Categorías",
      icono: (
        <Icono>
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
        </Icono>
      ),
    },
    {
      id: "subcategorias",
      label: "Subcategorías",
      icono: (
        <Icono>
          <path d="M2 22v-7a5 5 0 0 1 10 0v7"></path>
          <path d="M7 15v7"></path>
          <path d="M12 15a5 5 0 0 1 10 0v7"></path>
          <path d="M17 15v7"></path>
        </Icono>
      ),
    },
    {
      id: "hero",
      label: "Hero Banners",
      icono: (
        <Icono>
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <circle cx="8.5" cy="8.5" r="1.5"></circle>
          <polyline points="21 15 16 10 5 21"></polyline>
        </Icono>
      ),
    },
    {
      id: "banner",
      label: "Banner Secondary",
      icono: (
        <Icono>
          <line x1="4" y1="9" x2="20" y2="9"></line>
          <line x1="4" y1="15" x2="20" y2="15"></line>
          <line x1="10" y1="3" x2="10" y2="21"></line>
          <line x1="14" y1="3" x2="14" y2="21"></line>
        </Icono>
      ),
    },
    {
      id: "colecciones",
      label: "Colecciones",
      icono: (
        <Icono>
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
          <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </Icono>
      ),
    },
    {
      id: "configuracion",
      label: "Configuración",
      icono: (
        <Icono>
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </Icono>
      ),
    },
    {
      id: "credenciales",
      label: "Credenciales MP",
      icono: (
        <Icono>
          <path d="M12 1v22"></path>
          <path d="M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"></path>
        </Icono>
      ),
    },
    {
      id: "pedidos",
      label: "Pedidos",
      icono: (
        <Icono>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </Icono>
      ),
    },
    {
      id: "paginas",
      label: "Páginas",
      icono: (
        <Icono>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </Icono>
      ),
    },
    {
      id: "clientes",
      label: "Clientes",
      icono: (
        <Icono>
          <path d="M20 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M4 21v-2a4 4 0 0 1 3-3.87"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </Icono>
      ),
    },
  ];

  const seccionActiva = opcionesNav.find((opt) => opt.id === seccion) || opcionesNav[0];

  const linea = (extra) => ({
    display: "block",
    width: "100%",
    height: "1.5px",
    background: C.texto,
    borderRadius: "2px",
    transition: "all 0.2s ease",
    ...extra,
  });

  return (
    <header
      style={{
        background: C.bg,
        padding: esMovil ? "10px 16px" : "14px 32px",
        fontFamily: "'Inter', system-ui, sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        position: "relative",
        zIndex: 99,
        boxSizing: "border-box",
        borderBottom: `1px solid ${C.borde}`,
        boxShadow: "0 8px 24px -12px rgba(30, 64, 175, 0.55)",
      }}
    >
      <style>{css}</style>

      {/* IZQUIERDA: título en escritorio / menú en móvil */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {!esMovil ? (
          <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
            <h2
              style={{
                margin: 0,
                fontSize: "17px",
                fontWeight: 600,
                color: C.texto,
                letterSpacing: "-0.02em",
              }}
            >
              Panel de administración
            </h2>
            <span style={{ fontSize: "14px", color: C.borde }}>/</span>
            <span style={{ fontSize: "14px", fontWeight: 500, color: C.textoSuave }}>
              {seccionActiva.label}
            </span>
          </div>
        ) : (
          <div ref={dropdownRef} style={{ position: "relative" }}>
            <button
              className="nav-admin-btn nav-admin-ghost"
              onClick={() => setMenuAbierto(!menuAbierto)}
              aria-expanded={menuAbierto}
              aria-haspopup="menu"
              style={{
                background: "transparent",
                border: `1px solid ${C.borde}`,
                borderRadius: "999px",
                padding: "8px 16px 8px 14px",
                fontSize: "14px",
                fontWeight: 500,
                color: C.texto,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                userSelect: "none",
              }}
            >
              <span
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  width: "16px",
                  height: "11px",
                }}
              >
                <span
                  className="nav-admin-linea"
                  style={linea({
                    transform: menuAbierto ? "translateY(4.75px) rotate(45deg)" : "none",
                  })}
                />
                <span className="nav-admin-linea" style={linea({ opacity: menuAbierto ? 0 : 1 })} />
                <span
                  className="nav-admin-linea"
                  style={linea({
                    transform: menuAbierto ? "translateY(-4.75px) rotate(-45deg)" : "none",
                  })}
                />
              </span>

              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {seccionActiva.icono}
                <span>{seccionActiva.label}</span>
              </span>
            </button>

            {menuAbierto && (
              <div
                role="menu"
                style={{
                  position: "absolute",
                  top: "calc(100% + 10px)",
                  left: 0,
                  background: C.panel,
                  border: `1px solid ${C.borde}`,
                  borderRadius: "14px",
                  boxShadow: "0 20px 40px -8px rgba(0, 0, 0, 0.8)",
                  width: "230px",
                  padding: "6px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "2px",
                  zIndex: 100,
                  maxHeight: "70vh",
                  overflowY: "auto",
                }}
              >
                {opcionesNav.map((opc) => {
                  const estaActivo = opc.id === seccion;
                  return (
                    <button
                      key={opc.id}
                      role="menuitem"
                      className="nav-admin-btn nav-admin-item"
                      data-activo={estaActivo}
                      onClick={() => {
                        setSeccion(opc.id);
                        setMenuAbierto(false);
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "10px 12px",
                        borderRadius: "9px",
                        border: "none",
                        background: estaActivo ? C.activo : "transparent",
                        color: estaActivo ? C.texto : C.textoSuave,
                        fontSize: "14px",
                        fontWeight: estaActivo ? 600 : 500,
                        textAlign: "left",
                        cursor: "pointer",
                        width: "100%",
                      }}
                    >
                      <span style={{ display: "flex", alignItems: "center" }}>{opc.icono}</span>
                      <span>{opc.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* DERECHA: acciones y usuario */}
      <div style={{ display: "flex", alignItems: "center", gap: esMovil ? "8px" : "14px" }}>
        {/* Ver tienda: botón blanco, es la acción principal */}
        <button
          className="nav-admin-btn nav-admin-tienda"
          onClick={() => navigate("/")}
          title="Ver tienda"
          style={{
            background: "#2563eb",
            border: "none",
            color: "#ffffff",
            padding: esMovil ? "9px 11px" : "9px 18px",
            borderRadius: "999px",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          {esMovil ? (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-label="Ver tienda"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          ) : (
            "Ver tienda"
          )}
        </button>

        {!esMovil && <div style={{ width: "1px", height: "22px", background: C.borde }} />}

        {/* Usuario */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "#262626",
              border: "1px solid #3f3f3f",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: C.texto,
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            {usuario?.nombre ? usuario.nombre.charAt(0).toUpperCase() : "A"}
          </div>

          {!esMovil && (
            <span style={{ color: C.textoSuave, fontSize: "13px", fontWeight: 500 }}>
              Hola,{" "}
              <strong style={{ color: C.texto, fontWeight: 600 }}>
                {usuario?.nombre?.split(" ")[0] || "Admin"}
              </strong>
            </span>
          )}
        </div>

        {/* Cerrar sesión */}
        <button
          className="nav-admin-btn nav-admin-salir"
          onClick={handleLogout}
          title="Cerrar sesión"
          aria-label="Cerrar sesión"
          style={{
            background: "transparent",
            border: `1px solid ${C.borde}`,
            color: C.textoSuave,
            padding: "8px",
            borderRadius: "999px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
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