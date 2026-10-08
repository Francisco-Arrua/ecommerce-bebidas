import { useState, useEffect } from "react";
import imageCompression from "browser-image-compression";
import IconoPapelera from "../IconoPapelera";

export default function ColeccionesAdmin() {
  const [colecciones, setColecciones] = useState([]);
  const [productosDisponibles, setProductosDisponibles] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Estado para el buscador de productos
  const [busqueda, setBusqueda] = useState("");

  // Estados para el formulario
  const [nombre, setNombre] = useState("");
  const [subtitulo, setSubtitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState(""); 
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  
  const [subiendoImagen, setSubiendoImagen] = useState(false);

  const cargarDatosAdmin = async () => {
    try {
      const resCol = await fetch(`${import.meta.env.VITE_API_URL}/coleccion`);
      const dataCol = await resCol.json();
      setColecciones(dataCol);

      const resProd = await fetch(`${import.meta.env.VITE_API_URL}/productos`);
      const dataProd = await resProd.json();
      setProductosDisponibles(dataProd);
    } catch (error) {
      console.error("Error al cargar datos de administración:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatosAdmin();
  }, []);

  const manejarSubidaImagen = async (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;

    try {
      setSubiendoImagen(true);

      // Opciones para la compresión de la carátula/portada
      const opcionesCompresion = {
        maxSizeMB: 0.3,            // Limita el peso a un máximo de 300 KB
        maxWidthOrHeight: 1920,    // Redimensiona proporcionalmente si supera Full HD
        useWebWorker: true,
        fileType: "image/jpeg"     // Convierte a JPG para una compresión más eficiente
      };

      console.log(`Tamaño original de carátula: ${(archivo.size / 1024 / 1024).toFixed(2)} MB`);
      
      // Comprimimos la imagen de manera asíncrona
      const archivoComprimido = await imageCompression(archivo, opcionesCompresion);
      
      console.log(`Tamaño comprimido de carátula: ${(archivoComprimido.size / 1024 / 1024).toFixed(2)} MB`);

      const formData = new FormData();
      // Mandamos el archivo ya comprimido al backend
      formData.append("file", archivoComprimido);

      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
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
      setImagen(data.url || data.secure_url); 
    } catch (error) {
      console.error("Error procesando o subiendo imagen:", error);
      alert("No se pudo procesar o subir la imagen.");
    } finally {
      setSubiendoImagen(false);
    }
  };

  const manejarCheckboxProducto = (id) => {
    if (productosSeleccionados.includes(id)) {
      setProductosSeleccionados(productosSeleccionados.filter((pId) => pId !== id));
    } else {
      setProductosSeleccionados([...productosSeleccionados, id]);
    }
  };

  const guardarColeccion = async (e) => {
    e.preventDefault();
    if (subiendoImagen) return alert("Esperá a que la imagen termine de subirse.");

    const url = editandoId
      ? `${import.meta.env.VITE_API_URL}/coleccion/${editandoId}`
      : `${import.meta.env.VITE_API_URL}/coleccion`;

    const method = editandoId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method: method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          subtitulo,
          descripcion,
          imagen,
          productosIds: productosSeleccionados,
        }),
      });

      if (res.ok) {
        setNombre("");
        setSubtitulo("");
        setDescripcion("");
        setImagen("");
        setProductosSeleccionados([]);
        setEditandoId(null);
        setBusqueda("");
        cargarDatosAdmin();
      } else {
        const errData = await res.json();
        alert(`Error: ${errData.mensaje}`);
      }
    } catch (error) {
      console.error("Error al guardar la colección:", error);
    }
  };

  const comenzarEdicion = (col) => {
    setEditandoId(col.id);
    setNombre(col.nombre);
    setSubtitulo(col.subtitulo || "");
    setDescripcion(col.descripcion || "");
    setImagen(col.imagen || "");
    setProductosSeleccionados(col.productos ? col.productos.map((p) => p.id) : []);
  };

  const manejarEliminarColeccion = async (id) => {
    if (!confirm("¿Eliminar esta colección/promoción?")) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/coleccion/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        setColecciones(colecciones.filter((col) => col.id !== id));
      } else {
        const errData = await res.json();
        alert(`Error: ${errData.mensaje}`);
      }
    } catch (error) {
      console.error("Error al eliminar la colección:", error);
    }
  };

  // --- ESTILOS EXTRAÍDOS DE HEROADMIN ---
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

  // Filtrado lógico de productos en base a la búsqueda
  const productosFiltrados = productosDisponibles.filter((prod) => {
    const termino = busqueda.toLowerCase();
    const nombreProd = prod.nombre ? prod.nombre.toLowerCase() : "";
    const marcaProd = prod.marca ? prod.marca.toLowerCase() : "";
    return nombreProd.includes(termino) || marcaProd.includes(termino);
  });

  if (cargando) return <div style={{ padding: "20px", color: "#64748b", fontFamily: "Inter, sans-serif", fontSize: "14px" }}>Cargando panel de control...</div>;

  return (
    <div style={{ maxWidth: "1240px", margin: "0 auto", padding: "16px 8px 40px 8px", fontFamily: "Inter, sans-serif" }}>
      
      {/* Encabezado */}
      <header style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "26px", fontWeight: 800, margin: 0, color: "#0b0b0b", letterSpacing: "-0.03em" }}>
          Gestión de Colecciones
        </h1>
        <p style={{ margin: "6px 0 0 0", color: "#64748b", fontSize: "14px", fontWeight: 500 }}>
          Diseña tus combos comerciales, agrupaciones de productos y promociones destacadas.
        </p>
      </header>

      {/* Grid idéntico a HeroAdmin */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: "32px", alignItems: "start" }}>
        
        {/* COLUMNA IZQUIERDA: Formulario */}
        <div style={{ background: "#ffffff", padding: "36px", borderRadius: "24px", boxShadow: "0 10px 20px rgba(98, 98, 98, 0.4), 0 1px 3px rgba(255, 255, 255, 0.05)" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 800, margin: "0 0 24px 0", color: "#0f172a", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ color: "#3b82f6", display: "flex" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </span>
            {editandoId ? "Editar Propiedades" : "Nueva Colección / Promo"}
          </h2>

          <form onSubmit={guardarColeccion} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>Nombre de la Colección</label>
              <input
                type="text"
                placeholder="Ej. Combo Urbano Invierno"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                style={inputEstiloBase}
                onFocus={manejarFocusInput}
                onBlur={manejarBlurInput}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>Gancho Comercial / Subtítulo</label>
              <input
                type="text"
                placeholder="Ej. 20% OFF o Hot Sale"
                value={subtitulo}
                onChange={(e) => setSubtitulo(e.target.value)}
                style={inputEstiloBase}
                onFocus={manejarFocusInput}
                onBlur={manejarBlurInput}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>Descripción</label>
              <textarea
                placeholder="Breve texto explicando la promo..."
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                style={{ ...inputEstiloBase, minHeight: "80px", fontFamily: "inherit", resize: "vertical" }}
                onFocus={manejarFocusInput}
                onBlur={manejarBlurInput}
              />
            </div>

            {/* Input File Clón del HeroAdmin */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>Imagen de Portada (Carátula)</label>
              <div style={{ position: "relative" }}>
                <input
                  type="file"
                  id="subir-imagen-coleccion-form"
                  accept="image/*"
                  onChange={manejarSubidaImagen}
                  style={{ display: "none" }}
                />
                <label 
                  htmlFor="subir-imagen-coleccion-form"
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
                  {subiendoImagen ? "Procesando y subiendo..." : imagen ? "Cambiar carátula cargada" : "Subir archivo de imagen"}
                </label>
              </div>
            </div>

            {/* Live Preview exacto al del Hero */}
            <div>
              <label style={{ fontSize: "12px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>Vista previa de carátula</label>
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
                {imagen ? (
                  <>
                    <img 
                      src={imagen} 
                      alt="" 
                      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} 
                    />
                    <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "linear-gradient(90deg, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.3) 100%)" }} />
                  </>
                ) : (
                  <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(30, 41, 59, 0.5)", color: "#64748b", fontSize: "12px" }}>Falta subir una imagen de fondo</div>
                )}
                
                {imagen && (
                  <button type="button" onClick={() => setImagen("")} style={{ position: "absolute", top: "8px", right: "8px", background: "rgba(239, 68, 68, 0.9)", backdropFilter: "blur(4px)", color: "white", border: "none", borderRadius: "50%", width: "22px", height: "22px", cursor: "pointer", fontSize: "10px", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2 }}>✕</button>
                )}

                <div style={{ position: "relative", zIndex: 1, maxWidth: "80%" }}>
                  <h4 style={{ margin: 0, fontSize: "15px", fontWeight: 800, textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>
                    {nombre || "Nombre de Colección"}
                  </h4>
                  {subtitulo && (
                    <span style={{ display: "inline-block", marginTop: "6px", padding: "4px 8px", background: "#f97316", color: "white", borderRadius: "6px", fontSize: "10px", fontWeight: 700 }}>
                      {subtitulo}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* SECCIÓN NUEVA: Selección de Productos con Buscador */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>Asignar Productos a la Colección</label>
              
              {/* Buscador Integrado */}
              <input
                type="text"
                placeholder="Buscar producto por nombre o marca..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                style={{ ...inputEstiloBase, padding: "10px 14px", fontSize: "13px", backgroundColor: "#ffffff" }}
                onFocus={manejarFocusInput}
                onBlur={manejarBlurInput}
              />

              {/* Lista Scrolleable Rígida Clean */}
              <div style={{ maxHeight: "180px", overflowY: "auto", border: "1px solid #e2e8f0", padding: "8px", borderRadius: "14px", backgroundColor: "#f8fafc", marginTop: "4px" }}>
                {productosFiltrados.length === 0 ? (
                  <div style={{ fontSize: "12px", color: "#94a3b8", textAlign: "center", padding: "12px" }}>No se encontraron productos</div>
                ) : (
                  productosFiltrados.map((prod) => (
                    <div key={prod.id} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "6px 8px", borderRadius: "8px" }}>
                      <input 
                        type="checkbox" 
                        id={`prod-${prod.id}`} 
                        checked={productosSeleccionados.includes(prod.id)} 
                        onChange={() => manejarCheckboxProducto(prod.id)}
                        style={{ cursor: "pointer", width: "15px", height: "15px" }}
                      />
                      <label htmlFor={`prod-${prod.id}`} style={{ fontSize: "13px", color: "#334155", cursor: "pointer", userSelect: "none" }}>
                        <strong style={{ color: "#64748b" }}>[{prod.marca || "S/M"}]</strong> {prod.nombre} — ${Number(prod.precio).toLocaleString("es-AR")}
                      </label>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Botoneras del Form */}
            <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
              {editandoId && (
                <button 
                  type="button" 
                  onClick={() => { setEditandoId(null); setNombre(""); setSubtitulo(""); setDescripcion(""); setImagen(""); setProductosSeleccionados([]); setBusqueda(""); }} 
                  style={botonAccionEstilo}
                >
                  Cancelar
                </button>
              )}
              <button
                type="submit"
                disabled={subiendoImagen}
                style={{
                  flex: 1,
                  padding: "14px",
                  background: "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: "14px",
                  fontWeight: "600",
                  fontSize: "14px",
                  cursor: subiendoImagen ? "not-allowed" : "pointer",
                  boxShadow: "0 4px 12px rgba(37,99,235,0.15)",
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => { if (!subiendoImagen) e.currentTarget.style.opacity = "0.9"; }}
                onMouseLeave={(e) => { if (!subiendoImagen) e.currentTarget.style.opacity = "1"; }}
              >
                {editandoId ? "Guardar Cambios" : "Crear Colección"}
              </button>
            </div>

          </form>
        </div>

        {/* COLUMNA DERECHA: Lista Indexada */}
        <div>
          <h2 style={{ fontSize: "18px", fontWeight: 800, margin: "0 0 24px 0", color: "#0d0d0d", display: "flex", alignItems: "center", gap: "10px" }}>
            <span>Colecciones Registradas</span>
            <span style={{ fontSize: "12px", background: "rgba(59, 130, 246, 0.15)", padding: "4px 10px", borderRadius: "20px", color: "#3b82f6", fontWeight: 700 }}>
              {colecciones.length}
            </span>
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {colecciones.length === 0 ? (
              <div style={{ textAlign: "center", padding: "48px 24px", background: "#ffffff", borderRadius: "24px", color: "#94a3b8", fontWeight: 500, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}>
                No hay colecciones creadas todavía.
              </div>
            ) : (
              colecciones.map((col) => (
                <div
                  key={col.id}
                  style={{
                    background: "#ffffff",
                    padding: "20px",
                    borderRadius: "20px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.02)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                    border: "1px solid #e2e8f0"
                  }}
                >
                  {/* Tarjeta de simulación */}
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
                    {col.imagen && (
                      <>
                        <img 
                          src={col.imagen} 
                          alt="" 
                          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} 
                        />
                        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "linear-gradient(90deg, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.3) 100%)" }} />
                      </>
                    )}
                    <div style={{ position: "relative", zIndex: 1, maxWidth: "85%" }}>
                      <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, textShadow: "0 2px 4px rgba(0,0,0,0.4)" }}>
                        {col.nombre}
                      </h3>
                      {col.subtitulo && (
                        <div style={{ marginTop: "6px" }}>
                          <span style={{ padding: "4px 10px", background: "#f97316", borderRadius: "6px", fontSize: "10px", fontWeight: 700, textTransform: "uppercase" }}>{col.subtitulo}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Fila inferior de Metadatos y Acciones */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f1f5f9", paddingTop: "12px", flexWrap: "wrap", gap: "8px" }}>
                    <div>
                      <span style={{ fontSize: "12px", fontWeight: 500, color: "#64748b" }}>
                        Productos: <strong style={{ color: "#0f172a" }}>{col.productos ? col.productos.length : 0}</strong>
                      </span>
                    </div>

                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "flex-end" }}>
                      <button
                        onClick={() => comenzarEdicion(col)}
                        style={{ ...botonAccionEstilo, background: "#0f172a", color: "#ffffff", borderColor: "#0f172a" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "#1e293b"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "#0f172a"; }}
                      >
                        Editar
                      </button>

                      <button
                        onClick={() => manejarEliminarColeccion(col.id)}
                        type="button"
                        title="Eliminar"
                        aria-label="Eliminar colección"
                        style={{ ...botonAccionEstilo, width: "38px", height: "38px", padding: 0, display: "flex", alignItems: "center", justifyContent: "center", borderColor: "rgba(239, 68, 68, 0.2)", color: "#ef4444", background: "rgba(239, 68, 68, 0.02)" }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#ef4444";
                          e.currentTarget.style.color = "white";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "rgba(239, 68, 68, 0.02)";
                          e.currentTarget.style.color = "#ef4444";
                        }}
                      >
                        <IconoPapelera />
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