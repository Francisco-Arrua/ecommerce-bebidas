import { prisma } from "../db/prisma.js";

const capitalizar = (texto) => {
  if (!texto) return null;

  return texto
    .toLowerCase()
    .split(" ")
    .map(
      palabra =>
        palabra.charAt(0).toUpperCase() +
        palabra.slice(1)
    )
    .join(" ");
};

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
        imagenes: true,
      },
    });

    res.json(productos);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error obteniendo productos",
    });
  }
};

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
      imagenes = [],
    } = req.body;

    const producto = await prisma.producto.create({
      data: {
        nombre: capitalizar(nombre),
        descripcion,

        marca: capitalizar(marca),

        categoriaId:
          categoriaId
            ? Number(categoriaId)
            : null,

        subcategoriaId:
          subcategoriaId
            ? Number(subcategoriaId)
            : null,

        precio,
        stock,

        imagenes: {
          create: imagenes.map((imagen, index) => ({
            url: imagen.url,
            principal: imagen.principal,
            orden: index,
          })),
        },
      },

      include: {
        imagenes: true,
      },
    });

    res.status(201).json(producto);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al crear producto",
    });
  }
};

export const getProducto = async (req, res) => {
  const { id } = req.params;

  const producto = await prisma.producto.findUnique({
    where: {
      id: Number(id),
    },

    include: {
      categoria: true,
      subcategoria: true,
      imagenes: true,
    },
  });

  if (!producto) {
    return res.status(404).json({
      mensaje: "Producto no encontrado",
    });
  }

  res.json(producto);
};

export const actualizarProducto = async (req, res) => {
  const { id } = req.params;

  const {
    nombre,
    descripcion,
    marca,
    categoriaId,
    subcategoriaId,
    precio,
    stock,
  } = req.body;

  const producto = await prisma.producto.update({
    where: {
      id: Number(id),
    },
    data: {
      nombre: capitalizar(nombre),
      descripcion,

      marca: capitalizar(marca),
      categoriaId:
        categoriaId
          ? Number(categoriaId)
          : null,
      subcategoriaId:
        subcategoriaId
          ? Number(subcategoriaId)
          : null,

      precio,
      stock,
    },
  });

  res.json(producto);
};

export const eliminarProducto = async (req, res) => {
  const { id } = req.params;

  await prisma.producto.delete({
    where: {
      id: Number(id),
    },
  });

  res.json({
    mensaje: "Producto eliminado",
  });
};

export const actualizarStock = async (req, res) => {
  const { id } = req.params;
  const { stock } = req.body;

  const producto = await prisma.producto.update({
    where: {
      id: Number(id),
    },
    data: {
      stock,
    },
  });

  res.json(producto);
};

export const cambiarActivo = async (req, res) => {
  const { id } = req.params;

  const productoActual = await prisma.producto.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!productoActual) {
    return res.status(404).json({
      mensaje: "Producto no encontrado",
    });
  }

  const producto = await prisma.producto.update({
    where: {
      id: Number(id),
    },
    data: {
      activo: !productoActual.activo,
    },
  });

  res.json(producto);
};

export const cambiarDestacado = async (req, res) => {
  const { id } = req.params;

  const productoActual = await prisma.producto.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!productoActual) {
    return res.status(404).json({
      mensaje: "Producto no encontrado",
    });
  }

  const producto = await prisma.producto.update({
    where: {
      id: Number(id),
    },
    data: {
      destacado: !productoActual.destacado,
    },
  });

  res.json(producto);
};

export const getProductosRelacionados = async (req, res) => {
  const { id } = req.params;

  try {
    // Primero buscamos el producto actual
    const producto = await prisma.producto.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!producto) {
      return res.status(404).json({
        mensaje: "Producto no encontrado",
      });
    }

    // Ahora buscamos otros de la misma categoría
    const relacionados = await prisma.producto.findMany({
      where: {
        activo: true,
        categoriaId: producto.categoriaId,
        id: {
          not: producto.id,
        },
      },

      include: {
        imagenes: {
          orderBy: {
            orden: "asc",
          },
        },
      },

      take: 4,
    });

    res.json(relacionados);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error obteniendo productos relacionados",
    });
  }
};