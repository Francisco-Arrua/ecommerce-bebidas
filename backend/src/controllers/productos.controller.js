import { prisma } from "../db/prisma.js";
import { deleteCloudinaryResourcesByUrls } from "../utils/cloudinaryCleanup.js";
import { agregarPrecioVigente } from "../utils/precioProducto.js";

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
    ...agregarPrecioVigente(producto),
    stock: stockTotal,
    // El precio de oferta viene como Decimal de Prisma; lo normalizamos a Number
    // (o null si el producto no está en oferta) para que el frontend lo use directo.
    precioOferta:
      producto.precioOferta !== null && producto.precioOferta !== undefined
        ? Number(producto.precioOferta)
        : null,
  };
};

// GET /productos
export const getProductos = async (req, res) => {
  try {
    const {
      search,
      categoria,
      subcategoria,
      destacado,
      enOferta,
      activo,
      admin,
      resumen,
    } = req.query;
    const page = Math.max(1, Number(req.query.page) || 1);
    const limitSolicitado = Number(req.query.limit);
    const usaPaginacion = Boolean(req.query.page || req.query.limit);
    const limit = Math.min(100, Math.max(1, Number.isFinite(limitSolicitado) && limitSolicitado > 0 ? limitSolicitado : 20));

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

    if (subcategoria) {
      where.subcategoriaId = Number(subcategoria);
    }

    if (destacado !== undefined) {
      where.destacado = destacado === "true";
    }

    if (enOferta !== undefined) {
      where.enOferta = enOferta === "true";
    }

    if (activo !== undefined) {
      where.activo = activo === "true";
    }

    const include = {
      categoria: true,
      subcategoria: true,
      imagenes: resumen === "true" && admin !== "true"
        ? { orderBy: { orden: "asc" }, take: 1 }
        : { orderBy: { orden: "asc" } },
      talles: true,
    };

    const [productos, total] = await Promise.all([
      prisma.producto.findMany({
        where,
        orderBy: { createdAt: "desc" },
        ...(usaPaginacion ? { skip: (page - 1) * limit, take: limit } : {}),
        include,
      }),
      usaPaginacion ? prisma.producto.count({ where }) : Promise.resolve(null),
    ]);

    const items = productos.map(formatearProducto);

    if (usaPaginacion) {
      return res.json({
        items,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      });
    }

    res.json(items);
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
      enOferta = false,
      precioOferta = null,
      talles = [],
      imagenes: rawImagenes = [],
    } = req.body;

    // Si se manda a crear directamente en oferta, exigimos un precio de oferta válido
    if (enOferta && (precioOferta === null || precioOferta === undefined || Number(precioOferta) <= 0)) {
      return res.status(400).json({ mensaje: "Debés indicar un precio de oferta válido" });
    }

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
        enOferta: Boolean(enOferta),
        precioOferta: enOferta ? Number(precioOferta) : null,
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
      enOferta,
      precioOferta,
      talles,
      imagenes: rawImagenes,
    } = req.body;

    // Si se está activando la oferta, exigimos un precio de oferta válido
    if (enOferta && (precioOferta === undefined || precioOferta === null || Number(precioOferta) <= 0)) {
      return res.status(400).json({ mensaje: "Debés indicar un precio de oferta válido" });
    }

    const idProducto = Number(id);
    const tieneImagenesDefinidas = rawImagenes !== undefined;
    const listaImagenes = tieneImagenesDefinidas ? parsearImagenes(rawImagenes) : [];

    const tieneTallesDefinidos = talles !== undefined;
    const listaTalles = tieneTallesDefinidos ? parsearTalles(talles) : [];

    // enOferta manda: si viene definido, se recalcula precioOferta en consecuencia
    // (true -> guarda el precio nuevo, false -> lo limpia). Si no viene enOferta
    // pero sí precioOferta suelto, se actualiza el precio sin tocar el flag.
    let dataOferta = {};
    if (enOferta !== undefined) {
      dataOferta.enOferta = Boolean(enOferta);
      dataOferta.precioOferta = enOferta ? Number(precioOferta) : null;
    } else if (precioOferta !== undefined) {
      dataOferta.precioOferta = precioOferta !== null ? Number(precioOferta) : null;
    }

    const productoActualizado = await prisma.$transaction(
      async (tx) => {
        let imagenesPrevias = [];

        if (tieneImagenesDefinidas) {
          const productoActual = await tx.producto.findUnique({
            where: { id: idProducto },
            include: { imagenes: true },
          });

          imagenesPrevias = productoActual?.imagenes?.map((img) => img.url) || [];

          await tx.imagenProducto.deleteMany({
            where: { productoId: idProducto },
          });
        }

        if (tieneTallesDefinidos) {
          await tx.talleProducto.deleteMany({
            where: { productoId: idProducto },
          });
        }

        const producto = await tx.producto.update({
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
            ...dataOferta,

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

        return producto;
      },
      { maxWait: 5000, timeout: 10000 }
    );

    if (tieneImagenesDefinidas && imagenesPrevias.length > 0) {
      const urlsAEliminar = imagenesPrevias.filter((url) => !listaImagenes.some((img) => (typeof img === "string" ? img : img.url) === url));
      await deleteCloudinaryResourcesByUrls(urlsAEliminar);
    }

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

    const producto = await prisma.producto.findUnique({
      where: { id: Number(id) },
      include: { imagenes: true },
    });

    if (!producto) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    await prisma.producto.delete({
      where: {
        id: Number(id),
      },
    });

    const urls = producto.imagenes.map((img) => img.url);
    await deleteCloudinaryResourcesByUrls(urls);

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