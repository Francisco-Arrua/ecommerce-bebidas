import { prisma } from "../db/prisma.js";
import { agregarPrecioVigente, obtenerPrecioVigente } from "../utils/precioProducto.js";

// Helper para calcular stock dinámico del producto si tiene talles
const formatearProducto = (producto) => {
  if (!producto) return null;

  const stockTotal =
    producto.tieneTalles && Array.isArray(producto.talles)
      ? producto.talles.reduce((acc, t) => acc + Number(t.stock || 0), 0)
      : producto.stock;

  return {
    ...agregarPrecioVigente(producto),
    stock: stockTotal,
  };
};

// Helper para formatear un item individual del carrito
const formatearItem = (item) => ({
  ...item,
  producto: formatearProducto(item.producto),
  precioFinal: obtenerPrecioVigente(item.producto),
  subtotal: obtenerPrecioVigente(item.producto) * item.cantidad,
});

// Helper para devolver la estructura completa del carrito con totales
const obtenerCarritoEstructurado = async (usuarioId) => {
  const carrito = await prisma.carrito.findUnique({
    where: { usuarioId },
    include: {
      items: {
        include: {
          producto: {
            include: {
              imagenes: { orderBy: { orden: "asc" } },
              categoria: true,
              subcategoria: true,
              talles: true,
            },
          },
          talle: true,
        },
        orderBy: { id: "asc" },
      },
    },
  });

  if (!carrito) {
    return { id: null, usuarioId, items: [], totalItems: 0, total: 0 };
  }

  const itemsEstructurados = carrito.items.map(formatearItem);
  const total = itemsEstructurados.reduce((acc, i) => acc + i.subtotal, 0);
  const totalItems = itemsEstructurados.reduce((acc, i) => acc + i.cantidad, 0);

  return {
    id: carrito.id,
    usuarioId: carrito.usuarioId,
    items: itemsEstructurados,
    totalItems,
    total,
  };
};

export const agregarProducto = async (req, res) => {
  try {
    const { productoId, cantidad, talleId } = req.body;
    const usuarioId = Number(req.usuario.id);
    const cantidadAAgregar = Number(cantidad);

    if (isNaN(cantidadAAgregar) || cantidadAAgregar <= 0) {
      return res.status(400).json({ mensaje: "La cantidad debe ser mayor a 0" });
    }

    // 1. Verificar existencia del producto y sus talles
    const producto = await prisma.producto.findUnique({
      where: { id: Number(productoId) },
      include: { talles: true },
    });

    if (!producto) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    if (!producto.activo) {
      return res.status(400).json({ mensaje: "El producto no está disponible" });
    }

    // 2. Validar selección de talle según la configuración del producto
    let talleSeleccionado = null;
    let stockDisponible = producto.stock;

    if (producto.tieneTalles) {
      if (!talleId) {
        return res.status(400).json({ mensaje: "Debés seleccionar un talle para este producto" });
      }

      talleSeleccionado = producto.talles.find((t) => t.id === Number(talleId));

      if (!talleSeleccionado) {
        return res.status(400).json({ mensaje: "El talle seleccionado no pertenece a este producto" });
      }

      stockDisponible = talleSeleccionado.stock;
    }

    // 3. Obtener o crear carrito atómicamente (evita race condition)
    const carrito = await prisma.carrito.upsert({
      where: { usuarioId },
      update: {},
      create: { usuarioId },
    });

    // 4. Buscar si ya existe la combinación (Producto + Talle) en el carrito
    const itemExistente = await prisma.itemCarrito.findFirst({
      where: {
        carritoId: carrito.id,
        productoId: Number(productoId),
        talleId: talleId ? Number(talleId) : null,
      },
    });

    const cantidadActualEnCarrito = itemExistente ? itemExistente.cantidad : 0;
    const cantidadTotalDeseada = cantidadActualEnCarrito + cantidadAAgregar;

    // 5. Validar contra el stock específico
    if (cantidadTotalDeseada > stockDisponible) {
      const detalleTalle = talleSeleccionado ? ` (Talle ${talleSeleccionado.talle})` : "";
      return res.status(400).json({
        mensaje: `Stock insuficiente${detalleTalle}. Disponible: ${stockDisponible}. En carrito: ${cantidadActualEnCarrito}. Intenta agregar: ${cantidadAAgregar}.`,
      });
    }

    // 6. Actualizar o crear el ítem en el carrito
    if (itemExistente) {
      await prisma.itemCarrito.update({
        where: { id: itemExistente.id },
        data: { cantidad: cantidadTotalDeseada },
      });
    } else {
      await prisma.itemCarrito.create({
        data: {
          carritoId: carrito.id,
          productoId: Number(productoId),
          talleId: talleId ? Number(talleId) : null,
          cantidad: cantidadAAgregar,
        },
      });
    }

    // Devuelve el carrito completo estructurado con totales
    const carritoActualizado = await obtenerCarritoEstructurado(usuarioId);

    res.status(201).json({
      mensaje: itemExistente ? "Cantidad actualizada en el carrito" : "Producto agregado al carrito",
      carrito: carritoActualizado,
    });
  } catch (error) {
    console.error("Error agregando al carrito:", error);
    res.status(500).json({ mensaje: "Error agregando producto al carrito" });
  }
};

export const actualizarCantidad = async (req, res) => {
  try {
    const usuarioId = Number(req.usuario.id);
    const { id } = req.params; // ID del itemCarrito
    const nuevaCantidad = Number(req.body.cantidad);

    if (isNaN(nuevaCantidad) || nuevaCantidad <= 0) {
      return res.status(400).json({ mensaje: "La cantidad debe ser mayor a cero" });
    }

    const itemExistente = await prisma.itemCarrito.findUnique({
      where: { id: Number(id) },
      include: {
        producto: true,
        talle: true,
        carrito: true,
      },
    });

    if (!itemExistente) {
      return res.status(404).json({ mensaje: "El ítem del carrito no existe" });
    }

    if (Number(itemExistente.carrito.usuarioId) !== usuarioId) {
      return res.status(403).json({ mensaje: "No tenés permiso para modificar este carrito." });
    }

    // Determinar stock límite (Talle o Producto)
    let stockMaximo = itemExistente.producto.stock;
    if (itemExistente.talle) {
      stockMaximo = itemExistente.talle.stock;
    }

    if (nuevaCantidad > stockMaximo) {
      return res.status(400).json({
        mensaje: `Stock insuficiente. El máximo disponible para ${itemExistente.producto.nombre}${
          itemExistente.talle ? ` (${itemExistente.talle.talle})` : ""
        } es ${stockMaximo}.`,
      });
    }

    await prisma.itemCarrito.update({
      where: { id: Number(id) },
      data: { cantidad: nuevaCantidad },
    });

    const carritoActualizado = await obtenerCarritoEstructurado(usuarioId);

    res.json({
      mensaje: "Cantidad modificada correctamente",
      carrito: carritoActualizado,
    });
  } catch (error) {
    console.error("Error al actualizar cantidad:", error);
    res.status(500).json({ mensaje: "Error al actualizar la cantidad" });
  }
};

export const getCarrito = async (req, res) => {
  try {
    const usuarioId = Number(req.usuario.id);
    const carrito = await obtenerCarritoEstructurado(usuarioId);

    res.json(carrito);
  } catch (error) {
    console.error("Error obteniendo carrito:", error);
    res.status(500).json({ mensaje: "Error obteniendo carrito" });
  }
};

export const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = Number(req.usuario.id);

    const itemExistente = await prisma.itemCarrito.findUnique({
      where: { id: Number(id) },
      include: { carrito: true },
    });

    if (!itemExistente) {
      return res.status(404).json({ mensaje: "El ítem no existe en el carrito" });
    }

    if (Number(itemExistente.carrito.usuarioId) !== usuarioId) {
      return res.status(403).json({ mensaje: "No tenés permiso para modificar este carrito." });
    }

    await prisma.itemCarrito.delete({
      where: { id: Number(id) },
    });

    const carritoActualizado = await obtenerCarritoEstructurado(usuarioId);

    res.json({
      mensaje: "Producto eliminado del carrito correctamente",
      carrito: carritoActualizado,
    });
  } catch (error) {
    console.error("Error al eliminar item del carrito:", error);
    res.status(500).json({ mensaje: "Error al eliminar el producto del carrito" });
  }
};

export const vaciarCarrito = async (req, res) => {
  try {
    const usuarioId = Number(req.usuario.id);

    const carrito = await prisma.carrito.findUnique({
      where: { usuarioId },
    });

    if (!carrito) {
      return res.status(404).json({ mensaje: "No se encontró un carrito para este usuario" });
    }

    await prisma.itemCarrito.deleteMany({
      where: { carritoId: carrito.id },
    });

    res.json({ mensaje: "Carrito vaciado por completo" });
  } catch (error) {
    console.error("Error al vaciar carrito:", error);
    res.status(500).json({ mensaje: "Error al vaciar el carrito" });
  }
};