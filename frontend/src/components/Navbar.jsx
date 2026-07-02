import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState, useRef, useContext } from "react";
import { useAuth } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";

export default function Navbar({ busqueda, setBusqueda }) {
  const navigate = useNavigate();
  const [mostrarCategorias, setMostrarCategorias] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]); 
  const [configuracion, setConfiguracion] = useState(null);
  const [paginas, setPaginas] = useState([]);
  
  // Estado para ocultar/mostrar TODO el navbar de forma fluida usando transform
  const [ocultarNavbar, setOcultarNavbar] = useState(false);
  const lastScrollY = useRef(0);

  const { usuario, setUsuario } = useAuth();
  const [mostrarPerfil, setMostrarPerfil] = useState(false);
  const { carrito } = useContext(CartContext);

  const itemsDelCarrito = Array.isArray(carrito) ? carrito : carrito?.items || [];
  const cantidadTotal = itemsDelCarrito.reduce((acc, item) => acc + item.cantidad, 0);

  const API_URL = import.meta.env.VITE_API_URL;
  
  const cerrarSesion = () => {
    localStorage.removeItem("token");
    setUsuario(null);
    setMostrarPerfil(false);
    navigate("/");
  };

  useEffect(() => {
    const obtenerCategorias = async () => {
      try {
        const res = await fetch(`${API_URL}/categorias`);
        const data = await res.json();
        setCategorias(data);
      } catch (e) { console.error(e); }
    };

    const obtenerConfiguracion = async () => {
      try {
        const res = await fetch(`${API_URL}/configuracion`);
        const data = await res.json();
        setConfiguracion(data);
      } catch (e) { console.error(e); }
    };

    const obtenerPaginas = async () => {
      try {
        const res = await fetch(`${API_URL}/paginas?visible=true`);
        const data = await res.json();
        setPaginas(data);
      } catch (e) { console.error(e); }
    };

    obtenerCategorias();
    obtenerConfiguracion();
    obtenerPaginas();
  }, [API_URL]);

  // CORRECCIÓN: Trae las subcategorías si la categoría madre es única
  useEffect(() => {
    if (categorias.length === 1) {
      const obtenerSubcategorias = async () => {
        try {
          const res = await fetch(`${API_URL}/subcategorias?categoriaId=${categorias[0].id}`);
          const data = await res.json();
          setSubcategorias(data);
        } catch (e) { console.error(e); }
      };
      obtenerSubcategorias();
    }
  }, [categorias, API_URL]);

  // CONTROL DE SCROLL POR GPU (Cero rebotes, rendimiento nativo)
  useEffect(() => {
    const manejarScroll = () => {
      const currentScrollY = window.scrollY;

      // Tolerancia pequeña para evitar disparos falsos en celulares (efecto rebote elástico)
      if (Math.abs(currentScrollY - lastScrollY.current) < 5) return;

      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        // Hacia abajo: esconde todo el navbar de forma limpia
        setOcultarNavbar(true);
        setMostrarCategorias(false);
        setMostrarPerfil(false);
      } else {
        // Hacia arriba: reaparece instantáneamente sin saltos de layout
        setOcultarNavbar(false);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", manejarScroll, { passive: true });
    return () => window.removeEventListener("scroll", manejarScroll);
  }, []);

  const esCategoriaUnica = categorias.length === 1;

  return (
    <header
      style={{
        background: "rgba(10, 10, 12, 0.95)", 
        backdropFilter: "blur(16px)", 
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "0 15px 30px rgba(0, 0, 0, 0.3)", 
        borderBottom: "1px solid rgba(255, 255, 255, 0.07)",
        fontFamily: "Inter, sans-serif",
        // Aquí ocurre la magia: translate3d activa aceleración de hardware y elimina el jank
        transform: ocultarNavbar ? "translate3d(0, -100%, 0)" : "translate3d(0, 0, 0)",
        transition: "transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <div 
        style={{ 
          maxWidth: "1400px", 
          margin: "0 auto", 
          padding: "16px 24px 12px 24px",
        }}
      >
        
        {/* PARTE SUPERIOR */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "32px" }}>
          <Link to="/" style={{ textDecoration: "none", color: "#ffffff" }}>
            <h2 style={{ margin: 0, fontSize: "22px", fontWeight: 900, letterSpacing: "-0.05em", textTransform: "uppercase" }}>
              {configuracion?.nombreTienda || "Tienda"}
            </h2>
          </Link>

          {/* Barra de búsqueda */}
          <div style={{ flex: 1, maxWidth: "520px", position: "relative", display: "flex", alignItems: "center" }}>
            <svg
              width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              style={{ position: "absolute", left: "16px", pointerEvents: "none" }}
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="¿Qué estás buscando hoy?..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  navigate(`/buscados?search=${encodeURIComponent(busqueda)}`);
                }
              }}
              style={{
                width: "100%",
                padding: "12px 16px 12px 48px",
                borderRadius: "0px",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                backgroundColor: "rgba(255, 255, 255, 0.04)",
                fontSize: "14px",
                fontWeight: 500,
                color: "#ffffff",
                outline: "none",
                transition: "all 0.25s ease",
              }}
              onFocus={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.08)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.4)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.04)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
              }}
            />
          </div>

          {/* CONTENEDOR DE BOTONES */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            
            {/* BOTÓN DEL CARRITO */}
            <button 
              onClick={() => navigate("/carrito")}
              style={{
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
                width: "44px",
                height: "44px",
                borderRadius: "0px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)"; e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)"; e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.06)"; }}
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>

              {cantidadTotal > 0 && (
                <span style={{
                  position: "absolute",
                  top: "-1px",
                  right: "-1px",
                  background: "#ffffff", 
                  color: "#0a0a0c",
                  fontSize: "10px",
                  fontWeight: "800",
                  height: "16px",
                  minWidth: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 4px",
                  boxSizing: "border-box"
                }}>
                  {cantidadTotal}
                </span>
              )}
            </button>

            {/* BOTÓN DE PERFIL */}
            <div style={{ position: "relative" }}>
              <button 
                onClick={() => setMostrarPerfil(!mostrarPerfil)}
                style={{ 
                  background: usuario ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.04)", 
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                  padding: usuario ? "0 16px" : "0",
                  width: usuario ? "auto" : "44px", 
                  height: "44px", 
                  borderRadius: "0px",
                  cursor: "pointer", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  gap: "8px",
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)"; e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = usuario ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.04)"; e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.06)"; }}
              >
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                {usuario && <span style={{ color: "#ffffff", fontSize: "13px", fontWeight: 600, letterSpacing: "0.03em" }}>{usuario.nombre.split(" ")[0].toUpperCase()}</span>}
              </button>

              {mostrarPerfil && (
                <div 
                  style={{ 
                    position: "absolute", 
                    top: "100%", 
                    right: 0,
                    background: "#0a0a0c", 
                    minWidth: "200px",
                    borderRadius: "0px",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    padding: "4px 0",
                    zIndex: 120,
                  }}
                >
                  {usuario ? (
                    <>
                      <div style={{ padding: "12px 20px", fontSize: "11px", color: "#64748b", borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: "4px", letterSpacing: "0.05em" }}>
                        ROL: <strong style={{ color: "#ffffff" }}>{usuario.rol}</strong>
                      </div>
                      
                      {usuario.rol === "ADMIN" && (
                        <div
                          onClick={() => { navigate("/admin"); setMostrarPerfil(false); }}
                          style={{ padding: "12px 20px", cursor: "pointer", fontSize: "13px", fontWeight: 600, color: "#ffffff", transition: "all 0.2s" }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.06)"}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                        >
                          PANEL ADMIN
                        </div>
                      )}

                      <div
                        onClick={cerrarSesion}
                        style={{ padding: "12px 20px", cursor: "pointer", fontSize: "13px", fontWeight: 600, color: "#f87171", transition: "all 0.2s" }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.08)"}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                      >
                        CERRAR SESIÓN
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        onClick={() => { navigate("/login"); setMostrarPerfil(false); }}
                        style={{ padding: "12px 20px", cursor: "pointer", fontSize: "13px", fontWeight: 600, color: "#a1a1aa", transition: "all 0.2s" }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.06)"; e.currentTarget.style.color = "#ffffff"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#a1a1aa"; }}
                      >
                        INICIAR SESIÓN
                      </div>
                      <div
                        onClick={() => { navigate("/register"); setMostrarPerfil(false); }}
                        style={{ padding: "12px 20px", cursor: "pointer", fontSize: "13px", fontWeight: 600, color: "#a1a1aa", transition: "all 0.2s" }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.06)"; e.currentTarget.style.color = "#ffffff"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#a1a1aa"; }}
                      >
                        REGISTRARSE
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* PARTE INFERIOR: Navegación Estática y Fluida */}
        <nav 
          style={{ 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center", 
            gap: "36px", 
            marginTop: "16px",
            borderTop: "1px solid rgba(255, 255, 255, 0.06)",
            paddingTop: "14px"
          }}
        >
          <Link 
            to="/" 
            style={{ 
              textDecoration: "none", 
              color: "#94a3b8", 
              fontSize: "13px", 
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              transition: "color 0.2s ease" 
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = "#ffffff"}
            onMouseLeave={(e) => e.currentTarget.style.color = "#94a3b8"}
          >
            Inicio
          </Link>

          <Link 
            to="/promociones" 
            style={{ 
              textDecoration: "none", 
              color: "#94a3b8", 
              fontSize: "13px", 
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              transition: "color 0.2s ease" 
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = "#ffffff"}
            onMouseLeave={(e) => e.currentTarget.style.color = "#94a3b8"}
          >
            Promos
          </Link>          

          {/* MENU DESPLEGABLE DE CATEGORÍAS (Corregido y Limpio) */}
          {categorias.length > 0 && (
            <div style={{ position: "relative" }}>
              <span
                onClick={() => setMostrarCategorias(!mostrarCategorias)}
                style={{ 
                  cursor: "pointer", 
                  color: mostrarCategorias ? "#ffffff" : "#94a3b8", 
                  fontSize: "13px", 
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  userSelect: "none",
                  transition: "color 0.2s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = "#ffffff"}
                onMouseLeave={(e) => { if(!mostrarCategorias) e.currentTarget.style.color = "#94a3b8"; }}
              >
                Categorías
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: mostrarCategorias ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}><polyline points="6 9 12 15 18 9"></polyline></svg>
              </span>

              {mostrarCategorias && (
                <div 
                  style={{ 
                    position: "absolute", 
                    top: "100%", 
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "#0a0a0c", 
                    minWidth: "220px",
                    borderRadius: "0px",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    padding: "6px 0",
                    zIndex: 110,
                  }}
                >
                  {esCategoriaUnica
                    ? subcategorias.map((sub) => (
                        <div
                          key={sub.id}
                          onClick={() => {
                            navigate(`/categoria/${sub.id}`);
                            setMostrarCategorias(false);
                          }}
                          style={{ padding: "12px 20px", cursor: "pointer", fontSize: "13px", fontWeight: 500, color: "#a1a1aa", transition: "all 0.2s" }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.06)"; e.currentTarget.style.color = "#ffffff"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#a1a1aa"; }}
                        >
                          {sub.nombre.toUpperCase()}
                        </div>
                      ))
                    : categorias.map((categoria) => (
                        <div
                          key={categoria.id}
                          onClick={() => {
                            navigate(`/categoria/${categoria.id}`);
                            setMostrarCategorias(false);
                          }}
                          style={{ padding: "12px 20px", cursor: "pointer", fontSize: "13px", fontWeight: 500, color: "#a1a1aa", transition: "all 0.2s" }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.06)"; e.currentTarget.style.color = "#ffffff"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#a1a1aa"; }}
                        >
                          {categoria.nombre.toUpperCase()}
                        </div>
                      ))
                  }
                </div>
              )}
            </div>
          )}

          {/* PÁGINAS DINÁMICAS */}
          {paginas.map((pagina) => (
            <button
              key={pagina.id}
              onClick={() => {
                const seccion = document.getElementById(pagina.slug);
                if (seccion) {
                  seccion.scrollIntoView({ behavior: "smooth" });
                } else {
                  navigate(`/#${pagina.slug}`);
                }
              }}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#94a3b8",
                fontSize: "13px",
                fontWeight: 600,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                padding: 0,
                transition: "color 0.2s ease"
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#ffffff"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#94a3b8"}
            >
              {pagina.titulo}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}