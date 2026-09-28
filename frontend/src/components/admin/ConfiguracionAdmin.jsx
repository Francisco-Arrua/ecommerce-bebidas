import { useEffect, useState } from "react";

export default function ConfiguracionAdmin() {
  const [configuracion, setConfiguracion] = useState({
    nombreTienda: "",
    whatsapp: "",
    instagram: "",
    facebook: "",
  });

  const [guardadoExitoso, setGuardadoExitoso] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const obtenerConfiguracion = async () => {
    try {
      const res = await fetch(`${API_URL}/configuracion`);
      const data = await res.json();
      setConfiguracion({
        nombreTienda: data.nombreTienda || "",
        whatsapp: data.whatsapp || "",
        instagram: data.instagram || "",
        facebook: data.facebook || "",
      });
    } catch (error) {
      console.error("Error al obtener configuración:", error);
    }
  };

  useEffect(() => {
    obtenerConfiguracion();
  }, []);

  const guardarConfiguracion = async () => {
    try {
      await fetch(`${API_URL}/configuracion`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(configuracion),
      });
      setGuardadoExitoso(true);
      setTimeout(() => setGuardadoExitoso(false), 3000);
    } catch (error) {
      console.error("Error al guardar configuración:", error);
    }
  };

  // Objeto de estilos comunes para inputs limpios y responsivos
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

  return (
    <div
      style={{
        maxWidth: "760px",
        margin: "0 auto",
        padding: "16px 8px 40px 8px", // Relleno calibrado para no encajonarse
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Encabezado de la Sección integrado en el tono de la app */}
      <header style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "26px", fontWeight: 800, margin: 0, color: "#111111", letterSpacing: "-0.03em" }}>
          Configuración General
        </h1>
        <p style={{ margin: "6px 0 0 0", color: "#64748b", fontSize: "14px", fontWeight: 500 }}>
          Llena los campos con la información de tu tienda.
        </p>
      </header>

      {/* Tarjeta Contenedora Principal (Blanco predominante controlado) */}
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
        {/* BLOQUE 1: Información de la tienda */}
        <div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>Nombre de la Tienda</label>
            <input
              type="text"
              placeholder="Ej. Mi Tienda Online"
              value={configuracion.nombreTienda}
              style={estiloInputBase}
              onChange={(e) => setConfiguracion({ ...configuracion, nombreTienda: e.target.value })}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#3b82f6";
                e.currentTarget.style.backgroundColor = "#ffffff";
                e.currentTarget.style.boxShadow = "0 0 0 4px rgba(59, 130, 246, 0.1)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#e2e8f0";
                e.currentTarget.style.backgroundColor = "#f8fafc";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>
        </div>

        {/* BLOQUE 2: Redes y Enlaces de Contacto */}
        <div>

          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            
            {/* WhatsApp */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>Número de WhatsApp</label>
              <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
                <span style={{ position: "absolute", left: "16px", color: "#94a3b8", fontSize: "14px", fontWeight: 600 }}>+</span>
                <input
                  type="text"
                  placeholder="5491123456789"
                  value={configuracion.whatsapp}
                  style={{ ...estiloInputBase, paddingLeft: "32px" }}
                  onChange={(e) => setConfiguracion({ ...configuracion, whatsapp: e.target.value })}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#3b82f6";
                    e.currentTarget.style.backgroundColor = "#ffffff";
                    e.currentTarget.style.boxShadow = "0 0 0 4px rgba(59, 130, 246, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#e2e8f0";
                    e.currentTarget.style.backgroundColor = "#f8fafc";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            {/* Instagram */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>Usuario de Instagram</label>
              <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
                <span style={{ position: "absolute", left: "16px", color: "#94a3b8", fontSize: "14px", fontWeight: 500 }}>@</span>
                <input
                  type="text"
                  placeholder="usuario_tienda"
                  value={configuracion.instagram}
                  style={{ ...estiloInputBase, paddingLeft: "32px" }}
                  onChange={(e) => setConfiguracion({ ...configuracion, instagram: e.target.value })}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#3b82f6";
                    e.currentTarget.style.backgroundColor = "#ffffff";
                    e.currentTarget.style.boxShadow = "0 0 0 4px rgba(59, 130, 246, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#e2e8f0";
                    e.currentTarget.style.backgroundColor = "#f8fafc";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            {/* Facebook */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>Enlace de Facebook</label>
              <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
                <span style={{ position: "absolute", left: "16px", color: "#94a3b8", fontSize: "13px", fontWeight: 500 }}>facebook.com/</span>
                <input
                  type="text"
                  placeholder="mi_pagina"
                  value={configuracion.facebook}
                  style={{ ...estiloInputBase, paddingLeft: "112px" }}
                  onChange={(e) => setConfiguracion({ ...configuracion, facebook: e.target.value })}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#3b82f6";
                    e.currentTarget.style.backgroundColor = "#ffffff";
                    e.currentTarget.style.boxShadow = "0 0 0 4px rgba(59, 130, 246, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#e2e8f0";
                    e.currentTarget.style.backgroundColor = "#f8fafc";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

          </div>
        </div>

        {/* Botón de Guardado e Indicador */}
        <div style={{ paddingTop: "20px", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "16px" }}>
          
          {guardadoExitoso && (
            <span style={{ color: "#16a34a", fontSize: "14px", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              ¡Cambios guardados con éxito!
            </span>
          )}

          <button
            onClick={guardarConfiguracion}
            disabled={guardadoExitoso}
            style={{
              padding: "12px 24px",
              background: guardadoExitoso ? "#16a34a" : "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontWeight: "600",
              fontSize: "14px",
              cursor: guardadoExitoso ? "default" : "pointer",
              boxShadow: guardadoExitoso ? "none" : "0 4px 12px rgba(37,99,235,0.15)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              if (!guardadoExitoso) e.currentTarget.style.background = "#1d4ed8";
            }}
            onMouseLeave={(e) => {
              if (!guardadoExitoso) e.currentTarget.style.background = "#2563eb";
            }}
          >
            {guardadoExitoso ? "Ajustes Actualizados" : "Guardar Ajustes"}
          </button>
        </div>

      </div>
    </div>
  );
}