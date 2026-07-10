import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function RestablecerPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Extraemos el token que viene en la URL de forma nativa (?token=...)
  const token = searchParams.get("token");

  const [nuevaPassword, setNuevaPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    if (nuevaPassword !== confirmarPassword) {
      return setError("Las contraseñas no coinciden.");
    }

    if (nuevaPassword.length < 6) {
      return setError("La contraseña debe tener al menos 6 caracteres.");
    }

    setCargando(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/restablecer-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, nuevaPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.mensaje || "El enlace es inválido o expiró.");
      }

      setMensaje(data.mensaje);
      
      // Redirigimos al login en 3 segundos para que llegue a leer el mensaje de éxito
      setTimeout(() => {
        navigate("/login");
      }, 3000);

    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a0c",
        fontFamily: "Inter, sans-serif",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "rgba(255, 255, 255, 0.02)",
          backdropFilter: "blur(16px)",
          borderRadius: "16px",
          border: "1px solid rgba(255, 255, 255, 0.06)",
          padding: "40px 30px",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
        }}
      >
        <h2 style={{ color: "#ffffff", fontSize: "28px", fontWeight: 800, margin: "0 0 8px 0", letterSpacing: "-0.04em" }}>
          Establecer nueva contraseña
        </h2>
        <p style={{ color: "#94a3b8", fontSize: "14px", margin: "0 0 24px 0" }}>
          Ingresá tu nueva clave de acceso para recuperar tu cuenta.
        </p>

        {mensaje && (
          <div style={{ background: "rgba(34, 197, 94, 0.1)", border: "1px solid rgba(34, 197, 94, 0.2)", color: "#4ade80", padding: "12px", borderRadius: "10px", fontSize: "14px", marginBottom: "20px", fontWeight: 500 }}>
            {mensaje} Redirigiendo al login...
          </div>
        )}

        {error && (
          <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", color: "#f87171", padding: "12px", borderRadius: "10px", fontSize: "14px", marginBottom: "20px", fontWeight: 500 }}>
            {error}
          </div>
        )}

        <form onSubmit={manejarEnvio} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ color: "#94a3b8", fontSize: "13px", fontWeight: 600, display: "block", marginBottom: "6px" }}>Nueva Contraseña</label>
            <input
              type="password"
              required
              value={nuevaPassword}
              onChange={(e) => setNuevaPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.08)", backgroundColor: "rgba(255, 255, 255, 0.04)", color: "#ffffff", fontSize: "14px", outline: "none" }}
            />
          </div>

          <div>
            <label style={{ color: "#94a3b8", fontSize: "13px", fontWeight: 600, display: "block", marginBottom: "6px" }}>Confirmar Nueva Contraseña</label>
            <input
              type="password"
              required
              value={confirmarPassword}
              onChange={(e) => setConfirmarPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.08)", backgroundColor: "rgba(255, 255, 255, 0.04)", color: "#ffffff", fontSize: "14px", outline: "none" }}
            />
          </div>

          <button
            type="submit"
            disabled={cargando}
            style={{ width: "100%", padding: "14px", borderRadius: "10px", border: "none", backgroundColor: cargando ? "#475569" : "#ffffff", color: "#000000", fontSize: "14px", fontWeight: 700, cursor: cargando ? "not-allowed" : "pointer", marginTop: "10px", transition: "background 0.2s" }}
          >
            {cargando ? "Guardando..." : "Actualizar Contraseña"}
          </button>
        </form>
      </div>
    </div>
  );
}