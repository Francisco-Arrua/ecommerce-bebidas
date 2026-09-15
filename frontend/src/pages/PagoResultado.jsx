import { useEffect, useState, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MAX_INTENTOS = 6; // ~15 segundos de polling, por si el webhook tarda en llegar
const INTERVALO_MS = 2500;

export default function PagoResultado() {
  const [searchParams] = useSearchParams();
  const [orden, setOrden] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [errorConsulta, setErrorConsulta] = useState(false);
  const intentos = useRef(0);

  // Mercado Pago agrega external_reference (nuestro ordenId) a la URL de vuelta
  const ordenId = searchParams.get("external_reference");

  useEffect(() => {
    if (!ordenId) {
      setCargando(false);
      setErrorConsulta(true);
      return;
    }

    let cancelado = false;

    const consultarOrden = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/orden/${ordenId}`, {
          credentials: "include",
        });

        if (!res.ok) {
          if (!cancelado) setErrorConsulta(true);
          return;
        }

        const data = await res.json();
        if (cancelado) return;

        setOrden(data);

        // Si todavía está PENDIENTE, reintentamos unas veces: puede que
        // el webhook de Mercado Pago no haya llegado todavía.
        if (data.estado === "PENDIENTE" && intentos.current < MAX_INTENTOS) {
          intentos.current += 1;
          setTimeout(consultarOrden, INTERVALO_MS);
        } else {
          setCargando(false);
        }
      } catch (err) {
        console.error(err);
        if (!cancelado) {
          setErrorConsulta(true);
          setCargando(false);
        }
      }
    };

    consultarOrden();

    return () => {
      cancelado = true;
    };
  }, [ordenId]);

  const renderContenido = () => {
    if (errorConsulta) {
      return (
        <>
          <h2 style={{ fontSize: "20px", fontWeight: 900, textTransform: "uppercase", marginBottom: "12px" }}>
            No pudimos confirmar tu pago
          </h2>
          <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "24px" }}>
            Si ya realizaste el pago, no te preocupes: te vamos a contactar apenas se confirme.
            Si tenés dudas, escribinos directamente.
          </p>
        </>
      );
    }

    if (cargando) {
      return (
        <>
          <h2 style={{ fontSize: "20px", fontWeight: 900, textTransform: "uppercase", marginBottom: "12px" }}>
            Confirmando tu pago...
          </h2>
          <p style={{ color: "#64748b", fontSize: "14px" }}>
            Esto puede tardar unos segundos.
          </p>
        </>
      );
    }

    if (orden?.estado === "PAGADO") {
      return (
        <>
          <h2 style={{ fontSize: "20px", fontWeight: 900, textTransform: "uppercase", marginBottom: "12px", color: "#16a34a" }}>
            ¡Pago confirmado!
          </h2>
          <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "8px" }}>
            Tu orden #{orden.id} fue registrada correctamente.
          </p>
          <p style={{ color: "#64748b", fontSize: "14px" }}>
            Total: $ {Number(orden.totalGeneral).toLocaleString("es-AR")}
          </p>
        </>
      );
    }

    if (orden?.estado === "CANCELADO") {
      return (
        <>
          <h2 style={{ fontSize: "20px", fontWeight: 900, textTransform: "uppercase", marginBottom: "12px", color: "#ef4444" }}>
            El pago no se pudo completar
          </h2>
          <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "24px" }}>
            Tu orden fue cancelada. Podés intentar nuevamente cuando quieras.
          </p>
        </>
      );
    }

    // Sigue PENDIENTE después de todos los reintentos
    return (
      <>
        <h2 style={{ fontSize: "20px", fontWeight: 900, textTransform: "uppercase", marginBottom: "12px" }}>
          Tu pago está siendo procesado
        </h2>
        <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "24px" }}>
          Te vamos a avisar apenas se confirme. Podés revisar el estado más tarde en tus compras.
        </p>
      </>
    );
  };

  return (
    <div style={{ background: "#ffffff", minHeight: "100vh", fontFamily: "Inter, sans-serif", color: "#0f172a" }}>
      <Navbar />
      <main style={{ maxWidth: "600px", margin: "80px auto", textAlign: "center", padding: "0 24px" }}>
        {renderContenido()}
        <Link
          to="/"
          style={{
            display: "inline-block",
            marginTop: "16px",
            color: "#0f172a",
            fontWeight: 700,
            textTransform: "uppercase",
            fontSize: "13px",
          }}
        >
          Volver a la tienda
        </Link>
      </main>
      <Footer />
    </div>
  );
}