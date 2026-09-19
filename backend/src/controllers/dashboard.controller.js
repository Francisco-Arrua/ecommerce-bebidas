import { prisma } from "../db/prisma.js";

export const getDashboard = async (req, res) => {
  try {
    const productos = await prisma.producto.count();
    const categorias = await prisma.categoria.count();
    const subcategorias = await prisma.subcategoria.count();

    const activos = await prisma.producto.count({
      where: {
        activo: true,
      },
    });

    const destacados = await prisma.producto.count({
      where: {
        destacado: true,
      },
    });

    // 1. Incluimos los talles para poder calcular el stock total real en memoria o consultas
    const ultimosProductos = await prisma.producto.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      include: {
        categoria: true,
        subcategoria: true,
        talles: true,
      },
    });

    // 2. Traemos todos los productos con sus talles incluidos para el frontend
    const productosDetalle = await prisma.producto.findMany({
      include: {
        categoria: true,
        subcategoria: true,
        talles: true,
      },
    });

    // 3. Calculamos "sinStock" evaluando el tipo de producto (con talles o sin talles)
    const sinStock = productosDetalle.filter((producto) => {
      if (producto.tieneTalles && Array.isArray(producto.talles)) {
        // Para productos con variantes, sumamos el stock de todos sus talles
        const totalStockTalles = producto.talles.reduce(
          (acc, item) => acc + (item.stock || 0),
          0
        );
        return totalStockTalles === 0;
      }
      // Para productos sin talles (accesorios, etc.)
      return (producto.stock || 0) === 0;
    }).length;

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
      error: "Error obteniendo dashboard",
    });
  }
};