import { useEffect, useState, useRef } from "react";
// 1. Importamos el compresor
import imageCompression from "browser-image-compression";

export default function BannerAdmin() {
  const API_URL = import.meta.env.VITE_API_URL;
  const fileInputRef = useRef(null);

  const [banners, setBanners] = useState([]);
  const [bannerEditando, setBannerEditando] = useState(null);
  const [inputEnFoco, setInputEnFoco] = useState("");

  const [nuevoBanner, setNuevoBanner] = useState({
    titulo: "",
    subtitulo: "",
    imagen: "",
    colorInicio: "#0f2a4a",
    colorFin: "#2563eb",
    orden: 0,
  });

  const obtenerBanners = async () => {
    try {
      const res = await fetch(`${API_URL}/banner`);
      const data = await res.json();
      setBanners(data.sort((a, b) => a.orden - b.orden));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    obtenerBanners();
  }, []);

  // 2. Modificamos la función para aplicar compresión antes de subir
  const subirImagen = async (e) => {
    const archivoOriginal = e.target.files[0];
    if (!archivoOriginal) return;

    // Configuración de la compresión
    const opciones = {
      maxSizeMB: 1,            // Tamaño máximo de 1MB
      maxWidthOrHeight: 1920,  // Redimensiona si supera Full HD
      useWebWorker: true,      // Usa hilos de fondo para no congelar la UI
      fileType: "image/jpeg",
    };

    try {
      // Comprimimos el archivo en el navegador del cliente
      const archivoComprimido = await imageCompression(archivoOriginal, opciones);

      const formData = new FormData();
      // Enviamos el archivo ya optimizado al servidor
      formData.append("file", archivoComprimido, archivoOriginal.name);

      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/upload`, {
        method: "POST",
        credentials: "include",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.mensaje || `Error al subir la imagen (${res.status})`);
      }

      const data = await res.json();

      setNuevoBanner((prev) => ({
        ...prev,
        imagen: data.url,
      }));
    } catch (error) {
      console.error("Error al comprimir o subir la imagen:", error);
      alert("Hubo un error al procesar la imagen. Intenta con otra.");
    }
  };

  const crearBanner = async () => {
    if (!nuevoBanner.titulo.trim() && !nuevoBanner.imagen) {
      alert("Por favor, ingresa un título o sube una imagen con el texto de la promoción.");
      return;
    }

    try {
      await fetch(`${API_URL}/banner`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevoBanner),
      });

      cancelarEdicion();
      obtenerBanners();
    } catch (error) {
      console.error(error);
    }
  };

  const quitarImagen = () => {
    setNuevoBanner((prev) => ({ ...prev, imagen: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const editarBanner = (banner) => {
    setBannerEditando(banner.id);

    setNuevoBanner({
      titulo: banner.titulo || "",
      subtitulo: banner.subtitulo || "",
      imagen: banner.imagen || "",
      colorInicio: banner.colorInicio || "#0f2a4a",
      colorFin: banner.colorFin || "#2563eb",
      orden: banner.orden || 0,
    });
    
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const guardarEdicion = async () => {
    try {
      await fetch(`${API_URL}/banner/${bannerEditando}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(nuevoBanner)
      });

      cancelarEdicion();
      obtenerBanners();
    } catch (error) {
      console.error(error);
    }
  };

  const cancelarEdicion = () => {
    setBannerEditando(null);
    setNuevoBanner({
      titulo: "",
      subtitulo: "",
      imagen: "",
      colorInicio: "#0f2a4a",
      colorFin: "#2563eb",
      orden: 0
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const eliminarBanner = async (id) => {
    const confirmar = window.confirm("¿Seguro que deseas eliminar esta promoción?");
    if (!confirmar) return;

    try {
      await fetch(`${API_URL}/banner/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (bannerEditando === id) cancelarEdicion();
      obtenerBanners();
    } catch (error) {
      console.error(error);
    }
  };

  const cambiarActivo = async (id) => {
    try {
      await fetch(`${API_URL}/banner/${id}/activo`, {
        method: "PATCH",
        credentials: "include",
      });
      obtenerBanners();
    } catch (error) {
      console.error(error);
    }
  };

  const obtenerEstiloInput = (nombreInput) => {
    const focusActivo = inputEnFoco === nombreInput;
    return {
      padding: "12px 16px",
      borderRadius: "14px",
      border: focusActivo ? "1px solid #3b82f6" : "1px solid #e2e8f0",
      outline: "none",
      fontSize: "14px",
      color: "#0f172a",
      backgroundColor: focusActivo ? "#ffffff" : "#f8fafc",
      boxShadow: focusActivo ? "0 0 0 4px rgba(59, 130, 246, 0.1)" : "none",
      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
      boxSizing: "border-box",
      width: "100%",
    };
  };

  const botonAccionEstilo = {
    padding: "8px 14px",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    background: "#ffffff",
    color: "#475569",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 600,
    transition: "all 0.2s ease",
  };

  return (
    <div style={{ maxWidth: "1240px", margin: "0 auto", padding: "16px 8px 40px 8px", fontFamily: "Inter, sans-serif" }}>
      
      {/* Encabezado */}
      <header style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 800, margin: 0, color: "#0f172a", letterSpacing: "-0.03em" }}>
          Anuncios & Publicidades
        </h1>
        <p style={{ margin: "6px 0 0 0", color: "#64748b", fontSize: "14px", fontWeight: 500 }}>
          Crea y administra las ofertas dinámicas en el carrusel de tu tienda.
        </p>
      </header>

      {/* Grid de dos columnas */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: "32px", alignItems: "start" }}>
        
        {/* COLUMNA IZQUIERDA: Formulario */}
        <div style={{ background: "#ffffff", padding: "36px", borderRadius: "24px", boxShadow: "0 20px 40px rgba(80, 80, 80, 0.12), 0 1px 3px rgba(0, 0, 0, 0.02)", border: "1px solid #f1f5f9" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 800, margin: "0 0 24px 0", color: "#0f172a", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ color: bannerEditando ? "#eab308" : "#3b82f6", display: "flex" }}>
              {bannerEditando ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              )}
            </span>
            {bannerEditando ? "Editar Anuncio" : "Nuevo Anuncio"}
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>Título Principal</label>
              <input
                type="text"
                placeholder="Ej. 30% OFF en toda la tienda"
                value={nuevoBanner.titulo}
                style={obtenerEstiloInput("titulo")}
                onFocus={() => setInputEnFoco("titulo")}
                onBlur={() => setInputEnFoco("")}
                onChange={(e) => setNuevoBanner({ ...nuevoBanner, titulo: e.target.value })}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>Subtítulo o Detalle</label>
              <input
                type="text"
                placeholder="Ej. Usando el cupón VERANO2026"
                value={nuevoBanner.subtitulo}
                style={obtenerEstiloInput("subtitulo")}
                onFocus={() => setInputEnFoco("subtitulo")}
                onBlur={() => setInputEnFoco("")}
                onChange={(e) => setNuevoBanner({ ...nuevoBanner, subtitulo: e.target.value })}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>Orden de aparición</label>
              <input
                type="number"
                placeholder="0"
                value={nuevoBanner.orden || ""}
                style={obtenerEstiloInput("orden")}
                onFocus={() => setInputEnFoco("orden")}
                onBlur={() => setInputEnFoco("")}
                onChange={(e) => setNuevoBanner({ ...nuevoBanner, orden: Number(e.target.value) })}
              />
            </div>

            {/* Input Imagen Estilizado */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>Imagen de fondo (Opcional - Reemplaza colores)</label>
              <div style={{ position: "relative" }}>
                <input
                  type="file"
                  id="subir-imagen-banner"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={subirImagen}
                  style={{ display: "none" }}
                />
                <label 
                  htmlFor="subir-imagen-banner"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    padding: "12px 16px",
                    borderRadius: "14px",
                    border: "1px dashed #cbd5e1",
                    background: "#f8fafc",
                    color: "#475569",
                    fontSize: "14px",
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#f1f5f9"; e.currentTarget.style.borderColor = "#94a3b8"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.borderColor = "#cbd5e1"; }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                  {nuevoBanner.imagen ? "Cambiar imagen de fondo" : "Subir archivo de imagen"}
                </label>
              </div>
            </div>

            {/* Selectores de Color */}
            <div style={{ display: "flex", gap: "16px", background: "#f8fafc", padding: "14px", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#475569" }}>Color Inicio</label>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <input
                    type="color"
                    value={nuevoBanner.colorInicio}
                    style={{ border: "none", width: "36px", height: "36px", borderRadius: "10px", cursor: "pointer", padding: 0 }}
                    onChange={(e) => setNuevoBanner({ ...nuevoBanner, colorInicio: e.target.value })}
                  />
                  <span style={{ fontSize: "13px", fontFamily: "monospace", color: "#64748b", fontWeight: 600 }}>{nuevoBanner.colorInicio.toUpperCase()}</span>
                </div>
              </div>

              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#475569" }}>Color Fin</label>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <input
                    type="color"
                    value={nuevoBanner.colorFin}
                    style={{ border: "none", width: "36px", height: "36px", borderRadius: "10px", cursor: "pointer", padding: 0 }}
                    onChange={(e) => setNuevoBanner({ ...nuevoBanner, colorFin: e.target.value })}
                  />
                  <span style={{ fontSize: "13px", fontFamily: "monospace", color: "#64748b", fontWeight: 600 }}>{nuevoBanner.colorFin.toUpperCase()}</span>
                </div>
              </div>
            </div>

            {/* LIVE PREVIEW INTEGRADO */}
            <div>
              <label style={{ fontSize: "12px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>Vista previa en vivo</label>
              <div
                style={{
                  marginTop: "6px",
                  position: "relative",
                  padding: "24px",
                  borderRadius: "16px",
                  textAlign: "center",
                  color: "white",
                  minHeight: "110px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  overflow: "hidden",
                  boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.05)",
                  background: !nuevoBanner.imagen 
                    ? `linear-gradient(135deg, ${nuevoBanner.colorInicio} 0%, ${nuevoBanner.colorFin} 100%)` 
                    : "#f1f5f9"
                }}
              >
                {nuevoBanner.imagen && (
                  <>
                    <img 
                      src={nuevoBanner.imagen} 
                      alt="" 
                      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} 
                    />
                    <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(15, 23, 42, 0.4)" }} />
                  </>
                )}
                
                {nuevoBanner.imagen && (
                  <button 
                    type="button" 
                    onClick={quitarImagen} 
                    style={{ position: "absolute", top: "8px", right: "8px", background: "rgba(239, 68, 68, 0.9)", backdropFilter: "blur(4px)", color: "white", border: "none", borderRadius: "50%", width: "22px", height: "22px", cursor: "pointer", fontSize: "10px", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2, boxShadow: "0 2px 6px rgba(0,0,0,0.15)" }}
                  >
                    ✕
                  </button>
                )}

                <div style={{ position: "relative", zIndex: 1 }}>
                  <h4 style={{ margin: 0, fontSize: "16px", fontWeight: 800, textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}>
                    {nuevoBanner.titulo || "Título del Banner"}
                  </h4>
                  {nuevoBanner.subtitulo && (
                    <p style={{ margin: "6px 0 0 0", fontSize: "12px", opacity: 0.9, fontWeight: 500, textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}>
                      {nuevoBanner.subtitulo}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Acciones del Formulario */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <button
                onClick={bannerEditando ? guardarEdicion : crearBanner}
                style={{
                  padding: "14px",
                  background: bannerEditando ? "#eab308" : "#2563eb",
                  color: bannerEditando ? "#0f172a" : "white",
                  border: "none",
                  borderRadius: "14px",
                  fontWeight: "700",
                  fontSize: "14px",
                  cursor: "pointer",
                  boxShadow: bannerEditando ? "0 4px 12px rgba(234,179,8,0.15)" : "0 4px 12px rgba(37,99,235,0.15)",
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                {bannerEditando ? "Guardar Cambios" : "Crear promoción"}
              </button>

              {bannerEditando && (
                <button
                  onClick={cancelarEdicion}
                  style={{
                    padding: "12px",
                    background: "transparent",
                    color: "#64748b",
                    border: "1px solid #cbd5e1",
                    borderRadius: "14px",
                    fontWeight: "600",
                    fontSize: "13px",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.color = "#0f172a"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#64748b"; }}
                >
                  Cancelar Edición
                </button>
              )}
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: Lista */}
        <div>
          <h2 style={{ fontSize: "18px", fontWeight: 800, margin: "0 0 24px 0", color: "#0f172a", display: "flex", alignItems: "center", gap: "10px" }}>
            <span>Anuncios Registrados</span>
            <span style={{ fontSize: "12px", background: "rgba(59, 130, 246, 0.11)", padding: "4px 10px", borderRadius: "20px", color: "#2563eb", fontWeight: 700 }}>
              {banners.length}
            </span>
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {banners.length === 0 ? (
              <div style={{ textAlign: "center", padding: "48px 24px", background: "#ffffff", borderRadius: "24px", color: "#94a3b8", fontWeight: 500, boxShadow: "0 10px 30px rgba(0,0,0,0.05)", border: "1px solid #f1f5f9" }}>
                No hay promociones creadas todavía.
              </div>
            ) : (
              banners.map((banner) => (
                <div
                  key={banner.id}
                  style={{
                    background: "#ffffff",
                    padding: "20px",
                    borderRadius: "20px",
                    boxShadow: "0 10px 25px rgba(15, 23, 42, 0.05)",
                    border: bannerEditando === banner.id ? "2px solid #eab308" : "1px solid #f1f5f9",
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                    transition: "all 0.2s"
                  }}
                >
                  {/* Preview en lista */}
                  <div
                    style={{
                      padding: "24px",
                      borderRadius: "14px",
                      color: "white",
                      position: "relative",
                      minHeight: "95px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      overflow: "hidden",
                      background: !banner.imagen 
                        ? `linear-gradient(135deg, ${banner.colorInicio} 0%, ${banner.colorFin} 100%)` 
                        : "#f1f5f9"
                    }}
                  >
                    {banner.imagen && (
                      <>
                        <img 
                          src={banner.imagen} 
                          alt="" 
                          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} 
                        />
                        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(15, 23, 42, 0.4)" }} />
                      </>
                    )}
                    <div style={{ position: "relative", zIndex: 1 }}>
                      <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 800, textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}>
                        {banner.titulo}
                      </h3>
                      {banner.subtitulo && (
                        <p style={{ margin: "4px 0 0 0", fontSize: "12px", opacity: 0.9, textShadow: "0 2px 4px rgba(0,0,0,0.3)", fontWeight: 500 }}>
                          {banner.subtitulo}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Info y Estado */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f1f5f9", paddingTop: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span style={{ fontSize: "12px", fontWeight: 500, color: "#64748b" }}>Posición: <strong style={{ color: "#0f172a" }}>{banner.orden}</strong></span>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 700,
                          padding: "4px 10px",
                          borderRadius: "20px",
                          textTransform: "uppercase",
                          background: banner.activo ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                          color: banner.activo ? "#16a34a" : "#dc2626",
                        }}
                      >
                        {banner.activo ? "• Visible" : "• Oculto"}
                      </span>
                    </div>

                    {/* Botones */}
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => editarBanner(banner)}
                        style={{ ...botonAccionEstilo, borderColor: "#eab308", color: "#d97706", background: "rgba(234, 179, 8, 0.02)" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "#eab308"; e.currentTarget.style.color = "#0f172a"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(234, 179, 8, 0.02)"; e.currentTarget.style.color = "#d97706"; }}
                      >
                        Editar
                      </button>

                      <button
                        onClick={() => cambiarActivo(banner.id)}
                        style={botonAccionEstilo}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "#f1f5f9"; e.currentTarget.style.color = "#0f172a"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "#ffffff"; e.currentTarget.style.color = "#475569"; }}
                      >
                        {banner.activo ? "Ocultar" : "Mostrar"}
                      </button>
                      
                      <button
                        onClick={() => eliminarBanner(banner.id)}
                        style={{ ...botonAccionEstilo, borderColor: "rgba(239, 68, 68, 0.2)", color: "#ef4444", background: "rgba(239, 68, 68, 0.02)" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "#ef4444"; e.currentTarget.style.color = "white"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(239, 68, 68, 0.02)"; e.currentTarget.style.color = "#ef4444"; }}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}