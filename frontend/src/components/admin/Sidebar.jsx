export default function Sidebar({ seccion, setSeccion }) {
  
  // Lista de navegación usando SVGs minimalistas y limpios
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

  // Estilos dinámicos adaptados a la línea limpia y clara de la interfaz
  const obtenerEstiloItem = (idActivo) => ({
    display: "flex",
    alignItems: "center",
    gap: "12px",
    width: "100%",
    padding: "12px 16px",
    borderRadius: "12px",
    border: "none",
    fontSize: "14px",
    fontWeight: idActivo ? "600" : "500",
    // Color de texto: azul premium para activo, gris sobrio para el reposo
    color: idActivo ? "#2563eb" : "#64748b", 
    // Fondo: azul traslúcido soft para la sección seleccionada
    background: idActivo ? "rgba(37, 99, 235, 0.08)" : "transparent",
    cursor: "pointer",
    textAlign: "left",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    position: "relative",
    fontFamily: "'Inter', sans-serif"
  });

  return (
    <aside
      style={{
        width: "240px",
        background: "#ffffff", 
        minHeight: "100vh",
        padding: "32px 16px",
        borderRight: "1px solid #e2e8f0", // Línea divisoria clara y elegante
        display: "flex",
        flexDirection: "column",
        position: "sticky",
        top: 0,
        height: "100vh",
        boxSizing: "border-box",
      }}
    >
      {/* Menú de Navegación */}
      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          flex: 1,
        }}
      >
        {opcionesNav.map((opcion) => {
          const esActivo = seccion === opcion.id;
          return (
            <button
              key={opcion.id}
              onClick={() => setSeccion(opcion.id)}
              style={obtenerEstiloItem(esActivo)}
              onMouseEnter={(e) => {
                if (!esActivo) {
                  e.currentTarget.style.background = "#f1f5f9"; // Hover sutil gris de respiro
                  e.currentTarget.style.color = "#0f172a"; // Texto se oscurece al enfocar
                }
              }}
              onMouseLeave={(e) => {
                if (!esActivo) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#64748b";
                }
              }}
            >
              {/* Línea indicadora vertical azul */}
              {esActivo && (
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: "25%",
                    height: "50%",
                    width: "3px",
                    background: "#2563eb",
                    borderRadius: "0 4px 4px 0",
                  }}
                />
              )}
              
              {/* Contenedor del Icono SVG */}
              <span style={{ 
                display: "flex",
                alignItems: "center",
                color: esActivo ? "#2563eb" : "#64748b",
                transition: "color 0.2s"
              }}>
                {opcion.icono}
              </span>
              
              {opcion.label}
            </button>
          );
        })}
      </nav>

      {/* Footer del Sidebar */}
      <div
        style={{
          paddingTop: "16px",
          borderTop: "1px solid #f1f5f9",
          fontSize: "11px",
          color: "#94a3b8",
          textAlign: "center",
          fontWeight: 600,
          letterSpacing: "0.05em"
        }}
      >
        PANEL V1.0.0
      </div>
    </aside>
  );
}