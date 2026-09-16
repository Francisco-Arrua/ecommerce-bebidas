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

// Helper interno para normalizar el payload de imágenes
const parsearImagenes = (rawImagenes) => {
  if (!rawImagenes) return [];
  if (typeof rawImagenes === "string") {
    try {
      return JSON.parse(rawImagenes);
    } catch {
      return [];
    }
  }
  return Array.isArray(rawImagenes) ? rawImagenes : [];
};

// Helper interno para normalizar el payload de talles
const parsearTalles = (rawTalles) => {
  if (!rawTalles) return [];
  if (typeof rawTalles === "string") {
    try {
      return JSON.parse(rawTalles);
    } catch {
      return [];
    }
  }
  return Array.isArray(rawTalles) ? rawTalles : [];
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
      imagenes: rawImagenes = [],
    } = req.body;

    const listaImagenes = parsearImagenes(rawImagenes);
    const listaTalles = parsearTalles(talles);

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
        stock: tieneTalles ? 0 : Number(stock || 0),
        tieneTalles: Boolean(tieneTalles),

        // Mapeo seguro de imágenes
        ...(listaImagenes.length > 0 && {
          imagenes: {
            create: listaImagenes.map((imagen, index) => ({
              url: typeof imagen === "string" ? imagen : imagen.url,
              principal: Boolean(imagen.principal ?? index === 0),
              orden: index,
            })),
          },
        }),

        // Mapeo seguro de talles
        ...(tieneTalles && listaTalles.length > 0 && {
          talles: {
            create: listaTalles.map((t) => ({
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
    res.status(500).json({ mensaje: "Error al crear producto", error: error.message });
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
      talles,
      imagenes: rawImagenes,
    } = req.body;

    const idProducto = Number(id);
    const tieneImagenesDefinidas = rawImagenes !== undefined;
    const listaImagenes = tieneImagenesDefinidas ? parsearImagenes(rawImagenes) : [];

    const tieneTallesDefinidos = talles !== undefined;
    const listaTalles = tieneTallesDefinidos ? parsearTalles(talles) : [];

    const productoActualizado = await prisma.$transaction(
      async (tx) => {
        // 1. Eliminar relaciones previas solo si se enviaron nuevas listas
        if (tieneTallesDefinidos) {
          await tx.talleProducto.deleteMany({
            where: { productoId: idProducto },
          });
        }

        if (tieneImagenesDefinidas) {
          await tx.imagenProducto.deleteMany({
            where: { productoId: idProducto },
          });
        }

        // 2. Actualizar producto y recrear relaciones
        return await tx.producto.update({
          where: { id: idProducto },
          data: {
            nombre: nombre ? capitalizar(nombre) : undefined,
            descripcion,
            marca: marca !== undefined ? (marca ? capitalizar(marca) : null) : undefined,
            categoriaId: categoriaId !== undefined ? (categoriaId ? Number(categoriaId) : null) : undefined,
            subcategoriaId: subcategoriaId !== undefined ? (subcategoriaId ? Number(subcategoriaId) : null) : undefined,
            precio: precio !== undefined ? Number(precio) : undefined,
            activo: activo !== undefined ? Boolean(activo) : undefined,
            destacado: destacado !== undefined ? Boolean(destacado) : undefined,
            tieneTalles: tieneTalles !== undefined ? Boolean(tieneTalles) : undefined,
            stock: tieneTalles ? 0 : (stock !== undefined ? Number(stock) : undefined),

            ...(tieneImagenesDefinidas && listaImagenes.length > 0 && {
              imagenes: {
                create: listaImagenes.map((img, index) => ({
                  url: typeof img === "string" ? img : img.url,
                  principal: Boolean(img.principal ?? index === 0),
                  orden: index,
                })),
              },
            }),

            // ✅ FIX: antes se borraban los talles viejos pero nunca se
            // volvían a crear los nuevos. Ahora sí se recrean.
            ...(tieneTallesDefinidos && listaTalles.length > 0 && {
              talles: {
                create: listaTalles.map((t) => ({
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
      },
      { maxWait: 5000, timeout: 10000 }
    );

    res.json(formatearProducto(productoActualizado));
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).json({ mensaje: "Error al actualizar producto", error: error.message });
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