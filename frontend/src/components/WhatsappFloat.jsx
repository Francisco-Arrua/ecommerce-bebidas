import { useEffect, useState } from "react";

export default function WhatsappFloat() {
  const [configuracion, setConfiguracion] = useState(null);

  useEffect(() => {
    const obtenerConfiguracion = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/configuracion`
        );

        const data = await res.json();

        setConfiguracion(data);
      } catch (error) {
        console.error(error);
      }
    };

    obtenerConfiguracion();
  }, []);

  if (!configuracion?.whatsapp) return null;

  return (
    <a
      href={`https://wa.me/${configuracion.whatsapp}`}
      target="_blank"
      rel="noreferrer"
      style={{
        position: "fixed",
        bottom: "25px",
        right: "25px",
        width: "65px",
        height: "65px",
        borderRadius: "50%",
        background: "#25D366",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "32px",
        textDecoration: "none",
        boxShadow: "0 8px 25px rgba(0,0,0,0.25)",
        zIndex: 9999,
        transition: "transform 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform =
          "scale(1.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform =
          "scale(1)";
      }}
    >
    <img
    src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
    alt="WhatsApp"
    style={{
        width: "36px",
        height: "36px",
    }}
    />
    </a>
  );
}