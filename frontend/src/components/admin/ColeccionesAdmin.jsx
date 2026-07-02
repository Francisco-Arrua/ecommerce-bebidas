import { useState, useEffect } from "react";

export default function ColeccionesAdmin() {
  const [colecciones, setColecciones] = useState([]);
  const [productosDisponibles, setProductosDisponibles] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Estados para el formulario
  const [nombre, setNombre] = useState("");
  const [subtitulo, setSubtitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState(""); // Aquí guardaremos la URL de Cloudinary
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  
  // NUEVO: Estado de carga para la subida de la imagen
  const [subiendoImagen, setSubiendoImagen] = useState(false);

  useEffect(() => {
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

    cargarDatosAdmin();
  }, []);

  // NUEVO: Función para manejar el upload automático a Cloudinary
  const manejarSubidaImagen = async (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;

    const formData = new FormData();
    formData.append("file", archivo); // Ajustá 'file' según lo reciba tu upload.routes.js

    try {
      setSubiendoImagen(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
        method: "POST",
        body: formData,
        // No agregamos Content-Type header porque al pasar un FormData el navegador lo setea automáticamente con el boundary correcto
      });

      if (!res.ok) throw new Error("Error al subir la imagen");

      const data = await res.json();
      // Asumiendo que tu backend devuelve la url en data.url o data.secure_url
      setImagen(data.url || data.secure_url); 
      alert("Imagen subida con éxito a Cloudinary");
    } catch (error) {
      console.error("Error subiendo imagen:", error);
      alert("No se pudo subir la imagen.");
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
      const token = localStorage.getItem("token");

      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
        alert(editandoId ? "Colección actualizada con éxito" : "Colección creada con éxito");
        window.location.reload();
      } else {
        const errData = await res.json();
        alert(`Error: ${errData.mensaje}`);
      }
    } catch (error) {
      console.error("Error al guardar la colección:", error);
    }
  };

  // NUEVO: Función para eliminar colección en el Backend
  const manejarEliminarColeccion = async (id, nombreCol) => {
    const confirmar = window.confirm(`¿Estás seguro de que querés eliminar la colección "${nombreCol}"? Esto no borrará los productos.`);
    if (!confirmar) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/coleccion/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        alert("Colección eliminada correctamente.");
        setColecciones(colecciones.filter((col) => col.id !== id));
      } else {
        const errData = await res.json();
        alert(`Error: ${errData.mensaje}`);
      }
    } catch (error) {
      console.error("Error al eliminar la colección:", error);
      alert("Ocurrió un error al intentar eliminar.");
    }
  };

  if (cargando) return <div style={{ padding: "20px", color: "#64748b" }}>Cargando panel de control...</div>;

  return (
    <div style={{ padding: "30px", fontFamily: "Inter, sans-serif", background: "#f8fafc", minHeight: "100vh" }}>
      <h2 style={{ color: "#0f172a", fontSize: "24px", fontWeight: 700, marginBottom: "20px" }}>
        {editandoId ? "Editar Promoción / Colección" : "Crear Nueva Promoción / Colección"}
      </h2>

      {/* FORMULARIO DE CREACIÓN / EDICIÓN */}
      <form onSubmit={guardarColeccion} style={{ background: "white", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "40px", maxWidth: "800px" }}>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", fontWeight: 600, marginBottom: "5px", fontSize: "14px" }}>Nombre de la Colección</label>
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej: Combo Urbano Invierno" required style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", fontWeight: 600, marginBottom: "5px", fontSize: "14px" }}>Subtítulo / Gancho Comercial</label>
          <input type="text" value={subtitulo} onChange={(e) => setSubtitulo(e.target.value)} placeholder="Ej: 20% OFF" style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", fontWeight: 600, marginBottom: "5px", fontSize: "14px" }}>Descripción</label>
          <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Breve texto explicando la promo..." style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", minHeight: "80px" }} />
        </div>

        {/* MODIFICADO: Input de archivo para Cloudinary con vista previa */}
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", fontWeight: 600, marginBottom: "5px", fontSize: "14px" }}>Imagen de Portada (Carátula)</label>
          <input type="file" accept="image/*" onChange={manejarSubidaImagen} style={{ display: "block", marginBottom: "10px" }} />
          
          {subiendoImagen && <p style={{ fontSize: "13px", color: "#2563eb", margin: 0 }}>Subiendo imagen a Cloudinary, por favor esperá...</p>}
          
          {imagen && (
            <div style={{ marginTop: "10px" }}>
              <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 5px 0" }}>Vista previa actual:</p>
              <img src={imagen} alt="Preview" style={{ width: "150px", height: "100px", objectFit: "cover", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
            </div>
          )}
        </div>

        {/* SELECCIÓN DE PRODUCTOS */}
        <div style={{ marginBottom: "25px" }}>
          <label style={{ display: "block", fontWeight: 600, marginBottom: "10px", fontSize: "14px" }}>Seleccionar Productos para incluir:</label>
          <div style={{ maxHeight: "200px", overflowY: "scroll", border: "1px solid #cbd5e1", padding: "10px", borderRadius: "6px", background: "#f8fafc" }}>
            {productosDisponibles.map((prod) => (
              <div key={prod.id} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "6px 0" }}>
                <input type="checkbox" id={`prod-${prod.id}`} checked={productosSeleccionados.includes(prod.id)} onChange={() => manejarCheckboxProducto(prod.id)} />
                <label htmlFor={`prod-${prod.id}`} style={{ fontSize: "14px", cursor: "pointer" }}>
                  <strong>[{prod.marca || "Sin Marca"}]</strong> {prod.nombre} — ${Number(prod.precio).toLocaleString("es-AR")}
                </label>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" disabled={subiendoImagen} style={{ padding: "12px 24px", background: subiendoImagen ? "#94a3b8" : "#2563eb", color: "white", border: "none", borderRadius: "8px", fontWeight: "600", cursor: subiendoImagen ? "not-allowed" : "pointer" }}>
          {editandoId ? "Guardar Cambios" : "Crear Colección"}
        </button>

        {editandoId && (
          <button type="button" onClick={() => { setEditandoId(null); setNombre(""); setSubtitulo(""); setDescripcion(""); setImagen(""); setProductosSeleccionados([]); }} style={{ padding: "12px 24px", background: "#64748b", color: "white", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer", marginLeft: "10px" }}>
            Cancelar Edición
          </button>
        )}
      </form>

      {/* LISTADO DE PROMOS EXISTENTES */}
      <h3 style={{ marginTop: "40px", color: "#0f172a", fontSize: "18px", fontWeight: 700 }}>Colecciones Actuales</h3>
      <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e2e8f0", marginTop: "15px", overflow: "hidden" }}>
        {colecciones.map((col) => (
          <div key={col.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 20px", borderBottom: "1px solid #e2e8f0" }}>
            <div>
              <h4 style={{ margin: 0, fontSize: "16px", color: "#1e293b" }}>
                {col.nombre} <span style={{ color: "#ef4444", fontSize: "12px", fontWeight: 700 }}>{col.subtitulo}</span>
              </h4>
              <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#64748b" }}>ID: {col.id} • Creada el {new Date(col.createdAt).toLocaleDateString()}</p>
            </div>
            
            {/* NUEVO: Botonera con Editar y Eliminar */}
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => {
                  setEditandoId(col.id);
                  setNombre(col.nombre);
                  setSubtitulo(col.subtitulo || "");
                  setDescripcion(col.descripcion || "");
                  setImagen(col.imagen || "");
                  setProductosSeleccionados(col.productos ? col.productos.map((p) => p.id) : []);
                }}
                style={{ padding: "6px 14px", background: "#e2e8f0", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "13px", fontWeight: 600, color: "#334155" }}
              >
                Editar / Productos
              </button>
              
              <button
                onClick={() => manejarEliminarColeccion(col.id, col.nombre)}
                style={{ padding: "6px 14px", background: "#fee2e2", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "13px", fontWeight: 600, color: "#ef4444" }}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}