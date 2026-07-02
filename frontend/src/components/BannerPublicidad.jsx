import { useEffect, useState } from "react";

export default function BannerPublicidad() {
  const [banners, setBanners] = useState([]);
  const [indiceActual, setIndiceActual] = useState(0);

  useEffect(() => {
    const obtenerBanners = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/banner`);
        const data = await res.json();
        setBanners(data.filter((banner) => banner.activo));
      } catch (error) {
        console.error(error);
      }
    };

    obtenerBanners();
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;

    const intervalo = setInterval(() => {
      setIndiceActual((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 6000);

    return () => clearInterval(intervalo);
  }, [banners]);

  const banner = banners[indiceActual];

  if (!banner) return null;

  const bannerAnterior = () => {
    setIndiceActual(indiceActual === 0 ? banners.length - 1 : indiceActual - 1);
  };

  const bannerSiguiente = () => {
    setIndiceActual(indiceActual === banners.length - 1 ? 0 : indiceActual + 1);
  };

  return (
    <section
      style={{
        width: "100%",
        position: "relative",
        fontFamily: "Inter, sans-serif",
        overflow: "hidden",
        backgroundColor: "#0a0a0c",
        margin: "60px 0",
      }}
    >
      <div style={{ position: "relative", width: "100%" }}>
        
        {/* BOTÓN IZQUIERDO MINIMALISTA */}
        {banners.length > 1 && (
          <button
            onClick={bannerAnterior}
            style={{
              position: "absolute",
              left: "4%",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 10,
              background: "none",
              border: "none",
              color: "rgba(255, 255, 255, 0.6)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "12px",
              transition: "all 0.25s ease",
            }}
            onMouseEnter={(e) => { 
              e.currentTarget.style.color = "#ffffff"; 
              e.currentTarget.style.transform = "translateY(-50%) scale(1.2)"; 
            }}
            onMouseLeave={(e) => { 
              e.currentTarget.style.color = "rgba(255, 255, 255, 0.6)"; 
              e.currentTarget.style.transform = "translateY(-50%) scale(1)"; 
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
        )}

        {/* CUERPO DEL BANNER */}
        <div
          style={{
            position: "relative",
            color: "white",
            padding: "110px 10%",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "320px",
            boxSizing: "border-box",
            overflow: "hidden",
            background: !banner.imagen 
              ? `linear-gradient(135deg, ${banner.colorInicio || "#0f172a"} 0%, ${banner.colorFin || "#1e293b"} 100%)` 
              : "#0a0a0c"
          }}
        >
          {/* Imagen de fondo absoluta */}
          {banner.imagen && (
            <img 
              src={banner.imagen} 
              alt="" 
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                zIndex: 1,
              }}
            />
          )}

          {/* Textos limpios con zIndex 3 */}
          <div style={{ position: "relative", zIndex: 3, maxWidth: "800px" }}>
            <h2
              style={{
                fontSize: "clamp(28px, 4.8vw, 44px)",
                fontWeight: 900, // 900 para mantener el bloque brutalista limpio
                margin: 0,
                letterSpacing: "-0.03em",
                lineHeight: "1.1",
                textTransform: "uppercase",
                textShadow: "none", // ⬅️ Adiós sombras raras
                color: "#ffffff"
              }}
            >
              {banner.titulo}
            </h2>

            {banner.subtitulo && (
              <p
                style={{
                  marginTop: "16px",
                  fontSize: "clamp(14px, 2vw, 17px)",
                  color: "rgba(255, 255, 255, 0.95)",
                  fontWeight: 500,
                  marginRight: "auto",
                  marginLeft: "auto",
                  maxWidth: "600px",
                  lineHeight: "1.5",
                  letterSpacing: "0.02em",
                  textShadow: "none" // ⬅️ Limpieza total
                }}
              >
                {banner.subtitulo}
              </p>
            )}
          </div>
        </div>

        {/* BOTÓN DERECHO MINIMALISTA */}
        {banners.length > 1 && (
          <button
            onClick={bannerSiguiente}
            style={{
              position: "absolute",
              right: "4%",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 10,
              background: "none",
              border: "none",
              color: "rgba(255, 255, 255, 0.6)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "12px",
              transition: "all 0.25s ease",
            }}
            onMouseEnter={(e) => { 
              e.currentTarget.style.color = "#ffffff"; 
              e.currentTarget.style.transform = "translateY(-50%) scale(1.2)"; 
            }}
            onMouseLeave={(e) => { 
              e.currentTarget.style.color = "rgba(255, 255, 255, 0.6)"; 
              e.currentTarget.style.transform = "translateY(-50%) scale(1)"; 
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        )}
      </div>

      {/* INDICADORES HORIZONTALES */}
      {banners.length > 1 && (
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
            zIndex: 4,
          }}
        >
          {banners.map((_, index) => {
            const esActivo = index === indiceActual;
            return (
              <div
                key={index}
                onClick={() => setIndiceActual(index)}
                style={{
                  width: esActivo ? "32px" : "12px",
                  height: "3px",
                  borderRadius: "0px", // Rectangulares directos para el estilo general
                  cursor: "pointer",
                  background: esActivo ? "#ffffff" : "rgba(255, 255, 255, 0.3)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}