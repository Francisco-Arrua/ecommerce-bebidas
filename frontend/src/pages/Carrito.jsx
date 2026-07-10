import { useState, useEffect, useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Carrito() {
  // 1. Consumimos las funciones reales de tu contexto
  const { carrito, eliminarProductoItem, vaciarMiCarrito, cargando } = useContext(CartContext);
  const [configuracion, setConfiguracion] = useState(null);
  const navigate = useNavigate();

  // ✅ Aseguramos leer los items correctamente transformándolos a Array si es objeto
  const itemsDelCarrito = Array.isArray(carrito) ? carrito : carrito?.items || [];

  // 2. Calculamos el precio total basándonos en la estructura anidada o directa
  const totalCompra = itemsDelCarrito.reduce((acc, item) => {
    const precio = item.precio || item.Producto?.precio || item.producto?.precio || 0;
    return acc + (Number(precio) * item.cantidad);
  }, 0);

  useEffect(() => {
    const obtenerConfiguracion = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/configuracion`);
        const data = await res.json();
        setConfiguracion(data);
      } catch (error) {
        console.error("Error cargando la configuración:", error);
      }
    };

    obtenerConfiguracion();
  }, []);

  if (cargando) {
    return (
      <div 
        style={{ 
          color: "#0f172a", 
          textAlign: "center", 
          marginTop: "80px", 
          fontFamily: "Inter, sans-serif", 
          fontWeight: 700, 
          textTransform: "uppercase", 
          letterSpacing: "0.05em" 
        }}
      >
        Cargando carrito...
      </div>
    );
  }
  
  const mensajeWhatsapp = encodeURIComponent(
    `Hola! Me interesa realizar el siguiente pedido:\n\n` +
    `━━━━━━━━━━━━━━━━━━━━━━\n\n` +
    itemsDelCarrito
      .map((item) => {
        const nombre = item.nombre || item.Producto?.nombre || item.producto?.nombre;
        const precio = item.precio || item.Producto?.precio || item.producto?.precio || 0;
        const subtotal = precio * item.cantidad;

        return (
          `• ${nombre}\n` +
          `  Cantidad: ${item.cantidad}\n` +
          `  Precio unitario: $${precio.toLocaleString("es-AR")}\n` +
          `  Subtotal: $${subtotal.toLocaleString("es-AR")}`
        );
      })
      .join("\n\n") +
    `\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n` +
    `Total estimado: $${totalCompra.toLocaleString("es-AR")}\n\n` +
    `Quedo atento. ¡Muchas gracias!`
  );
    
  const whatsappUrl = configuracion?.whatsapp ? `https://wa.me/${configuracion.whatsapp}?text=${mensajeWhatsapp}` : "#";

  return (
    <div style={{ background: "#ffffff", minHeight: "100vh", fontFamily: "Inter, sans-serif", color: "#0f172a" }}>
      <Navbar />

      <main style={{ maxWidth: "850px", margin: "60px auto", padding: "0 24px" }}>
        {/* TÍTULO EN MAYÚSCULAS CON FUERZA BRUTALISTA */}
        <h1 
          style={{ 
            fontSize: "26px", 
            fontWeight: 900, 
            color: "#0f172a", 
            marginBottom: "32px", 
            letterSpacing: "-0.03em", 
            textTransform: "uppercase" 
          }}
        >
          Tu Carrito de Compras
        </h1>

        {itemsDelCarrito.length === 0 ? (
          /* ESTADO VACÍO ESTRUCTURADO Y LIMPIO */
          <div 
            style={{ 
              background: "#ffffff", 
              padding: "60px 40px", 
              borderRadius: "0px", 
              textAlign: "center", 
              border: "1px solid #0f172a" 
            }}
          >
            <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "24px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              No tenés productos en el carrito todavía.
            </p>
            <Link 
              to="/" 
              style={{ 
                background: "#0f172a", 
                color: "#ffffff", 
                padding: "14px 28px", 
                borderRadius: "0px", 
                textDecoration: "none", 
                fontWeight: "900", 
                display: "inline-block", 
                textTransform: "uppercase", 
                letterSpacing: "0.05em",
                fontSize: "13px",
                border: "1px solid #0f172a",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#ffffff";
                e.currentTarget.style.color = "#0f172a";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#0f172a";
                e.currentTarget.style.color = "#ffffff";
              }}
            >
              Ver productos
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            
            {/* CONTENEDOR DE LA LISTA DE PRODUCTOS */}
            <div 
              style={{ 
                background: "#ffffff", 
                borderRadius: "0px", 
                border: "1px solid #0f172a", 
                padding: "24px", 
                display: "flex", 
                flexDirection: "column", 
                gap: "20px" 
              }}
            >
              {itemsDelCarrito.map((item) => {
                const nombreProducto = item.nombre || item.Producto?.nombre || item.producto?.nombre || "Producto";
                const precioProducto = item.precio || item.Producto?.precio || item.producto?.precio || 0;
                const listaImagenes = item.imagenes || item.Producto?.imagenes || item.producto?.imagenes || [];
                const imagenProducto = [...listaImagenes].sort((a, b) => a.orden - b.orden)[0]?.url || "";

                return (
                  <div 
                    key={item.id || item.productoId} 
                    style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      gap: "20px", 
                      borderBottom: "1px solid #e2e8f0", 
                      paddingBottom: "20px" 
                    }}
                  >
                    {/* CUADRANTE DE LA IMAGEN INDUSTRIAL */}
                    <div 
                      style={{ 
                        width: "80px", 
                        height: "80px", 
                        border: "1px solid #e2e8f0", 
                        background: "#f8fafc", 
                        borderRadius: "0px", 
                        position: "relative",
                        overflow: "hidden",
                        flexShrink: 0
                      }}
                    >
                      {imagenProducto ? (
                        <img 
                          src={imagenProducto} 
                          alt={nombreProducto} 
                          style={{ 
                            width: "100%", 
                            height: "100%", 
                            objectFit: "cover" 
                          }} 
                        />
                      ) : (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: "10px", color: "#94a3b8", fontWeight: 700, textTransform: "uppercase" }}>
                          S/I
                        </div>
                      )}
                    </div>
                    
                    {/* DETALLES */}
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
                      <h3 
                        style={{ 
                          margin: 0, 
                          fontSize: "15px", 
                          fontWeight: 700, 
                          color: "#0f172a",
                          lineHeight: "1.3" 
                        }}
                      >
                        {nombreProducto}
                      </h3>
                      <p style={{ margin: 0, color: "#0f172a", fontWeight: 900, fontSize: "14px" }}>
                        $ {Number(precioProducto).toLocaleString("es-AR")}
                      </p>
                    </div>

                    {/* CANTIDAD INDUSTRIAL */}
                    <div 
                      style={{ 
                        border: "1px solid #e2e8f0", 
                        padding: "6px 12px", 
                        fontSize: "12px", 
                        color: "#0f172a", 
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.03em",
                        background: "#f8fafc"
                      }}
                    >
                      CANT: {item.cantidad}
                    </div>

                    {/* BOTÓN ELIMINAR MINIMALISTA */}
                    <button 
                      onClick={() => eliminarProductoItem && eliminarProductoItem(item.id || item.productoId)}
                      style={{ 
                        background: "none", 
                        border: "none", 
                        color: "#ef4444", 
                        cursor: "pointer", 
                        fontWeight: "700", 
                        fontSize: "12px",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        padding: "8px"
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                );
              })}

              {/* VACIAR CARRITO */}
              <button 
                onClick={vaciarMiCarrito}
                style={{ 
                  alignSelf: "flex-end", 
                  background: "none", 
                  border: "none", 
                  color: "#94a3b8", 
                  cursor: "pointer", 
                  fontSize: "12px", 
                  textTransform: "uppercase",
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                  marginTop: "4px"
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = "#0f172a"}
                onMouseLeave={(e) => e.currentTarget.style.color = "#94a3b8"}
              >
                [ Vaciar carrito ]
              </button>
            </div>

            {/* SECCIÓN FINAL DEL CHECKOUT TOTAL */}
            <div 
              style={{ 
                background: "#ffffff", 
                padding: "24px", 
                borderRadius: "0px", 
                border: "1px solid #0f172a", 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                flexWrap: "wrap",
                gap: "20px"
              }}
            >
              <div>
                <span style={{ fontSize: "11px", color: "#64748b", display: "block", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "2px" }}>
                  Total estimado
                </span>
                <span style={{ fontSize: "24px", fontWeight: 900, color: "#0f172a", letterSpacing: "-0.02em" }}>
                  $ {totalCompra.toLocaleString("es-AR")}
                </span>
              </div>
              
              {/* BOTÓN WHATSAPP BRUTALISTA-CLEAN */}
              <button 
                style={{ 
                  background: "#0f172a", // Usamos negro puro para consistencia de marca elegante.
                  color: "#ffffff", 
                  border: "1px solid #0f172a", 
                  padding: "16px 32px", 
                  borderRadius: "0px", 
                  fontWeight: "900", 
                  fontSize: "14px", 
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
                onClick={() => window.open(whatsappUrl, "_blank")}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#25D366"; // Transiciona al verde nativo solo al pasar el mouse
                  e.currentTarget.style.borderColor = "#25D366";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#0f172a";
                  e.currentTarget.style.borderColor = "#0f172a";
                }}
              >
                Iniciar pedido por WhatsApp
              </button>
            </div>

          </div>
        )}
      </main>

      <Footer />

    </div>
  );
}