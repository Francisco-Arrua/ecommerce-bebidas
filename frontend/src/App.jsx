import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Producto from "./pages/Producto";
import Buscados from "./pages/Buscados";
import Categoria from "./pages/Categoria";
import Register from "./pages/Register"; 
import Login from "./pages/Login";
import Carrito from "./pages/Carrito";
import Envio from "./pages/Envio";
import Pago from "./pages/Pago";

import CambiarPasswordPerfil from "./pages/CambiarPasswordPerfil";
import SolicitarRecuperacion from "./pages/SolicitarRecuperacion";
import RestablecerPassword from "./pages/RestablecerPassword";

import Promociones from "./pages/Promociones";
import ColeccionDetalle from "./pages/ColeccionDetalle";

import RutaAdmin from "./components/RutaAdmin"; 
import ColeccionesAdmin from "./components/admin/ColeccionesAdmin";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext"; 
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* RUTAS PÚBLICAS ESTÁTICAS */}
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} /> 
            <Route path="/login" element={<Login />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/envio" element={<Envio />} />
            <Route path="/pago" element={<Pago />} />

            <Route path="/perfil/cambiar-password" element={<CambiarPasswordPerfil />} />
            <Route path="/recuperar" element={<SolicitarRecuperacion />} />
            <Route path="/restablecer-password" element={<RestablecerPassword />} />
            
            <Route path="/promociones" element={<Promociones />} />
            <Route path="/promociones/:id" element={<ColeccionDetalle />} />

            {/* RUTAS CON PARÁMETROS DINÁMICOS */}
            <Route path="/producto/:id" element={<Producto />} />
            <Route path="/buscados" element={<Buscados />} />
            <Route path="/categoria/:id" element={<Categoria />} />

            {/* RUTAS PROTEGIDAS (ADMIN) */}
            <Route element={<RutaAdmin />}>
              <Route path="/admin" element={<Admin />} />
              {/* Protegemos la ruta del ABM de las colecciones aquí adentro */}
              <Route path="/admin/colecciones" element={<ColeccionesAdmin />} />

            </Route>

          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;