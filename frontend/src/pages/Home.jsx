import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import ProductosDestacados from "../components/ProductosDestacados";
import BannerPublicidad from "../components/BannerPublicidad";
import PaginasHome from "../components/PaginasHome";
import Footer from "../components/Footer";
import WhatsappFloat from "../components/WhatsappFloat";


export default function Home() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const obtenerProductos = async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/productos`
      );

      const data = await res.json();

      setProductos(
        data.filter(
          (producto) => producto.activo
        )
      );
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

      <PaginasHome />
      
      <Footer />

      <WhatsappFloat />
    </>
  );
}