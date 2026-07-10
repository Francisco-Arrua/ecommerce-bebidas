import { useState } from "react";

export default function CambiarPasswordPerfil() {
  const [passwordActual, setPasswordActual] = useState("");
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token"); 

      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/cambiar-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, 
        },
        body: JSON.stringify({ passwordActual, nuevaPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.mensaje || "Error al cambiar la contraseña");
      }

      setMensaje(data.mensaje);
      setPasswordActual("");
      setNuevaPassword("");
    } catch (err) {
      setError(err.message || "Error al cambiar la contraseña");
    } finally {
      setLoading(false);
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
          Cambiar Contraseña
        </h2>
        <p style={{ color: "#94a3b8", fontSize: "14px", margin: "0 0 24px 0" }}>
          Ingresá tus credenciales actuales y tu nueva clave para actualizar.
        </p>

        {mensaje && (
          <div style={{ background: "rgba(34, 197, 94, 0.1)", border: "1px solid rgba(34, 197, 94, 0.2)", color: "#4ade80", padding: "12px", borderRadius: "10px", fontSize: "14px", marginBottom: "20px", fontWeight: 500 }}>
            {mensaje}
          </div>
        )}

        {error && (
          <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", color: "#f87171", padding: "12px", borderRadius: "10px", fontSize: "14px", marginBottom: "20px", fontWeight: 500 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ color: "#94a3b8", fontSize: "13px", fontWeight: 600, display: "block", marginBottom: "6px" }}>Contraseña Actual</label>
            <input
              type="password"
              required
              value={passwordActual}
              onChange={(e) => setPasswordActual(e.target.value)}
              placeholder="••••••••"
              style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.08)", backgroundColor: "rgba(255, 255, 255, 0.04)", color: "#ffffff", fontSize: "14px", outline: "none" }}
            />
          </div>

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

          <button
            type="submit"
            disabled={loading}
            style={{ width: "100%", padding: "14px", borderRadius: "10px", border: "none", backgroundColor: loading ? "#475569" : "#ffffff", color: "#000000", fontSize: "14px", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", marginTop: "10px", transition: "background 0.2s" }}
          >
            {loading ? "Actualizando..." : "Actualizar Contraseña"}
          </button>
        </form>
      </div>
    </div>
  );
}