import { useEffect, useState } from "react";
// 1. Importamos la librería de compresión
import imageCompression from "browser-image-compression";

export default function PaginasAdmin() {
  const [paginas, setPaginas] = useState([]);
  const [editandoId, setEditandoId] = useState(null);

  const [formulario, setFormulario] = useState({
    titulo: "",
    slug: "",
    contenido: "",
    imagen: "", 
    visibleEnMenu: true,
    orden: 0,
  });

  const API_URL = import.meta.env.VITE_API_URL;

  const obtenerPaginas = async () => {
    try {
      const res = await fetch(`${API_URL}/paginas`);
      const data = await res.json();
      setPaginas(data.sort((a, b) => a.orden - b.orden)); 
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    obtenerPaginas();
  }, []);

  // 2. Modificamos la función para que sea async y comprima la foto
  const subirImagenPagina = async (e) => {
    const archivoOriginal = e.target.files[0];
    if (!archivoOriginal) return;

    // Configuración de compresión (un balance excelente entre peso y calidad)
    const opcionesCompresion = {
      maxSizeMB: 1,           // Máximo 1MB aproximado
      maxWidthOrHeight: 1200,  // Ajusta la resolución si es una foto enorme de celular
      useWebWorker: true,     // Compresión en segundo plano para no trabar la interfaz
      fileType: "image/jpeg",
    };

    let archivoParaSubir = archivoOriginal;

    try {
      console.log(`Peso original: ${(archivoOriginal.size / 1024 / 1024).toFixed(2)} MB`);
      
      // Comprimimos la imagen
      const archivoComprimido = await imageCompression(archivoOriginal, opcionesCompresion);
      archivoParaSubir = archivoComprimido;

      console.log(`Peso comprimido: ${(archivoComprimido.size / 1024 / 1024).toFixed(2)} MB`);
    } catch (errorCompresion) {
      console.warn("No se pudo comprimir la imagen, se subirá en su estado original:", errorCompresion);
      // Si falla, archivoParaSubir se queda con el archivoOriginal como respaldo
    }

    // Preparamos el envío a tu endpoint /upload
    const formDataImagen = new FormData();
    formDataImagen.append("file", archivoParaSubir);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/upload`, {
        method: "POST",
        credentials: "include",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formDataImagen,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.mensaje || `Error al subir la imagen (${res.status})`);
      }

      const data = await res.json();

      setFormulario((prev) => ({
        ...prev,
        imagen: data.url,
      }));
    } catch (error) {
      console.error("Error al subir imagen de sección:", error);
    }
  };

  const guardarPagina = async () => {
    if (!formulario.titulo.trim()) {
      alert("Por favor, ingresa un título para la sección.");
      return;
    }

    const cuerpoPeticion = {
      ...formulario,
      orden: Number(formulario.orden) || 0,
      imagen: formulario.imagen.trim() === "" ? null : formulario.imagen, 
    };

    try {
      if (editandoId) {
        const res = await fetch(`${API_URL}/paginas/${editandoId}`, {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cuerpoPeticion),
        });
        if (!res.ok) throw new Error("Error al actualizar la página");
      } else {
        const res = await fetch(`${API_URL}/paginas`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cuerpoPeticion),
        });
        if (!res.ok) throw new Error("Error al crear la página");
      }

      setFormulario({
        titulo: "",
        slug: "",
        contenido: "",
        imagen: "",
        visibleEnMenu: true,
        orden: 0,
      });

      setEditandoId(null);
      obtenerPaginas();
    } catch (error) {
      console.error("Error en la operación:", error);
    }
  };

  const editarPagina = (pagina) => {
    setFormulario({
      titulo: pagina.titulo || "",
      slug: pagina.slug || "",
      contenido: pagina.contenido || "",
      imagen: pagina.imagen || "", 
      visibleEnMenu: pagina.visibleEnMenu ?? true,
      orden: pagina.orden || 0,
    });
    setEditandoId(pagina.id);
  };

  const eliminarPagina = async (id) => {
    const confirmar = window.confirm("¿Seguro que deseas eliminar esta página?");
    if (!confirmar) return;

    try {
      await fetch(`${API_URL}/paginas/${id}`, { method: "DELETE", credentials: "include" });
      obtenerPaginas();
    } catch (error) {
      console.error(error);
    }
  };

  // Base de inputs unificada
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
      
      {/* Encabezado integrado */}
      <header style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "26px", fontWeight: 800, margin: 0, color: "#0a0a0a", letterSpacing: "-0.03em" }}>
          Gestión de Secciones
        </h1>
        <p style={{ margin: "6px 0 0 0", color: "#64748b", fontSize: "14px", fontWeight: 500 }}>
          Crea, edita y organiza las secciones dinámicas de tu sitio web.
        </p>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: "32px", alignItems: "start" }}>
        
        {/* COLUMNA IZQUIERDA: Formulario */}
        <div style={{ background: "#ffffff", padding: "36px", borderRadius: "24px", boxShadow: "0 10px 20px rgba(98, 98, 98, 0.4), 0 1px 3px rgba(255, 255, 255, 0.05)" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 800, margin: "0 0 24px 0", color: "#0f172a", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ color: "#3b82f6", display: "flex" }}>
              {editandoId ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              )}
            </span>
            {editandoId ? "Editar Sección" : "Nueva Sección"}
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>Título</label>
              <input
                type="text"
                placeholder="Ej. Quiénes Somos"
                value={formulario.titulo}
                style={inputEstiloBase}
                onFocus={manejarFocusInput}
                onBlur={manejarBlurInput}
                onChange={(e) => {
                  const titulo = e.target.value;
                  const slug = titulo
                    .toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .replace(/\s+/g, "-")
                    .replace(/[^a-z0-9-]/g, "");
                  setFormulario({ ...formulario, titulo, slug });
                }}
              />
              {formulario.slug && (
                <span style={{ fontSize: "12px", color: "#3b82f6", fontWeight: 500, marginTop: "4px", display: "inline-block" }}>
                 <span style={{ color: "#64748b" }}>/{formulario.slug}</span>
                </span>
              )}
            </div>

            {/* Input de Imagen Custom */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>Imagen Destacada</label>
              <div style={{ position: "relative" }}>
                <input
                  type="file"
                  id="subir-imagen-pagina"
                  accept="image/*"
                  onChange={subirImagenPagina}
                  style={{ display: "none" }}
                />
                <label 
                  htmlFor="subir-imagen-pagina"
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
                  Subir o cambiar archivo
                </label>
              </div>
              
              {formulario.imagen && (
                <div style={{ position: "relative", width: "100%", height: "140px", borderRadius: "14px", overflow: "hidden", border: "1px solid #e2e8f0", marginTop: "8px" }}>
                  <img src={formulario.imagen} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <button type="button" onClick={() => setFormulario({ ...formulario, imagen: "" })} style={{ position: "absolute", top: "8px", right: "8px", background: "rgba(239, 68, 68, 0.9)", backdropFilter: "blur(4px)", color: "white", border: "none", borderRadius: "50%", width: "24px", height: "24px", cursor: "pointer", fontSize: "11px", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>✕</button>
                </div>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>Contenido</label>
              <textarea
                rows="6"
                placeholder="Escribe el cuerpo de la página aquí..."
                value={formulario.contenido}
                style={{ ...inputEstiloBase, fontFamily: "inherit", resize: "vertical" }}
                onFocus={manejarFocusInput}
                onBlur={manejarBlurInput}
                onChange={(e) => setFormulario({ ...formulario, contenido: e.target.value })}
              />
            </div>

            <div style={{ display: "flex", gap: "24px", alignItems: "center", background: "#f8fafc", padding: "14px", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px", width: "80px" }}>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#475569" }}>Orden</label>
                <input
                  type="number"
                  placeholder="0"
                  value={formulario.orden || ""}
                  style={{ ...inputEstiloBase, padding: "8px 12px" }}
                  onFocus={manejarFocusInput}
                  onBlur={manejarBlurInput}
                  onChange={(e) => setFormulario({ ...formulario, orden: Number(e.target.value) })}
                />
              </div>

              <label style={{ display: "inline-flex", alignItems: "center", gap: "10px", fontSize: "14px", fontWeight: 600, color: "#334155", cursor: "pointer", marginTop: "16px" }}>
                <input
                  type="checkbox"
                  checked={formulario.visibleEnMenu}
                  style={{ width: "18px", height: "18px", cursor: "pointer", accentColor: "#3b82f6" }}
                  onChange={(e) => setFormulario({ ...formulario, visibleEnMenu: e.target.checked })}
                />
                Mostrar en menú
              </label>
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
              <button
                onClick={guardarPagina}
                style={{ flex: 1, padding: "14px", background: editandoId ? "#0284c7" : "#2563eb", color: "white", border: "none", borderRadius: "14px", fontWeight: "600", fontSize: "14px", cursor: "pointer", boxShadow: editandoId ? "0 4px 12px rgba(2,132,199,0.15)" : "0 4px 12px rgba(37,99,235,0.15)", transition: "all 0.2s" }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = "0.9"}
                onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
              >
                {editandoId ? "Actualizar Página" : "Crear Página"}
              </button>

              {editandoId && (
                <button
                  onClick={() => {
                    setEditandoId(null);
                    setFormulario({ titulo: "", slug: "", contenido: "", imagen: "", visibleEnMenu: true, orden: 0 });
                  }}
                  style={{ padding: "14px", background: "#f1f5f9", color: "#475569", border: "none", borderRadius: "14px", fontWeight: "600", fontSize: "14px", cursor: "pointer", transition: "all 0.2s" }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#e2e8f0"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "#f1f5f9"}
                >
                  Cancelar
                </button>
              )}
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: Listado */}
        <div>
          <h2 style={{ fontSize: "18px", fontWeight: 800, margin: "0 0 24px 0", color: "#1a1a1a", display: "flex", alignItems: "center", gap: "10px" }}>
            <span>Secciones Activas</span>
            <span style={{ fontSize: "12px", background: "rgba(59, 130, 246, 0.15)", padding: "4px 10px", borderRadius: "20px", color: "#3b82f6", fontWeight: 700 }}>{paginas.length}</span>
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {paginas.length === 0 ? (
              <div style={{ textAlign: "center", padding: "48px 24px", background: "#ffffff", borderRadius: "24px", color: "#94a3b8", fontWeight: 500, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}>
                No hay páginas creadas todavía.
              </div>
            ) : (
              paginas.map((pagina) => (
                <div key={pagina.id} style={{ background: "#ffffff", padding: "20px", borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.2)", display: "flex", gap: "16px", alignItems: "center" }}>
                  
                  {/* Miniatura del listado */}
                  <div style={{ width: "80px", height: "60px", borderRadius: "12px", overflow: "hidden", background: "#f1f5f9", border: "1px solid #e2e8f0", flexShrink: 0, position: "relative" }}>
                    {pagina.imagen ? (
                      <img src={pagina.imagen} alt="" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#94a3b8", fontSize: "11px", fontWeight: 600 }}>Sin foto</div>
                    )}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px" }}>
                      <div style={{ minWidth: 0 }}>
                        <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 800, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{pagina.titulo}</h3>
                        <span style={{ fontSize: "13px", color: "#64748b", fontFamily: "monospace" }}>/{pagina.slug}</span>
                      </div>
                      <span style={{ fontSize: "11px", fontWeight: 700, padding: "4px 10px", borderRadius: "20px", textTransform: "uppercase", background: pagina.visibleEnMenu ? "rgba(34,197,94,0.1)" : "#f1f5f9", color: pagina.visibleEnMenu ? "#16a34a" : "#64748b", flexShrink: 0 }}>
                        {pagina.visibleEnMenu ? "En menú" : "Oculto"}
                      </span>
                    </div>

                    <div style={{ display: "flex", gap: "20px", fontSize: "13px", color: "#475569", borderTop: "1px solid #f1f5f9", paddingTop: "10px", marginTop: "10px", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "12px", fontWeight: 500, color: "#64748b" }}>Posición: <strong style={{ color: "#0f172a" }}>{pagina.orden}</strong></span>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button onClick={() => editarPagina(pagina)} style={botonAccionEstilo} onMouseEnter={(e) => { e.currentTarget.style.background = "#f1f5f9"; e.currentTarget.style.color = "#0f172a"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "#ffffff"; e.currentTarget.style.color = "#475569"; }}>Editar</button>
                        <button onClick={() => eliminarPagina(pagina.id)} style={{ ...botonAccionEstilo, borderColor: "rgba(239, 68, 68, 0.2)", color: "#ef4444", background: "rgba(239, 68, 68, 0.02)" }} onMouseEnter={(e) => { e.currentTarget.style.background = "#ef4444"; e.currentTarget.style.color = "white"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(239, 68, 68, 0.02)"; e.currentTarget.style.color = "#ef4444"; }}>Eliminar</button>
                      </div>
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