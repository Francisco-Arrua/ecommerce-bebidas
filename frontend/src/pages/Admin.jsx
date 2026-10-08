import Sidebar from "../components/admin/Sidebar";
import Dashboard from "../components/admin/Dashboard";
import ProductosAdmin from "../components/admin/ProductosAdmin";
import CategoriasAdmin from "../components/admin/CategoriasAdmin";
import SubcategoriasAdmin from "../components/admin/SubcategoriasAdmin";
import HeroAdmin from "../components/admin/HeroAdmin";
import ConfiguracionAdmin from "../components/admin/ConfiguracionAdmin";
import PaginasAdmin from "../components/admin/PaginasAdmin";
import BannerAdmin from "../components/admin/BannerAdmin";
import NavbarAdmin from "../components/admin/NavbarAdmin";
import Clientes from "../components/admin/Clientes";
import ColeccionesAdmin from "../components/admin/ColeccionesAdmin";
import CredencialesMP from "../components/admin/CredencialesMPAdmin";
import PedidosAdmin from "../components/admin/PedidosAdmin";
import Manual from "../components/admin/Manual";

import { useEffect, useState } from "react";

export default function Admin() {
  const [seccion, setSeccion] = useState("productos");
  const [esMovil, setEsMovil] = useState(false);

  // Detectamos si el usuario está en móvil o tablet (menos de 1024px)
  useEffect(() => {
    const checkResponsive = () => {
      setEsMovil(window.innerWidth < 1024);
    };
    checkResponsive(); // Chequeo inicial
    window.addEventListener("resize", checkResponsive);
    return () => window.removeEventListener("resize", checkResponsive);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        // Fondo gris ultra suave ("off-white") para que no canse la vista y dé contraste
        background: "#f8fafc", 
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        overflow: "hidden"
      }}
    >

      <NavbarAdmin seccion={seccion} setSeccion={setSeccion} />

      <div
        style={{
          display: "flex",
          flex: 1,
          width: "100%",
          overflow: "hidden"
        }}
      >

        {!esMovil && (
          <Sidebar
            seccion={seccion}
            setSeccion={setSeccion}
          />
        )}

        <div
          style={{
            flex: 1,
            // Ajustamos el padding dinámicamente para no perder espacio en celulares
            padding: esMovil ? "16px" : "24px", 
            overflowY: "auto",
            height: "100%"
          }}
        >
          {seccion === "dashboard" && <Dashboard />}
          {seccion === "productos" && <ProductosAdmin />}
          {seccion === "categorias" && <CategoriasAdmin />}
          {seccion === "subcategorias" && <SubcategoriasAdmin />}
          {seccion === "hero" && <HeroAdmin />}
          {seccion === "banner" && <BannerAdmin />}
          {seccion === "colecciones" && <ColeccionesAdmin />}
          {seccion === "configuracion" && <ConfiguracionAdmin />}
          {seccion === "paginas" && <PaginasAdmin />}
          {seccion === "clientes" && <Clientes />}
          {seccion === "credenciales" && <CredencialesMP />}
          {seccion === "pedidos" && <PedidosAdmin />}
          {seccion === "manual" && <Manual />}
        </div>
      </div>
    </div>
  );
}