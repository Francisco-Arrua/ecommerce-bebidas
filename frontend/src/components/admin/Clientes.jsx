import { useEffect, useState } from "react";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  
  // Estados para Filtros y Buscador
  const [busqueda, setBusqueda] = useState("");
  const [filtroOrden, setFiltroOrden] = useState("nuevos"); // opciones: nuevos, viejos, az
  
  // Estado para limitar los registros visibles (Paginación)
  const [limiteVisible, setLimiteVisible] = useState(20);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const obtenerClientes = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/clientes`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Error al obtener los clientes");
        
        const data = await res.json();
        setClientes(data);
      } catch (error) {
        console.error(error);
      } finally {
        setCargando(false);
      }
    };

    obtenerClientes();
  }, [API_URL]);

  // --- LÓGICA DE FILTRADO, ORDENAMIENTO Y PAGINACIÓN ---
  
  // 1. Filtrar por búsqueda (Nombre o Email)
  const clientesFiltrados = clientes.filter((cliente) => {
    const termino = busqueda.toLowerCase().trim();
    return (
      cliente.nombre.toLowerCase().includes(termino) ||
      cliente.email.toLowerCase().includes(termino)
    );
  });

  // 2. Ordenar según el criterio seleccionado
  const clientesOrdenados = [...clientesFiltrados].sort((a, b) => {
    if (filtroOrden === "nuevos") {
      return new Date(b.creadoEn) - new Date(a.creadoEn);
    }
    if (filtroOrden === "viejos") {
      return new Date(a.creadoEn) - new Date(b.creadoEn);
    }
    if (filtroOrden === "az") {
      return a.nombre.localeCompare(b.nombre);
    }
    return 0;
  });

  // 3. Cortar el array para renderizar solo la porción visible (Ej. primeros 20)
  const clientesRenderizados = clientesOrdenados.slice(0, limiteVisible);

  // Función para cargar la siguiente tanda
  const cargarMasClientes = () => {
    setLimiteVisible((prev) => prev + 20);
  };

  // Cada vez que el usuario busque o cambie el filtro, reseteamos el límite a 20
  const manejarCambioFiltro = (e, tipo) => {
    setLimiteVisible(20);
    if (tipo === "busqueda") setBusqueda(e.target.value);
    if (tipo === "orden") setFiltroOrden(e.target.value);
  };

  // Estilos reutilizables en línea
  const estilos = {
    contenedor: {
      maxWidth: "1000px",
      margin: "0 auto",
      padding: "32px 20px",
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      backgroundColor: "#ffffff",
      minHeight: "100vh",
    },
    cargando: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "200px",
      color: "#64748b",
      fontSize: "16px",
      fontWeight: "500",
    },
    titulo: {
      color: "#0f172a",
      marginBottom: "4px",
      fontSize: "28px",
      fontWeight: "800",
      letterSpacing: "-0.025em",
    },
    subtitulo: {
      color: "#64748b",
      fontSize: "14px",
      marginBottom: "24px",
      marginTop: "0",
    },
    barraHerramientas: {
      display: "flex",
      flexWrap: "wrap",
      gap: "12px",
      marginBottom: "20px",
      alignItems: "center",
      justifyContent: "space-between",
    },
    inputBusqueda: {
      padding: "10px 16px",
      borderRadius: "12px",
      border: "1px solid #e2e8f0",
      outline: "none",
      fontSize: "14px",
      color: "#0f172a",
      backgroundColor: "#f8fafc",
      width: "100%",
      maxWidth: "320px",
      boxSizing: "border-box",
      transition: "all 0.2s ease",
    },
    selectFiltro: {
      padding: "10px 14px",
      borderRadius: "12px",
      border: "1px solid #e2e8f0",
      outline: "none",
      fontSize: "14px",
      color: "#475569",
      backgroundColor: "#ffffff",
      cursor: "pointer",
      fontWeight: "500",
      transition: "all 0.2s ease",
    },
    tablaContenedor: {
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      border: "1px solid #e2e8f0",
      overflow: "hidden",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.03), 0 2px 4px -1px rgba(0, 0, 0, 0.02)",
    },
    tabla: {
      width: "100%",
      borderCollapse: "collapse",
      textAlign: "left",
      fontSize: "14px",
    },
    thead: {
      background: "#f8fafc",
      borderBottom: "1px solid #e2e8f0",
    },
    th: {
      padding: "14px 16px",
      color: "#475569",
      fontWeight: "600",
      textTransform: "uppercase",
      fontSize: "11px",
      letterSpacing: "0.05em",
    },
    td: {
      padding: "16px",
      color: "#334155",
      borderBottom: "1px solid #f1f5f9",
    },
    noData: {
      padding: "48px",
      textAlign: "center",
      color: "#94a3b8",
      fontSize: "15px",
    },
    botonCargarMas: {
      display: "block",
      margin: "24px auto 0 auto",
      padding: "10px 24px",
      background: "#ffffff",
      color: "#2563eb",
      border: "1px solid #cbd5e1",
      borderRadius: "12px",
      fontWeight: "600",
      fontSize: "14px",
      cursor: "pointer",
      boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
      transition: "all 0.2s ease",
    }
  };

  if (cargando) {
    return <div style={estilos.cargando}>Cargando clientes...</div>;
  }

  return (
    <div style={estilos.contenedor}>
      <h1 style={estilos.titulo}>Clientes</h1>
      <p style={estilos.subtitulo}>
        Total en el sistema: <strong>{clientes.length}</strong> 
        {busqueda && ` | Encontrados: ${clientesFiltrados.length}`}
      </p>

      {/* BARRA DE FILTROS Y BUSCADOR */}
      <div style={estilos.barraHerramientas}>
        <input
          type="text"
          placeholder="Buscar por nombre o email..."
          value={busqueda}
          style={estilos.inputBusqueda}
          onChange={(e) => manejarCambioFiltro(e, "busqueda")}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "#3b82f6";
            e.currentTarget.style.backgroundColor = "#ffffff";
            e.currentTarget.style.boxShadow = "0 0 0 4px rgba(59, 130, 246, 0.08)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "#e2e8f0";
            e.currentTarget.style.backgroundColor = "#f8fafc";
            e.currentTarget.style.boxShadow = "none";
          }}
        />

        <select
          value={filtroOrden}
          style={estilos.selectFiltro}
          onChange={(e) => manejarCambioFiltro(e, "orden")}
        >
          <option value="nuevos">Más nuevos primero</option>
          <option value="viejos">Más viejos primero</option>
          <option value="az">Orden alfabético (A-Z)</option>
        </select>
      </div>

      {/* TABLA DE CLIENTES */}
      <div style={estilos.tablaContenedor}>
        <div style={{ overflowX: "auto" }}>
          <table style={estilos.tabla}>
            <thead style={estilos.thead}>
              <tr>
                <th style={estilos.th}>ID</th>
                <th style={estilos.th}>Nombre</th>
                <th style={estilos.th}>Email</th>
                <th style={estilos.th}>Registrado</th>
              </tr>
            </thead>

            <tbody>
              {clientesRenderizados.map((cliente) => (
                <tr key={cliente.id} className="tabla-fila">
                  <td style={{ ...estilos.td, fontWeight: "500", color: "#64748b" }}>
                    #{cliente.id}
                  </td>
                  <td style={{ ...estilos.td, fontWeight: "600", color: "#0f172a" }}>
                    {cliente.nombre}
                  </td>
                  <td style={estilos.td}>{cliente.email}</td>
                  <td style={estilos.td}>
                    {new Date(cliente.creadoEn).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {clientesOrdenados.length === 0 && (
          <div style={estilos.noData}>
            No se encontraron clientes que coincidan con la búsqueda.
          </div>
        )}
      </div>

      {/* BOTÓN DINÁMICO: "Cargar más" */}
      {/* Solo se muestra si quedan registros pendientes por renderizar en la lista actual */}
      {clientesOrdenados.length > limiteVisible && (
        <button
          onClick={cargarMasClientes}
          style={estilos.botonCargarMas}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#f8fafc";
            e.currentTarget.style.borderColor = "#94a3b8";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#ffffff";
            e.currentTarget.style.borderColor = "#cbd5e1";
          }}
        >
          Cargar más clientes ({clientesOrdenados.length - limiteVisible} restantes)
        </button>
      )}
    </div>
  );
}