import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { obtenerPrecioVigente, tieneOfertaVigente } from "../utils/precioProducto";

export default function Carrito() {
  const { carrito, eliminarProductoItem, vaciarMiCarrito, cargando } = useContext(CartContext);
  const navigate = useNavigate();

  const itemsDelCarrito = Array.isArray(carrito) ? carrito : carrito?.items || [];

  const totalCompra = itemsDelCarrito.reduce((acc, item) => {
    const precio = obtenerPrecioVigente(item.producto || item.Producto || item);
    return acc + (Number(precio) * item.cantidad);
  }, 0);

  if (cargando) {
    return (
      <div style={{ color: "#0f172a", textAlign: "center", marginTop: "80px", fontFamily: "Inter, sans-serif", fontWeight: 700, textTransform: "uppercase" }}>
        Cargando carrito...
      </div>
    );
  }

  return (
    <div style={{ background: "#ffffff", minHeight: "100vh", fontFamily: "Inter, sans-serif", color: "#0f172a" }}>
      <Navbar />

      <main style={{ maxWidth: "850px", margin: "60px auto", padding: "0 24px" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: 900, color: "#0f172a", margin: 0, textTransform: "uppercase", letterSpacing: "-0.03em" }}>
            Tu Carrito de Compras
          </h1>
        </div>

        {itemsDelCarrito.length === 0 ? (
          <div style={{ background: "#ffffff", padding: "60px 40px", textAlign: "center", border: "1px solid #0f172a" }}>
            <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "24px", fontWeight: 600, textTransform: "uppercase" }}>
              No tenés productos en el carrito todavía.
            </p>
            <Link 
              to="/" 
              style={{ background: "#0f172a", color: "#ffffff", padding: "14px 28px", textDecoration: "none", fontWeight: "900", display: "inline-block", textTransform: "uppercase", fontSize: "13px", border: "1px solid #0f172a" }}
            >
              Ver productos
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            
            {/* LISTA DE PRODUCTOS */}
            <div style={{ background: "#ffffff", border: "1px solid #0f172a", padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
              {itemsDelCarrito.map((item) => {
                const nombreProducto = item.nombre || item.Producto?.nombre || item.producto?.nombre || "Producto";
                const producto = item.producto || item.Producto || item;
                const precioProducto = obtenerPrecioVigente(producto);
                const precioOriginal = Number(producto.precio || 0);
                
                const talleProducto = 
                  (typeof item.talle === "object" ? item.talle?.talle || item.talle?.nombre : item.talle) ||
                  item.talleNombre ||
                  item.variante?.talle ||
                  item.Talle?.nombre;

                const listaImagenes = item.imagenes || item.Producto?.imagenes || item.producto?.imagenes || [];
                const imagenProducto = [...listaImagenes].sort((a, b) => a.orden - b.orden)[0]?.url || "";

                return (
                  <div key={item.id || item.productoId} style={{ display: "flex", alignItems: "center", gap: "20px", borderBottom: "1px solid #e2e8f0", paddingBottom: "20px" }}>
                    <div style={{ width: "80px", height: "80px", border: "1px solid #e2e8f0", background: "#f8fafc", overflow: "hidden", flexShrink: 0 }}>
                      {imagenProducto ? (
                        <img src={imagenProducto} alt={nombreProducto} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: "10px", color: "#94a3b8", fontWeight: 700 }}>S/I</div>
                      )}
                    </div>
                    
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
                      <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "#0f172a" }}>{nombreProducto}</h3>
                      {talleProducto && (
                        <span style={{ display: "inline-block", fontSize: "11px", fontWeight: 800, color: "#0f172a", background: "#f1f5f9", border: "1px solid #cbd5e1", padding: "2px 6px", width: "fit-content", textTransform: "uppercase" }}>
                          Talle: {talleProducto}
                        </span>
                      )}
                      <p style={{ margin: 0, color: tieneOfertaVigente(producto) ? "#c2410c" : "#0f172a", fontWeight: 900, fontSize: "14px" }}>
                        $ {Number(precioProducto).toLocaleString("es-AR")}
                        {tieneOfertaVigente(producto) && (
                          <span style={{ marginLeft: "8px", color: "#94a3b8", textDecoration: "line-through", fontSize: "12px" }}>
                            $ {precioOriginal.toLocaleString("es-AR")}
                          </span>
                        )}
                      </p>
                    </div>

                    <div style={{ border: "1px solid #e2e8f0", padding: "6px 12px", fontSize: "12px", color: "#0f172a", fontWeight: 700, background: "#f8fafc" }}>
                      CANT: {item.cantidad}
                    </div>

                    <button 
                      onClick={() => eliminarProductoItem && eliminarProductoItem(item.id || item.productoId)}
                      style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontWeight: "700", fontSize: "12px", textTransform: "uppercase", padding: "8px" }}
                    >
                      Eliminar
                    </button>
                  </div>
                );
              })}

              <button 
                onClick={vaciarMiCarrito}
                style={{ alignSelf: "flex-end", background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "12px", textTransform: "uppercase", fontWeight: 700 }}
              >
                [ Vaciar carrito ]
              </button>
            </div>

            {/* TOTAL Y BOTÓN CONTINUAR COMPRA */}
            <div style={{ background: "#ffffff", padding: "24px", border: "1px solid #0f172a", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
              <div>
                <span style={{ fontSize: "11px", color: "#64748b", display: "block", fontWeight: 700, textTransform: "uppercase", marginBottom: "2px" }}>
                  Total estimado
                </span>
                <span style={{ fontSize: "24px", fontWeight: 900, color: "#0f172a" }}>
                  $ {totalCompra.toLocaleString("es-AR")}
                </span>
              </div>
              
              <button 
                onClick={() => navigate("/envio")}
                style={{ background: "#0f172a", color: "#ffffff", border: "1px solid #0f172a", padding: "16px 32px", fontWeight: "900", fontSize: "14px", textTransform: "uppercase", cursor: "pointer" }}
              >
                Continuar Compra →
              </button>
            </div>

          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}