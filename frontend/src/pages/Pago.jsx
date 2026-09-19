import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { obtenerPrecioVigente } from "../utils/precioProducto";

export default function Pago() {
  const { carrito } = useContext(CartContext);
  const navigate = useNavigate();

  const [checkoutData, setCheckoutData] = useState(null);
  const [opcionesEnvio, setOpcionesEnvio] = useState([]);
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState("");

  const itemsDelCarrito = Array.isArray(carrito) ? carrito : carrito?.items || [];

  const totalCompra = itemsDelCarrito.reduce((acc, item) => {
    const precio = obtenerPrecioVigente(item.producto || item.Producto || item);
    return acc + Number(precio) * item.cantidad;
  }, 0);

  // Leemos lo que guardó Envio.jsx en localStorage
  useEffect(() => {
    const datosGuardados = localStorage.getItem("datosEnvio");
    if (!datosGuardados) {
      navigate("/envio");
      return;
    }
    setCheckoutData(JSON.parse(datosGuardados));
  }, [navigate]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/envio`)
      .then((res) => res.json())
      .then(setOpcionesEnvio)
      .catch(() => setOpcionesEnvio([]));
  }, []);

  const opcionEnvio = opcionesEnvio.find(
    (opcion) => String(opcion.id) === String(checkoutData?.opcionEnvioId)
  );
  const costoEnvio = Number(opcionEnvio?.costo || 0);

  const handlePagarConMercadoPago = async () => {
    if (!checkoutData) return;
    setProcesando(true);
    setError("");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/pagos/crear-preferencia`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(checkoutData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.mensaje || "No se pudo iniciar el pago. Intentá nuevamente.");
        setProcesando(false);
        return;
      }

      // Ya no necesitamos estos datos guardados localmente
      localStorage.removeItem("datosEnvio");

      // Redirigimos al checkout hospedado de Mercado Pago
      window.location.href = data.initPoint;
    } catch (err) {
      console.error(err);
      setError("Ocurrió un error de conexión. Intentá nuevamente.");
      setProcesando(false);
    }
  };

  if (itemsDelCarrito.length === 0) {
    return (
      <div style={{ background: "#ffffff", minHeight: "100vh", fontFamily: "Inter, sans-serif" }}>
        <Navbar />
        <main style={{ maxWidth: "600px", margin: "80px auto", textAlign: "center", padding: "0 24px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: 900, textTransform: "uppercase", marginBottom: "16px" }}>
            Tu carrito está vacío
          </h2>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ background: "#ffffff", minHeight: "100vh", fontFamily: "Inter, sans-serif", color: "#0f172a" }}>
      <Navbar />

      <main style={{ maxWidth: "700px", margin: "60px auto", padding: "0 24px" }}>
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: 900, margin: "0 0 8px 0", textTransform: "uppercase", letterSpacing: "-0.03em" }}>
            Confirmar y Pagar
          </h1>
          <p style={{ color: "#64748b", fontSize: "13px", fontWeight: 600, textTransform: "uppercase", margin: 0 }}>
            Paso 3 de 3: Pago
          </p>
        </div>

        <div style={{ border: "1px solid #0f172a", padding: "28px", display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* RESUMEN DE PRODUCTOS */}
          <div>
            <h3 style={{ fontSize: "13px", fontWeight: 800, textTransform: "uppercase", marginBottom: "12px" }}>
              Resumen del pedido
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {itemsDelCarrito.map((item) => {
                const nombre = item.nombre || item.Producto?.nombre || item.producto?.nombre;
                const precio = obtenerPrecioVigente(item.producto || item.Producto || item);
                return (
                  <div key={item.id || item.productoId} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                    <span>{nombre} x{item.cantidad}</span>
                    <span style={{ fontWeight: 700 }}>
                      $ {(Number(precio) * item.cantidad).toLocaleString("es-AR")}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* MÉTODO DE ENTREGA */}
          {checkoutData && (
            <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "16px", fontSize: "13px" }}>
              <p style={{ margin: "0 0 4px 0" }}>
                <strong>Entrega:</strong> {opcionEnvio?.nombre || "Cargando..."}
              </p>
              <p style={{ margin: 0 }}>
                <strong>Destinatario:</strong> {checkoutData.datosEnvio?.nombreRecibe}
              </p>
            </div>
          )}

          {/* TOTAL */}
          <div style={{ borderTop: "1px solid #0f172a", paddingTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase" }}>Total a pagar</span>
            <span style={{ fontSize: "24px", fontWeight: 900 }}>
              $ {(totalCompra + costoEnvio).toLocaleString("es-AR")}
            </span>
          </div>

          {error && (
            <p style={{ color: "#ef4444", fontSize: "13px", fontWeight: 700, margin: 0 }}>
              {error}
            </p>
          )}

          <button
            onClick={handlePagarConMercadoPago}
            disabled={procesando || !checkoutData}
            style={{
              background: "#009ee3",
              color: "#ffffff",
              border: "none",
              padding: "18px",
              fontWeight: 900,
              fontSize: "14px",
              textTransform: "uppercase",
              cursor: procesando ? "not-allowed" : "pointer",
              opacity: procesando ? 0.7 : 1,
            }}
          >
            {procesando ? "Redirigiendo a Mercado Pago..." : "Pagar con Mercado Pago"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/envio")}
            disabled={procesando}
            style={{ background: "none", border: "1px solid #0f172a", padding: "14px", color: "#0f172a", fontWeight: 800, fontSize: "12px", textTransform: "uppercase", cursor: "pointer" }}
          >
            ← Volver
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}