import { prisma } from "../db/prisma.js";

export const agregarProducto = async (req, res) => {
  try {
    const { productoId, cantidad } = req.body;

    const usuarioId = req.usuario.id;

    const cantidadAAgregar = Number(cantidad);

    if (cantidadAAgregar <= 0) {
      return res.status(400).json({ mensaje: "La cantidad debe ser mayor a 0" });
    }

    // 1. Verificar que exista el producto y traer su stock
    const producto = await prisma.producto.findUnique({
      where: { id: Number(productoId) },
    });

    if (!producto) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    // 2. Buscar o crear el carrito del usuario
    let carrito = await prisma.carrito.findUnique({
      where: { usuarioId },
    });

    if (!carrito) {
      carrito = await prisma.carrito.create({
        data: { usuarioId: Number(usuarioId) },
      });
    }

    // 3. Buscar si el producto ya está en el carrito
    const itemExistente = await prisma.itemCarrito.findFirst({
      where: {
        carritoId: carrito.id,
        productoId: Number(productoId),
      },
    });

    // 4. Calcular cuánto tendría en total en base a lo que ya hay en el carrito
    const cantidadActual = itemExistente ? itemExistente.cantidad : 0;
    const cantidadTotalDeseada = cantidadActual + cantidadAAgregar;

    // 5. VALIDACIÓN DE STOCK
    if (cantidadTotalDeseada > producto.stock) {
      return res.status(400).json({
        mensaje: `Stock insuficiente. Disponible: ${producto.stock}. Ya tenés ${cantidadActual} en el carrito e intentás sumar ${cantidadAAgregar}.`,
      });
    }

    // 6. Si el stock es suficiente, actualizamos o creamos
    if (itemExistente) {
      const itemActualizado = await prisma.itemCarrito.update({
        where: { id: itemExistente.id },
        data: { cantidad: cantidadTotalDeseada },
      });

      return res.json({
        mensaje: "Cantidad actualizada en el carrito",
        item: itemActualizado,
      });
    }

    // Si no existía el ítem, lo creamos de cero
    const item = await prisma.itemCarrito.create({
      data: {
        carritoId: carrito.id,
        productoId: Number(productoId),
        cantidad: cantidadAAgregar,
      },
    });

    res.status(201).json({
      mensaje: "Producto agregado al carrito",
      item,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error agregando producto al carrito" });
  }
};

export const actualizarCantidad = async (req, res) => {
  const usuarioId = req.usuario.id;
  try {
    const { id } = req.params; // id del ItemCarrito
    const { cantidad } = req.body;
    const nuevaCantidad = Number(cantidad);

    if (nuevaCantidad <= 0) {
      return res.status(400).json({ mensaje: "La cantidad debe ser mayor a cero" });
    }

    // 1. Buscar el ítem de manera única e incluir la info del producto relacionado
    const itemExistente = await prisma.itemCarrito.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        producto: true,
        carrito: true,
      },
    });

    if (!itemExistente) {
      return res.status(404).json({ mensaje: "El ítem del carrito no existe" });
    }

    if (itemExistente.carrito.usuarioId !== usuarioId) {
        return res.status(403).json({
            mensaje: "No tenés permiso para modificar este carrito."
        });
    }

    // 2. VALIDACIÓN DE STOCK
    if (nuevaCantidad > itemExistente.producto.stock) {
      return res.status(400).json({
        mensaje: `No podés seleccionar esa cantidad. El stock disponible de ${itemExistente.producto.nombre} es ${itemExistente.producto.stock}.`,
      });
    }

    // 3. Modificar la cantidad de la línea
    const itemActualizado = await prisma.itemCarrito.update({
      where: { id: Number(id) },
      data: { cantidad: nuevaCantidad },
      include: { producto: true  }
    });

    res.json({
      mensaje: "Cantidad modificada correctamente",
      item: itemActualizado,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al actualizar la cantidad" });
  }
};

export const getCarrito = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;

    const carrito = await prisma.carrito.findUnique({
      where: {
        usuarioId: Number(usuarioId),
      },

      include: {
        items: {
          include: {
            producto: {
              include: {
                imagenes: {
                  orderBy: {
                    orden: "asc",
                  },
                },

                categoria: true,
                subcategoria: true,
              },
            },
          },
        },
      },
    });

    if (!carrito) {
      return res.status(404).json({
        mensaje: "El usuario no tiene carrito",
      });
    }

    res.json(carrito);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error obteniendo carrito",
    });
  }
};


export const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params; // El id del ItemCarrito

    const usuarioId = req.usuario.id;

    const itemExistente = await prisma.itemCarrito.findUnique({
        where:{
            id:Number(id)
        },
        include:{
            carrito:true
        }
    })

    if (!itemExistente) {
      return res.status(404).json({
        mensaje: "El ítem no existe en el carrito",
      });
    }

    if (itemExistente.carrito.usuarioId !== usuarioId) {
        return res.status(403).json({
            mensaje: "No tenés permiso para modificar este carrito."
        });
    }

    // Eliminar el ítem
    await prisma.itemCarrito.delete({
      where: {
        id: Number(id),
      },
    });

    res.json({
      mensaje: "Producto eliminado del carrito correctamente",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error al eliminar el producto del carrito",
    });
  }
};

export const vaciarCarrito = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;

    if (!usuarioId) {
      return res.status(400).json({
        mensaje: "El id del usuario es requerido",
      });
    }

    // Buscar el carrito de ese usuario
    const carrito = await prisma.carrito.findUnique({
      where: { usuarioId },
    });

    if (!carrito) {
      return res.status(404).json({
        mensaje: "No se encontró un carrito para este usuario",
      });
    }

    // Borrar todos los items asociados a ese carritoId
    await prisma.itemCarrito.deleteMany({
      where: {
        carritoId: carrito.id,
      },
    });

    res.json({
      mensaje: "Carrito vaciado por completo",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error al vaciar el carrito",
    });
  }
};
