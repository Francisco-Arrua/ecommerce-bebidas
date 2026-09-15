import { useEffect, useState } from "react";

export default function CredencialesMP() {
  const [estadoActual, setEstadoActual] = useState(null); // lo que devuelve el GET
  const [form, setForm] = useState({
    mpAccessToken: "",
    mpPublicKey: "",
    mpWebhookSecret: "",
  });

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [guardadoExitoso, setGuardadoExitoso] = useState(false);
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  const obtenerEstado = async () => {
    setCargando(true);
    try {
      const res = await fetch(`${API_URL}/configuracionpago`, {
        credentials: "include",
      });
      const data = await res.json();
      setEstadoActual(data);
      // La Public Key no es secreta, la precargamos. El Access Token y el
      // Webhook Secret nunca viajan completos desde el backend, así que
      // esos campos quedan vacíos hasta que el admin los vuelva a pegar.
      setForm((prev) => ({ ...prev, mpPublicKey: data.mpPublicKey || "" }));
    } catch (err) {
      console.error("Error al obtener credenciales de Mercado Pago:", err);
      setError("No se pudo cargar el estado actual de la configuración.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerEstado();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const guardarCredenciales = async () => {
    setError("");

    if (!form.mpAccessToken || !form.mpPublicKey) {
      setError("El Access Token y la Public Key son obligatorios.");
      return;
    }

    if (!estadoActual?.mpWebhookSecretConfigurado && !form.mpWebhookSecret) {
      setError("La clave secreta del Webhook es necesaria para confirmar los pagos automáticamente.");
      return;
    }

    setGuardando(true);
    try {
      const body = {
        mpAccessToken: form.mpAccessToken,
        mpPublicKey: form.mpPublicKey,
      };
      if (form.mpWebhookSecret) {
        body.mpWebhookSecret = form.mpWebhookSecret;
      }

      const res = await fetch(`${API_URL}/configuracionpago`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.mensaje || "No se pudieron guardar las credenciales.");
        setGuardando(false);
        return;
      }

      setGuardadoExitoso(true);
      setForm({ mpAccessToken: "", mpPublicKey: form.mpPublicKey, mpWebhookSecret: "" });
      await obtenerEstado();
      setTimeout(() => setGuardadoExitoso(false), 3000);
    } catch (err) {
      console.error("Error al guardar credenciales:", err);
      setError("Ocurrió un error de conexión al guardar.");
    } finally {
      setGuardando(false);
    }
  };

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
    fontFamily: "monospace",
  };

  const manejarFoco = (e) => {
    e.currentTarget.style.borderColor = "#3b82f6";
    e.currentTarget.style.backgroundColor = "#ffffff";
    e.currentTarget.style.boxShadow = "0 0 0 4px rgba(59, 130, 246, 0.1)";
  };

  const manejarBlur = (e) => {
    e.currentTarget.style.borderColor = "#e2e8f0";
    e.currentTarget.style.backgroundColor = "#f8fafc";
    e.currentTarget.style.boxShadow = "none";
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
      <header style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "26px", fontWeight: 800, margin: 0, color: "#111111", letterSpacing: "-0.03em" }}>
          Credenciales de Mercado Pago
        </h1>
        <p style={{ margin: "6px 0 0 0", color: "#64748b", fontSize: "14px", fontWeight: 500 }}>
          Conectá tu cuenta de Mercado Pago para poder cobrar en la tienda.
        </p>
      </header>

      <div
        style={{
          background: "#ffffff",
          padding: "36px",
          borderRadius: "24px",
          boxShadow: "0 20px 40px rgba(91, 91, 91, 0.33), 0 1px 3px rgba(255, 255, 255, 0.05)",
          display: "flex",
          flexDirection: "column",
          gap: "32px",
        }}
      >
        {/* ESTADO ACTUAL */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <span style={{ color: "#3b82f6", display: "flex" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 6v6l4 2"></path>
              </svg>
            </span>
            <h3 style={{ fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", margin: 0 }}>
              Estado Actual
            </h3>
          </div>

          {cargando ? (
            <p style={{ color: "#94a3b8", fontSize: "14px", margin: 0 }}>Cargando...</p>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                background: "#f8fafc",
                borderRadius: "14px",
                padding: "16px 20px",
                border: "1px solid #e2e8f0",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ display: "block", fontSize: "13px", color: "#334155", fontWeight: 600 }}>
                    Estado de la integración
                  </span>
                  <span style={{ display: "block", marginTop: "3px", fontSize: "12px", color: "#64748b" }}>
                    Indica si la tienda tiene los datos básicos para cobrar.
                  </span>
                </div>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    padding: "4px 10px",
                    borderRadius: "999px",
                    color: estadoActual?.configurado ? "#16a34a" : "#dc2626",
                    background: estadoActual?.configurado ? "rgba(22,163,74,0.1)" : "rgba(220,38,38,0.1)",
                  }}
                >
                  {estadoActual?.configurado ? "Listo para cobrar" : "Falta Access Token o Public Key"}
                </span>
              </div>

              {estadoActual?.mpAccessTokenEnmascarado && (
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                  <span style={{ color: "#64748b" }}>Access Token actual</span>
                  <span style={{ fontFamily: "monospace", color: "#334155" }}>
                    {estadoActual.mpAccessTokenEnmascarado}
                  </span>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                <div>
                  <span style={{ display: "block", color: "#64748b" }}>Confirmación automática de pagos</span>
                  <span style={{ display: "block", marginTop: "3px", fontSize: "12px", color: "#94a3b8" }}>
                    Usa el Webhook Secret para validar los avisos de Mercado Pago.
                  </span>
                </div>
                <span style={{ color: estadoActual?.mpWebhookSecretConfigurado ? "#16a34a" : "#dc2626", fontWeight: 600, whiteSpace: "nowrap" }}>
                  {estadoActual?.mpWebhookSecretConfigurado ? "Activa" : "Falta configurar"}
                </span>
              </div>

              {estadoActual?.updatedAt && (
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                  <span style={{ color: "#94a3b8" }}>Última actualización</span>
                  <span style={{ color: "#94a3b8" }}>
                    {new Date(estadoActual.updatedAt).toLocaleString("es-AR")}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* FORMULARIO */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <span style={{ color: "#3b82f6", display: "flex" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="11" width="18" height="10" rx="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </span>
            <h3 style={{ fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", margin: 0 }}>
              Actualizar Credenciales
            </h3>
          </div>

          <p style={{ fontSize: "12px", color: "#94a3b8", margin: "0 0 18px 0", lineHeight: 1.5 }}>
            Estos datos conectan tu tienda con tu cuenta de Mercado Pago. Los encontrás
            en Mercado Pago, dentro de <strong>Configuración de tu aplicación &gt; Credenciales</strong>.
            Por seguridad, al guardar cambios tenés que volver a pegar el Access Token y la Public Key completos.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>Access Token de Mercado Pago *</label>
              <input
                type="password"
                placeholder="APP_USR-xxxxxxxx-xxxxxx-xxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxxx"
                value={form.mpAccessToken}
                style={estiloInputBase}
                onChange={(e) => setForm({ ...form, mpAccessToken: e.target.value })}
                onFocus={manejarFoco}
                onBlur={manejarBlur}
              />
              <span style={{ fontSize: "12px", color: "#64748b", lineHeight: 1.45 }}>
                Es la clave privada que autoriza al backend a crear preferencias y consultar pagos. No la compartas ni la pongas en el frontend.
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>Public Key de Mercado Pago *</label>
              <input
                type="text"
                placeholder="APP_USR-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                value={form.mpPublicKey}
                style={estiloInputBase}
                onChange={(e) => setForm({ ...form, mpPublicKey: e.target.value })}
                onFocus={manejarFoco}
                onBlur={manejarBlur}
              />
              <span style={{ fontSize: "12px", color: "#64748b", lineHeight: 1.45 }}>
                Es el identificador público de tu aplicación. Mercado Pago la muestra junto al Access Token.
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>
                Clave secreta del Webhook *
              </label>
              <input
                type="password"
                placeholder="Clave secreta del panel de Webhooks de Mercado Pago"
                value={form.mpWebhookSecret}
                style={estiloInputBase}
                onChange={(e) => setForm({ ...form, mpWebhookSecret: e.target.value })}
                onFocus={manejarFoco}
                onBlur={manejarBlur}
              />
              <span style={{ fontSize: "12px", color: "#64748b", lineHeight: 1.45 }}>
                Es la clave que Mercado Pago usa para firmar las notificaciones de pago. Permite verificar que el aviso sea auténtico y confirmar la orden automáticamente.
              </span>
            </div>
          </div>
        </div>

        {error && (
          <p style={{ color: "#dc2626", fontSize: "13px", fontWeight: 600, margin: 0 }}>{error}</p>
        )}

        <div style={{ paddingTop: "20px", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "16px" }}>
          {guardadoExitoso && (
            <span style={{ color: "#16a34a", fontSize: "14px", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              ¡Credenciales guardadas!
            </span>
          )}

          <button
            onClick={guardarCredenciales}
            disabled={guardando || guardadoExitoso}
            style={{
              padding: "12px 24px",
              background: guardadoExitoso ? "#16a34a" : "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontWeight: "600",
              fontSize: "14px",
              cursor: guardando || guardadoExitoso ? "default" : "pointer",
              boxShadow: guardadoExitoso ? "none" : "0 4px 12px rgba(37,99,235,0.15)",
              transition: "all 0.2s ease",
              opacity: guardando ? 0.7 : 1,
            }}
            onMouseEnter={(e) => {
              if (!guardadoExitoso && !guardando) e.currentTarget.style.background = "#1d4ed8";
            }}
            onMouseLeave={(e) => {
              if (!guardadoExitoso && !guardando) e.currentTarget.style.background = "#2563eb";
            }}
          >
            {guardando ? "Guardando..." : guardadoExitoso ? "Credenciales Actualizadas" : "Guardar Credenciales"}
          </button>
        </div>
      </div>
    </div>
  );
}