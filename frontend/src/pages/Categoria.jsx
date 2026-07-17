import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Categoria() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [subcategoriaSeleccionada, setSubcategoriaSeleccionada] = useState("Todos");
  const navigate = useNavigate();
  const [limiteVisible, setLimiteVisible] = useState(42);

  // Carga productos cada vez que cambia la categoría (id de la ruta)
  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        setCargando(true);
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/productos?categoria=${id}`
        );
        const data = await res.json();

        setProductos(data);
        setLimiteVisible(42);
      } catch (error) {
        console.error("Error cargando productos:", error);
      } finally {
        setCargando(false);
      }
    };

    if (id) {
      obtenerProductos();
    }
  }, [id]);

  // Sincroniza la subcategoría seleccionada con el query param ?sub= de la URL.
  // Corre al montar Y cada vez que cambia sub, aunque sigamos en la misma
  // categoría (por ejemplo, click en otra subcategoría desde el Navbar
  // estando ya parado en /categoria/:id).
  useEffect(() => {
    const subParam = searchParams.get("sub");
    setSubcategoriaSeleccionada(subParam ? Number(subParam) : "Todos");
    setLimiteVisible(42);
  }, [searchParams]);

  const subcategorias = [
    { id: "Todos", nombre: "Todos" },
    ...Array.from(
      new Map(
        productos
          .filter((p) => p.subcategoria?.id)
          .map((p) => [p.subcategoria.id, { id: p.subcategoria.id, nombre: p.subcategoria.nombre }])
      ).values()
    ),
  ];

  const productosFiltrados =
    subcategoriaSeleccionada === "Todos"
      ? productos
      : productos.filter(
          (producto) => producto.subcategoria?.id === subcategoriaSeleccionada
        );

  const productosRenderizados = productosFiltrados.slice(0, limiteVisible);

  const cargarMasProductos = () => {
    setLimiteVisible((prev) => prev + 42);
  };

  // Cambia la subcategoría Y actualiza la URL, para que quede
  // compartible/recargable y el botón "atrás" del navegador funcione.
  const manejarCambioSubcategoria = (subId) => {
    setLimiteVisible(42);
    if (subId === "Todos") {
      setSearchParams({});
    } else {
      setSearchParams({ sub: subId });
    }
  };

  const obtenerNombreHeader = () => {
    if (subcategoriaSeleccionada !== "Todos") {
      const subEncontrada = subcategorias.find((s) => s.id === subcategoriaSeleccionada);
      return subEncontrada ? subEncontrada.nombre : "Sección";
    }

    if (productos.length > 0) {
      const primerProducto = productos[0];
      if (primerProducto.subcategoria?.id === Number(id)) {
        return primerProducto.subcategoria.nombre;
      }
      return primerProducto.categoria?.nombre || "Categoría";
    }
    return "Categoría";
  };

  return (
    <>
      <Navbar />

      <main style={{ maxWidth: "1400px", margin: "50px auto", padding: "0 24px", minHeight: "60vh", fontFamily: "Inter, sans-serif" }}>
        {cargando ? (
          <div style={{ textAlign: "center", padding: "40px", fontSize: "14px", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Buscando productos...
          </div>
        ) : (
          <>
            <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 900, color: "#0f172a", textTransform: "uppercase", letterSpacing: "-0.03em" }}>
              {obtenerNombreHeader()}
            </h1>

            {subcategorias.length > 2 && (
              <div style={{ display: "flex", gap: "10px", marginTop: "24px", marginBottom: "32px", flexWrap: "wrap" }}>
                {subcategorias.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => manejarCambioSubcategoria(sub.id)}
                    style={{
                      padding: "10px 20px",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      transition: "all 0.15s ease",
                      border: "1px solid",
                      borderRadius: "0px",
                      borderColor: subcategoriaSeleccionada === sub.id ? "#0f172a" : "#e2e8f0",
                      background: subcategoriaSeleccionada === sub.id ? "#0f172a" : "#ffffff",
                      color: subcategoriaSeleccionada === sub.id ? "#ffffff" : "#0f172a",
                    }}
                    onMouseEnter={(e) => {
                      if (subcategoriaSeleccionada !== sub.id) {
                        e.currentTarget.style.borderColor = "#0f172a";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (subcategoriaSeleccionada !== sub.id) {
                        e.currentTarget.style.borderColor = "#e2e8f0";
                      }
                    }}
                  >
                    {sub.nombre}
                  </button>
                ))}
              </div>
            )}

            {productosFiltrados.length === 0 ? (
              <p style={{ color: "#64748b", fontSize: "14px", fontWeight: 600, marginTop: "32px", textTransform: "uppercase" }}>
                No se encontraron productos en esta sección.
              </p>
            ) : (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: "20px", marginTop: "32px" }}>
                  {productosRenderizados.map((producto) => (
                    <div
                      key={producto.id}
                      onClick={() => navigate(`/producto/${producto.id}`)}
                      style={{
                        background: "#ffffff",
                        borderRadius: "0px",
                        overflow: "hidden",
                        cursor: "pointer",
                        border: "1px solid #e2e8f0",
                        transition: "all 0.2s ease-in-out",
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
                      <div
                        style={{
                          height: "240px",
                          width: "100%",
                          position: "relative",
                          overflow: "hidden",
                          background: "#f8fafc",
                          borderBottom: "1px solid #e2e8f0",
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
                              textTransform: "uppercase",
                            }}
                          >
                            Sin imagen
                          </div>
                        )}
                      </div>

                      <div style={{ padding: "16px", background: "#ffffff" }}>
                        <p style={{ margin: 0, color: "#64748b", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                          {producto.marca || "General"}
                        </p>
                        <h4 style={{ margin: "6px 0 8px 0", color: "#0f172a", fontSize: "14px", fontWeight: 700, lineHeight: "1.4", minHeight: "40px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                          {producto.nombre}
                        </h4>
                        <h3 style={{ margin: 0, color: "#0f172a", fontSize: "16px", fontWeight: 900, letterSpacing: "-0.02em" }}>
                          $ {Number(producto.precio).toLocaleString("es-AR")}
                        </h3>
                      </div>
                    </div>
                  ))}
                </div>

                {productosFiltrados.length > limiteVisible && (
                  <button
                    onClick={cargarMasProductos}
                    style={{
                      display: "block",
                      margin: "48px auto 0 auto",
                      padding: "14px 32px",
                      background: "#ffffff",
                      color: "#0f172a",
                      border: "1px solid #0f172a",
                      borderRadius: "0px",
                      fontWeight: "900",
                      fontSize: "14px",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
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
                    Ver más productos ({productosFiltrados.length - limiteVisible} restantes)
                  </button>
                )}
              </>
            )}
          </>
        )}
      </main>

      <Footer />
    </>
  );
}