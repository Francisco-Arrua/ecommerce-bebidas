import { useEffect, useState } from "react";

export default function CategoriasAdmin() {
  const [categorias, setCategorias] = useState([]);
  const [nombre, setNombre] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [nombreEditado, setNombreEditado] = useState("");

  const obtenerCategorias = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/categorias`);
      const data = await res.json();
      setCategorias(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    obtenerCategorias();
  }, []);

  const crearCategoria = async (e) => {
    if (e) e.preventDefault();
    if (!nombre.trim()) return;

    try {
      await fetch(`${import.meta.env.VITE_API_URL}/categorias`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre }),
      });

      setNombre("");
      obtenerCategorias();
    } catch (error) {
      console.error(error);
    }
  };

  const eliminarCategoria = async (id) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta categoría?")) return;
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/categorias/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        alert("No puedes eliminar una categoría que tiene subcategorías asociadas.");
        return;
      }

      obtenerCategorias();
    } catch (error) {
      console.error(error);
    }
  };

  const editarCategoria = async (id) => {
    if (!nombreEditado.trim()) return;
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/categorias/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre: nombreEditado }),
      });

      setEditandoId(null);
      setNombreEditado("");
      obtenerCategorias();
    } catch (error) {
      console.error(error);
    }
  };

  // --- ESTILOS COMPARTIDOS (CALIBRADOS CON LA LÍNEA DE DISEÑO PREMIUM) ---
  const estiloInputBase = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "14px",
    border: "1px solid #e2e8f0",
    fontSize: "14px",
    color: "#0f172a",
    backgroundColor: "#f8fafc",
    outline: "none",
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

  const estiloTarjetaContenedora = {
    background: "#ffffff",
    padding: "36px",
    borderRadius: "24px",
    boxShadow: "0 10px 20px rgba(98, 98, 98, 0.4), 0 1px 3px rgba(255, 255, 255, 0.05)",
    display: "flex",
    flexDirection: "column",
    gap: "32px",
    marginBottom: "32px"
  };

  const botonAccionEstilo = {
    width: "38px",
    height: "38px",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    background: "#ffffff",
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0
  };

  return (
    <div
      style={{
        maxWidth: "760px",
        margin: "0 auto",
        padding: "16px 8px 40px 8px",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Encabezado */}
      <header style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "26px", fontWeight: 800, margin: 0, color: "#0b0b0b", letterSpacing: "-0.03em" }}>
          Gestión de Categorías
        </h1>
        <p style={{ margin: "6px 0 0 0", color: "#64748b", fontSize: "14px", fontWeight: 500 }}>
          Estructura las agrupaciones principales para los productos de tu tienda.
        </p>
      </header>

      {/* BLOQUE 1: Formulario de Creación (Tarjeta) */}
      <div style={estiloTarjetaContenedora}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
            <span style={{ color: "#3b82f6", display: "flex" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
            </span>
            <h3 style={{ fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", margin: 0 }}>
              Nueva Categoría Principal
            </h3>
          </div>

          <form onSubmit={crearCategoria} style={{ display: "flex", gap: "16px", alignItems: "flex-end" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>Nombre de la Categoría</label>
              <input
                type="text"
                placeholder="Ej. Suplementos, Accesorios, Indumentaria..."
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                style={estiloInputBase}
                onFocus={manejarFocusInput}
                onBlur={manejarBlurInput}
              />
            </div>
            <button
              type="submit"
              style={{
                padding: "12px 24px",
                background: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "12px",
                fontWeight: "600",
                fontSize: "14px",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(37,99,235,0.15)",
                transition: "all 0.2s ease",
                height: "45px",
                boxSizing: "border-box"
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#1d4ed8"}
              onMouseLeave={(e) => e.currentTarget.style.background = "#2563eb"}
            >
              Agregar
            </button>
          </form>
        </div>
      </div>

      {/* BLOQUE 2: Listado de Categorías Existentes */}
      <div style={estiloTarjetaContenedora}>
        <div>
          {/* Cabecera del Listado */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid #f1f5f9", paddingBottom: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ color: "#3b82f6", display: "flex" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
              </span>
              <h3 style={{ fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", margin: 0 }}>
                Categorías Activas
              </h3>
            </div>
            <span style={{ fontSize: "12px", fontWeight: 600, color: "#64748b", background: "#f1f5f9", padding: "4px 12px", borderRadius: "20px" }}>
              {categorias.length} {categorias.length === 1 ? 'sección' : 'secciones'}
            </span>
          </div>

          {/* Lista Dinámica */}
          {categorias.length === 0 ? (
            <p style={{ margin: 0, color: "#94a3b8", fontSize: "14px", fontStyle: "italic", padding: "12px 0" }}>
              No hay categorías creadas todavía.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {categorias.map((categoria) => (
                <div
                  key={categoria.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 16px",
                    background: "#f8fafc",
                    borderRadius: "14px",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  {/* Contenido / Input Inline de Edición */}
                  <div style={{ flex: "1", marginRight: "16px" }}>
                    {editandoId === categoria.id ? (
                      <input
                        value={nombreEditado}
                        onChange={(e) => setNombreEditado(e.target.value)}
                        style={{ ...estiloInputBase, padding: "8px 12px" }}
                        onFocus={manejarFocusInput}
                        onBlur={manejarBlurInput}
                        autoFocus
                      />
                    ) : (
                      <span style={{ color: "#0f172a", fontSize: "14px", fontWeight: 600, paddingLeft: "4px" }}>
                        {categoria.nombre}
                      </span>
                    )}
                  </div>

                  {/* Botonera de Acciones en Fila */}
                  <div style={{ display: "flex", gap: "8px" }}>
                    {editandoId === categoria.id ? (
                      <>
                        <button
                          onClick={() => setEditandoId(null)}
                          style={{
                            ...botonAccionEstilo,
                            width: "auto",
                            padding: "0 12px",
                            fontSize: "12px",
                            fontWeight: 600,
                            color: "#64748b"
                          }}
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={() => editarCategoria(categoria.id)}
                          style={{ ...botonAccionEstilo, background: "#ecfdf5", borderColor: "#a7f3d0" }}
                          title="Guardar"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          setEditandoId(categoria.id);
                          setNombreEditado(categoria.nombre);
                        }}
                        style={botonAccionEstilo}
                        title="Editar"
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#f1f5f9";
                          e.currentTarget.style.borderColor = "#cbd5e1";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "#ffffff";
                          e.currentTarget.style.borderColor = "#e2e8f0";
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                      </button>
                    )}

                    <button
                      onClick={() => eliminarCategoria(categoria.id)}
                      style={botonAccionEstilo}
                      title="Eliminar"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#fef2f2";
                        e.currentTarget.style.borderColor = "#fca5a5";
                        e.currentTarget.querySelector("svg").style.stroke = "#ef4444";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#ffffff";
                        e.currentTarget.style.borderColor = "#e2e8f0";
                        e.currentTarget.querySelector("svg").style.stroke = "#64748b";
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "stroke 0.2s" }}><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}