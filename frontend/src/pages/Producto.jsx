import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CartContext } from "../context/CartContext";
import { obtenerPrecioVigente, tieneOfertaVigente } from "../utils/precioProducto";

export default function Producto() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [producto, setProducto] = useState(null);
  const [relacionados, setRelacionados] = useState([]);
  const [configuracion, setConfiguracion] = useState(null);
  const [imagenSeleccionada, setImagenSeleccionada] = useState("");

  // Estados de selección (traídos del primer código)
  const [talleSeleccionado, setTalleSeleccionado] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [errorTalle, setErrorTalle] = useState(false);
  const [agregadoExito, setAgregadoExito] = useState(false);

  const { agregarProducto } = useContext(CartContext);

  useEffect(() => {
    const obtenerProducto = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/productos/${id}`);
        const data = await res.json();
        setProducto(data);

        const portada = data.imagenes?.sort((a, b) => a.orden - b.orden)[0]?.url || "";
        setImagenSeleccionada(portada);

        const resRelacionados = await fetch(
          `${import.meta.env.VITE_API_URL}/productos/${id}/relacionados`
        );
        const dataRelacionados = await resRelacionados.json();
        setRelacionados(dataRelacionados);

        const resConfig = await fetch(`${import.meta.env.VITE_API_URL}/configuracion`);
        const dataConfig = await resConfig.json();
        setConfiguracion(dataConfig);
      } catch (error) {
        console.error("Error cargando los datos del producto:", error);
      }
    };

    obtenerProducto();

    // Reiniciar selección al cambiar de producto
    setTalleSeleccionado(null);
    setCantidad(1);
    setErrorTalle(false);
  }, [id]);

  if (!producto) {
    return (
      <>
        <Navbar />
        <div
          style={{
            minHeight: "70vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            background: "#ffffff",
            fontFamily: "Inter, sans-serif",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              border: "2px solid #e2e8f0",
              borderTopColor: "#0f172a",
              borderRadius: "0px",
              animation: "spin 1s linear infinite",
            }}
          />
          <h3
            style={{
              marginTop: "16px",
              color: "#0f172a",
              fontWeight: 700,
              fontSize: "14px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Cargando producto...
          </h3>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
        <Footer />
      </>
    );
  }

  const precioVigente = obtenerPrecioVigente(producto);
  const precioFormateado = precioVigente.toLocaleString("es-AR");

  const mensaje = encodeURIComponent(
    `Hola! Me interesa el producto *${producto.nombre}* (${producto.marca || ""}) que vi en la web. El precio indicado es *$ ${precioFormateado} ARS*.`
  );
  const whatsappUrl = configuracion ? `https://wa.me/${configuracion.whatsapp}?text=${mensaje}` : "#";

  // Stock disponible según la variante seleccionada o el general (del primer código)
  const stockDisponible = producto.tieneTalles
    ? talleSeleccionado
      ? talleSeleccionado.stock
      : 0
    : producto.stock;

  const sinStockGeneral = producto.tieneTalles
    ? !producto.talles?.some((t) => t.stock > 0)
    : producto.stock <= 0;

  const handleSelectTalle = (talleObj) => {
    if (talleObj.stock <= 0) return;
    setTalleSeleccionado(talleObj);
    setErrorTalle(false);
    setCantidad(1);
  };

  const manejarAgregarCarrito = () => {
    if (producto.tieneTalles && !talleSeleccionado) {
      setErrorTalle(true);
      return;
    }

    const itemParaCarrito = {
      id: producto.id,
      nombre: producto.nombre,
      precio: precioVigente,
      imagen: imagenSeleccionada || producto.imagenes?.[0]?.url || "/placeholder.jpg",
      tieneTalles: producto.tieneTalles,
      talleId: talleSeleccionado ? talleSeleccionado.id : null,
      talle: talleSeleccionado ? talleSeleccionado.talle : null,
      cantidad,
    };

    // ⚠️ Ajustá esta llamada a la firma real de tu CartContext.
    // Si tu agregarProducto espera (id, cantidad), usá:
    // agregarProducto(producto.id, cantidad);
    agregarProducto(itemParaCarrito);

    setAgregadoExito(true);
    setTimeout(() => setAgregadoExito(false), 2500);
  };

  return (
    <div style={{ background: "#ffffff", minHeight: "100vh", fontFamily: "Inter, sans-serif" }}>
      <Navbar />

      {/* Contenedor Principal Adaptativo */}
      <main
        style={{
          maxWidth: "1200px",
          margin: "40px auto",
          padding: "0 24px",
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: "40px",
        }}
      >
        {/* Columna Izquierda: Galería */}
        <div
          style={{
            flex: "1 1 500px",
            maxWidth: "100%",
            display: "flex",
            gap: "16px",
            flexDirection: "row",
          }}
        >
          {producto.imagenes?.length > 1 && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                maxHeight: "450px",
                overflowY: "auto",
                paddingRight: "4px",
                scrollbarWidth: "none",
              }}
            >
              {producto.imagenes.map((img, idx) => (
                <div
                  key={idx}
                  onMouseEnter={() => setImagenSeleccionada(img.url)}
                  onClick={() => setImagenSeleccionada(img.url)}
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "0px",
                    overflow: "hidden",
                    border: imagenSeleccionada === img.url ? "2px solid #0f172a" : "1px solid #e2e8f0",
                    cursor: "pointer",
                    background: "#ffffff",
                    transition: "all 0.15s ease",
                    flexShrink: 0,
                  }}
                >
                  <img src={img.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ))}
            </div>
          )}

          <div
            style={{
              background: "#ffffff",
              padding: "16px",
              borderRadius: "0px",
              border: "1px solid #e2e8f0",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "450px",
              flex: 1,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {imagenSeleccionada ? (
              <img
                src={imagenSeleccionada}
                alt={producto.nombre}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  background: "#ffffff",
                }}
              />
            ) : (
              <div style={{ color: "#94a3b8", fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>
                Imagen no disponible
              </div>
            )}
          </div>
        </div>

        {/* Columna Derecha: Información del Producto */}
        <div
          style={{
            flex: "1 1 450px",
            background: "#ffffff",
            padding: "32px",
            borderRadius: "0px",
            border: "1px solid #e2e8f0",
            boxSizing: "border-box",
          }}
        >
          {producto.marca && (
            <span
              style={{
                color: "#0f172a",
                fontWeight: 800,
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                background: "#f1f5f9",
                padding: "4px 10px",
                borderRadius: "0px",
                display: "inline-block",
                marginBottom: "16px",
                border: "1px solid #e2e8f0",
              }}
            >
              {producto.marca}
            </span>
          )}

          <h1
            style={{
              margin: "0 0 16px 0",
              fontSize: "26px",
              fontWeight: 900,
              color: "#0f172a",
              letterSpacing: "-0.03em",
              lineHeight: 1.2,
              textTransform: "uppercase",
            }}
          >
            {producto.nombre}
          </h1>

          {/* Precio */}
          <div
            style={{
              padding: "16px 0",
              borderTop: "1px solid #e2e8f0",
              borderBottom: "1px solid #e2e8f0",
              margin: "24px 0",
              display: "flex",
              alignItems: "baseline",
              gap: "8px",
            }}
          >
            <span style={{ fontSize: "30px", fontWeight: 900, color: tieneOfertaVigente(producto) ? "#c2410c" : "#0f172a", letterSpacing: "-0.02em" }}>
              $ {precioFormateado}
            </span>
            {tieneOfertaVigente(producto) && (
              <span style={{ fontSize: "14px", color: "#94a3b8", textDecoration: "line-through", fontWeight: 700 }}>
                $ {Number(producto.precio).toLocaleString("es-AR")}
              </span>
            )}
            <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 700 }}>ARS</span>
          </div>

          {/* Descripción */}
          <div style={{ marginBottom: "32px" }}>
            <h3
              style={{
                fontSize: "12px",
                fontWeight: 800,
                color: "#0f172a",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                margin: "0 0 12px 0",
              }}
            >
              Descripción del producto
            </h3>
            <p
              style={{
                margin: 0,
                color: "#334155",
                fontSize: "14px",
                lineHeight: 1.6,
                whiteSpace: "pre-line",
              }}
            >
              {producto.descripcion || "Este producto no cuenta con una descripción detallada todavía."}
            </p>
          </div>

          {/* SELECTOR DE TALLES (del primer código, con estilo industrial) */}
          {producto.tieneTalles && (
            <div style={{ marginBottom: "24px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "12px",
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 800,
                    color: "#0f172a",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Seleccionar talle
                </span>
                {talleSeleccionado && (
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "#64748b" }}>
                    Stock: {talleSeleccionado.stock} unid.
                  </span>
                )}
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(56px, 1fr))",
                  gap: "10px",
                }}
              >
                {producto.talles?.map((t) => {
                  const sinStock = t.stock <= 0;
                  const seleccionado = talleSeleccionado?.id === t.id;

                  return (
                    <button
                      key={t.id}
                      disabled={sinStock}
                      onClick={() => handleSelectTalle(t)}
                      style={{
                        height: "44px",
                        border: seleccionado ? "1px solid #0f172a" : "1px solid #e2e8f0",
                        backgroundColor: sinStock ? "#f1f5f9" : seleccionado ? "#0f172a" : "#ffffff",
                        color: sinStock ? "#94a3b8" : seleccionado ? "#ffffff" : "#0f172a",
                        fontSize: "13px",
                        fontWeight: 700,
                        borderRadius: "0px",
                        cursor: sinStock ? "not-allowed" : "pointer",
                        textDecoration: sinStock ? "line-through" : "none",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {t.talle}
                    </button>
                  );
                })}
              </div>

              {errorTalle && (
                <p style={{ color: "#dc2626", fontSize: "12px", fontWeight: 700, marginTop: "8px" }}>
                  * Por favor, seleccioná un talle para continuar.
                </p>
              )}
            </div>
          )}

          {/* CANTIDAD (del primer código, con estilo industrial) */}
          <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                border: "1px solid #0f172a",
                height: "50px",
              }}
            >
              <button
                onClick={() => setCantidad((prev) => Math.max(1, prev - 1))}
                disabled={cantidad <= 1 || sinStockGeneral}
                style={{
                  width: "40px",
                  height: "100%",
                  border: "none",
                  backgroundColor: "transparent",
                  fontSize: "16px",
                  fontWeight: "700",
                  color: "#0f172a",
                  cursor: cantidad <= 1 || sinStockGeneral ? "not-allowed" : "pointer",
                }}
              >
                −
              </button>
              <span style={{ width: "40px", textAlign: "center", fontSize: "14px", fontWeight: "700", color: "#0f172a" }}>
                {cantidad}
              </span>
              <button
                onClick={() =>
                  setCantidad((prev) =>
                    producto.tieneTalles
                      ? talleSeleccionado
                        ? Math.min(talleSeleccionado.stock, prev + 1)
                        : prev
                      : Math.min(producto.stock, prev + 1)
                  )
                }
                disabled={
                  sinStockGeneral ||
                  (producto.tieneTalles && !talleSeleccionado) ||
                  cantidad >= stockDisponible
                }
                style={{
                  width: "40px",
                  height: "100%",
                  border: "none",
                  backgroundColor: "transparent",
                  fontSize: "16px",
                  fontWeight: "700",
                  color: "#0f172a",
                  cursor:
                    sinStockGeneral || (producto.tieneTalles && !talleSeleccionado) || cantidad >= stockDisponible
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                +
              </button>
            </div>
          </div>

          {/* 🛒 BOTÓN AGREGAR AL CARRITO (ESTILO INDUSTRIAL) */}
          <button
            onClick={manejarAgregarCarrito}
            disabled={sinStockGeneral || (producto.tieneTalles && talleSeleccionado?.stock <= 0)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              width: "100%",
              boxSizing: "border-box",
              padding: "16px 24px",
              background: sinStockGeneral ? "#a1a1aa" : "#0f172a",
              color: "#ffffff",
              border: "none",
              borderRadius: "0px",
              fontWeight: "800",
              fontSize: "14px",
              textTransform: "uppercase",
              letterSpacing: "0.03em",
              cursor: sinStockGeneral ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
              textAlign: "center",
              marginBottom: "12px",
            }}
            onMouseEnter={(e) => {
              if (!sinStockGeneral) e.currentTarget.style.background = "#334155";
            }}
            onMouseLeave={(e) => {
              if (!sinStockGeneral) e.currentTarget.style.background = "#0f172a";
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {sinStockGeneral ? "Agotado" : "Agregar al carrito"}
          </button>

          {agregadoExito && (
            <div
              style={{
                marginTop: "16px",
                padding: "12px",
                backgroundColor: "#0f172a",
                color: "#ffffff",
                fontSize: "12px",
                fontWeight: "700",
                textAlign: "center",
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              Producto agregado al carrito correctamente
            </div>
          )}
        </div>
      </main>

      {/* Sección: "También te puede interesar" */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "80px auto 40px auto",
          padding: "0 24px",
        }}
      >
        <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "32px", marginBottom: "32px" }}>
          <h2 style={{ margin: 0, fontSize: "22px", fontWeight: 900, color: "#0f172a", textTransform: "uppercase", letterSpacing: "-0.03em" }}>
            También te puede interesar
          </h2>
          <p style={{ margin: "4px 0 0 0", color: "#64748b", fontSize: "13px", fontWeight: 500 }}>
            Productos recomendados para ti.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: "24px" }}>
          {relacionados.map((prod) => {
            const portadaRelacionado = [...(prod.imagenes || [])].sort((a, b) => a.orden - b.orden)[0]?.url;

            return (
              <div
                key={prod.id}
                onClick={() => {
                  navigate(`/producto/${prod.id}`);
                  window.scrollTo(0, 0);
                }}
                style={{
                  background: "#ffffff",
                  borderRadius: "0px",
                  overflow: "hidden",
                  cursor: "pointer",
                  border: "1px solid #e2e8f0",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#0f172a";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#e2e8f0";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div
                  style={{
                    height: "220px",
                    width: "100%",
                    position: "relative",
                    overflow: "hidden",
                    background: "#f8fafc",
                    borderBottom: "1px solid #e2e8f0",
                  }}
                >
                  {portadaRelacionado ? (
                    <img
                      src={portadaRelacionado}
                      alt={prod.nombre}
                      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }}
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
                        textTransform: "uppercase",
                      }}
                    >
                      Sin imagen
                    </div>
                  )}
                </div>

                <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "4px" }}>
                  <p style={{ margin: 0, color: "#64748b", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {prod.marca || "General"}
                  </p>
                  <h4
                    style={{
                      margin: "4px 0 6px 0",
                      color: "#0f172a",
                      fontSize: "14px",
                      fontWeight: 600,
                      lineHeight: "1.4",
                      minHeight: "40px",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {prod.nombre}
                  </h4>
                  <h3 style={{ margin: 0, color: "#0f172a", fontSize: "16px", fontWeight: 800, letterSpacing: "-0.02em" }}>
                    $ {obtenerPrecioVigente(prod).toLocaleString("es-AR")}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <Footer />
    </div>
  );
}