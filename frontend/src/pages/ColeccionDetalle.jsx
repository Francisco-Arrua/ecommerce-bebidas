import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { obtenerPrecioVigente } from "../utils/precioProducto";

export default function ColeccionDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [coleccion, setColeccion] = useState(null);
  const [cargando, setCargando] = useState(true);

  // RENDIMIENTO: Control de límite visible de productos
  const [limiteVisible, setLimiteVisible] = useState(42);

  useEffect(() => {
    const obtenerDetalle = async () => {
      try {
        setCargando(true);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/coleccion/${id}`);
        if (!res.ok) throw new Error("Error al obtener la colección");
        const data = await res.json();
        setColeccion(data);
        setLimiteVisible(42); 
      } catch (error) {
        console.error(error);
      } finally {
        setCargando(false);
      }
    };
    if (id) obtenerDetalle();
  }, [id]);

  if (cargando) {
    return (
      <>
        <Navbar />
        <div style={{ textAlign: "center", padding: "100px", color: "#0f172a", fontSize: "13px", fontWeight: 900, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "Inter, sans-serif" }}>
          Cargando catálogo...
        </div>
        <Footer />
      </>
    );
  }

  if (!coleccion) {
    return (
      <>
        <Navbar />
        <div style={{ textAlign: "center", padding: "100px", color: "#475569", fontSize: "14px", fontWeight: 500, fontFamily: "Inter, sans-serif" }}>
          La colección no existe o fue dada de baja.
        </div>
        <Footer />
      </>
    );
  }

  const productosRenderizados = coleccion.productos?.slice(0, limiteVisible) || [];

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: "1400px", margin: "60px auto", padding: "0 30px", minHeight: "65vh", fontFamily: "Inter, sans-serif" }}>
        
        {/* CABECERA CON CORTE BRUTALISTA SUTIL */}
        <div style={{ borderBottom: "1px solid #0f172a", paddingBottom: "35px", marginBottom: "40px" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "20px", flexWrap: "wrap" }}>
            <h1 style={{ margin: 0, fontSize: "clamp(28px, 3.5vw, 38px)", fontWeight: 900, color: "#0f172a", letterSpacing: "-0.03em", textTransform: "uppercase", lineHeight: 1.1 }}>
              {coleccion.nombre}
            </h1>
            {coleccion.subtitulo && (
              <span style={{ background: "#c2410c", color: "white", padding: "5px 14px", borderRadius: "0px", fontSize: "11px", fontWeight: 900, letterSpacing: "0.05em", textTransform: "uppercase", border: "1px solid #0f172a" }}>
                {coleccion.subtitulo}
              </span>
            )}
          </div>
          {coleccion.descripcion && (
            <p style={{ color: "#475569", fontSize: "15px", fontWeight: 500, marginTop: "12px", margin: "12px 0 0 0", maxWidth: "700px", lineHeight: "1.55" }}>
              {coleccion.descripcion}
            </p>
          )}
        </div>

        {/* GRILLA DE PRODUCTOS INTEGRADOS */}
        {coleccion.productos?.length === 0 ? (
          <p style={{ color: "#475569", fontSize: "14px", fontWeight: 500 }}>Próximamente se agregarán productos a esta colección.</p>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: "24px" }}>
              {productosRenderizados.map((producto) => (
                <div
                  key={producto.id}
                  onClick={() => navigate(`/producto/${producto.id}`)}
                  style={{ 
                    background: "white", 
                    borderRadius: "0px", 
                    overflow: "hidden", 
                    cursor: "pointer", 
                    border: "1px solid #0f172a", 
                    boxShadow: "0px 0px 0px #0f172a", 
                    transition: "all 0.1s cubic-bezier(0.4, 0, 0.2, 1)" 
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translate(-2px, -2px)";
                    e.currentTarget.style.boxShadow = "1px 1px 0px #0f172a"; // ⬇️ Reducido a un sutil toque de 2px
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translate(0, 0)";
                    e.currentTarget.style.boxShadow = "0px 0px 0px #0f172a";
                  }}
                >
                  {/* Imagen del Producto */}
                  <div style={{ height: "240px", width: "100%", position: "relative", overflow: "hidden", background: "#f8fafc", borderBottom: "1px solid #0f172a" }}>
                    {producto.imagenes?.length > 0 ? (
                      <img src={producto.imagenes[0].url} alt={producto.nombre} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
                    ) : (
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#64748b", fontSize: "11px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                        [ Sin imagen ]
                      </div>
                    )}
                  </div>
                  
                  {/* Detalles de la tarjeta */}
                  <div style={{ padding: "16px", backgroundColor: "#ffffff" }}>
                    <p style={{ margin: 0, color: "#64748b", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.03em" }}>
                      {producto.marca || "Sin marca"}
                    </p>
                    <h4 style={{ margin: "4px 0 8px 0", color: "#0f172a", fontSize: "15px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "-0.01em", lineHeight: "1.2" }}>
                      {producto.nombre}
                    </h4>
                    <h3 style={{ margin: 0, color: "#0f172a", fontSize: "16px", fontWeight: 900 }}>
                      $ {obtenerPrecioVigente(producto).toLocaleString("es-AR")}
                    </h3>
                  </div>
                </div>
              ))}
            </div>

            {/* BOTÓN VER MÁS */}
            {coleccion.productos?.length > limiteVisible && (
              <button
                onClick={() => setLimiteVisible((prev) => prev + 42)}
                style={{ 
                  display: "block", 
                  margin: "50px auto 0 auto", 
                  padding: "14px 36px", 
                  background: "#ffffff", 
                  color: "#0f172a", 
                  border: "1px solid #0f172a", 
                  borderRadius: "0px", 
                  fontWeight: "900", 
                  fontSize: "13px", 
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  cursor: "pointer", 
                  boxShadow: "0px 0px 0px #0f172a",
                  transition: "all 0.1s cubic-bezier(0.4, 0, 0.2, 1)" 
                }}
                onMouseEnter={(e) => { 
                  e.currentTarget.style.background = "#0f172a"; 
                  e.currentTarget.style.color = "#ffffff";
                }}
                onMouseLeave={(e) => { 
                  e.currentTarget.style.background = "#ffffff"; 
                  e.currentTarget.style.color = "#0f172a";
                }}
              >
                Ver más productos ({coleccion.productos.length - limiteVisible})
              </button>
            )}
          </>
        )}
      </main>
      <Footer />
    </>
  );
}