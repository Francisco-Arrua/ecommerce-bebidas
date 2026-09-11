import { useEffect, useState } from "react";

const COLOR_ESTADO_ORDEN = {
  PENDIENTE: { color: "#b45309", bg: "rgba(180,83,9,0.1)" },
  PAGADO: { color: "#16a34a", bg: "rgba(22,163,74,0.1)" },
  CANCELADO: { color: "#dc2626", bg: "rgba(220,38,38,0.1)" },
};

const COLOR_ESTADO_PAGO = {
  PENDIENTE: { color: "#b45309", bg: "rgba(180,83,9,0.1)" },
  APROBADO: { color: "#16a34a", bg: "rgba(22,163,74,0.1)" },
  RECHAZADO: { color: "#dc2626", bg: "rgba(220,38,38,0.1)" },
  REEMBOLSADO: { color: "#7c3aed", bg: "rgba(124,58,237,0.1)" },
};

const FILTROS = [
  { valor: "TODAS", etiqueta: "Todas" },
  { valor: "PENDIENTE", etiqueta: "Pendientes" },
  { valor: "PAGADO", etiqueta: "Pagadas" },
  { valor: "CANCELADO", etiqueta: "Canceladas" },
];

const Badge = ({ texto, colorInfo }) => (
  <span
    style={{
      fontSize: "12px",
      fontWeight: 700,
      padding: "4px 10px",
      borderRadius: "999px",
      color: colorInfo?.color || "#334155",
      background: colorInfo?.bg || "#f1f5f9",
      whiteSpace: "nowrap",
    }}
  >
    {texto}
  </span>
);

export default function Pedidos() {
  const [ordenes, setOrdenes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [filtro, setFiltro] = useState("TODAS");
  const [ordenAbierta, setOrdenAbierta] = useState(null);
  const [actualizandoId, setActualizandoId] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const obtenerOrdenes = async () => {
    setCargando(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/orden/admin/todas`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error("No se pudieron cargar los pedidos");
      }

      const data = await res.json();
      setOrdenes(data);
    } catch (err) {
      console.error("Error al obtener pedidos:", err);
      setError("No se pudieron cargar los pedidos. Probá recargar la página.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerOrdenes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const actualizarEstadoOrden = async (ordenId, cambios) => {
    setActualizandoId(ordenId);
    try {
      const res = await fetch(`${API_URL}/orden/${ordenId}/estado`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cambios),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.mensaje || "No se pudo actualizar el pedido");
        return;
      }

      setOrdenes((prev) =>
        prev.map((o) => (o.id === ordenId ? { ...o, ...data.orden } : o))
      );
    } catch (err) {
      console.error("Error al actualizar pedido:", err);
      alert("Error de conexión al actualizar el pedido");
    } finally {
      setActualizandoId(null);
    }
  };

  const ordenesFiltradas =
    filtro === "TODAS" ? ordenes : ordenes.filter((o) => o.estado === filtro);

  const estiloSelect = {
    padding: "8px 12px",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    fontSize: "13px",
    fontWeight: 600,
    color: "#334155",
    background: "#f8fafc",
    outline: "none",
    cursor: "pointer",
  };

  return (
    <div
      style={{
        maxWidth: "960px",
        margin: "0 auto",
        padding: "16px 8px 40px 8px",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <header style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "26px", fontWeight: 800, margin: 0, color: "#111111", letterSpacing: "-0.03em" }}>
          Pedidos
        </h1>
        <p style={{ margin: "6px 0 0 0", color: "#64748b", fontSize: "14px", fontWeight: 500 }}>
          Gestioná los pedidos de tus clientes, su estado de pago y de envío.
        </p>
      </header>

      {/* FILTROS */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
        {FILTROS.map((f) => (
          <button
            key={f.valor}
            onClick={() => setFiltro(f.valor)}
            style={{
              padding: "8px 16px",
              borderRadius: "999px",
              border: filtro === f.valor ? "1px solid #2563eb" : "1px solid #e2e8f0",
              background: filtro === f.valor ? "#2563eb" : "#ffffff",
              color: filtro === f.valor ? "#ffffff" : "#334155",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            {f.etiqueta}
          </button>
        ))}
      </div>

      {cargando && (
        <p style={{ color: "#94a3b8", fontSize: "14px" }}>Cargando pedidos...</p>
      )}

      {error && (
        <p style={{ color: "#dc2626", fontSize: "14px", fontWeight: 600 }}>{error}</p>
      )}

      {!cargando && !error && ordenesFiltradas.length === 0 && (
        <div
          style={{
            background: "#ffffff",
            borderRadius: "20px",
            padding: "40px",
            textAlign: "center",
            color: "#94a3b8",
            fontSize: "14px",
            boxShadow: "0 20px 40px rgba(91, 91, 91, 0.15)",
          }}
        >
          No hay pedidos en esta categoría todavía.
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {ordenesFiltradas.map((orden) => {
          const abierta = ordenAbierta === orden.id;
          const ultimoPago = orden.pagos?.[orden.pagos.length - 1];

          return (
            <div
              key={orden.id}
              style={{
                background: "#ffffff",
                borderRadius: "20px",
                boxShadow: "0 12px 30px rgba(91, 91, 91, 0.15)",
                overflow: "hidden",
              }}
            >
              {/* CABECERA */}
              <div
                onClick={() => setOrdenAbierta(abierta ? null : orden.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "16px",
                  padding: "20px 24px",
                  cursor: "pointer",
                  flexWrap: "wrap",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "4px", minWidth: "180px" }}>
                  <span style={{ fontSize: "15px", fontWeight: 700, color: "#111111" }}>
                    Pedido #{orden.id}
                  </span>
                  <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                    {new Date(orden.createdAt).toLocaleString("es-AR")}
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "4px", minWidth: "160px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>
                    {orden.usuario?.nombre}
                  </span>
                  <span style={{ fontSize: "12px", color: "#94a3b8" }}>{orden.usuario?.email}</span>
                </div>

                <span style={{ fontSize: "16px", fontWeight: 800, color: "#111111" }}>
                  $ {Number(orden.totalGeneral).toLocaleString("es-AR")}
                </span>

                <Badge texto={orden.estado} colorInfo={COLOR_ESTADO_ORDEN[orden.estado]} />

                {ultimoPago && (
                  <Badge
                    texto={`Pago: ${ultimoPago.estado}`}
                    colorInfo={COLOR_ESTADO_PAGO[ultimoPago.estado]}
                  />
                )}

                <span style={{ color: "#94a3b8", fontSize: "18px" }}>{abierta ? "▲" : "▼"}</span>
              </div>

              {/* DETALLE EXPANDIDO */}
              {abierta && (
                <div style={{ padding: "0 24px 24px 24px", borderTop: "1px solid #f1f5f9" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", paddingTop: "20px" }}>

                    {/* PRODUCTOS */}
                    <div>
                      <h4 style={{ fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 12px 0" }}>
                        Productos
                      </h4>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {orden.items?.map((item) => (
                          <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                            <span style={{ color: "#334155" }}>
                              {item.nombreProducto}
                              {item.talle ? ` (Talle ${item.talle})` : ""} x{item.cantidad}
                            </span>
                            <span style={{ fontWeight: 600, color: "#111111" }}>
                              $ {(Number(item.precioUnitario) * item.cantidad).toLocaleString("es-AR")}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div style={{ marginTop: "10px", paddingTop: "10px", borderTop: "1px dashed #e2e8f0", display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                        <span style={{ color: "#64748b" }}>Envío ({orden.metodoEnvio})</span>
                        <span style={{ fontWeight: 600 }}>
                          $ {Number(orden.costoEnvio).toLocaleString("es-AR")}
                        </span>
                      </div>
                    </div>

                    {/* ENTREGA Y PAGO */}
                    <div>
                      <h4 style={{ fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 12px 0" }}>
                        Entrega
                      </h4>
                      {orden.direccion ? (
                        <div style={{ fontSize: "13px", color: "#334155", lineHeight: 1.6 }}>
                          <div>{orden.direccion.nombreRecibe} · {orden.direccion.telefono}</div>
                          <div>
                            {orden.direccion.calle} {orden.direccion.numero}
                            {orden.direccion.pisoDepto ? `, ${orden.direccion.pisoDepto}` : ""}
                          </div>
                          <div>{orden.direccion.localidad}, {orden.direccion.provincia} ({orden.direccion.codigoPostal})</div>
                          {orden.direccion.aclaraciones && (
                            <div style={{ color: "#94a3b8", marginTop: "4px" }}>
                              "{orden.direccion.aclaraciones}"
                            </div>
                          )}
                        </div>
                      ) : (
                        <p style={{ fontSize: "13px", color: "#94a3b8" }}>Sin datos de dirección</p>
                      )}

                      <h4 style={{ fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", margin: "18px 0 12px 0" }}>
                        Forma de Pago
                      </h4>
                      {orden.pagos && orden.pagos.length > 0 ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          {orden.pagos.map((pago) => (
                            <div key={pago.id} style={{ fontSize: "13px", color: "#334155", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span>
                                {pago.metodoPago} · $ {Number(pago.monto).toLocaleString("es-AR")}
                                {pago.mpPaymentId && (
                                  <span style={{ color: "#94a3b8" }}> (#{pago.mpPaymentId})</span>
                                )}
                              </span>
                              <Badge texto={pago.estado} colorInfo={COLOR_ESTADO_PAGO[pago.estado]} />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p style={{ fontSize: "13px", color: "#94a3b8" }}>Sin intentos de pago registrados</p>
                      )}
                    </div>
                  </div>

                  {/* ACCIONES DE ESTADO */}
                  <div
                    style={{
                      marginTop: "20px",
                      paddingTop: "20px",
                      borderTop: "1px solid #f1f5f9",
                      display: "flex",
                      gap: "20px",
                      flexWrap: "wrap",
                      alignItems: "flex-end",
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <label style={{ fontSize: "12px", fontWeight: 600, color: "#64748b" }}>Estado del pedido</label>
                      <select
                        value={orden.estado}
                        disabled={actualizandoId === orden.id}
                        onChange={(e) => actualizarEstadoOrden(orden.id, { estado: e.target.value })}
                        style={estiloSelect}
                      >
                        <option value="PENDIENTE">Pendiente</option>
                        <option value="PAGADO">Pagado</option>
                        <option value="CANCELADO">Cancelado</option>
                      </select>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <label style={{ fontSize: "12px", fontWeight: 600, color: "#64748b" }}>Estado del envío</label>
                      <select
                        value={orden.estadoEnvio}
                        disabled={actualizandoId === orden.id}
                        onChange={(e) => actualizarEstadoOrden(orden.id, { estadoEnvio: e.target.value })}
                        style={estiloSelect}
                      >
                        <option value="PENDIENTE_DESPACHO">Pendiente de despacho</option>
                        <option value="ENVIADO">Enviado</option>
                        <option value="ENTREGADO">Entregado</option>
                      </select>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: "1", minWidth: "220px" }}>
                      <label style={{ fontSize: "12px", fontWeight: 600, color: "#64748b" }}>Código de seguimiento</label>
                      <input
                        type="text"
                        defaultValue={orden.codigoSeguimiento || ""}
                        placeholder="Ej: AR123456789"
                        onBlur={(e) => {
                          if (e.target.value !== (orden.codigoSeguimiento || "")) {
                            actualizarEstadoOrden(orden.id, { codigoSeguimiento: e.target.value });
                          }
                        }}
                        style={{ ...estiloSelect, cursor: "text" }}
                      />
                    </div>

                    {actualizandoId === orden.id && (
                      <span style={{ fontSize: "12px", color: "#94a3b8" }}>Guardando...</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}