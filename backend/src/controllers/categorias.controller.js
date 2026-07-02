import { prisma } from "../db/prisma.js";

export const getCategorias = async (req, res) => {
  try {
    const categorias = await prisma.categoria.findMany({
      orderBy: {
        nombre: "asc",
      },
    });

    res.json(categorias);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error obtuvo categorías",
    });
  }
};

export const crearCategoria = async (req, res) => {
  try {
    const { nombre } = req.body;

    const categoria = await prisma.categoria.create({
      data: {
        nombre,
      },
    });

    res.status(201).json(categoria);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error creando categoría",
    });
  }
};

export const editarCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;

    const categoria = await prisma.categoria.update({
      where: {
        id: Number(id),
      },
      data: {
        nombre,
      },
    });

    res.json(categoria);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error editando categoría",
    });
  }
};

export const eliminarCategoria = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Contamos cuántos productos están usando esta categoría actualmente
    const productosAsociados = await prisma.producto.count({
      where: {
        categoriaId: Number(id),
      },
    });

    // 2. Si hay al menos uno, frenamos el borrado mandando un Status 400 (Bad Request)
    if (productosAsociados > 0) {
      return res.status(400).json({
        error: `No se puede eliminar. Esta categoría tiene ${productosAsociados} producto(s) asociado(s). Reasígnalos o elimínalos primero.`,
      });
    }

    // 3. Si el conteo dio 0, procedemos a borrar seguros
    await prisma.categoria.delete({
      where: {
        id: Number(id),
      },
    });

    res.json({
      mensaje: "Categoría eliminada con éxito",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error eliminando categoría",
    });
  }
};