import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import IconoPapelera from "../components/IconoPapelera";
import { obtenerPrecioVigente, tieneOfertaVigente } from "../utils/precioProducto";

export default function Carrito() {
  const { carrito, actualizarCantidadItem, eliminarProductoItem, vaciarMiCarrito, cargando } = useContext(CartContext);
  const navigate = useNavigate();
  const [itemEnProceso, setItemEnProceso] = useState(null);
  const [errorAccion, setErrorAccion] = useState("");

  const itemsDelCarrito = Array.isArray(carrito) ? carrito : carrito?.items || [];

  const manejarCambioCantidad = async (itemId, cantidad) => {
    if (itemEnProceso !== null) return;
    setItemEnProceso(itemId);
    setErrorAccion("");
    const resultado = await actualizarCantidadItem(itemId, cantidad);
    if (!resultado?.ok) setErrorAccion(resultado?.mensaje || "No se pudo actualizar la cantidad.");
    setItemEnProceso(null);
  };

  const manejarEliminar = async (itemId) => {
    if (itemEnProceso !== null) return;
    setItemEnProceso(itemId);
    setErrorAccion("");
    const resultado = await eliminarProductoItem(itemId);
    if (!resultado?.ok) setErrorAccion(resultado?.mensaje || "No se pudo eliminar el producto.");
    setItemEnProceso(null);
  };

  const manejarVaciar = async () => {
    if (itemEnProceso !== null) return;
    setItemEnProceso("vaciar");
    setErrorAccion("");
    const resultado = await vaciarMiCarrito();
    if (!resultado?.ok) setErrorAccion(resultado?.mensaje || "No se pudo vaciar el carrito.");
    setItemEnProceso(null);
  };

  const totalCompra = itemsDelCarrito.reduce((acc, item) => {
    const precio = obtenerPrecioVigente(item.producto || item.Producto || item);
    return acc + (Number(precio) * item.cantidad);
  }, 0);

  return (
    <div style={{ background: "#ffffff", minHeight: "100vh", fontFamily: "Inter, sans-serif", color: "#0f172a" }}>
      <Navbar />

      <main style={{ maxWidth: "850px", margin: "60px auto", padding: "0 24px" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: 900, color: "#0f172a", margin: 0, textTransform: "uppercase", letterSpacing: "-0.03em" }}>
            Tu Carrito de Compras
          </h1>
        </div>

        {errorAccion && (
          <div role="alert" style={{ marginBottom: "20px", border: "1px solid #fecaca", background: "#fef2f2", color: "#b91c1c", padding: "12px 16px", fontSize: "13px", fontWeight: 600 }}>
            {errorAccion}
          </div>
        )}

        {cargando ? (
          <div role="status" aria-live="polite" style={{ minHeight: "280px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #e2e8f0", color: "#64748b", fontSize: "13px", fontWeight: 700, textTransform: "uppercase" }}>
            Cargando tu carrito...
          </div>
        ) : itemsDelCarrito.length === 0 ? (
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

                const itemId = item.id || item.productoId;
                const stockDisponible = Number(item.talle?.stock ?? producto.stock ?? 0);
                const ocupado = itemEnProceso !== null;

                return (
                  <div key={itemId} style={{ display: "grid", gridTemplateColumns: "64px minmax(0, 1fr) auto 36px", alignItems: "center", gap: "12px", borderBottom: "1px solid #e2e8f0", paddingBottom: "20px" }}>
                    <div style={{ width: "64px", height: "64px", border: "1px solid #e2e8f0", background: "#f8fafc", overflow: "hidden", flexShrink: 0 }}>
                      {imagenProducto ? (
                        <img src={imagenProducto} alt={nombreProducto} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: "10px", color: "#94a3b8", fontWeight: 700 }}>S/I</div>
                      )}
                    </div>
                    
                    <div style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
                      <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "#0f172a", overflowWrap: "anywhere" }}>{nombreProducto}</h3>
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

                    <div aria-label={`Cantidad: ${item.cantidad}`} style={{ display: "flex", alignItems: "center", border: "1px solid #cbd5e1", background: "#ffffff", height: "36px" }}>
                      <button
                        type="button"
                        onClick={() => manejarCambioCantidad(itemId, item.cantidad - 1)}
                        disabled={ocupado || item.cantidad <= 1}
                        aria-label={`Quitar una unidad de ${nombreProducto}`}
                        style={{ width: "34px", height: "34px", border: "none", background: "transparent", color: "#0f172a", fontSize: "18px", cursor: ocupado || item.cantidad <= 1 ? "not-allowed" : "pointer", opacity: ocupado || item.cantidad <= 1 ? 0.4 : 1 }}
                      >
                        −
                      </button>
                      <span aria-live="polite" style={{ minWidth: "24px", textAlign: "center", fontSize: "13px", fontWeight: 700 }}>{item.cantidad}</span>
                      <button
                        type="button"
                        onClick={() => manejarCambioCantidad(itemId, item.cantidad + 1)}
                        disabled={ocupado || item.cantidad >= stockDisponible}
                        aria-label={`Agregar una unidad de ${nombreProducto}`}
                        style={{ width: "34px", height: "34px", border: "none", background: "transparent", color: "#0f172a", fontSize: "18px", cursor: ocupado || item.cantidad >= stockDisponible ? "not-allowed" : "pointer", opacity: ocupado || item.cantidad >= stockDisponible ? 0.4 : 1 }}
                      >
                        +
                      </button>
                    </div>

                    <button 
                      type="button"
                      onClick={() => manejarEliminar(itemId)}
                      disabled={ocupado}
                      title="Eliminar producto"
                      aria-label={`Eliminar ${nombreProducto} del carrito`}
                      style={{ width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", background: "#fff", border: "1px solid #fecaca", color: "#ef4444", cursor: ocupado ? "not-allowed" : "pointer", padding: 0, opacity: ocupado ? 0.5 : 1 }}
                    >
                      <IconoPapelera />
                    </button>
                  </div>
                );
              })}

              <button 
                onClick={manejarVaciar}
                disabled={itemEnProceso !== null}
                style={{ alignSelf: "flex-end", background: "none", border: "none", color: "#94a3b8", cursor: itemEnProceso !== null ? "not-allowed" : "pointer", fontSize: "12px", textTransform: "uppercase", fontWeight: 700 }}
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