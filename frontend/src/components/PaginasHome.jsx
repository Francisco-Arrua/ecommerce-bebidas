import { useEffect, useState } from "react";

export default function PaginasHome() {
  const [paginas, setPaginas] = useState([]);

  useEffect(() => {
    const obtenerPaginas = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/paginas`);
        const data = await res.json();
        setPaginas(data.sort((a, b) => a.orden - b.orden));
      } catch (error) {
        console.error("Error cargando páginas en Home:", error);
      }
    };

    obtenerPaginas();
  }, []);

  return (
    <section 
      style={{ 
        background: "#ffffff", 
        fontFamily: "'Inter', sans-serif",
        width: "100%",
        boxSizing: "border-box"
      }}
    >
      {paginas.map((pagina, indice) => {
        const esImpar = indice % 2 !== 0;
        const fondoTexto = esImpar ? "#f1f5f9" : "#f8fafc";

        return (
          <div
            key={pagina.id}
            id={pagina.slug}
            style={{
              minHeight: "75vh",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              alignItems: "stretch",
              width: "100%", // 🚀 Ocupa el 100% del ancho de la pantalla
              boxSizing: "border-box",
              backgroundColor: "#ffffff",
              // ⬇️ Línea superior e inferior que cruzan la pantalla de lado a lado
              borderTop: "1px solid #0f172a",
              borderBottom: "1px solid #0f172a",
              // ⬇️ El espacio de separación limpio entre bloques de páginas
              marginBottom: "80px", 
            }}
          >
            {/* BLOQUE DE TEXTO ENMARCADO */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: "80px min(10%, 80px)",
                order: esImpar ? 2 : 1,
                boxSizing: "border-box",
                backgroundColor: fondoTexto, 
                // Línea divisoria vertical interna entre la imagen y el texto
                borderLeft: esImpar ? "1px solid #0f172a" : "none",
                borderRight: !esImpar ? "1px solid #0f172a" : "none",
              }}
            >
              <div style={{ maxWidth: "460px", margin: "0 auto", width: "100%" }}>
                
                {/* Título limpio, fuerte y contundente */}
                <h2
                  style={{
                    fontSize: "clamp(28px, 3.8vw, 40px)",
                    fontWeight: 900, 
                    color: "#0f172a",
                    margin: "0 0 20px 0",
                    letterSpacing: "-0.03em",
                    lineHeight: 1.05,
                    textTransform: "uppercase"
                  }}
                >
                  {pagina.titulo}
                </h2>

                {/* Párrafo estilizado */}
                <p
                  style={{
                    fontSize: "14px",
                    lineHeight: "1.65",
                    color: "#334155",
                    fontWeight: 500,
                    margin: 0,
                    whiteSpace: "pre-line",
                    letterSpacing: "0.01em"
                  }}
                >
                  {pagina.contenido}
                </p>

                {/* Subrayado geométrico recto estilo tag */}
                <div style={{ 
                  width: "40px", 
                  height: "3px", 
                  backgroundColor: "#0f172a", 
                  marginTop: "28px" 
                }} />
              </div>
            </div>

            {/* CONTENEDOR DE LA IMAGEN */}
            <div
              style={{
                position: "relative",
                width: "100%",
                minHeight: "450px",
                order: esImpar ? 1 : 2,
                background: "#f8fafc",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "#0f172a",
                boxSizing: "border-box"
              }}
            >
              {pagina.imagen ? (
                <img
                  src={pagina.imagen}
                  alt={pagina.titulo}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                    borderRadius: "0px"
                  }}
                />
              ) : (
                <div style={{ padding: "40px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="0" ry="0"></rect>
                    <line x1="21" y1="21" x2="3" y2="3"></line>
                  </svg>
                  <span style={{ fontSize: "11px", fontWeight: 900, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                    [ Sin Imagen ]
                  </span>
                </div>
              )}
            </div>

          </div>
        );
      })}
    </section>
  );
}