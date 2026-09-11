import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const labelStyle = {
  display: "block",
  fontSize: "11px",
  fontWeight: 700,
  textTransform: "uppercase",
  color: "#64748b",
  marginBottom: "6px",
};

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #cbd5e1",
  outline: "none",
  boxSizing: "border-box",
};

export default function Envio() {
  const { carrito } = useContext(CartContext);
  const navigate = useNavigate();

  // ✅ Todos los hooks van ANTES de cualquier return condicional (Reglas de los Hooks)
  const [metodoEntrega, setMetodoEntrega] = useState("retiro"); // "retiro" | "envio"
  const [formData, setFormData] = useState({
    nombreRecibe: "",
    telefono: "",
    provincia: "",
    localidad: "",
    codigoPostal: "",
    calle: "",
    numero: "",
    pisoDepto: "",
    aclaraciones: "",
  });

  const itemsDelCarrito = Array.isArray(carrito) ? carrito : carrito?.items || [];

  const handleChangeInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleContinuarPago = (e) => {
    e.preventDefault();

    const datosEnvio = {
      nombreRecibe: formData.nombreRecibe,
      telefono: formData.telefono,
      // Si es retiro, mandamos valores fijos del local en vez de pedirle datos al usuario
      provincia: metodoEntrega === "envio" ? formData.provincia : "Retiro en local",
      localidad: metodoEntrega === "envio" ? formData.localidad : "Retiro en local",
      codigoPostal: metodoEntrega === "envio" ? formData.codigoPostal : "S/N",
      calle: metodoEntrega === "envio" ? formData.calle : "Retiro en local",
      numero: metodoEntrega === "envio" ? formData.numero : "S/N",
      pisoDepto: formData.pisoDepto || null,
      aclaraciones: formData.aclaraciones || null,
    };

    const checkoutData = {
      metodoEnvio: metodoEntrega === "envio" ? "Envío a Domicilio" : "Retiro por Local",
      costoEnvio: metodoEntrega === "envio" ? 0 : 0, // ajustar cuando tengas costos reales de envío
      datosEnvio,
    };

    localStorage.setItem("datosEnvio", JSON.stringify(checkoutData));
    navigate("/pago");
  };

  // Si el carrito está vacío, redirigimos
  if (itemsDelCarrito.length === 0) {
    return (
      <div style={{ background: "#ffffff", minHeight: "100vh", fontFamily: "Inter, sans-serif" }}>
        <Navbar />
        <main style={{ maxWidth: "600px", margin: "80px auto", textAlign: "center", padding: "0 24px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: 900, textTransform: "uppercase", marginBottom: "16px" }}>
            Tu carrito está vacío
          </h2>
          <Link to="/" style={{ color: "#0f172a", fontWeight: 700, textTransform: "uppercase" }}>
            Ir a la tienda
          </Link>
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
          <h1 style={{ fontSize: "24px", fontWeight: 900, color: "#0f172a", margin: "0 0 8px 0", textTransform: "uppercase", letterSpacing: "-0.03em" }}>
            Datos de Entrega y Contacto
          </h1>
          <p style={{ color: "#64748b", fontSize: "13px", fontWeight: 600, textTransform: "uppercase", margin: 0 }}>
            Paso 2 de 3: Selección de entrega
          </p>
        </div>

        <form onSubmit={handleContinuarPago} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ background: "#ffffff", border: "1px solid #0f172a", padding: "28px", display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* SELECCIÓN MÉTODO DE ENTREGA */}
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 800, textTransform: "uppercase", color: "#0f172a", marginBottom: "10px" }}>
                Método de Entrega *
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <button
                  type="button"
                  onClick={() => setMetodoEntrega("retiro")}
                  style={{
                    padding: "14px",
                    border: "1px solid #0f172a",
                    background: metodoEntrega === "retiro" ? "#0f172a" : "#ffffff",
                    color: metodoEntrega === "retiro" ? "#ffffff" : "#0f172a",
                    fontWeight: 800,
                    fontSize: "12px",
                    textTransform: "uppercase",
                    cursor: "pointer",
                  }}
                >
                  Retiro por Local
                </button>
                <button
                  type="button"
                  onClick={() => setMetodoEntrega("envio")}
                  style={{
                    padding: "14px",
                    border: "1px solid #0f172a",
                    background: metodoEntrega === "envio" ? "#0f172a" : "#ffffff",
                    color: metodoEntrega === "envio" ? "#ffffff" : "#0f172a",
                    fontWeight: 800,
                    fontSize: "12px",
                    textTransform: "uppercase",
                    cursor: "pointer",
                  }}
                >
                  Envío a Domicilio
                </button>
              </div>
            </div>

            {/* CAMPOS PERSONALES */}
            <div>
              <label style={labelStyle}>Nombre y Apellido *</label>
              <input
                type="text"
                name="nombreRecibe"
                required
                value={formData.nombreRecibe}
                onChange={handleChangeInput}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Teléfono / WhatsApp *</label>
              <input
                type="tel"
                name="telefono"
                required
                placeholder="Ej: 3421234567"
                value={formData.telefono}
                onChange={handleChangeInput}
                style={inputStyle}
              />
            </div>

            {/* CAMPOS DE DIRECCIÓN (SOLO SI ES ENVÍO) */}
            {metodoEntrega === "envio" && (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "16px" }}>
                  <div>
                    <label style={labelStyle}>Calle *</label>
                    <input
                      type="text"
                      name="calle"
                      required
                      value={formData.calle}
                      onChange={handleChangeInput}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Número *</label>
                    <input
                      type="text"
                      name="numero"
                      required
                      value={formData.numero}
                      onChange={handleChangeInput}
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Piso / Depto</label>
                  <input
                    type="text"
                    name="pisoDepto"
                    value={formData.pisoDepto}
                    onChange={handleChangeInput}
                    style={inputStyle}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "16px" }}>
                  <div>
                    <label style={labelStyle}>Provincia *</label>
                    <input
                      type="text"
                      name="provincia"
                      required
                      value={formData.provincia}
                      onChange={handleChangeInput}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Código Postal *</label>
                    <input
                      type="text"
                      name="codigoPostal"
                      required
                      value={formData.codigoPostal}
                      onChange={handleChangeInput}
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Localidad *</label>
                  <input
                    type="text"
                    name="localidad"
                    required
                    value={formData.localidad}
                    onChange={handleChangeInput}
                    style={inputStyle}
                  />
                </div>
              </>
            )}

            <div>
              <label style={labelStyle}>Observaciones / Notas Adicionales</label>
              <textarea
                name="aclaraciones"
                rows="3"
                placeholder="Aclaraciones, horarios de preferencia, etc."
                value={formData.aclaraciones}
                onChange={handleChangeInput}
                style={{ ...inputStyle, resize: "none" }}
              />
            </div>

          </div>

          {/* ACCIONES */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
            <button
              type="button"
              onClick={() => navigate("/carrito")}
              style={{ background: "none", border: "1px solid #0f172a", padding: "16px 24px", color: "#0f172a", fontWeight: 800, fontSize: "13px", textTransform: "uppercase", cursor: "pointer" }}
            >
              ← Volver al carrito
            </button>

            <button
              type="submit"
              style={{ background: "#0f172a", color: "#ffffff", border: "1px solid #0f172a", padding: "16px 32px", fontWeight: "900", fontSize: "14px", textTransform: "uppercase", cursor: "pointer" }}
            >
              Continuar al Pago →
            </button>
          </div>
        </form>

      </main>

      <Footer />
    </div>
  );
}