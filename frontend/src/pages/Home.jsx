import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import ProductosDestacados from "../components/ProductosDestacados";
import ProductosOferta from "../components/ProductosOferta";
import BannerPublicidad from "../components/BannerPublicidad";
import PaginasHome from "../components/PaginasHome";
import Footer from "../components/Footer";
import WhatsappFloat from "../components/WhatsappFloat";


export default function Home() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL;
        const [destacadosRes, ofertasRes] = await Promise.all([
          fetch(`${API_URL}/productos?destacado=true&activo=true&limit=12&resumen=true`),
          fetch(`${API_URL}/productos?enOferta=true&activo=true&limit=12&resumen=true`),
        ]);

        const [destacadosData, ofertasData] = await Promise.all([
          destacadosRes.json(),
          ofertasRes.json(),
        ]);

        const destacados = destacadosData.items || destacadosData;
        const ofertas = ofertasData.items || ofertasData;
        const productosUnicos = [...destacados, ...ofertas].filter(
          (producto, index, lista) => lista.findIndex((item) => item.id === producto.id) === index
        );

        setProductos(productosUnicos);
      } catch (error) {
        console.error("Error cargando productos destacados y ofertas:", error);
        setProductos([]);
      }
    };

    obtenerProductos();
  }, []);

  return (
    <>
      <Navbar />

      <Hero />

      <ProductosDestacados
        productos={productos}
      />

      <BannerPublicidad />

      <ProductosOferta
        productos={productos}
      />

      <PaginasHome />
      
      <Footer />

      <WhatsappFloat />
    </>
  );
}