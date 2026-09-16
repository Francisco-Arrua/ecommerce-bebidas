import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { iniciarSesion } = useAuth();
  const [formData, setFormData] = useState({ nombre: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const RecordarEntrada = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.mensaje || "Error al registrar usuario");
      }

      // Antes esto dependía 100% de la cookie: si el navegador la bloqueaba
      // (Safari/iOS y muchos mobile por default), el usuario quedaba
      // registrado en la DB pero nunca "entraba". Ahora guardamos el token
      // como respaldo y logueamos directo con los datos que ya tenemos.
      iniciarSesion(data.token, data.usuario);
      navigate("/");
    } catch (err) {
      setError(err.message);
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
          Crear cuenta
        </h2>
        <p style={{ color: "#94a3b8", fontSize: "14px", margin: "0 0 24px 0" }}>
          Registrate para empezar a comprar.
        </p>

        {error && (
          <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", color: "#f87171", padding: "12px", borderRadius: "10px", fontSize: "14px", marginBottom: "20px", fontWeight: 500 }}>
            {error}
          </div>
        )}

        <form onSubmit={manejarEnvio} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ color: "#94a3b8", fontSize: "13px", fontWeight: 600, display: "block", marginBottom: "6px" }}>Nombre completo</label>
            <input
              type="text"
              name="nombre"
              required
              value={formData.nombre}
              onChange={RecordarEntrada}
              placeholder="Nombre y Apellido"
              style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.08)", backgroundColor: "rgba(255, 255, 255, 0.04)", color: "#ffffff", fontSize: "14px", outline: "none" }}
            />
          </div>

          <div>
            <label style={{ color: "#94a3b8", fontSize: "13px", fontWeight: 600, display: "block", marginBottom: "6px" }}>Correo electrónico</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={RecordarEntrada}
              placeholder="correo@ejemplo.com"
              style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.08)", backgroundColor: "rgba(255, 255, 255, 0.04)", color: "#ffffff", fontSize: "14px", outline: "none" }}
            />
          </div>

          <div>
            <label style={{ color: "#94a3b8", fontSize: "13px", fontWeight: 600, display: "block", marginBottom: "6px" }}>Contraseña</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={RecordarEntrada}
              placeholder="••••••••"
              style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.08)", backgroundColor: "rgba(255, 255, 255, 0.04)", color: "#ffffff", fontSize: "14px", outline: "none" }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: "100%", padding: "14px", borderRadius: "10px", border: "none", backgroundColor: loading ? "#475569" : "#ffffff", color: "#000000", fontSize: "14px", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", marginTop: "10px", transition: "background 0.2s" }}
          >
            {loading ? "Registrando..." : "Registrarse"}
          </button>
        </form>

        <p style={{ color: "#64748b", fontSize: "14px", textAlign: "center", marginTop: "24px", margin: "24px 0 0 0" }}>
          ¿Ya tenés cuenta?{" "}
          <Link to="/login" style={{ color: "#ffffff", textDecoration: "none", fontWeight: 600 }}>
            Iniciá sesión
          </Link>
        </p>
      </div>
    </div>
  );
}