import { prisma } from "../db/prisma.js";

const capitalizar = (texto) => {
  if (!texto) return null;

  return texto
    .toLowerCase()
    .split(" ")
    .map(
      (palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1)
    )
    .join(" ");
};

// Helper para mapear el stock total dinámicamente
const formatearProducto = (producto) => {
  if (!producto) return null;

  const stockTotal =
    producto.tieneTalles && Array.isArray(producto.talles)
      ? producto.talles.reduce((acc, t) => acc + Number(t.stock || 0), 0)
      : producto.stock;

  return {
    ...producto,
    stock: stockTotal,
  };
};

// GET /productos
export const getProductos = async (req, res) => {
  try {
    const { search, categoria } = req.query;

    const where = {};

    if (search) {
      where.OR = [
        {
          nombre: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          marca: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    if (categoria) {
      where.categoriaId = Number(categoria);
    }

    const productos = await prisma.producto.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        categoria: true,
        subcategoria: true,
        imagenes: {
          orderBy: { orden: "asc" },
        },
        talles: true,
      },
    });

    res.json(productos.map(formatearProducto));
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ mensaje: "Error al obtener productos" });
  }
};

// GET /productos/:id
export const getProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const producto = await prisma.producto.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        categoria: true,
        subcategoria: true,
        imagenes: {
          orderBy: { orden: "asc" },
        },
        talles: true,
      },
    });

    if (!producto) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    res.json(formatearProducto(producto));
  } catch (error) {
    console.error("Error al obtener producto:", error);
    res.status(500).json({ mensaje: "Error al obtener el producto" });
  }
};

// POST /productos
export const crearProducto = async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      marca,
      categoriaId,
      subcategoriaId,
      precio,
      stock,
      tieneTalles = false,
      destacado = false,
      activo = true,
      talles = [],
      imagenes = [],
    } = req.body;

    const producto = await prisma.producto.create({
      data: {
        nombre: capitalizar(nombre),
        descripcion,
        marca: marca ? capitalizar(marca) : null,
        categoriaId: categoriaId ? Number(categoriaId) : null,
        subcategoriaId: subcategoriaId ? Number(subcategoriaId) : null,
        precio: Number(precio),
        activo: Boolean(activo),
        destacado: Boolean(destacado),

        // Si tiene talles, el stock general en BD queda en 0
        stock: tieneTalles ? 0 : Number(stock || 0),
        tieneTalles: Boolean(tieneTalles),

        // Imágenes
        imagenes: {
          create: imagenes.map((imagen, index) => ({
            url: imagen.url,
            principal: Boolean(imagen.principal),
            orden: index,
          })),
        },

        // Talles
        ...(tieneTalles && talles.length > 0 && {
          talles: {
            create: talles.map((t) => ({
              talle: t.talle,
              stock: Number(t.stock),
            })),
          },
        }),
      },
      include: {
        categoria: true,
        subcategoria: true,
        imagenes: true,
        talles: true,
      },
    });

    res.status(201).json(formatearProducto(producto));
  } catch (error) {
    console.error("Error al crear producto:", error);
    res.status(500).json({ mensaje: "Error al crear producto" });
  }
};

// PUT /productos/:id
export const actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      descripcion,
      marca,
      categoriaId,
      subcategoriaId,
      precio,
      stock,
      tieneTalles,
      destacado,
      activo,
      talles = [],
      imagenes = [],
    } = req.body;

    const idProducto = Number(id);

    const productoActualizado = await prisma.$transaction(async (tx) => {
      // 1. Reemplazar relaciones si vienen definidas
      if (talles) {
        await tx.talleProducto.deleteMany({
          where: { productoId: idProducto },
        });
      }

      if (imagenes) {
        await tx.imagenProducto.deleteMany({
          where: { productoId: idProducto },
        });
      }

      // 2. Actualizar producto base
      return await tx.producto.update({
        where: { id: idProducto },
        data: {
          nombre: nombre ? capitalizar(nombre) : undefined,
          descripcion,
          marca: marca ? capitalizar(marca) : null,
          categoriaId: categoriaId ? Number(categoriaId) : null,
          subcategoriaId: subcategoriaId ? Number(subcategoriaId) : null,
          precio: precio !== undefined ? Number(precio) : undefined,
          activo: activo !== undefined ? Boolean(activo) : undefined,
          destacado: destacado !== undefined ? Boolean(destacado) : undefined,
          tieneTalles: tieneTalles !== undefined ? Boolean(tieneTalles) : undefined,
          stock: tieneTalles ? 0 : Number(stock || 0),

          // Recrear imágenes
          ...(imagenes && imagenes.length > 0 && {
            imagenes: {
              create: imagenes.map((img, index) => ({
                url: img.url,
                principal: Boolean(img.principal),
                orden: index,
              })),
            },
          }),

          // Recrear talles
          ...(tieneTalles && talles && talles.length > 0 && {
            talles: {
              create: talles.map((t) => ({
                talle: t.talle,
                stock: Number(t.stock),
              })),
            },
          }),
        },
        include: {
          categoria: true,
          subcategoria: true,
          imagenes: true,
          talles: true,
        },
      });
    });

    res.json(formatearProducto(productoActualizado));
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).json({ mensaje: "Error al actualizar producto" });
  }
};

// DELETE /productos/:id
export const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.producto.delete({
      where: {
        id: Number(id),
      },
    });

    res.json({ mensaje: "Producto eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ mensaje: "Error al eliminar producto" });
  }
};

// PATCH /productos/:id/stock
export const actualizarStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock, talleId } = req.body;

    if (talleId) {
      const talleActualizado = await prisma.talleProducto.update({
        where: { id: Number(talleId) },
        data: { stock: Number(stock) },
      });
      return res.json(talleActualizado);
    }

    const producto = await prisma.producto.update({
      where: { id: Number(id) },
      data: { stock: Number(stock) },
      include: { talles: true },
    });

    res.json(formatearProducto(producto));
  } catch (error) {
    console.error("Error al actualizar stock:", error);
    res.status(500).json({ mensaje: "Error al actualizar el stock" });
  }
};

// PATCH /productos/:id/activo
export const cambiarActivo = async (req, res) => {
  try {
    const { id } = req.params;

    const productoActual = await prisma.producto.findUnique({
      where: { id: Number(id) },
    });

    if (!productoActual) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    const producto = await prisma.producto.update({
      where: { id: Number(id) },
      data: { activo: !productoActual.activo },
    });

    res.json(producto);
  } catch (error) {
    console.error("Error al cambiar estado activo:", error);
    res.status(500).json({ mensaje: "Error al cambiar estado" });
  }
};

// PATCH /productos/:id/destacado
export const cambiarDestacado = async (req, res) => {
  try {
    const { id } = req.params;

    const productoActual = await prisma.producto.findUnique({
      where: { id: Number(id) },
    });

    if (!productoActual) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    const producto = await prisma.producto.update({
      where: { id: Number(id) },
      data: { destacado: !productoActual.destacado },
    });

    res.json(producto);
  } catch (error) {
    console.error("Error al cambiar destacado:", error);
    res.status(500).json({ mensaje: "Error al cambiar destacado" });
  }
};

// GET /productos/:id/relacionados
export const getProductosRelacionados = async (req, res) => {
  try {
    const { id } = req.params;

    const producto = await prisma.producto.findUnique({
      where: { id: Number(id) },
    });

    if (!producto) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    const relacionados = await prisma.producto.findMany({
      where: {
        activo: true,
        categoriaId: producto.categoriaId,
        id: { not: producto.id },
      },
      include: {
        imagenes: {
          orderBy: { orden: "asc" },
        },
        talles: true,
      },
      take: 4,
    });

    res.json(relacionados.map(formatearProducto));
  } catch (error) {
    console.error("Error obteniendo productos relacionados:", error);
    res.status(500).json({ mensaje: "Error obteniendo productos relacionados" });
  }
};