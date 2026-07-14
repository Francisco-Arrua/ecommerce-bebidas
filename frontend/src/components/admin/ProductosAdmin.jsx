import { useEffect, useState, useMemo } from "react";
import imageCompression from "browser-image-compression";

const MAX_IMAGENES = 8;
const API_URL = import.meta.env.VITE_API_URL;
const UPLOAD_ENDPOINT = `${API_URL}/upload`;

export default function ProductosAdmin() {
  const [editandoId, setEditandoId] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);

  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [subcategoriaFiltro, setSubcategoriaFiltro] = useState("");

  // Estado para las imágenes del formulario de creación
  const [imagenesSubidas, setImagenesSubidas] = useState([]);
  const [orden, setOrden] = useState("recientes");

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    marca: "",
    categoriaId: "",
    subcategoriaId: "",
    precio: "",
    stock: "",
  });

  const [editForm, setEditForm] = useState({
    nombre: "",
    descripcion: "",
    marca: "",
    categoriaId: "",
    subcategoriaId: "",
    precio: "",
    stock: "",
    imagenes: [], 
  });

  // ==========================================
  // FUNCIONES DE CONTROL DE IMÁGENES COMPARTIDAS
  // ==========================================
  const procesarSubidaImagenes = async (e, esEdicion = false) => {
    const archivos = Array.from(e.target.files || []);
    if (archivos.length === 0) return;

    const imagenesActuales = esEdicion ? editForm.imagenes : imagenesSubidas;

    if (imagenesActuales.length + archivos.length > MAX_IMAGENES) {
      alert(`No podés subir más de ${MAX_IMAGENES} imágenes en total. Actualmente tenés ${imagenesActuales.length}.`);
      e.target.value = "";
      return;
    }

    const nuevasImagenesProcesadas = [];

    // Configuración de compresión optimizada para el catálogo
    const opcionesCompresion = {
      maxSizeMB: 1,            // Intentará que no pase de 1MB (generalmente las baja a ~150-200KB)
      maxWidthOrHeight: 1200,  // Resolución máxima excelente para web y responsive móvil
      useWebWorker: true,      // Evita tildar la UI del teléfono procesando en segundo plano
    };

    for (const archivo of archivos) {
      let archivoParaSubir = archivo;

      // Solo intentamos comprimir si el archivo es realmente una imagen
      if (archivo.type.startsWith("image/")) {
        try {
          // Comprimimos la imagen en el dispositivo del usuario
          archivoParaSubir = await imageCompression(archivo, opcionesCompresion);
        } catch (error) {
          console.error("Error al comprimir la imagen, se intentará subir original:", error);
          // Si por alguna razón falla la compresión, no bloqueamos el flujo; usamos el original
          archivoParaSubir = archivo;
        }
      }

      const formDataImagen = new FormData();
      // 'archivoParaSubir' ahora contiene la imagen optimizada (mantiene el nombre original y tipo)
      formDataImagen.append("file", archivoParaSubir);

      try {
        const res = await fetch(UPLOAD_ENDPOINT, {
          method: "POST",
          body: formDataImagen,
        });
        
        if (!res.ok) throw new Error("Error en la respuesta del servidor");
        
        const data = await res.json();
        const tienePrincipal = imagenesActuales.some(img => img.principal) || nuevasImagenesProcesadas.some(img => img.principal);

        nuevasImagenesProcesadas.push({
          url: data.url,
          principal: !tienePrincipal && nuevasImagenesProcesadas.length === 0,
        });
      } catch (error) {
        console.error("Error al subir una de las imágenes:", error);
      }
    }

    if (esEdicion) {
      setEditForm((prev) => ({
        ...prev,
        imagenes: [...prev.imagenes, ...nuevasImagenesProcesadas]
      }));
    } else {
      setImagenesSubidas((prev) => [...prev, ...nuevasImagenesProcesadas]);
    }

    e.target.value = "";
  };
  // ==========================================
  // EFECTOS Y PETICIONES API
  // ==========================================
  const obtenerCategorias = async () => {
    const res = await fetch(`${API_URL}/categorias`);
    const data = await res.json();
    setCategorias(data);
  };

  const obtenerSubcategorias = async () => {
    const res = await fetch(`${API_URL}/subcategorias`);
    const data = await res.json();
    setSubcategorias(data);
  };

  const obtenerProductos = async () => {
    try {
      const res = await fetch(`${API_URL}/productos`);
      const data = await res.json();
      setProductos(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    obtenerProductos();
    obtenerCategorias();
    obtenerSubcategorias();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleEditChange = (e) => {
    setEditForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const productosFiltradosYOrdenados = useMemo(() => {
    let resultado = productos.filter((producto) =>
      [
        producto.nombre,
        producto.marca,
        producto.categoria?.nombre,
        producto.subcategoria?.nombre,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(busqueda.toLowerCase())
    );

    if (categoriaFiltro) {
      resultado = resultado.filter(
        (p) => p.categoriaId === Number(categoriaFiltro)
      );
    }

    if (subcategoriaFiltro) {
      resultado = resultado.filter(
        (p) => p.subcategoriaId === Number(subcategoriaFiltro)
      );
    }

    const copia = [...resultado];

    switch (orden) {
      case "recientes":
        copia.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "antiguos":
        copia.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "nombre-asc":
        copia.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case "nombre-desc":
        copia.sort((a, b) => b.nombre.localeCompare(a.nombre));
        break;
      case "precio-asc":
        copia.sort((a, b) => Number(a.precio) - Number(b.precio));
        break;
      case "precio-desc":
        copia.sort((a, b) => Number(b.precio) - Number(a.precio));
        break;
      default:
        break;
    }

    return copia;
  }, [productos, busqueda, categoriaFiltro, subcategoriaFiltro, orden]);

  const crearProducto = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/productos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          precio: Number(formData.precio),
          stock: Number(formData.stock),
          categoriaId: formData.categoriaId ? Number(formData.categoriaId) : null,
          subcategoriaId: formData.subcategoriaId ? Number(formData.subcategoriaId) : null,
          imagenes: imagenesSubidas, 
        }),
      });

      if (!res.ok) throw new Error("Error al crear producto");

      setFormData({
        nombre: "",
        descripcion: "",
        marca: "",
        categoriaId: "",
        subcategoriaId: "",
        precio: "",
        stock: "",
      });

      setImagenesSubidas([]);
      obtenerProductos();
    } catch (error) {
      console.error(error);
    }
  };

  const eliminarProducto = async (id) => {
    if (!confirm("¿Eliminar producto?")) return;
    try {
      await fetch(`${API_URL}/productos/${id}`, { method: "DELETE" });
      obtenerProductos();
    } catch (error) {
      console.error(error);
    }
  };

  const comenzarEdicion = (producto) => {
    setEditandoId(producto.id);
    setEditForm({
      nombre: producto.nombre || "",
      descripcion: producto.descripcion || "",
      marca: producto.marca || "",
      categoriaId: producto.categoriaId || "",
      subcategoriaId: producto.subcategoriaId || "",
      precio: producto.precio || "",
      stock: producto.stock || "",
      imagenes: producto.imagenes || [], 
    });
  };

  const guardarEdicion = async () => {
    try {
      await fetch(`${API_URL}/productos/${editandoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editForm,
          precio: Number(editForm.precio),
          stock: Number(editForm.stock),
          categoriaId: editForm.categoriaId ? Number(editForm.categoriaId) : null,
          subcategoriaId: editForm.subcategoriaId ? Number(editForm.subcategoriaId) : null,
        }),
      });

      setEditandoId(null);
      obtenerProductos();
    } catch (error) {
      console.error(error);
    }
  };

  const modificarStock = async (id, stockActual, cambio) => {
    try {
      await fetch(`${API_URL}/productos/${id}/stock`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stock: Math.max(0, stockActual + cambio),
        }),
      });
      obtenerProductos();
    } catch (error) {
      console.error(error);
    }
  };

  const cambiarActivo = async (id) => {
    try {
      await fetch(`${API_URL}/productos/${id}/activo`, { method: "PATCH" });
      obtenerProductos();
    } catch (error) {
      console.error(error);
    }
  };

  const cambiarDestacado = async (id) => {
    try {
      await fetch(`${API_URL}/productos/${id}/destacado`, { method: "PATCH" });
      obtenerProductos();
    } catch (error) {
      console.error(error);
    }
  };

  // ==========================================
  // ESTILOS DE INTERFAZ REUTILIZABLES PREMIUM
  // ==========================================
  const inputEstiloBase = {
    padding: "10px 14px",
    borderRadius: "14px",
    border: "1px solid #e2e8f0",
    outline: "none",
    fontSize: "14px",
    color: "#0f172a",
    background: "#f8fafc",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    boxSizing: "border-box",
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

  const contenedorSeccionEstilo = {
    background: "#ffffff",
    padding: "36px",
    borderRadius: "24px",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)",
    marginBottom: "40px"
  };

  // Estilos mejorados y más pequeños para las tarjetas de métricas superiores
  const tarjetaMetricaEstilo = {
    background: "#ffffff",
    padding: "16px 20px",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.01)",
    display: "flex",
    alignItems: "center",
    gap: "14px"
  };

  // Componente interno UI de Galería de Miniaturas Reutilizable
  const GaleriaMiniaturas = ({ imagenes, esEdicion }) => {
    return (
      <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", marginTop: "12px" }}>
        {imagenes.map((img, index) => (
          <div 
            key={index} 
            style={{ 
              position: "relative", 
              width: "100px", 
              height: "100px", 
              borderRadius: "14px", 
              overflow: "hidden", 
              border: img.principal ? "2.5px solid #3b82f6" : "1px solid #e2e8f0",
              boxShadow: img.principal ? "0 8px 20px rgba(59, 130, 246, 0.15)" : "none",
              transition: "all 0.2s ease"
            }}
          >
            <img src={img.url} alt={`Preview ${index}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            
            <button
              type="button"
              onClick={() => definirImagenPrincipal(index, esEdicion)}
              style={{
                position: "absolute",
                bottom: "6px",
                left: "6px",
                background: img.principal ? "#3b82f6" : "rgba(15, 23, 42, 0.75)",
                color: "#ffffff",
                border: "none",
                borderRadius: "6px",
                padding: "3px 8px",
                fontSize: "10px",
                cursor: "pointer",
                fontWeight: 700,
                backdropFilter: "blur(4px)"
              }}
            >
              {img.principal ? "Portada" : "Usar portada"}
            </button>

            <button 
              type="button" 
              onClick={() => eliminarImagenIndividual(index, esEdicion)} 
              style={{ 
                position: "absolute", 
                top: "6px", 
                right: "6px", 
                background: "#ef4444", 
                color: "white", 
                border: "none", 
                borderRadius: "50%", 
                width: "20px", 
                height: "20px", 
                cursor: "pointer", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                fontSize: "10px", 
                fontWeight: "bold",
                boxShadow: "0 2px 4px rgba(0,0,0,0.15)"
              }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ minHeight: "100vh", padding: "24px 16px 40px 16px", fontFamily: "Inter, sans-serif", backgroundColor: "#f8fafc" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        
        {/* METRICAS SUPERIORES COMPACTAS Y MODERNAS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px", marginBottom: "24px" }}>
          <div style={tarjetaMetricaEstilo}>
            <span style={{ width: "40px", height: "40px", background: "#eff6ff", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: "#3b82f6", flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
            </span>
            <div>
              <p style={{ margin: 0, color: "#64748b", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Productos Catálogo</p>
              <h3 style={{ margin: "2px 0 0 0", fontSize: "22px", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>{productos.length}</h3>
            </div>
          </div>
          
          <div style={tarjetaMetricaEstilo}>
            <span style={{ width: "40px", height: "40px", background: "#f0fdf4", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: "#10b981", flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
            </span>
            <div>
              <p style={{ margin: 0, color: "#64748b", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Stock Total General</p>
              <h3 style={{ margin: "2px 0 0 0", fontSize: "22px", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>{productos.reduce((total, p) => total + p.stock, 0)}</h3>
            </div>
          </div>
        </div>

        {/* FORMULARIO NUEVO PRODUCTO */}
        <div style={contenedorSeccionEstilo}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f1f5f9", paddingBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ color: "#3b82f6", display: "flex" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
              </span>
              <h2 style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em" }}>Nuevo Producto</h2>
            </div>
            <span style={{ fontSize: "12px", color: "#64748b", background: "#f1f5f9", padding: "4px 10px", borderRadius: "20px", fontWeight: 600 }}>
              Archivos: {imagenesSubidas.length} / {MAX_IMAGENES}
            </span>
          </div>

          <form onSubmit={crearProducto} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "16px", marginTop: "24px" }}>
            <input name="nombre" placeholder="Nombre del producto" value={formData.nombre} onChange={handleChange} required style={inputEstiloBase} onFocus={manejarFocusInput} onBlur={manejarBlurInput} />
            <input name="marca" placeholder="Marca" value={formData.marca} onChange={handleChange} style={inputEstiloBase} onFocus={manejarFocusInput} onBlur={manejarBlurInput} />
            
            <select name="categoriaId" value={formData.categoriaId} onChange={handleChange} style={inputEstiloBase} onFocus={manejarFocusInput} onBlur={manejarBlurInput}>
              <option value="">Seleccionar categoría</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
              ))}
            </select>

            <select name="subcategoriaId" value={formData.subcategoriaId} onChange={handleChange} style={inputEstiloBase} onFocus={manejarFocusInput} onBlur={manejarBlurInput}>
              <option value="">Seleccionar subcategoría</option>
              {subcategorias
                .filter((sub) => sub.categoriaId === Number(formData.categoriaId))
                .map((sub) => (
                  <option key={sub.id} value={sub.id}>{sub.nombre}</option>
                ))}
            </select>

            <input name="precio" type="number" placeholder="Precio ($)" value={formData.precio} onChange={handleChange} required style={inputEstiloBase} onFocus={manejarFocusInput} onBlur={manejarBlurInput} />
            <input name="stock" type="number" placeholder="Stock inicial" value={formData.stock} onChange={handleChange} required style={inputEstiloBase} onFocus={manejarFocusInput} onBlur={manejarBlurInput} />
            
            <div style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: "10px" }}>
              <label style={{ fontSize: "13px", fontWeight: 700, color: "#475569" }}>Imágenes de Exhibición</label>
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                onChange={(e) => procesarSubidaImagenes(e, false)} 
                style={inputEstiloBase} 
                onFocus={manejarFocusInput} 
                onBlur={manejarBlurInput} 
              />
              <GaleriaMiniaturas imagenes={imagenesSubidas} esEdicion={false} />
            </div>
            
            <textarea name="descripcion" placeholder="Descripción breve del producto..." value={formData.descripcion} onChange={handleChange} style={{ ...inputEstiloBase, gridColumn: "1 / -1", minHeight: "100px", fontFamily: "inherit", resize: "vertical" }} onFocus={manejarFocusInput} onBlur={manejarBlurInput} />
            
            <button type="submit" style={{ gridColumn: "1 / -1", padding: "12px", border: "none", borderRadius: "14px", background: "#3b82f6", color: "white", cursor: "pointer", fontWeight: "600", fontSize: "14px", transition: "all 0.2s ease" }} onMouseEnter={(e) => e.currentTarget.style.background = "#2563eb"} onMouseLeave={(e) => e.currentTarget.style.background = "#3b82f6"}>
              Registrar Producto en Catálogo
            </button>
          </form>
        </div>

        {/* FILTROS Y BUSCADOR */}
        <div style={{ background: "#ffffff", padding: "20px 24px", borderRadius: "24px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)", border: "1px solid #e2e8f0", marginBottom: "30px", display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
          <select value={orden} onChange={(e) => setOrden(e.target.value)} style={{ ...inputEstiloBase, minWidth: "160px" }} onFocus={manejarFocusInput} onBlur={manejarBlurInput}>
            <option value="recientes">Más recientes</option>
            <option value="antiguos">Más antiguos</option>
            <option value="nombre-asc">Nombre A-Z</option>
            <option value="nombre-desc">Nombre Z-A</option>
            <option value="precio-asc">Precio menor</option>
            <option value="precio-desc">Precio mayor</option>
          </select>

          <div style={{ flex: 1, minWidth: "250px", position: "relative", display: "flex", alignItems: "center" }}>
            <input type="text" placeholder="Buscar producto por nombre, marca o categoría..." value={busqueda} onChange={(e) => e.target.value} style={{ ...inputEstiloBase, width: "100%" }} onFocus={manejarFocusInput} onBlur={manejarBlurInput} />
          </div>

          <select value={categoriaFiltro} onChange={(e) => { setCategoriaFiltro(e.target.value); setSubcategoriaFiltro(""); }} style={{ ...inputEstiloBase, minWidth: "180px" }} onFocus={manejarFocusInput} onBlur={manejarBlurInput}>
            <option value="">Todas las categorías</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.nombre}</option>
            ))}
          </select>

          <select value={subcategoriaFiltro} onChange={(e) => setSubcategoriaFiltro(e.target.value)} style={{ ...inputEstiloBase, minWidth: "180px" }} onFocus={manejarFocusInput} onBlur={manejarBlurInput}>
            <option value="">Todas las subcategorías</option>
            {subcategorias
              .filter((sub) => !categoriaFiltro || sub.categoriaId === Number(categoriaFiltro))
              .map((sub) => (
                <option key={sub.id} value={sub.id}>{sub.nombre}</option>
              ))}
          </select>
        </div>

        {/* LISTADO DE PRODUCTOS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {productosFiltradosYOrdenados.map((producto) => {
            const fotoPrincipal = producto.imagenes?.find((img) => img.principal)?.url || producto.imagenes?.[0]?.url;

            return (
              <div key={producto.id} style={{ background: "#ffffff", borderRadius: "24px", padding: "24px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)", display: "flex", gap: "24px", flexWrap: "wrap", position: "relative" }}>
                
                {/* Miniatura de catálogo */}
                <div style={{ width: "120px", height: "120px", borderRadius: "16px", overflow: "hidden", background: "#f8fafc", border: "1px solid #e2e8f0", flexShrink: 0 }}>
                  {fotoPrincipal ? (
                    <img src={fotoPrincipal} alt={producto.nombre} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                    </div>
                  )}
                </div>

                {/* Información General */}
                <div style={{ flex: 1, minWidth: "300px" }}>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "6px" }}>
                    <p style={{ margin: 0, color: "#64748b", fontSize: "13px", fontWeight: 600, textTransform: "uppercase" }}>{producto.marca || "Sin Marca"}</p>
                    {producto.destacado && (
                      <span style={{ background: "#fef3c7", color: "#d97706", padding: "2px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 700 }}>Destacado</span>
                    )}
                    {!producto.activo && (
                      <span style={{ background: "#f1f5f9", color: "#64748b", padding: "2px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 700 }}>Inactivo</span>
                    )}
                  </div>

                  <h3 style={{ margin: "0 0 6px 0", color: "#0f172a", fontSize: "18px", fontWeight: 700, letterSpacing: "-0.02em" }}>{producto.nombre}</h3>
                  <p style={{ margin: "0 0 16px 0", color: "#64748b", fontSize: "14px", lineHeight: "1.5" }}>{producto.descripcion || "Sin descripción disponible."}</p>

                  {/* Badges de Atributos */}
                  <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", fontSize: "13px", color: "#475569", background: "#f8fafc", padding: "12px 16px", borderRadius: "14px", width: "fit-content", border: "1px solid #e2e8f0" }}>
                    <span><strong>Categoría:</strong> {producto.categoria?.nombre || "-"}</span>
                    <span><strong>Subcategoría:</strong> {producto.subcategoria?.nombre || "-"}</span>
                    <span><strong>Precio:</strong> <strong style={{ color: "#0f172a" }}>${Number(producto.precio).toLocaleString("es-AR")}</strong></span>
                    <span>
                      <strong>Stock:</strong>{" "}
                      <strong style={{ color: producto.stock === 0 ? "#ef4444" : "#0f172a" }}>{producto.stock} uds.</strong>
                    </span>
                  </div>
                </div>

                {/* Controles Laterales */}
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "flex-end", gap: "16px", marginLeft: "auto" }}>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <button onClick={() => modificarStock(producto.id, producto.stock, -1)} style={botonAccionEstilo} onMouseEnter={(e) => e.currentTarget.style.background = "#f8fafc"} onMouseLeave={(e) => e.currentTarget.style.background = "#ffffff"}>-1 Stock</button>
                    <button onClick={() => modificarStock(producto.id, producto.stock, 1)} style={botonAccionEstilo} onMouseEnter={(e) => e.currentTarget.style.background = "#f8fafc"} onMouseLeave={(e) => e.currentTarget.style.background = "#ffffff"}>+1 Stock</button>
                    <button onClick={() => cambiarActivo(producto.id)} style={{ ...botonAccionEstilo, borderColor: producto.activo ? "#e2e8f0" : "#3b82f6", color: producto.activo ? "#475569" : "#3b82f6" }}>{producto.activo ? "Desactivar" : "Activar"}</button>
                    <button onClick={() => cambiarDestacado(producto.id)} style={{ ...botonAccionEstilo, color: producto.destacado ? "#eab308" : "#475569" }}>{producto.destacado ? "★ Destacado" : "☆ Destacar"}</button>
                  </div>

                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={() => comenzarEdicion(producto)} style={{ ...botonAccionEstilo, background: "#0f172a", color: "#ffffff", border: "none" }} onMouseEnter={(e) => e.currentTarget.style.background = "#1e293b"} onMouseLeave={(e) => e.currentTarget.style.background = "#0f172a"}>Editar</button>
                    <button onClick={() => eliminarProducto(producto.id)} style={{ ...botonAccionEstilo, borderColor: "#fecaca", color: "#ef4444" }} onMouseEnter={(e) => e.currentTarget.style.background = "#fff5f5"} onMouseLeave={(e) => e.currentTarget.style.background = "#ffffff"}>Eliminar</button>
                  </div>
                </div>

                {/* FORMULARIO DE EDICIÓN EXPANDIDO */}
                {editandoId === producto.id && (
                  <div style={{ width: "100%", marginTop: "16px", paddingTop: "24px", borderTop: "1px dashed #e2e8f0", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "14px" }}>
                    <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <h4 style={{ margin: 0, fontSize: "14px", color: "#0f172a", fontWeight: 700 }}>Actualizar información técnica</h4>
                      <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>
                        Fotos actuales: {editForm.imagenes?.length || 0} / {MAX_IMAGENES}
                      </span>
                    </div>
                    
                    <input name="nombre" value={editForm.nombre} onChange={handleEditChange} placeholder="Nombre" style={inputEstiloBase} onFocus={manejarFocusInput} onBlur={manejarBlurInput} />
                    <input name="marca" value={editForm.marca} onChange={handleEditChange} placeholder="Marca" style={inputEstiloBase} onFocus={manejarFocusInput} onBlur={manejarBlurInput} />

                    <select name="categoriaId" value={editForm.categoriaId} onChange={handleEditChange} style={inputEstiloBase} onFocus={manejarFocusInput} onBlur={manejarBlurInput}>
                      <option value="">Seleccionar categoría</option>
                      {categorias.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                      ))}
                    </select>

                    <select name="subcategoriaId" value={editForm.subcategoriaId} onChange={handleEditChange} style={inputEstiloBase} onFocus={manejarFocusInput} onBlur={manejarBlurInput}>
                      <option value="">Seleccionar subcategoría</option>
                      {subcategorias
                        .filter((sub) => sub.categoriaId === Number(editForm.categoriaId))
                        .map((sub) => (
                          <option key={sub.id} value={sub.id}>{sub.nombre}</option>
                        ))}
                    </select>

                    <input name="precio" type="number" value={editForm.precio} onChange={handleEditChange} placeholder="Precio" style={inputEstiloBase} onFocus={manejarFocusInput} onBlur={manejarBlurInput} />
                    <input name="stock" type="number" value={editForm.stock} onChange={handleEditChange} placeholder="Stock" style={inputEstiloBase} onFocus={manejarFocusInput} onBlur={manejarBlurInput} />
                    
                    <div style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: "10px", marginTop: "4px" }}>
                      <label style={{ fontSize: "13px", fontWeight: 700, color: "#475569" }}>Cargar nuevas imágenes al producto</label>
                      <input 
                        type="file" 
                        multiple 
                        accept="image/*" 
                        onChange={(e) => procesarSubidaImagenes(e, true)} 
                        style={inputEstiloBase} 
                        onFocus={manejarFocusInput} 
                        onBlur={manejarBlurInput} 
                      />
                      <GaleriaMiniaturas imagenes={editForm.imagenes || []} esEdicion={true} />
                    </div>

                    <textarea name="descripcion" value={editForm.descripcion} onChange={handleEditChange} placeholder="Descripción..." style={{ ...inputEstiloBase, gridColumn: "1 / -1", minHeight: "80px", fontFamily: "inherit", resize: "vertical" }} onFocus={manejarFocusInput} onBlur={manejarBlurInput} />

                    <div style={{ gridColumn: "1 / -1", display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "10px" }}>
                      <button onClick={() => setEditandoId(null)} style={{ ...botonAccionEstilo, background: "#f1f5f9", border: "none", color: "#475569" }}>Cancelar</button>
                      <button onClick={guardarEdicion} style={{ ...botonAccionEstilo, background: "#3b82f6", color: "#ffffff", border: "none" }}>Guardar Cambios</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
      </div>
    </div>
  );
}