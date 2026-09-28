// Misma paleta que NavbarAdmin: negro puro, grises neutros y blanco como único acento
const C = {
  bg: "#000000",
  borde: "#262626",
  texto: "#fafafa",
  textoSuave: "#a1a1a1",
  textoTenue: "#6b6b6b",
  hover: "rgba(255, 255, 255, 0.08)",
  activo: "rgba(37, 99, 235, 0.16)",
  azul: "#2365f5e7"
};

const css = `
  .sidebar-item {
    transition: background 0.15s ease, color 0.15s ease;
  }
  .sidebar-item:hover:not([data-activo="true"]) {
    background: ${C.hover};
    color: ${C.texto};
  }
  .sidebar-item:focus-visible {
    outline: 2px solid #ffffff;
    outline-offset: -2px;
  }
  .sidebar-nav::-webkit-scrollbar { width: 6px; }
  .sidebar-nav::-webkit-scrollbar-thumb { background: #262626; border-radius: 999px; }
  @media (prefers-reduced-motion: reduce) {
    .sidebar-item { transition: none !important; }
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

export default function Sidebar({ seccion, setSeccion }) {
  const opcionesNav = [
    {
      id: "dashboard",
      label: "Inicio",
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
      label: "Portadas",
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
      label: "Anuncios",
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
          <path d="M1 12h22"></path>
          <circle cx="12" cy="12" r="10"></circle>
        </Icono>
      ),
    },
    {
      id: "pedidos",
      label: "Pedidos",
      icono: (
        <Icono>
          <path d="M22 16H14V10H10V16H2"></path>
          <path d="M2 8h20"></path>
          <circle cx="16" cy="16" r="4"></circle>
        </Icono>
      ),
    },
    {
      id: "paginas",
      label: "Secciones",
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

  const obtenerEstiloItem = (esActivo) => ({
    display: "flex",
    alignItems: "center",
    gap: "12px",
    width: "100%",
    padding: "9px 12px",
    borderRadius: "9px",
    border: "none",
    fontSize: "13.5px",
    fontWeight: esActivo ? 600 : 500,
    color: esActivo ? C.texto : C.textoSuave,
    background: esActivo ? C.azul : "transparent",
    cursor: "pointer",
    textAlign: "left",
    position: "relative",
    fontFamily: "'Inter', system-ui, sans-serif",
  });

  return (
    <aside
      style={{
        width: "240px",
        background: C.bg,
        padding: "16px 12px",
        borderRight: `1px solid ${C.borde}`,
        display: "flex",
        flexDirection: "column",
        position: "sticky",
        top: 0,
        height: "100vh",
        maxHeight: "100vh",
        boxSizing: "border-box",
      }}
    >
      <style>{css}</style>

      <nav
        className="sidebar-nav"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "2px",
          flex: 1,
          overflowY: "auto", // Evita que se corte en laptops pequeñas
          minHeight: 0,
        }}
      >
        {opcionesNav.map((opcion) => {
          const esActivo = seccion === opcion.id;
          return (
            <button
              key={opcion.id}
              className="sidebar-item"
              data-activo={esActivo}
              aria-current={esActivo ? "page" : undefined}
              onClick={() => setSeccion(opcion.id)}
              style={obtenerEstiloItem(esActivo)}
            >
              {/* Indicador vertical de la sección activa */}
              {esActivo && (
                <span
                  style={{
                    position: "absolute",
                    left: "-12px",
                    top: "22%",
                    height: "56%",
                    width: "3px",
                    background: C.texto,
                    borderRadius: "0 4px 4px 0",
                  }}
                />
              )}

              <span style={{ display: "flex", alignItems: "center" }}>{opcion.icono}</span>
              {opcion.label}
            </button>
          );
        })}
      </nav>

      <div
        style={{
          paddingTop: "12px",
          marginTop: "12px",
          borderTop: `1px solid ${C.borde}`,
          fontSize: "12px",
          color: C.textoTenue,
          textAlign: "center",
          fontWeight: 500,
          fontFamily: "'Inter', system-ui, sans-serif",
        }}
      >
        Panel v1.0.0
      </div>
    </aside>
  );
}