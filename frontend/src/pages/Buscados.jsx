import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function Buscados() {
  const [productos, setProductos] = useState([]);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Capturamos los filtros desde la URL (Súper útil para links directos)
  const terminoUrl = searchParams.get("search") || "";
  const categoriaUrl = searchParams.get("categoria") || "";
  const subcategoriaUrl = searchParams.get("subcategoria") || "";

  const [busqueda, setBusqueda] = useState(terminoUrl);

  // Límite para paginación virtual en tandas de 42
  const [limiteVisible, setLimiteVisible] = useState(42);

  useEffect(() => {
    setBusqueda(terminoUrl);
    // Si cambia cualquier filtro, reseteamos la tanda para volver al inicio
    setLimiteVisible(42);
  }, [terminoUrl, categoriaUrl, subcategoriaUrl]);

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/productos`);
        const data = await res.json();
        setProductos(data.filter((producto) => producto.activo));
      } catch (error) {
        console.error("Error al obtener productos:", error);
      }
    };

    obtenerProductos();
  }, []);

  // FILTRADO EN MEMORIA MULTIDIMENSIONAL (Búsqueda + Categoría + Subcategoría)
  const resultados = productos.filter((producto) => {
    // 1. Filtro por término de búsqueda (nombre o marca)
    const coincideTermino =
      !terminoUrl ||
      producto.nombre.toLowerCase().includes(terminoUrl.toLowerCase()) ||
      producto.marca?.toLowerCase().includes(terminoUrl.toLowerCase());

    // 2. Filtro por Categoría (asumiendo que producto.categoriaId es un String o Number)
    const coincideCategoria =
      !categoriaUrl || 
      String(producto.categoriaId) === String(categoriaUrl);

    // 3. Filtro por Subcategoría
    const coincideSubcategoria =
      !subcategoriaUrl || 
      String(producto.subcategoriaId) === String(subcategoriaUrl);

    // El producto se muestra solo si pasa los tres filtros activos
    return coincideTermino && coincideCategoria && coincideSubcategoria;
  });

  // Cortamos el array filtrado para la paginación virtual
  const resultadosRenderizados = resultados.slice(0, limiteVisible);

  const cargarMasProductos = () => {
    setLimiteVisible((prev) => prev + 42);
  };

  // Pequeña lógica para armar un título dinámico descriptivo según lo que se está filtrando
  const obtenerTituloPagina = () => {
    if (terminoUrl) return `Resultados para "${terminoUrl}"`;
    if (subcategoriaUrl) return "Productos de la subcategoría seleccionada";
    if (categoriaUrl) return "Productos de la categoría seleccionada";
    return "Todos los productos";
  };

  return (
    <>
      <Navbar busqueda={busqueda} setBusqueda={setBusqueda} />

      <main
        style={{
          maxWidth: "1400px",
          margin: "50px auto",
          padding: "0 30px",
          minHeight: "65vh",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "28px",
            fontWeight: 700,
            color: "#0b1d33",
            letterSpacing: "-0.01em",
          }}
        >
          {obtenerTituloPagina()}
        </h1>

        <p style={{ color: "#64748b", fontSize: "15px", marginTop: "8px", marginBottom: "30px" }}>
          {resultados.length} {resultados.length === 1 ? "producto encontrado" : "productos encontrados"}
        </p>

        {resultados.length === 0 ? (
          <p style={{ color: "#64748b", fontSize: "16px", textAlign: "center", marginTop: "40px" }}>
            No encontramos coincidencias para los filtros seleccionados. ¡Prueba buscando otra cosa!
          </p>
        ) : (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: "20px",
              }}
            >
              {resultadosRenderizados.map((producto) => (
                <div
                  key={producto.id}
                  onClick={() => navigate(`/producto/${producto.id}`)}
                  style={{
                    background: "white",
                    borderRadius: "12px",
                    overflow: "hidden",
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(11,29,51,0.08)",
                    border: "1px solid #eef2f7",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 12px 24px rgba(11,29,51,0.14)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(11,29,51,0.08)";
                  }}
                >
                  <div
                    style={{
                      height: "220px",
                      width: "100%",
                      position: "relative",
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
                          background: "#f8fafc",
                          color: "#64748b",
                          fontSize: "14px",
                        }}
                      >
                        Sin imagen
                      </div>
                    )}
                  </div>

                  <div style={{ padding: "15px" }}>
                    <p style={{ margin: 0, color: "#64748b", fontSize: "0.9rem" }}>
                      {producto.marca}
                    </p>
                    <h4 style={{ margin: "6px 0", color: "#1e293b", fontSize: "15px", fontWeight: 600 }}>
                      {producto.nombre}
                    </h4>
                    <h3 style={{ margin: 0, color: "#0b1d33", fontSize: "17px", fontWeight: 700 }}>
                      $ {Number(producto.precio).toLocaleString("es-AR")}
                    </h3>
                  </div>
                </div>
              ))}
            </div>

            {resultados.length > limiteVisible && (
              <button
                onClick={cargarMasProductos}
                style={{
                  display: "block",
                  margin: "40px auto 0 auto",
                  padding: "12px 32px",
                  background: "#0b1d33",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "12px",
                  fontWeight: "600",
                  fontSize: "15px",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(11,29,51,0.15)",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#143154";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#0b1d33";
                  e.currentTarget.style.transform = "0";
                }}
              >
                Ver más resultados ({resultados.length - limiteVisible} restantes)
              </button>
            )}
          </>
        )}
      </main>

      <Footer />
    </>
  );
}