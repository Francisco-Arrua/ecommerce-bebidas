import { useEffect, useState } from "react";

export default function Footer() {
  const [configuracion, setConfiguracion] = useState(null);

  useEffect(() => {
    const obtenerConfiguracion = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/configuracion`);
        const data = await res.json();
        setConfiguracion(data);
      } catch (error) {
        console.error(error);
      }
    };

    obtenerConfiguracion();
  }, []);

  return (
    <footer
      style={{
        background: "#000000",
        color: "#ffffff",
        marginTop: "120px",
        fontFamily: "'Inter', sans-serif",
        borderTop: "1px solid #e5e5e5", // Línea minimalista de acento superior estilo catálogo
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "80px 24px 40px 24px",
          boxSizing: "border-box"
        }}
      >
        {/* Contenedor Grid Principal */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "48px",
            marginBottom: "60px",
          }}
        >
          {/* COLUMNA 1: Sobre la Marca */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
              <h2
                style={{
                  fontSize: "22px",
                  fontWeight: 800,
                  margin: 0,
                  letterSpacing: "-0.04em",
                  color: "#ffffff",
                  textTransform: "uppercase"
                }}
              >
                {configuracion?.nombreTienda || "Tienda Online"}
              </h2>
              <span style={{ 
                fontSize: "10px", 
                fontWeight: 800, 
                padding: "3px 8px", 
                background: "#ffffff", 
                color: "#000000", 
                borderRadius: "0px", // Recto e imponente
                textTransform: "uppercase",
                letterSpacing: "0.05em"
              }}>
                Oficial
              </span>
            </div>
            <p style={{ color: "#737373", fontSize: "14px", lineHeight: "1.6", margin: 0, maxWidth: "300px" }}>
              Tu tienda de confianza con la mejor selección de productos y atención personalizada vía WhatsApp.
            </p>
          </div>

          {/* COLUMNA 2: Redes Sociales */}
          <div>
            <h4 style={{ color: "#ffffff", fontSize: "12px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 24px 0" }}>
              Nuestras Redes
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {configuracion?.instagram && (
                <a
                  href={`https://instagram.com/${configuracion.instagram}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    color: "#737373",
                    textDecoration: "none",
                    fontSize: "14px",
                    fontWeight: 500,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "10px",
                    transition: "all 0.15s ease",
                    letterSpacing: "0.02em"
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#ffffff"; e.currentTarget.style.transform = "translateX(2px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "#737373"; e.currentTarget.style.transform = "translateX(0)"; }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  Instagram
                </a>
              )}

              {configuracion?.facebook && (
                <a
                  href={`https://facebook.com/${configuracion.facebook}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    color: "#737373",
                    textDecoration: "none",
                    fontSize: "14px",
                    fontWeight: 500,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "10px",
                    transition: "all 0.15s ease",
                    letterSpacing: "0.02em"
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#ffffff"; e.currentTarget.style.transform = "translateX(2px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "#737373"; e.currentTarget.style.transform = "translateX(0)"; }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                  Facebook
                </a>
              )}

              {!configuracion?.instagram && !configuracion?.facebook && (
                <span style={{ color: "#404040", fontSize: "14px" }}>No hay redes configuradas.</span>
              )}
            </div>
          </div>

          {/* COLUMNA 3: Contacto Directo */}
          <div>
            <h4 style={{ color: "#ffffff", fontSize: "12px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 24px 0" }}>
              Atención al Cliente
            </h4>
            {configuracion?.whatsapp ? (
              <a
                href={`https://wa.me/${configuracion.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  background: "transparent",
                  border: "1px solid #404040",
                  padding: "12px 20px",
                  borderRadius: "0px", // 100% Recto, look urbano deportivo
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "12px",
                  color: "#ffffff",
                  textDecoration: "none",
                  fontSize: "13px",
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#ffffff"; e.currentTarget.style.color = "#000000"; e.currentTarget.style.borderColor = "#ffffff"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#ffffff"; e.currentTarget.style.borderColor = "#404040"; }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.4 0 11.973 0c3.184.001 6.177 1.24 8.427 3.491 2.25 2.253 3.486 5.244 3.485 8.427-.003 6.616-5.343 11.962-11.918 11.962-2.004-.001-3.973-.504-5.717-1.464L0 24zm6.154-3.461c1.656.982 3.272 1.499 4.908 1.5 5.462 0 9.904-4.43 9.907-9.885.002-2.643-1.026-5.127-2.897-7.001-1.872-1.873-4.359-2.903-7.005-2.904-5.46 0-9.902 4.43-9.906 9.886-.001 1.748.48 3.409 1.393 4.869l-.999 3.648 3.733-.979z"/>
                </svg>
                <span>WHATSAPP: +{configuracion.whatsapp}</span>
              </a>
            ) : (
              <span style={{ color: "#404040", fontSize: "14px" }}>Sin teléfono registrado.</span>
            )}
          </div>
        </div>

        {/* Fila Inferior: Copyright */}
        <div
          style={{
            paddingTop: "32px",
            borderTop: "1px solid #1a1a1a",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px"
          }}
        >
          <p style={{ margin: 0, color: "#525252", fontSize: "12px", letterSpacing: "0.02em" }}>
            © 2026 {configuracion?.nombreTienda || "Tienda"}. Todos los derechos reservados.
          </p>
          <p style={{ margin: 0, color: "#404040", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Desarrollado por: <a href="https://instagram.com/arrua.franciscoo" target="_blank" rel="noopener noreferrer" style={{ color: "#ffffff", textDecoration: "underline" }}>Enlace aquí</a>
          </p>
        </div>
      </div>
    </footer>
  );
}