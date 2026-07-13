import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CartContext } from "../context/CartContext";

export default function Producto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [relacionados, setRelacionados] = useState([]);
  const [configuracion, setConfiguracion] = useState(null);
  const [imagenSeleccionada, setImagenSeleccionada] = useState("");

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
          <div style={{ width: "32px", height: "32px", border: "2px solid #e2e8f0", borderTopColor: "#0f172a", borderRadius: "0px", animation: "spin 1s linear infinite" }} />
          <h3 style={{ marginTop: "16px", color: "#0f172a", fontWeight: 700, fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Cargando producto...</h3>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
        <Footer />
      </>
    );
  }

  const precioFormateado = Number(producto.precio).toLocaleString("es-AR");

  const mensaje = encodeURIComponent(
    `Hola! Me interesa el producto *${producto.nombre}* (${producto.marca || ''}) que vi en la web. El precio indicado es *$ ${precioFormateado} ARS*.`
  );
  const whatsappUrl = configuracion ? `https://wa.me/${configuracion.whatsapp}?text=${mensaje}` : "#";

  const manejarAgregarCarrito = async () => {
    if (producto && agregarProducto) {
      await agregarProducto(producto.id, 1);
    }
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
            flexDirection: "row"
          }}
        >
          {/* Subcolumna de Miniaturas Verticales */}
          {producto.imagenes?.length > 1 && (
            <div 
              style={{ 
                display: "flex", 
                flexDirection: "column", 
                gap: "12px",
                maxHeight: "450px",
                overflowY: "auto",
                paddingRight: "4px",
                scrollbarWidth: "none"
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
                    borderRadius: "0px", // ⬅️ Recto
                    overflow: "hidden",
                    border: imagenSeleccionada === img.url ? "2px solid #0f172a" : "1px solid #e2e8f0",
                    cursor: "pointer",
                    background: "#ffffff",
                    transition: "all 0.15s ease",
                    flexShrink: 0
                  }}
                >
                  <img src={img.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ))}
            </div>
          )}

          {/* Contenedor de la Imagen Grande */}
          <div
            style={{
              background: "#ffffff",
              padding: "16px",
              borderRadius: "0px", // ⬅️ Recto
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
              <div style={{ color: "#94a3b8", fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>Imagen no disponible</div>
            )}
          </div>
        </div>

        {/* Columna Derecha: Información del Producto */}
        <div
          style={{
            flex: "1 1 450px",
            background: "#ffffff",
            padding: "32px",
            borderRadius: "0px", // ⬅️ Recto
            border: "1px solid #e2e8f0",
            boxSizing: "border-box"
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
                borderRadius: "0px", // ⬅️ Recto
                display: "inline-block",
                marginBottom: "16px",
                border: "1px solid #e2e8f0"
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
              textTransform: "uppercase"
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
              gap: "8px"
            }}
          >
            <span style={{ fontSize: "30px", fontWeight: 900, color: "#0f172a", letterSpacing: "-0.02em" }}>
              $ {precioFormateado}
            </span>
            <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 700 }}>ARS</span>
          </div>

          {/* Descripción */}
          <div style={{ marginBottom: "32px" }}>
            <h3 style={{ fontSize: "12px", fontWeight: 800, color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 12px 0" }}>
              Descripción del producto
            </h3>
            <p
              style={{
                margin: 0,
                color: "#334155",
                fontSize: "14px",
                lineHeight: 1.6,
                whiteSpace: "pre-line"
              }}
            >
              {producto.descripcion || "Este producto no cuenta con una descripción detallada todavía."}
            </p>
          </div>

          {/* 🛒 BOTÓN AGREGAR AL CARRITO (ESTILO INDUSTRIAL) */}
          <button
            onClick={manejarAgregarCarrito}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              width: "100%",
              boxSizing: "border-box",
              padding: "16px 24px",
              background: "#0f172a", // Negro pleno
              color: "#ffffff",
              border: "none",
              borderRadius: "0px", // ⬅️ Recto
              fontWeight: "800",
              fontSize: "14px",
              textTransform: "uppercase",
              letterSpacing: "0.03em",
              cursor: "pointer",
              transition: "all 0.2s ease",
              textAlign: "center",
              marginBottom: "12px"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#334155";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#0f172a";
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            Agregar al carrito
          </button>

          {/* Botón WhatsApp (ESTILO SEGURO PERO RECTO) */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              width: "100%",
              boxSizing: "border-box",
              padding: "16px 24px",
              background: "#ffffff",
              color: "#16a34a", // Verde sutil en texto
              border: "2px solid #16a34a",
              borderRadius: "0px", // ⬅️ Recto
              fontWeight: "800",
              fontSize: "14px",
              textTransform: "uppercase",
              letterSpacing: "0.03em",
              textDecoration: "none",
              transition: "all 0.2s ease",
              textAlign: "center"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#16a34a";
              e.currentTarget.style.color = "#ffffff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#ffffff";
              e.currentTarget.style.color = "#16a34a";
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.4 0 11.973 0c3.184.001 6.177 1.24 8.427 3.491 2.25 2.253 3.486 5.244 3.485 8.427-.003 6.616-5.343 11.962-11.918 11.962-2.004-.001-3.973-.504-5.717-1.464L0 24zm6.154-3.461c1.656.982 3.272 1.499 4.908 1.5 5.462 0 9.904-4.43 9.907-9.885.002-2.643-1.026-5.127-2.897-7.001-1.872-1.873-4.359-2.903-7.005-2.904-5.46 0-9.902 4.43-9.906 9.886-.001 1.748.48 3.409 1.393 4.869l-.999 3.648 3.733-.979zM16.92 14.19c-.31-.155-1.835-.905-2.119-1.01-.284-.103-.49-.155-.697.156-.206.31-.798.981-.978 1.188-.181.206-.361.233-.671.078-.31-.155-1.309-.48-2.494-1.536-.922-.823-1.545-1.839-1.726-2.149-.181-.31-.018-.477.136-.631.139-.139.31-.361.464-.541.155-.181.206-.31.31-.516.103-.206.052-.387-.026-.541-.077-.155-.697-1.677-.954-2.296-.252-.606-.508-.524-.697-.534-.18-.01-.387-.01-.594-.01-.206 0-.542.078-.826.387-.283.31-1.084 1.058-1.084 2.581s1.11 3.018 1.26 3.224c.15.206 2.184 3.334 5.292 4.673.739.319 1.317.51 1.764.652.743.236 1.419.203 1.953.123.595-.089 1.835-.749 2.093-1.446.258-.697.258-1.291.181-1.417-.077-.127-.283-.207-.593-.363z"/>
            </svg>
            Consultar por WhatsApp
          </a>
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

        {/* Grilla de Relacionados */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: "24px" }}>
          {relacionados.map((prod) => {
            const portadaRelacionado =
              [...(prod.imagenes || [])]
                .sort((a, b) => a.orden - b.orden)[0]?.url;

            return (
              <div
                key={prod.id}
                onClick={() => {
                  navigate(`/producto/${prod.id}`);
                  window.scrollTo(0, 0);
                }}
                style={{
                  background: "#ffffff",
                  borderRadius: "0px", // ⬅️ Recto
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
                <div style={{ height: "220px", width: "100%", position: "relative", overflow: "hidden", background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                  {portadaRelacionado ? (
                    <img 
                      src={portadaRelacionado} 
                      alt={prod.nombre} 
                      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }} 
                    />
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#94a3b8", fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>
                      Sin imagen
                    </div>
                  )}
                </div>

                <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "4px" }}>
                  <p style={{ margin: 0, color: "#64748b", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>{prod.marca || "General"}</p>
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
                      overflow: "hidden"
                    }}
                  >
                    {prod.nombre}
                  </h4>
                  <h3 style={{ margin: 0, color: "#0f172a", fontSize: "16px", fontWeight: 800, letterSpacing: "-0.02em" }}>
                    $ {Number(prod.precio).toLocaleString("es-AR")}
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