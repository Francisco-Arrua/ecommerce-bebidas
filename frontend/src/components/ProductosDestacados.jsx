import { useNavigate } from "react-router-dom";
import { obtenerPrecioVigente } from "../utils/precioProducto";

export default function ProductosDestacados({ productos }) {
  const navigate = useNavigate();

  if (!productos || productos.length === 0) return null;

  return (
    <section
      style={{
        maxWidth: "1400px",
        margin: "60px auto",
        padding: "0 24px",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <h2
        style={{
          marginBottom: "24px",
          fontSize: "24px",
          fontWeight: 900,
          color: "#0f172a",
          textTransform: "uppercase",
          letterSpacing: "-0.03em",
        }}
      >
        Productos Destacados
      </h2>

      <div
        className="productos-scroll"
        style={{
          display: "flex",
          gap: "20px",
          overflowX: "auto",
          scrollBehavior: "smooth",
          paddingBottom: "16px",
          scrollbarWidth: "none", 
          WebkitOverflowScrolling: "touch",
        }}
      >
        {productos
          // ✅ FIX: antes solo filtraba por "destacado", así que un producto
          // oculto (activo: false) que estuviera marcado como destacado
          // igual se mostraba en la home. Ahora también exige activo === true.
          .filter((producto) => producto.destacado && producto.activo)
          .slice(0, 12)
          .map((producto) => (
            <div
              key={producto.id}
              onClick={() => navigate(`/producto/${producto.id}`)}
              style={{
                background: "#ffffff",
                borderRadius: "0px", // Esquinas rectas Adidas style
                overflow: "hidden",
                cursor: "pointer",
                border: "1px solid #e2e8f0",
                minWidth: "240px",
                flexShrink: 0,
                transition: "all 0.2s ease-in-out",
                position: "relative"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#0f172a";
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e2e8f0";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {/* CONTENEDOR DE IMAGEN */}
              <div
                style={{
                  height: "240px",
                  width: "100%",
                  position: "relative",
                  backgroundColor: "#f8fafc",
                  borderBottom: "1px solid #e2e8f0",
                  overflow: "hidden",
                }}
              >
                {producto.imagenes?.length > 0 ? (
                  <img
                    src={producto.imagenes[0].url}
                    alt={producto.nombre}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                      color: "#94a3b8",
                      fontSize: "12px",
                      fontWeight: 600,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase"
                    }}
                  >
                    Sin imagen
                  </div>
                )}
              </div>

              {/* DETALLES DEL PRODUCTO */}
              <div
                style={{
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                  background: "#ffffff"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <p
                    style={{
                      color: "#64748b",
                      fontSize: "11px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      margin: 0,
                    }}
                  >
                    {producto.marca || "General"}
                  </p>
                  
                  {producto.destacado && (
                    <span
                      style={{
                        background: "#0f172a",
                        color: "#ffffff",
                        padding: "3px 8px",
                        borderRadius: "0px",
                        fontSize: "9px",
                        fontWeight: 900,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em"
                      }}
                    >
                      TOP
                    </span>
                  )}
                </div>

                <h4
                  style={{
                    margin: "6px 0 8px 0",
                    color: "#0f172a",
                    fontSize: "14px",
                    fontWeight: 700,
                    lineHeight: "1.4",
                    minHeight: "40px",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden"
                  }}
                >
                  {producto.nombre}
                </h4>

                <h3
                  style={{
                    margin: 0,
                    color: "#0f172a",
                    fontSize: "16px",
                    fontWeight: 900,
                    letterSpacing: "-0.02em"
                  }}
                >
                  $ {obtenerPrecioVigente(producto).toLocaleString("es-AR")}
                </h3>
              </div>
            </div>
          ))}
      </div>
    </section>
  );
}