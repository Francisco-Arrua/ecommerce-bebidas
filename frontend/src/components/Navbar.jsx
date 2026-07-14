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
  
  // Estado para el menú móvil
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);
  
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

  // Función para obtener las iniciales del usuario (Ej: "Francisco Silva" -> "FS")
  const obtenerIniciales = (nombreCompleto) => {
    if (!nombreCompleto) return "";
    const partes = nombreCompleto.trim().split(/\s+/);
    if (partes.length >= 2) {
      return (partes[0][0] + partes[1][0]).toUpperCase();
    }
    return partes[0].slice(0, 2).toUpperCase();
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

  useEffect(() => {
    const manejarScroll = () => {
      const currentScrollY = window.scrollY;

      if (Math.abs(currentScrollY - lastScrollY.current) < 5) return;

      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        setOcultarNavbar(true);
        setMostrarCategorias(false);
        setMostrarPerfil(false);
        setMenuMovilAbierto(false);
      } else {
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
        transform: ocultarNavbar ? "translate3d(0, -100%, 0)" : "translate3d(0, 0, 0)",
        transition: "transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {/* Estilos CSS dinámicos */}
      <style>{`
        .nav-desktop {
          display: flex !important;
        }
        .btn-menu-movil {
          display: none !important;
        }
        .buscador-wrapper {
          flex: 1;
          max-width: 520px;
        }
        .logo-tienda {
          display: block;
        }
        .menu-movil-dropdown {
          display: none;
        }
        @media (max-width: 768px) {
          .nav-desktop {
            display: none !important;
          }
          .btn-menu-movil {
            display: flex !important;
          }
          .logo-tienda {
            display: none !important; /* Oculta el nombre de la tienda en móviles */
          }
          .buscador-wrapper {
            max-width: 100% !important;
            order: 3; /* Pasa al segundo renglón en móvil */
            width: 100%;
          }
          .header-grid {
            flex-wrap: wrap;
            gap: 16px !important;
            justify-content: flex-end !important; /* Empuja los botones a la derecha si no está el logo */
          }
          .menu-movil-dropdown {
            display: ${menuMovilAbierto ? "flex" : "none"};
            flex-direction: column;
            gap: 16px;
            padding: 16px 0;
            border-top: 1px solid rgba(255, 255, 255, 0.06);
            margin-top: 12px;
          }
        }
      `}</style>

      <div 
        style={{ 
          maxWidth: "1400px", 
          margin: "0 auto", 
          padding: "16px 24px 12px 24px",
        }}
      >
        
        {/* PARTE SUPERIOR */}
        <div className="header-grid" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "32px" }}>
          
          {/* Logo / Nombre de Tienda */}
          <Link to="/" className="logo-tienda" style={{ textDecoration: "none", color: "#ffffff" }}>
            <h2 style={{ margin: 0, fontSize: "22px", fontWeight: 900, letterSpacing: "-0.05em", textTransform: "uppercase" }}>
              {configuracion?.nombreTienda || "Tienda"}
            </h2>
          </Link>

          {/* Barra de búsqueda (mantiene bordes rectos de 0px) */}
          <div className="buscador-wrapper" style={{ position: "relative", display: "flex", alignItems: "center" }}>
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

          {/* CONTENEDOR DE BOTONES (Carrito, Perfil, Hamburguesa) */}
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
                  borderRadius: "0px",
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
                  padding: usuario ? "0 14px" : "0",
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
                {/* Ahora muestra únicamente las iniciales de manera compacta */}
                {usuario && (
                  <span style={{ color: "#ffffff", fontSize: "13px", fontWeight: 700, letterSpacing: "0.05em" }}>
                    {obtenerIniciales(usuario.nombre)}
                  </span>
                )}
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
                        onClick={() => { navigate("/perfil/cambiar-password"); setMostrarPerfil(false); }}
                        style={{ padding: "12px 20px", cursor: "pointer", fontSize: "13px", fontWeight: 600, color: "#a1a1aa", transition: "all 0.2s" }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.06)"; e.currentTarget.style.color = "#ffffff"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#a1a1aa"; }}
                      >
                        CAMBIAR CONTRASEÑA
                      </div>

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

            {/* BOTÓN HAMBURGUESA (Móviles) */}
            <button
              className="btn-menu-movil"
              onClick={() => setMenuMovilAbierto(!menuMovilAbierto)}
              style={{
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
                width: "44px",
                height: "44px",
                borderRadius: "0px",
                cursor: "pointer",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s"
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2">
                {menuMovilAbierto ? (
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" />
                )}
              </svg>
            </button>

          </div>
        </div>

        {/* PARTE INFERIOR: Navegación de Escritorio */}
        <nav 
          className="nav-desktop"
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

          {/* Menú Desplegable Categorías */}
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

          {/* Páginas Dinámicas */}
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

        {/* MENÚ MÓVIL DESPLEGABLE */}
        <div className="menu-movil-dropdown">
          <Link 
            to="/" 
            onClick={() => setMenuMovilAbierto(false)}
            style={{ textDecoration: "none", color: "#94a3b8", fontSize: "14px", fontWeight: 600, textTransform: "uppercase" }}
          >
            Inicio
          </Link>
          <Link 
            to="/promociones" 
            onClick={() => setMenuMovilAbierto(false)}
            style={{ textDecoration: "none", color: "#94a3b8", fontSize: "14px", fontWeight: 600, textTransform: "uppercase" }}
          >
            Promos
          </Link>

          {/* Categorías en menú móvil */}
          {categorias.length > 0 && (
            <div>
              <span 
                onClick={() => setMostrarCategorias(!mostrarCategorias)}
                style={{ color: "#ffffff", fontSize: "14px", fontWeight: 600, textTransform: "uppercase", display: "flex", gap: "6px", cursor: "pointer" }}
              >
                Categorías
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: mostrarCategorias ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}><polyline points="6 9 12 15 18 9"></polyline></svg>
              </span>
              
              {mostrarCategorias && (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", paddingLeft: "16px", marginTop: "10px" }}>
                  {esCategoriaUnica
                    ? subcategorias.map((sub) => (
                        <span 
                          key={sub.id} 
                          onClick={() => { navigate(`/categoria/${sub.id}`); setMenuMovilAbierto(false); }}
                          style={{ color: "#a1a1aa", fontSize: "13px", cursor: "pointer" }}
                        >
                          {sub.nombre.toUpperCase()}
                        </span>
                      ))
                    : categorias.map((cat) => (
                        <span 
                          key={cat.id} 
                          onClick={() => { navigate(`/categoria/${cat.id}`); setMenuMovilAbierto(false); }}
                          style={{ color: "#a1a1aa", fontSize: "13px", cursor: "pointer" }}
                        >
                          {cat.nombre.toUpperCase()}
                        </span>
                      ))
                  }
                </div>
              )}
            </div>
          )}

          {/* Páginas Dinámicas en móvil */}
          {paginas.map((pagina) => (
            <button
              key={pagina.id}
              onClick={() => {
                setMenuMovilAbierto(false);
                const seccion = document.getElementById(pagina.slug);
                if (seccion) {
                  seccion.scrollIntoView({ behavior: "smooth" });
                } else {
                  navigate(`/#${pagina.slug}`);
                }
              }}
              style={{ background: "none", border: "none", textAlign: "left", cursor: "pointer", color: "#94a3b8", fontSize: "14px", fontWeight: 600, textTransform: "uppercase", padding: 0 }}
            >
              {pagina.titulo}
            </button>
          ))}
        </div>

      </div>
    </header>
  );
}