import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { obtenerPrecioVigente } from "../utils/precioProducto";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Categoria() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [subcategoriaSeleccionada, setSubcategoriaSeleccionada] = useState("Todos");
  const [subcategoriasDisponibles, setSubcategoriasDisponibles] = useState([]);
  const navigate = useNavigate();
  const [pagina, setPagina] = useState(1);
  const [paginacion, setPaginacion] = useState({ total: 0, totalPages: 0 });

  // Carga solo una página de productos y las subcategorías de la categoría.
  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        setCargando(true);
        const subParam = searchParams.get("sub");
        const params = new URLSearchParams({
          categoria: id,
          page: String(pagina),
          limit: "28",
          resumen: "true",
        });
        if (subParam) params.set("subcategoria", subParam);

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/productos?${params.toString()}`
        );
        const data = await res.json();

        setProductos(data.items || data);
        setPaginacion({ total: data.total || 0, totalPages: data.totalPages || 1 });
      } catch (error) {
        console.error("Error cargando productos:", error);
      } finally {
        setCargando(false);
      }
    };

    const obtenerSubcategorias = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/subcategorias?categoriaId=${id}`);
        const data = await res.json();
        setSubcategoriasDisponibles(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error cargando subcategorías:", error);
        setSubcategoriasDisponibles([]);
      }
    };

    if (id) {
      obtenerProductos();
      obtenerSubcategorias();
    }
  }, [id, pagina, searchParams]);

  // Sincroniza la subcategoría seleccionada con el query param ?sub= de la URL.
  // Corre al montar Y cada vez que cambia sub, aunque sigamos en la misma
  // categoría (por ejemplo, click en otra subcategoría desde el Navbar
  // estando ya parado en /categoria/:id).
  useEffect(() => {
    const subParam = searchParams.get("sub");
    setSubcategoriaSeleccionada(subParam ? Number(subParam) : "Todos");
    setPagina(1);
  }, [searchParams]);

  const subcategorias = [
    { id: "Todos", nombre: "Todos" },
    ...subcategoriasDisponibles,
  ];

  const productosFiltrados = productos;

  // Cambia la subcategoría Y actualiza la URL, para que quede
  // compartible/recargable y el botón "atrás" del navegador funcione.
  const manejarCambioSubcategoria = (subId) => {
    setPagina(1);
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
                  {productosFiltrados.map((producto) => (
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
                          $ {obtenerPrecioVigente(producto).toLocaleString("es-AR")}
                        </h3>
                      </div>
                    </div>
                  ))}
                </div>

                {paginacion.totalPages > 1 && (
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "16px", marginTop: "48px" }}>
                    <button
                      onClick={() => setPagina((actual) => Math.max(1, actual - 1))}
                      disabled={pagina === 1}
                      style={{ padding: "12px 20px", background: "#ffffff", color: "#0f172a", border: "1px solid #0f172a", fontWeight: 800, cursor: pagina === 1 ? "not-allowed" : "pointer", opacity: pagina === 1 ? 0.45 : 1 }}
                    >
                      Anterior
                    </button>
                    <span style={{ fontSize: "13px", fontWeight: 800, color: "#64748b" }}>
                      Página {pagina} de {paginacion.totalPages}
                    </span>
                    <button
                      onClick={() => setPagina((actual) => Math.min(paginacion.totalPages, actual + 1))}
                      disabled={pagina >= paginacion.totalPages}
                      style={{ padding: "12px 20px", background: "#0f172a", color: "#ffffff", border: "1px solid #0f172a", fontWeight: 800, cursor: pagina >= paginacion.totalPages ? "not-allowed" : "pointer", opacity: pagina >= paginacion.totalPages ? 0.45 : 1 }}
                    >
                      Siguiente
                    </button>
                  </div>
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