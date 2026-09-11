import { prisma } from "../db/prisma.js";

// Crear Orden + Dirección de Envío (Formulario de Checkout)
export const crearOrden = async (req, res) => {
  try {
    const usuarioId = Number(req.usuario.id);
    const { datosEnvio, metodoEnvio, costoEnvio = 0 } = req.body;

    // 1. Validar que vengan los datos obligatorios del formulario de envío
    if (!datosEnvio) {
      return res.status(400).json({ mensaje: "Los datos de envío son obligatorios" });
    }

    const {
      nombreRecibe,
      telefono,
      provincia,
      localidad,
      codigoPostal,
      calle,
      numero,
      pisoDepto,
      aclaraciones,
    } = datosEnvio;

    if (!nombreRecibe || !telefono || !provincia || !localidad || !codigoPostal || !calle || !numero) {
      return res.status(400).json({ mensaje: "Faltan campos obligatorios en la dirección de envío" });
    }

    // 2. Obtener el carrito del usuario
    const carrito = await prisma.carrito.findUnique({
      where: { usuarioId },
      include: {
        items: {
          include: {
            producto: {
              include: {
                imagenes: { orderBy: { orden: "asc" }, take: 1 },
              },
            },
            talle: true,
          },
        },
      },
    });

    if (!carrito || carrito.items.length === 0) {
      return res.status(400).json({ mensaje: "El carrito está vacío" });
    }

    // 3. Transacción de Prisma
    const nuevaOrden = await prisma.$transaction(async (tx) => {
      let totalProductosCalculado = 0;
      const itemsOrdenParaCrear = [];

      // Validar stock y estructurar snapshots
      for (const item of carrito.items) {
        const { producto, talle, cantidad } = item;

        // Validar Stock
        if (producto.tieneTalles) {
          if (!talle) {
            throw new Error(`El producto "${producto.nombre}" requiere talle.`);
          }
          if (talle.stock < cantidad) {
            throw new Error(
              `Stock insuficiente para "${producto.nombre}" (${talle.talle}). Disp: ${talle.stock}, Solicitado: ${cantidad}`
            );
          }
        } else {
          if (producto.stock < cantidad) {
            throw new Error(
              `Stock insuficiente para "${producto.nombre}". Disp: ${producto.stock}, Solicitado: ${cantidad}`
            );
          }
        }

        const precio = Number(producto.precio);
        totalProductosCalculado += precio * cantidad;

        // Guardar Snapshots inalterables
        itemsOrdenParaCrear.push({
          productoId: producto.id,
          talleId: talle ? talle.id : null,
          nombreProducto: producto.nombre,
          imagenUrl: producto.imagenes[0]?.url || null,
          talle: talle ? talle.talle : null,
          precioUnitario: precio,
          cantidad,
        });
      }

      const costoEnvioNum = Number(costoEnvio);
      const totalGeneralCalculado = totalProductosCalculado + costoEnvioNum;

      // Crear Orden con DireccionEnvio e ItemOrden integrados
      const orden = await tx.orden.create({
        data: {
          usuarioId,
          totalProductos: totalProductosCalculado,
          costoEnvio: costoEnvioNum,
          totalGeneral: totalGeneralCalculado,
          metodoEnvio: metodoEnvio || "Envío a Domicilio",
          estado: "PENDIENTE",
          estadoEnvio: "PENDIENTE_DESPACHO",
          items: {
            create: itemsOrdenParaCrear,
          },
          direccion: {
            create: {
              nombreRecibe,
              telefono,
              provincia,
              localidad,
              codigoPostal,
              calle,
              numero,
              pisoDepto: pisoDepto || null,
              aclaraciones: aclaraciones || null,
            },
          },
        },
        include: {
          items: true,
          direccion: true,
        },
      });

      // Descontar Stock real de la DB
      for (const item of carrito.items) {
        if (item.producto.tieneTalles && item.talle) {
          await tx.talleProducto.update({
            where: { id: item.talle.id },
            data: { stock: { decrement: item.cantidad } },
          });
        } else {
          await tx.producto.update({
            where: { id: item.producto.id },
            data: { stock: { decrement: item.cantidad } },
          });
        }
      }

      // Vaciar Carrito
      await tx.itemCarrito.deleteMany({
        where: { carritoId: carrito.id },
      });

      return orden;
    });

    res.status(201).json({
      mensaje: "Orden y datos de envío registrados con éxito",
      orden: nuevaOrden,
    });
  } catch (error) {
    console.error("Error al crear la orden:", error);
    res.status(400).json({
      mensaje: error.message || "Error al procesar la orden",
    });
  }
};

// Consultar compras propias del usuario
export const getMisOrdenes = async (req, res) => {
  try {
    const usuarioId = Number(req.usuario.id);

    const ordenes = await prisma.orden.findMany({
      where: { usuarioId },
      include: {
        items: true,
        direccion: true,
        pagos: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(ordenes);
  } catch (error) {
    console.error("Error al obtener mis órdenes:", error);
    res.status(500).json({ mensaje: "Error al obtener historial de compras" });
  }
};

// Ver detalle de una orden específica
export const getOrdenPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = Number(req.usuario.id);
    const esAdmin = req.usuario.rol === "ADMIN";

    const orden = await prisma.orden.findUnique({
      where: { id: Number(id) },
      include: {
        usuario: { select: { id: true, nombre: true, email: true } },
        items: true,
        direccion: true,
        pagos: true,
      },
    });

    if (!orden) {
      return res.status(404).json({ mensaje: "Orden no encontrada" });
    }

    if (orden.usuarioId !== usuarioId && !esAdmin) {
      return res.status(403).json({ mensaje: "No estás autorizado a ver esta orden" });
    }

    res.json(orden);
  } catch (error) {
    console.error("Error al obtener la orden:", error);
    res.status(500).json({ mensaje: "Error al obtener la orden" });
  }
};

// Ver todas las órdenes (Panel de Admin)
export const getTodasLasOrdenes = async (req, res) => {
  try {
    const ordenes = await prisma.orden.findMany({
      include: {
        usuario: { select: { id: true, nombre: true, email: true } },
        items: true,
        direccion: true,
        pagos: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(ordenes);
  } catch (error) {
    console.error("Error al obtener todas las órdenes:", error);
    res.status(500).json({ mensaje: "Error al obtener las órdenes" });
  }
};

// Cambiar estado de la Orden / Envío (Panel de Admin)
export const actualizarEstadoOrden = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado, estadoEnvio, codigoSeguimiento } = req.body;

    const dataAActualizar = {};
    if (estado) dataAActualizar.estado = estado;
    if (estadoEnvio) dataAActualizar.estadoEnvio = estadoEnvio;
    if (codigoSeguimiento !== undefined) dataAActualizar.codigoSeguimiento = codigoSeguimiento;

    const ordenActualizada = await prisma.orden.update({
      where: { id: Number(id) },
      data: dataAActualizar,
      include: { direccion: true },
    });

    res.json({
      mensaje: "Orden actualizada correctamente",
      orden: ordenActualizada,
    });
  } catch (error) {
    console.error("Error al actualizar la orden:", error);
    res.status(500).json({ mensaje: "Error al actualizar la orden" });
  }
};