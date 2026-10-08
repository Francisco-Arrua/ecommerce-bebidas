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
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/carrito`, {
        credentials: "include",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
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
    if (!usuarioId) return { ok: false, mensaje: "Iniciá sesión para agregar productos al carrito." };

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
          ...(localStorage.getItem("token")
            ? { Authorization: `Bearer ${localStorage.getItem("token")}` }
            : {}),
        },
        body: JSON.stringify({ productoId, cantidad, talleId }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { ok: false, mensaje: data.mensaje || "No se pudo agregar el producto al carrito." };
      }

      if (data.carrito) setCarrito(data.carrito);
      return { ok: true };
    } catch (error) {
      console.error(error);
      return { ok: false, mensaje: "Ocurrió un error al agregar el producto. Intentá nuevamente." };
    }
  };

  // 3. Actualizar cantidad de un ítem
  const actualizarCantidadItem = async (itemCarritoId, nuevaCantidad) => {
    const itemAnterior = carrito?.items?.find((item) => item.id === itemCarritoId);

    if (itemAnterior) {
      setCarrito((actual) => {
        if (!actual) return actual;
        const precioUnitario = Number(itemAnterior.precioFinal ?? (itemAnterior.subtotal / itemAnterior.cantidad));
        const diferencia = nuevaCantidad - itemAnterior.cantidad;
        return {
          ...actual,
          items: actual.items.map((item) => item.id === itemCarritoId
            ? { ...item, cantidad: nuevaCantidad, subtotal: precioUnitario * nuevaCantidad }
            : item),
          totalItems: actual.totalItems + diferencia,
          total: actual.total + precioUnitario * diferencia,
        };
      });
    }

    try {
      const res = await fetch(`${API_URL}/carrito/item/${itemCarritoId}`, {
        method: "PUT",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...(localStorage.getItem("token")
              ? { Authorization: `Bearer ${localStorage.getItem("token")}` }
              : {}),
          },
        body: JSON.stringify({ cantidad: nuevaCantidad }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (itemAnterior) {
          setCarrito((actual) => {
            if (!actual) return actual;
            const itemActual = actual.items.find((item) => item.id === itemCarritoId);
            if (!itemActual) return actual;
            const precioUnitario = Number(itemActual.precioFinal ?? (itemActual.subtotal / itemActual.cantidad));
            const diferencia = itemAnterior.cantidad - itemActual.cantidad;
            return {
              ...actual,
              items: actual.items.map((item) => item.id === itemCarritoId
                ? { ...item, cantidad: itemAnterior.cantidad, subtotal: precioUnitario * itemAnterior.cantidad }
                : item),
              totalItems: actual.totalItems + diferencia,
              total: actual.total + precioUnitario * diferencia,
            };
          });
        }
        return { ok: false, mensaje: data.mensaje || "No se pudo actualizar la cantidad." };
      }

      if (data.carrito) setCarrito(data.carrito);
      return { ok: true };
    } catch (error) {
      console.error(error);
      return { ok: false, mensaje: "No se pudo actualizar la cantidad. Intentá nuevamente." };
    }
  };

  // 4. Eliminar una línea del carrito
  const eliminarProductoItem = async (itemCarritoId) => {
    const itemAnterior = carrito?.items?.find((item) => item.id === itemCarritoId);
    const indiceAnterior = carrito?.items?.findIndex((item) => item.id === itemCarritoId) ?? -1;

    if (itemAnterior) {
      setCarrito((actual) => actual ? {
        ...actual,
        items: actual.items.filter((item) => item.id !== itemCarritoId),
        totalItems: actual.totalItems - itemAnterior.cantidad,
        total: actual.total - Number(itemAnterior.subtotal ?? (itemAnterior.precioFinal * itemAnterior.cantidad)),
      } : actual);
    }

    try {
      const res = await fetch(`${API_URL}/carrito/item/${itemCarritoId}`, {
        method: "DELETE",
        credentials: "include",
        headers: localStorage.getItem("token")
          ? { Authorization: `Bearer ${localStorage.getItem("token")}` }
          : {},
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (itemAnterior) {
          setCarrito((actual) => {
            if (!actual || actual.items.some((item) => item.id === itemCarritoId)) return actual;
            const items = [...actual.items];
            items.splice(Math.min(indiceAnterior, items.length), 0, itemAnterior);
            return {
              ...actual,
              items,
              totalItems: actual.totalItems + itemAnterior.cantidad,
              total: actual.total + Number(itemAnterior.subtotal ?? (itemAnterior.precioFinal * itemAnterior.cantidad)),
            };
          });
        }
        return { ok: false, mensaje: data.mensaje || "No se pudo eliminar el producto." };
      }

      if (data.carrito) setCarrito(data.carrito);
      return { ok: true };
    } catch (error) {
      console.error(error);
      return { ok: false, mensaje: "No se pudo eliminar el producto. Intentá nuevamente." };
    }
  };

  // 5. Vaciar carrito por completo
  const vaciarMiCarrito = async () => {
    const carritoAnterior = carrito;
    setCarrito((actual) => actual ? { ...actual, items: [], totalItems: 0, total: 0 } : actual);

    try {
      const res = await fetch(`${API_URL}/carrito/vaciar`, {
        method: "DELETE",
        credentials: "include",
        headers: localStorage.getItem("token")
          ? { Authorization: `Bearer ${localStorage.getItem("token")}` }
          : {},
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (carritoAnterior) setCarrito(carritoAnterior);
        return { ok: false, mensaje: data.mensaje || "No se pudo vaciar el carrito." };
      }

      setCarrito((actual) => ({
        ...(actual || { id: null, usuarioId, totalItems: 0, total: 0 }),
        items: [],
        totalItems: 0,
        total: 0,
      }));
      return { ok: true };
    } catch (error) {
      console.error(error);
      if (carritoAnterior) setCarrito(carritoAnterior);
      return { ok: false, mensaje: "No se pudo vaciar el carrito. Intentá nuevamente." };
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