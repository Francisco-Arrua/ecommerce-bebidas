import { useEffect, useState } from "react";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [stockMinimo, setStockMinimo] = useState(5);

  const obtenerStats = async () => {
    try {
      // 1. Traemos las estadísticas generales del dashboard
      const resDashboard = await fetch(`${import.meta.env.VITE_API_URL}/dashboard`);
      const dataDashboard = await resDashboard.json();

      // 2. Traemos las colecciones en paralelo para sacar la cantidad del front
      let totalColecciones = 0;
      try {
        const resColecciones = await fetch(`${import.meta.env.VITE_API_URL}/coleccion`);
        if (resColecciones.ok) {
          const dataColecciones = await resColecciones.json();
          totalColecciones = dataColecciones.length;
        }
      } catch (errCol) {
        console.error("Error trayendo colecciones para métricas:", errCol);
      }

      // 3. Inyectamos la cantidad de colecciones en el estado consolidado
      setStats({
        ...dataDashboard,
        colecciones: totalColecciones
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    obtenerStats();
  }, []);

  if (!stats) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", fontFamily: "Inter, sans-serif" }}>
        <div style={{ width: "32px", height: "32px", border: "3px solid #e2e8f0", borderTopColor: "#3b82f6", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <h3 style={{ marginTop: "16px", color: "#64748b", fontWeight: 500, fontSize: "14px" }}>Preparando tu espacio...</h3>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // --- ESTILOS COMPARTIDOS PREMIUM CLAROS ---
  const estiloInputBase = {
    padding: "10px 14px",
    borderRadius: "14px",
    border: "1px solid #e2e8f0",
    outline: "none",
    fontSize: "14px",
    color: "#0f172a",
    backgroundColor: "#f8fafc",
    fontWeight: "600",
    textAlign: "center",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    boxSizing: "border-box",
  };

  const manejarFocusInput = (e) => {
    e.currentTarget.style.borderColor = "#3b82f6";
    e.currentTarget.style.backgroundColor = "#ffffff";
    e.currentTarget.style.boxShadow = "0 0 0 4px rgba(59, 130, 246, 0.1)";
  };

  const manejarBlurInput = (e) => {
    e.currentTarget.style.borderColor = "#e2e8f0";
    e.currentTarget.style.backgroundColor = "#f8fafc";
    e.currentTarget.style.boxShadow = "none";
  };

  // Tarjeta de métrica optimizada (Clara, limpia y con elevación suave)
  const cardStyle = {
    background: "#ffffff",
    padding: "24px",
    borderRadius: "24px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    position: "relative"
  };

  const contenedorSeccionEstilo = {
    marginTop: "32px",
    background: "#ffffff",
    borderRadius: "24px",
    padding: "36px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)",
  };

  const productosBajoStock = stats.productosDetalle.filter(
    (producto) => producto.stock <= stockMinimo
  );

  return (
    <div style={{ minHeight: "100vh", padding: "8px 8px 40px 8px", fontFamily: "Inter, sans-serif" }}>
      <div style={{ maxWidth: "1340px", margin: "0 auto" }}>

        {/* GRILLA DE METRICAS (Actualizada dinámicamente) */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "24px" }}>
          
          {/* TOTAL PRODUCTOS */}
          <div style={cardStyle}>
            <div>
              <span style={{ width: "36px", height: "36px", background: "#eff6ff", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", color: "#3b82f6" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l-7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
              </span>
              <h3 style={{ margin: "14px 0 0 0", fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em" }}>Productos</h3>
            </div>
            <h2 style={{ margin: "16px 0 0 0", fontSize: "36px", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.03em" }}>{stats.productos}</h2>
          </div>

          {/* CATEGORIAS */}
          <div style={cardStyle}>
            <div>
              <span style={{ width: "36px", height: "36px", background: "#fdf4ff", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", color: "#d946ef" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
              </span>
              <h3 style={{ margin: "14px 0 0 0", fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em" }}>Categorías</h3>
            </div>
            <h2 style={{ margin: "16px 0 0 0", fontSize: "36px", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.03em" }}>{stats.categorias}</h2>
          </div>

          {/* SUBCATEGORIAS */}
          <div style={cardStyle}>
            <div>
              <span style={{ width: "36px", height: "36px", background: "#f5f3ff", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", color: "#8b5cf6" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 9h16M4 15h16M10 3L6 21M18 3l-4 21"/></svg>
              </span>
              <h3 style={{ margin: "14px 0 0 0", fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em" }}>Subcategorías</h3>
            </div>
            <h2 style={{ margin: "16px 0 0 0", fontSize: "36px", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.03em" }}>{stats.subcategorias}</h2>
          </div>

          {/* NUEVA TARJETA: COLECCIONES */}
          <div style={cardStyle}>
            <div>
              <span style={{ width: "36px", height: "36px", background: "#fff7ed", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", color: "#f97316" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
              </span>
              <h3 style={{ margin: "14px 0 0 0", fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em" }}>Colecciones</h3>
            </div>
            <h2 style={{ margin: "16px 0 0 0", fontSize: "36px", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.03em" }}>{stats.colecciones}</h2>
          </div>

          {/* ACTIVOS EN LINEA */}
          <div style={cardStyle}>
            <div>
              <span style={{ width: "36px", height: "36px", background: "#f0fdf4", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", color: "#10b981" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
              </span>
              <h3 style={{ margin: "14px 0 0 0", fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em" }}>En Línea</h3>
            </div>
            <h2 style={{ margin: "16px 0 0 0", fontSize: "36px", fontWeight: 800, color: "#10b981", letterSpacing: "-0.03em" }}>{stats.activos}</h2>
          </div>

          {/* DESTACADOS */}
          <div style={cardStyle}>
            <div>
              <span style={{ width: "36px", height: "36px", background: "#fefce8", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", color: "#eab308" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </span>
              <h3 style={{ margin: "14px 0 0 0", fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em" }}>Destacados</h3>
            </div>
            <h2 style={{ margin: "16px 0 0 0", fontSize: "36px", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.03em" }}>{stats.destacados}</h2>
          </div>

          {/* SIN STOCK / AGOTADOS */}
          <div style={{ ...cardStyle, background: stats.sinStock > 0 ? "#fff5f5" : "#ffffff", borderColor: stats.sinStock > 0 ? "#fee2e2" : "#e2e8f0" }}>
            <div>
              <span style={{ width: "36px", height: "36px", background: stats.sinStock > 0 ? "#ffe4e4" : "#f8fafc", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", color: stats.sinStock > 0 ? "#ef4444" : "#64748b" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              </span>
              <h3 style={{ margin: "14px 0 0 0", fontSize: "12px", fontWeight: 700, color: stats.sinStock > 0 ? "#991b1b" : "#64748b", textTransform: "uppercase", letterSpacing: "0.06em" }}>Agotados</h3>
            </div>
            <h2 style={{ margin: "16px 0 0 0", fontSize: "36px", fontWeight: 800, color: stats.sinStock > 0 ? "#dc2626" : "#0f172a", letterSpacing: "-0.03em" }}>{stats.sinStock}</h2>
          </div>
        </div>

        {/* SECCIÓN: ÚLTIMOS PRODUCTOS CARGADOS */}
        <div style={contenedorSeccionEstilo}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px", borderBottom: "1px solid #f1f5f9", paddingBottom: "16px" }}>
            <span style={{ color: "#3b82f6", display: "flex" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 20v-6M6 20V10M18 20V4"/></svg>
            </span>
            <h3 style={{ fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", margin: 0 }}>
              Últimos ingresos del catálogo
            </h3>
          </div>

          {stats.ultimosProductos.length === 0 ? (
            <p style={{ margin: 0, color: "#94a3b8", fontSize: "14px", fontStyle: "italic" }}>No se registran productos cargados recientemente.</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "14px" }}>
              {stats.ultimosProductos.map((producto) => (
                <div
                  key={producto.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "14px 18px",
                    background: "#f8fafc",
                    borderRadius: "14px",
                    border: "1px solid #e2e8f0"
                  }}
                >
                  <strong style={{ color: "#0f172a", fontSize: "14px", fontWeight: 600 }}>{producto.nombre}</strong>
                  <span style={{ fontSize: "11px", fontWeight: 600, color: "#64748b", background: "#ffffff", padding: "4px 10px", borderRadius: "20px", border: "1px solid #e2e8f0" }}>
                    {producto.categoria?.nombre || "-"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SECCIÓN: AUDITORÍA DE INVENTARIO (BAJO STOCK) */}
        <div style={contenedorSeccionEstilo}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", marginBottom: "24px", borderBottom: "1px solid #f1f5f9", paddingBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ color: "#3b82f6", display: "flex" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </span>
              <div>
                <h3 style={{ fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", margin: 0 }}>
                  Auditoría de Alertas de Stock
                </h3>
              </div>
            </div>
            
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <label style={{ fontSize: "13px", color: "#334155", fontWeight: 600 }}>Umbral crítico:</label>
              <input
                type="number"
                min="0"
                value={stockMinimo}
                onChange={(e) => setStockMinimo(Number(e.target.value))}
                style={estiloInputBase}
                onFocus={manejarFocusInput}
                onBlur={manejarBlurInput}
              />
            </div>
          </div>

          {productosBajoStock.length === 0 ? (
            <div style={{ textAlign: "center", padding: "24px", background: "#f0fdf4", borderRadius: "16px", color: "#10b981", fontSize: "14px", fontWeight: 600, border: "1px solid #a7f3d0" }}>
              Todos los niveles operativos se encuentran estables por encima del límite establecido.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {productosBajoStock.map((producto) => {
                const sinStock = producto.stock === 0;
                return (
                  <div
                    key={producto.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "14px 18px",
                      background: sinStock ? "#fff5f5" : "#ffffff",
                      borderRadius: "14px",
                      border: sinStock ? "1px solid #fecaca" : "1px solid #e2e8f0",
                    }}
                  >
                    <div>
                      <strong style={{ color: sinStock ? "#991b1b" : "#0f172a", fontSize: "14px", fontWeight: 600 }}>{producto.nombre}</strong>
                      <div style={{ color: "#64748b", fontSize: "12px", marginTop: "2px", fontWeight: 500 }}>
                        {producto.categoria?.nombre || "-"} • {producto.subcategoria?.nombre || "-"}
                      </div>
                    </div>
                    
                    <span style={{ 
                      fontSize: "12px", 
                      fontWeight: 700, 
                      color: sinStock ? "#dc2626" : "#d97706",
                      background: sinStock ? "#ffe4e4" : "#fef3c7",
                      padding: "6px 14px", 
                      borderRadius: "10px",
                    }}>
                      {sinStock ? "Sin Unidades" : `${producto.stock} disponibles`}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}