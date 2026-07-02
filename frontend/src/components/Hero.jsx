import { useEffect, useState } from "react";

export default function Hero() {
  const [slides, setSlides] = useState([]);
  const [slideActual, setSlideActual] = useState(0);

  const obtenerSlides = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/hero`);
      const data = await res.json();
      setSlides(data.filter((slide) => slide.activo));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    obtenerSlides();
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;

    const intervalo = setInterval(() => {
      setSlideActual((actual) =>
        actual === slides.length - 1 ? 0 : actual + 1
      );
    }, 6000); // 6 segundos da más tiempo para apreciar la fotografía limpia

    return () => clearInterval(intervalo);
  }, [slides]);

  const slide = slides[slideActual];

  return (
    /* CONTENEDOR FULL WIDTH: Ocupa el 100% real de la pantalla sin márgenes molestos */
    <section style={{ width: "100%", overflow: "hidden", position: "relative", backgroundColor: "#0a0a0c" }}>
      <div
        style={{
          height: "80vh", // Estética moderna: usa una proporción alta del navegador (80% del alto visible)
          width: "100%",
          position: "relative",
          backgroundImage: slide?.imagen
            ? `url(${slide.imagen})`
            : "linear-gradient(135deg, #0a0a0c 0%, #111827 100%)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          transition: "background-image 0.6s ease-in-out", // Transición fluida entre slides
        }}
      >
        {/* CAPA DE TEXTO CON GRADIENTE SUTIL (Solo oscurece levemente la base/izquierda para legibilidad sin arruinar la foto) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 8%", // Padding porcentual para consistencia responsive
            color: "white",
          }}
        >
          {/* FLECHA IZQUIERDA MINIMALISTA */}
          {slides.length > 1 && (
            <button
              onClick={() => setSlideActual(slideActual === 0 ? slides.length - 1 : slideActual - 1)}
              style={{
                position: "absolute",
                left: "30px",
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 10,
                border: "none",
                background: "none",
                color: "rgba(255,255,255,0.6)",
                cursor: "pointer",
                fontSize: "28px",
                transition: "all 0.25s ease",
                padding: "10px",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#ffffff"; e.currentTarget.style.transform = "translateY(-50%) scale(1.15)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.6)"; e.currentTarget.style.transform = "translateY(-50%) scale(1)"; }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
          )}

          {/* TEXTOS CON SOMBRAS DE CONTRASTE */}
          <h1
            style={{
              fontSize: "clamp(32px, 5vw, 56px)", // Responsive automático según tamaño de pantalla
              fontWeight: 800,
              margin: 0,
              maxWidth: "650px",
              letterSpacing: "-0.04em",
              lineHeight: "1.1",
              textShadow: "0 4px 24px rgba(0,0,0,0.50), 0 2px 4px rgba(0,0,0,0.30)", // Seguridad anti-fondos blancos
            }}
          >
            {slide?.titulo || "Nueva Colección"}
          </h1>

          <p
            style={{
              marginTop: "18px",
              fontSize: "clamp(16px, 2vw, 20px)",
              color: "#f3f4f6",
              maxWidth: "550px",
              fontWeight: 400,
              lineHeight: "1.6",
              textShadow: "0 2px 12px rgba(0,0,0,0.50)",
            }}
          >
            {slide?.subtitulo || "Descubrí nuestros productos destacados"}
          </p>

          {slide?.textoBoton && (
            <button
              style={{
                marginTop: "28px",
                padding: "14px 32px",
                border: "none",
                borderRadius: "4px", // Ángulos rectos y sutiles sumamente elegantes
                cursor: "pointer",
                fontWeight: "700",
                background: "#ffffff", // Inversión cromática: Botón blanco puro destaca muchísimo más
                color: "#0a0a0c",
                fontSize: "14px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                width: "fit-content",
                boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
                transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#0a0a0c";
                e.currentTarget.style.color = "#ffffff";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 15px 30px rgba(0,0,0,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#ffffff";
                e.currentTarget.style.color = "#0a0a0c";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.15)";
              }}
            >
              {slide.textoBoton}
            </button>
          )}

          {/* FLECHA DERECHA MINIMALISTA */}
          {slides.length > 1 && (
            <button
              onClick={() => setSlideActual(slideActual === slides.length - 1 ? 0 : slideActual + 1)}
              style={{
                position: "absolute",
                right: "30px",
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 10,
                border: "none",
                background: "none",
                color: "rgba(255,255,255,0.6)",
                cursor: "pointer",
                fontSize: "28px",
                transition: "all 0.25s ease",
                padding: "10px",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#ffffff"; e.currentTarget.style.transform = "translateY(-50%) scale(1.15)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.6)"; e.currentTarget.style.transform = "translateY(-50%) scale(1)"; }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          )}
        </div>

        {/* INDICADORES INFERIORES: Formato líneas finas horizontales en vez de círculos toscos */}
        <div
          style={{
            position: "absolute",
            bottom: "30px",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            zIndex: 15,
          }}
        >
          {slides.map((_, index) => (
            <div
              key={index}
              onClick={() => setSlideActual(index)}
              style={{
                width: slideActual === index ? "40px" : "16px", // Línea expansiva dinámica para el activo
                height: "3px",
                borderRadius: "2px",
                cursor: "pointer",
                background: slideActual === index ? "#ffffff" : "rgba(255,255,255,0.35)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}