import { createContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext"; // ✅ Usamos tu hook directamente

// ✅ Esencial: Creamos y exportamos el contexto para que Navbar lo consuma
export const CartContext = createContext(); 

export const CartProvider = ({ children }) => {
  const [carrito, setCarrito] = useState(null);
  const [cargando, setCargando] = useState(false);
  
  // ✅ Corregido: Extraemos 'usuario' tal cual se llama en tu AuthContext
  const { usuario } = useAuth(); 
  const usuarioId = usuario?.id; 

  const API_URL = import.meta.env.VITE_API_URL;

  // 1. Cargar el carrito del usuario desde la API
  const obtenerCarrito = async () => {
    if (!usuarioId) return;
    setCargando(true);
    try {
      const res = await fetch(`${API_URL}/carrito`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setCarrito(data);
      } else {
        setCarrito(null);
      }
    } catch (error) {
      console.error("Error al obtener el carrito:", error);
    } finally {
      setCargando(false);
    }
  };

  // Cargar el carrito automáticamente cuando el usuario se loguee
  useEffect(() => {
    if (usuarioId) {
      obtenerCarrito();
    } else {
      setCarrito(null); 
    }
  }, [usuarioId]);

  // 2. Agregar producto al carrito
  // 2. Agregar producto al carrito
  const agregarProducto = async (productoIdOrItem, cantidadParam) => {
    if (!usuarioId) return alert("Debes iniciar sesión para agregar productos");

    // Si nos pasan un objeto (como { id, cantidad, talleId }), extraemos los valores
    let productoId, cantidad, talleId;

    if (typeof productoIdOrItem === "object" && productoIdOrItem !== null) {
      productoId = productoIdOrItem.id || productoIdOrItem.productoId;
      cantidad = productoIdOrItem.cantidad;
      talleId = productoIdOrItem.talleId;
    } else {
      productoId = productoIdOrItem;
      cantidad = cantidadParam;
    }

    try {
      const res = await fetch(`${API_URL}/carrito`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productoId, cantidad, talleId }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.mensaje || "Error al agregar al carrito"); 
        return false;
      }

      await obtenerCarrito();
      alert(data.mensaje || "Producto agregado correctamente");
      return true;
    } catch (error) {
      console.error(error);
      alert("Error al agregar el producto");
      return false;
    }
  };

  // 3. Actualizar cantidad de un ítem
  const actualizarCantidadItem = async (itemCarritoId, nuevaCantidad) => {
    try {
      const res = await fetch(`${API_URL}/carrito/item/${itemCarritoId}`, {
        method: "PUT",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
          },
        body: JSON.stringify({ cantidad: nuevaCantidad }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.mensaje); 
        return;
      }

      await obtenerCarrito();
    } catch (error) {
      console.error(error);
    }
  };

  // 4. Eliminar una línea del carrito
  const eliminarProductoItem = async (itemCarritoId) => {
    try {
      const res = await fetch(`${API_URL}/carrito/item/${itemCarritoId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        await obtenerCarrito();
      } else {
        const data = await res.json().catch(() => ({}));
        console.error("Error al eliminar item:", data.mensaje);
        alert(data.mensaje || "No se pudo eliminar el producto");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 5. Vaciar carrito por completo
  const vaciarMiCarrito = async () => {
    try {
      const res = await fetch(`${API_URL}/carrito/vaciar`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        await obtenerCarrito();
      } else {
        const data = await res.json().catch(() => ({}));
        console.error("Error al vaciar carrito:", data.mensaje);
        alert(data.mensaje || "No se pudo vaciar el carrito");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        carrito,
        cargando,
        agregarProducto,
        actualizarCantidadItem,
        eliminarProductoItem,
        vaciarMiCarrito,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};