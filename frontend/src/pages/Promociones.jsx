import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Promociones() {
  const [colecciones, setColecciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerColecciones = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/coleccion`);
        if (!res.ok) throw new Error("Error al traer las colecciones");
        const data = await res.json();
        setColecciones(data);
      } catch (error) {
        console.error(error);
      } finally {
        setCargando(false);
      }
    };
    obtenerColecciones();
  }, []);

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: "1400px", margin: "60px auto", padding: "0 30px", minHeight: "65vh", fontFamily: "Inter, sans-serif" }}>
        
        {/* Cabecera Fuerte pero Refinada */}
        <h1 style={{ margin: 0, fontSize: "clamp(30px, 3.8vw, 40px)", fontWeight: 900, color: "#0f172a", letterSpacing: "-0.03em", textTransform: "uppercase", lineHeight: 1.1 }}>
          Nuestras Colecciones y Promos
        </h1>
        <p style={{ color: "#475569", fontSize: "15px", fontWeight: 500, marginTop: "8px", marginBottom: "40px", maxWidth: "600px", lineHeight: "1.5" }}>
          Descubrí los conjuntos y liquidaciones exclusivas que armamos para vos.
        </p>

        {cargando ? (
          <div style={{ textAlign: "center", padding: "60px", color: "#475569", fontSize: "13px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>
            Cargando promociones...
          </div>
        ) : colecciones.length === 0 ? (
          <p style={{ textAlign: "center", color: "#475569", marginTop: "20px", fontSize: "14px", fontWeight: 500 }}>
            No hay promociones activas en este momento.
          </p>
        ) : (
          /* Grilla de Bloques Sutiles */
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "30px" }}>
            {colecciones.map((col) => (
              <div
                key={col.id}
                onClick={() => navigate(`/promociones/${col.id}`)}
                style={{
                  background: "white",
                  borderRadius: "0px", // Esquinas 100% rectas
                  overflow: "hidden",
                  cursor: "pointer",
                  border: "1px solid #0f172a", // ⬇️ Borde de 1px ultra elegante
                  boxShadow: "0 4px 12px rgba(15, 23, 42, 0.03)", 
                  transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow = "0 12px 24px rgba(15, 23, 42, 0.08)"; 
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(15, 23, 42, 0.03)";
                }}
              >
                {/* Contenedor de Imagen con línea divisoria de 1px */}
                <div style={{ height: "250px", background: "#f8fafc", position: "relative", overflow: "hidden", borderBottom: "1px solid #0f172a" }}>
                  {col.imagen ? (
                    <img src={col.imagen} alt={col.nombre} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#64748b", fontSize: "12px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                      Sin imagen de portada
                    </div>
                  )}
                  
                  {/* Badge de Descuento Recto e integrado con bordes de 1px */}
                  {col.subtitulo && (
                    <div style={{ position: "absolute", top: "0", right: "0", background: "#ef4444", color: "white", padding: "6px 14px", borderRadius: "0px", fontSize: "11px", fontWeight: 900, letterSpacing: "0.03em", textTransform: "uppercase", borderLeft: "1px solid #0f172a", borderBottom: "1px solid #0f172a" }}>
                      {col.subtitulo}
                    </div>
                  )}
                </div>

                {/* Bloque de Texto con Fondo Gris Suave */}
                <div style={{ padding: "20px", backgroundColor: "#f8fafc" }}>
                  <h3 style={{ margin: "0 0 8px 0", color: "#0f172a", fontSize: "18px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "-0.02em" }}>
                    {col.nombre}
                  </h3>
                  <p style={{ margin: 0, color: "#475569", fontSize: "14px", fontWeight: 500, lineHeight: "1.55" }}>
                    {col.descripcion || "Hacé clic para ver los productos de esta colección."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}