import { useEffect, useState } from "react";
// import imageCompression from "browser-image-compression";

export default function HeroAdmin() {
  const [slides, setSlides] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  
  // Estado para la creación
  const [formData, setFormData] = useState({
    titulo: "",
    subtitulo: "",
    textoBoton: "",
    linkBoton: "",
    imagen: "",
    orden: 0,
  });

  // Estado para la edición
  const [editForm, setEditForm] = useState({
    titulo: "",
    subtitulo: "",
    textoBoton: "",
    linkBoton: "",
    imagen: "",
    orden: 0,
  });

  // Estado para feedback visual de carga de imágenes
  const [subiendoForm, setSubiendoForm] = useState(false);
  const [subiendoEdit, setSubiendoEdit] = useState(false);

  const obtenerSlides = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/hero`);
      const data = await res.json();
      setSlides(data.sort((a, b) => a.orden - b.orden));
    } catch (error) {
      console.error("Error al obtener portadas:", error);
    }
  };

  useEffect(() => {
    obtenerSlides();
  }, []);

  const crearSlide = async (e) => {
    if (e) e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/hero`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Error al crear la portada");

      setFormData({
        titulo: "",
        subtitulo: "",
        textoBoton: "",
        linkBoton: "",
        imagen: "",
        orden: 0,
      });

      obtenerSlides();
    } catch (error) {
      console.error(error);
      alert("No se pudo crear la portada. Revisa la consola.");
    }
  };

  const comenzarEdicion = (slide) => {
    setEditandoId(slide.id);
    setEditForm({
      titulo: slide.titulo || "",
      subtitulo: slide.subtitulo || "",
      textoBoton: slide.textoBoton || "",
      linkBoton: slide.linkBoton || "",
      imagen: slide.imagen || "",
      orden: slide.orden || 0,
    });
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setEditForm({
      titulo: "",
      subtitulo: "",
      textoBoton: "",
      linkBoton: "",
      imagen: "",
      orden: 0,
    });
  };

  const guardarEdicion = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/hero/${editandoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editForm),
      });

      if (!res.ok) throw new Error("Error al guardar cambios");

      setEditandoId(null);
      obtenerSlides();
    } catch (error) {
      console.error(error);
      alert("No se pudieron guardar los cambios.");
    }
  };

  const eliminarSlide = async (id) => {
    if (!confirm("¿Eliminar slide?")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/hero/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error al eliminar");
      obtenerSlides();
    } catch (error) {
      console.error(error);
    }
  };

  const cambiarActivo = async (id) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/hero/${id}/activo`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("Error al cambiar estado");
      obtenerSlides();
    } catch (error) {
      console.error(error);
    }
  };

  // Función utilizando la librería browser-image-compression
// Función modificada para subir original, con la compresión comentada para el futuro
  const subirImagenHero = async (e, esEdicion = false) => {
    const archivo = e.target.files[0];
    if (!archivo) return;

    // Activamos spinner de carga correspondiente
    if (esEdicion) setSubiendoEdit(true);
    else setSubiendoForm(true);

    try {
      /* =======================================================================
         COMPRESIÓN DE IMÁGENES
         Para volver a activar la compresión en el futuro, descomentá este bloque
         y usá "archivoProcesado" en el FormData en lugar de "archivo".
         ======================================================================= */
      /*
      const opcionesCompresion = {
        maxSizeMB: 0.3,            // Máximo 300 KB
        maxWidthOrHeight: 1920,    // Redimensionar a Full HD
        useWebWorker: true,
        fileType: "image/jpeg"
      };
      console.log(`Tamaño original: ${(archivo.size / 1024 / 1024).toFixed(2)} MB`);
      const archivoProcesado = await imageCompression(archivo, opcionesCompresion);
      console.log(`Tamaño comprimido: ${(archivoProcesado.size / 1024 / 1024).toFixed(2)} MB`);
      */
      /* ======================================================================= */

      // Actualmente sube el archivo original para mantener el 100% de la calidad visual
      const archivoParaSubir = archivo; // <-- Si descomentás lo de arriba, cambiá "archivo" por "archivoProcesado"

      const formDataImagen = new FormData();
      formDataImagen.append("file", archivoParaSubir);

      // Subir al backend
      const res = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
        method: "POST",
        body: formDataImagen,
      });

      if (!res.ok) throw new Error("Error al subir archivo");
      const data = await res.json();

      if (esEdicion) {
        setEditForm((prev) => ({
          ...prev,
          imagen: data.url,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          imagen: data.url,
        }));
      }
    } catch (error) {
      console.error("Error al subir imagen:", error);
      alert("Hubo un problema al subir la imagen.");
    } finally {
      if (esEdicion) setSubiendoEdit(false);
      else setSubiendoForm(false);
    }
  };

  // Base estética unificada para inputs
  const inputEstiloBase = {
    padding: "12px 16px",
    borderRadius: "14px",
    border: "1px solid #e2e8f0",
    outline: "none",
    fontSize: "14px",
    color: "#0f172a",
    backgroundColor: "#f8fafc",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    boxSizing: "border-box",
    width: "100%",
  };

  const manejarFocusInput = (e) => {
    e.currentTarget.style.borderColor = "#3b82f6";
    e.currentTarget.style.backgroundColor = "#ffffff";
    e.currentTarget.style.boxShadow = "0 0 0 4px rgba(59, 130, 246, 0.1)";
  };

  const manejarBlurInput = (e) => {
    e.currentTarget.style.borderColor = "#e2e8f0";
    e.currentTarget.style.backgroundColor = "#f8fafc";
    e.currentTarget.style.boxShadow = "none";
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
        <h1 style={{ fontSize: "26px", fontWeight: 800, margin: 0, color: "#0b0b0b", letterSpacing: "-0.03em" }}>
          Gestión de Portadas
        </h1>
        <p style={{ margin: "6px 0 0 0", color: "#64748b", fontSize: "14px", fontWeight: 500 }}>
          Diseña y administra los banners dinámicos (Hero Carousel) de la pantalla principal.
        </p>
      </header>

      {/* Grid de dos columnas */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: "32px", alignItems: "start" }}>
        
        {/* COLUMNA IZQUIERDA: Crear Slide */}
        <div style={{ background: "#ffffff", padding: "36px", borderRadius: "24px", boxShadow: "0 10px 20px rgba(98, 98, 98, 0.15), 0 1px 3px rgba(0, 0, 0, 0.05)" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 800, margin: "0 0 24px 0", color: "#0f172a", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ color: "#3b82f6", display: "flex" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </span>
            Nueva Portada
          </h2>

          <form onSubmit={crearSlide} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>Título de Portada</label>
              <input
                type="text"
                placeholder="Ej. Nueva Colección de Invierno 2026"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                required
                style={inputEstiloBase}
                onFocus={manejarFocusInput}
                onBlur={manejarBlurInput}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>Subtítulo / Descripción</label>
              <textarea
                placeholder="Ingresa un texto descriptivo que acompañe al título..."
                value={formData.subtitulo}
                onChange={(e) => setFormData({ ...formData, subtitulo: e.target.value })}
                style={{ ...inputEstiloBase, minHeight: "80px", fontFamily: "inherit", resize: "vertical" }}
                onFocus={manejarFocusInput}
                onBlur={manejarBlurInput}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>Texto del Botón</label>
                <input
                  type="text"
                  placeholder="Ej. Ver Ofertas"
                  value={formData.textoBoton}
                  onChange={(e) => setFormData({ ...formData, textoBoton: e.target.value })}
                  style={inputEstiloBase}
                  onFocus={manejarFocusInput}
                  onBlur={manejarBlurInput}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>Posición / Orden</label>
                <input
                  type="number"
                  placeholder="0"
                  value={formData.orden || ""}
                  onChange={(e) => setFormData({ ...formData, orden: Number(e.target.value) })}
                  required
                  style={inputEstiloBase}
                  onFocus={manejarFocusInput}
                  onBlur={manejarBlurInput}
                />
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>Enlace del Botón (Destino URL)</label>
              <input
                type="text"
                placeholder="Ej. /productos?categoria=invierno"
                value={formData.linkBoton}
                onChange={(e) => setFormData({ ...formData, linkBoton: e.target.value })}
                style={inputEstiloBase}
                onFocus={manejarFocusInput}
                onBlur={manejarBlurInput}
              />
            </div>

            {/* Input File Estilizado Custom */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>Imagen Principal del Hero</label>
              <div style={{ position: "relative" }}>
                <input
                  type="file"
                  id="subir-imagen-hero-form"
                  accept="image/*"
                  onChange={(e) => subirImagenHero(e, false)}
                  style={{ display: "none" }}
                  disabled={subiendoForm}
                />
                <label 
                  htmlFor="subir-imagen-hero-form"
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
                    cursor: subiendoForm ? "not-allowed" : "pointer",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => { 
                    if (!subiendoForm) {
                      e.currentTarget.style.background = "#f1f5f9"; 
                      e.currentTarget.style.borderColor = "#94a3b8"; 
                    }
                  }}
                  onMouseLeave={(e) => { 
                    if (!subiendoForm) {
                      e.currentTarget.style.background = "#f8fafc"; 
                      e.currentTarget.style.borderColor = "#cbd5e1"; 
                    }
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                  {subiendoForm ? "Comprimiendo y subiendo..." : formData.imagen ? "Cambiar imagen seleccionada" : "Subir archivo de imagen"}
                </label>
              </div>
            </div>

            {/* LIVE PREVIEW INTEGRADO */}
            <div>
              <label style={{ fontSize: "12px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>Vista previa de portada</label>
              <div
                style={{
                  marginTop: "6px",
                  position: "relative",
                  padding: "24px",
                  borderRadius: "16px",
                  color: "white",
                  minHeight: "130px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  textAlign: "left",
                  overflow: "hidden",
                  background: "#0f172a",
                  boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.05)"
                }}
              >
                {formData.imagen ? (
                  <>
                    <img 
                      src={formData.imagen} 
                      alt="" 
                      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} 
                    />
                    <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "linear-gradient(90deg, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.3) 100%)" }} />
                  </>
                ) : (
                  <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(30, 41, 59, 0.5)", color: "#64748b", fontSize: "12px" }}>Falta subir una imagen de fondo</div>
                )}
                
                {formData.imagen && (
                  <button type="button" onClick={() => setFormData({ ...formData, imagen: "" })} style={{ position: "absolute", top: "8px", right: "8px", background: "rgba(239, 68, 68, 0.9)", backdropFilter: "blur(4px)", color: "white", border: "none", borderRadius: "50%", width: "22px", height: "22px", cursor: "pointer", fontSize: "10px", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2 }}>✕</button>
                )}

                <div style={{ position: "relative", zIndex: 1, maxWidth: "80%" }}>
                  <h4 style={{ margin: 0, fontSize: "15px", fontWeight: 800, textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>
                    {formData.titulo || "Título del Hero"}
                  </h4>
                  {formData.subtitulo && (
                    <p style={{ margin: "4px 0 0 0", fontSize: "11px", opacity: 0.85, fontWeight: 400, textShadow: "0 2px 4px rgba(0,0,0,0.5)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {formData.subtitulo}
                    </p>
                  )}
                  {formData.textoBoton && (
                    <span style={{ display: "inline-block", marginTop: "10px", padding: "6px 12px", background: "#2563eb", color: "white", borderRadius: "8px", fontSize: "10px", fontWeight: 700, textTransform: "uppercase" }}>
                      {formData.textoBoton}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={subiendoForm}
              style={{
                marginTop: "4px",
                padding: "14px",
                background: subiendoForm ? "#94a3b8" : "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "14px",
                fontWeight: "600",
                fontSize: "14px",
                cursor: subiendoForm ? "not-allowed" : "pointer",
                boxShadow: "0 4px 12px rgba(37,99,235,0.15)",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => { if (!subiendoForm) e.currentTarget.style.opacity = "0.9"; }}
              onMouseLeave={(e) => { if (!subiendoForm) e.currentTarget.style.opacity = "1"; }}
            >
              Crear Portada Hero
            </button>
          </form>
        </div>

        {/* COLUMNA DERECHA: Lista de Portadas Existentes */}
        <div>
          <h2 style={{ fontSize: "18px", fontWeight: 800, margin: "0 0 24px 0", color: "#0d0d0d", display: "flex", alignItems: "center", gap: "10px" }}>
            <span>Portadas Registradas</span>
            <span style={{ fontSize: "12px", background: "rgba(59, 130, 246, 0.15)", padding: "4px 10px", borderRadius: "20px", color: "#3b82f6", fontWeight: 700 }}>
              {slides.length}
            </span>
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {slides.length === 0 ? (
              <div style={{ textAlign: "center", padding: "48px 24px", background: "#ffffff", borderRadius: "24px", color: "#94a3b8", fontWeight: 500, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
                No hay portadas principales creadas todavía.
              </div>
            ) : (
              slides.map((slide) => (
                <div
                  key={slide.id}
                  style={{
                    background: "#ffffff",
                    padding: "20px",
                    borderRadius: "20px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                    border: "1px solid #f1f5f9"
                  }}
                >
                  {/* Vista de Tarjeta */}
                  <div
                    style={{
                      padding: "24px",
                      borderRadius: "14px",
                      color: "white",
                      position: "relative",
                      minHeight: "100px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      overflow: "hidden",
                      background: "#0f172a"
                    }}
                  >
                    {slide.imagen && (
                      <>
                        <img 
                          src={slide.imagen} 
                          alt="" 
                          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} 
                        />
                        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "linear-gradient(90deg, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.3) 100%)" }} />
                      </>
                    )}
                    <div style={{ position: "relative", zIndex: 1, maxWidth: "85%" }}>
                      <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, textShadow: "0 2px 4px rgba(0,0,0,0.4)" }}>
                        {slide.titulo}
                      </h3>
                      {slide.subtitulo && (
                        <p style={{ margin: "4px 0 0 0", fontSize: "12px", opacity: 0.85, textShadow: "0 2px 4px rgba(0,0,0,0.4)", fontWeight: 400, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                          {slide.subtitulo}
                        </p>
                      )}
                      {slide.textoBoton && (
                        <div style={{ marginTop: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ padding: "4px 10px", background: "#2563eb", borderRadius: "6px", fontSize: "10px", fontWeight: 700, textTransform: "uppercase" }}>{slide.textoBoton}</span>
                          <code style={{ fontSize: "11px", opacity: 0.7, color: "#93c5fd" }}>{slide.linkBoton || "/"}</code>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Fila de Estados y Controles */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f1f5f9", paddingTop: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span style={{ fontSize: "12px", fontWeight: 500, color: "#64748b" }}>Orden: <strong style={{ color: "#0f172a" }}>{slide.orden}</strong></span>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 700,
                          padding: "4px 10px",
                          borderRadius: "20px",
                          textTransform: "uppercase",
                          background: slide.activo ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                          color: slide.activo ? "#16a34a" : "#dc2626",
                        }}
                      >
                        {slide.activo ? "• Visible" : "• Oculto"}
                      </span>
                    </div>

                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => cambiarActivo(slide.id)}
                        style={botonAccionEstilo}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "#f1f5f9"; e.currentTarget.style.color = "#0f172a"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "#ffffff"; e.currentTarget.style.color = "#475569"; }}
                      >
                        {slide.activo ? "Ocultar" : "Mostrar"}
                      </button>
                      
                      <button
                        onClick={() => comenzarEdicion(slide)}
                        style={{ ...botonAccionEstilo, background: "#0f172a", color: "#ffffff", borderColor: "#0f172a" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "#1e293b"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "#0f172a"; }}
                      >
                        Editar
                      </button>

                      <button
                        onClick={() => eliminarSlide(slide.id)}
                        style={{ ...botonAccionEstilo, borderColor: "rgba(239, 68, 68, 0.2)", color: "#ef4444", background: "rgba(239, 68, 68, 0.02)" }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#ef4444";
                          e.currentTarget.style.color = "white";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "rgba(239, 68, 68, 0.02)";
                          e.currentTarget.style.color = "#ef4444";
                        }}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>

                  {/* Formulario Inline Desplegable para Editar */}
                  {editandoId === slide.id && (
                    <div style={{ marginTop: "8px", paddingTop: "20px", borderTop: "1px dashed #e2e8f0", display: "flex", flexDirection: "column", gap: "14px" }}>
                      <h4 style={{ margin: 0, fontSize: "14px", color: "#0f172a", fontWeight: 700 }}>Editar Propiedades de Portada</h4>
                      
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                        <input value={editForm.titulo} onChange={(e) => setEditForm({ ...editForm, titulo: e.target.value })} placeholder="Título" style={inputEstiloBase} onFocus={manejarFocusInput} onBlur={manejarBlurInput} />
                        <input type="number" value={editForm.orden || ""} onChange={(e) => setEditForm({ ...editForm, orden: Number(e.target.value) })} placeholder="Orden" style={inputEstiloBase} onFocus={manejarFocusInput} onBlur={manejarBlurInput} />
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                        <input value={editForm.textoBoton} onChange={(e) => setEditForm({ ...editForm, textoBoton: e.target.value })} placeholder="Texto Botón" style={inputEstiloBase} onFocus={manejarFocusInput} onBlur={manejarBlurInput} />
                        <input value={editForm.linkBoton} onChange={(e) => setEditForm({ ...editForm, linkBoton: e.target.value })} placeholder="Link Botón" style={inputEstiloBase} onFocus={manejarFocusInput} onBlur={manejarBlurInput} />
                      </div>

                      <textarea value={editForm.subtitulo} onChange={(e) => setEditForm({ ...editForm, subtitulo: e.target.value })} placeholder="Subtítulo o descripción..." style={{ ...inputEstiloBase, minHeight: "70px", fontFamily: "inherit" }} onFocus={manejarFocusInput} onBlur={manejarBlurInput} />

                      {/* Input de Reemplazo de Imagen en Edición */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <label style={{ fontSize: "12px", fontWeight: 600, color: "#475569" }}>Reemplazar imagen de fondo:</label>
                        <div style={{ position: "relative" }}>
                          <input
                            type="file"
                            id={`editar-imagen-hero-${slide.id}`}
                            accept="image/*"
                            onChange={(e) => subirImagenHero(e, true)}
                            style={{ display: "none" }}
                            disabled={subiendoEdit}
                          />
                          <label 
                            htmlFor={`editar-imagen-hero-${slide.id}`}
                            style={{ 
                              display: "flex", 
                              alignItems: "center", 
                              justifyContent: "center", 
                              gap: "8px", 
                              padding: "10px 14px", 
                              borderRadius: "10px", 
                              border: "1px dashed #cbd5e1", 
                              background: "#f8fafc", 
                              color: "#475569", 
                              fontSize: "13px", 
                              cursor: subiendoEdit ? "not-allowed" : "pointer" 
                            }}
                          >
                            {subiendoEdit ? "Comprimiendo y subiendo..." : "Subir nueva imagen"}
                          </label>
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "4px" }}>
                        <button onClick={cancelarEdicion} style={botonAccionEstilo}>Cancelar</button>
                        <button onClick={guardarEdicion} disabled={subiendoEdit} style={{ ...botonAccionEstilo, background: subiendoEdit ? "#94a3b8" : "#3b82f6", color: "white", border: "none" }}>
                          Guardar Cambios
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}