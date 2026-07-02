import { prisma } from "../db/prisma.js";

export const getDashboard = async (req, res) => {
  try {
    const productos =
      await prisma.producto.count();

    const categorias =
      await prisma.categoria.count();

    const subcategorias =
      await prisma.subcategoria.count();

    const activos =
      await prisma.producto.count({
        where: {
          activo: true,
        },
      });

    const destacados =
      await prisma.producto.count({
        where: {
          destacado: true,
        },
      });

    const sinStock =
        await prisma.producto.count({
            where: {
            stock: 0,
            },
        });

    const ultimosProductos = await prisma.producto.findMany({
        orderBy: {
        createdAt: "desc",
        },
        take: 5,
        include: {
        categoria: true,
        subcategoria: true,
        },
    });

    const productosDetalle = await prisma.producto.findMany({
        include: {
        categoria: true,
        subcategoria: true,
        },
    });

    res.json({
      productos,
      categorias,
      subcategorias,
      activos,
      destacados,
      sinStock,
      ultimosProductos,
      productosDetalle,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error:
        "Error obteniendo dashboard",
    });
  }
};
