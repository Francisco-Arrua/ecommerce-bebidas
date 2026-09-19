import { useNavigate } from "react-router-dom";
import { obtenerPrecioVigente, tieneOfertaVigente } from "../utils/precioProducto";

export default function ProductosOferta({ productos }) {
  const navigate = useNavigate();

  if (!productos || productos.length === 0) return null;

  return (
    <section
      style={{
        width: "100%",        // Ocupa todo el ancho disponible
        maxWidth: "100%",     // Elimina la restricción de 1400px
        margin: "60px 0",     // Mantiene el margen vertical y remueve el centrado lateral
        padding: "0",         // Quita el relleno exterior para pegar a los bordes
        fontFamily: "Inter, sans-serif",
        boxSizing: "border-box",
      }}
    >
      <h2
        style={{
          marginBottom: "24px",
          paddingLeft: "16px", // Margen interno lateral para alinear el título
          paddingRight: "16px",
          fontSize: "24px",
          fontWeight: 900,
          color: "#0f172a",
          textTransform: "uppercase",
          letterSpacing: "-0.03em",
        }}
      >
        Nuestras Ofertas
      </h2>

      <div
        className="productos-scroll"
        style={{
          display: "flex",
          gap: "20px",
          overflowX: "auto",
          scrollBehavior: "smooth",
          paddingLeft: "16px",  // Espacio inicial antes de la primera tarjeta
          paddingRight: "16px", // Espacio final después de la última tarjeta
          paddingBottom: "16px",
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {productos
          .filter((producto) => producto.enOferta && producto.activo)
          .slice(0, 12)
          .map((producto) => {
            // Cálculo opcional del porcentaje de descuento
            const precioNormal = Number(producto.precio);
            const precioOferta = obtenerPrecioVigente(producto);
            const tieneDescuento = tieneOfertaVigente(producto);
            const porcentajeDescuento = tieneDescuento
              ? Math.round(((precioNormal - precioOferta) / precioNormal) * 100)
              : null;

            return (
              <div
                key={producto.id}
                onClick={() => navigate(`/producto/${producto.id}`)}
                style={{
                  background: "#ffffff",
                  borderRadius: "0px",
                  overflow: "hidden",
                  cursor: "pointer",
                  border: "1px solid #e2e8f0",
                  minWidth: "240px",
                  flexShrink: 0,
                  transition: "all 0.2s ease-in-out",
                  position: "relative",
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
                        textTransform: "uppercase",
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
                    background: "#ffffff",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
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

                    {porcentajeDescuento ? (
                      <span
                        style={{
                          background: "#dc2626", // Rojo destacado para oferta
                          color: "#ffffff",
                          padding: "3px 8px",
                          borderRadius: "0px",
                          fontSize: "9px",
                          fontWeight: 900,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                      >
                        {porcentajeDescuento}% OFF
                      </span>
                    ) : (
                      <span
                        style={{
                          background: "#dc2626",
                          color: "#ffffff",
                          padding: "3px 8px",
                          borderRadius: "0px",
                          fontSize: "9px",
                          fontWeight: 900,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                      >
                        OFERTA
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
                      overflow: "hidden",
                    }}
                  >
                    {producto.nombre}
                  </h4>

                  {/* PRECIOS */}
                  <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                    <h3
                      style={{
                        margin: 0,
                        color: tieneDescuento ? "#dc2626" : "#0f172a",
                        fontSize: "16px",
                        fontWeight: 900,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      $ {precioOferta.toLocaleString("es-AR")}
                    </h3>

                    {tieneDescuento && (
                      <span
                        style={{
                          fontSize: "12px",
                          color: "#94a3b8",
                          textDecoration: "line-through",
                          fontWeight: 600,
                        }}
                      >
                        $ {precioNormal.toLocaleString("es-AR")}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </section>
  );
}