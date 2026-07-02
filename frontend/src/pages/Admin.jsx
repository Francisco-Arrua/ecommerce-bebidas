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

import { useEffect, useState } from "react";

export default function Admin() {
  const [seccion, setSeccion] = useState("productos");

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
      {/* 🔥 EL NAVBAR QUEDA ARRIBA DE TODO, CORRIENDO DE PUNTA A PUNTA */}
      <NavbarAdmin />

      {/* 👇 CLAVE 2: Contenedor inferior que se divide horizontalmente */}
      <div
        style={{
          display: "flex",
          flex: 1,
          width: "100%",
          overflow: "hidden"
        }}
      >
        {/* El Sidebar ahora arranca abajo del Navbar, a la izquierda */}
        <Sidebar
          seccion={seccion}
          setSeccion={setSeccion}
        />

        {/* Contenedor derecho scrollable para las vistas del panel */}
        <div
          style={{
            flex: 1,
            padding: "24px", // Un poco de padding global para despegar los componentes de los bordes
            overflowY: "auto",
            height: "100%"
          }}
        >
          {seccion === "dashboard" && (
            <Dashboard />
          )}

          {seccion === "productos" && (
            <ProductosAdmin />
          )}

          {seccion === "categorias" && (
            <CategoriasAdmin />
          )}
          
          {seccion === "subcategorias" && (
            <SubcategoriasAdmin />
          )}
          
          {seccion === "hero" && (
            <HeroAdmin />
          )}
          
          {seccion === "banner" && (
            <BannerAdmin />
          )}
          {seccion === "colecciones" && (
            <ColeccionesAdmin />
          )}
          
          {seccion === "configuracion" && (
            <ConfiguracionAdmin />
          )}
          
          {seccion === "paginas" && (
            <PaginasAdmin />
          )}
          
          {seccion === "clientes" && (
            <Clientes />
          )}
        </div>
      </div>
    </div>
  );
}