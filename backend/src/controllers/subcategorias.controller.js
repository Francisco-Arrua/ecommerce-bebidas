import { prisma } from "../db/prisma.js";

export const getSubcategorias = async (req, res) => {
  try {
    const { categoriaId } = req.query;

    const subcategorias = await prisma.subcategoria.findMany({
      where: categoriaId ? { categoriaId: Number(categoriaId) } : undefined,
      include: {
        categoria: true,
      },
      orderBy: {
        nombre: "asc",
      },
    });

    res.json(subcategorias);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error obteniendo subcategorías",
    });
  }
};

export const crearSubcategoria = async (
  req,
  res
) => {
  try {
    const {
      nombre,
      categoriaId,
    } = req.body;

    const subcategoria =
      await prisma.subcategoria.create({
        data: {
          nombre,
          categoriaId:
            Number(categoriaId),
        },
      });

    res.status(201).json(
      subcategoria
    );
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error:
        "Error creando subcategoría",
    });
  }
};

export const editarSubcategoria = async (
  req,
  res
) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;

    const subcategoria =
      await prisma.subcategoria.update({
        where: {
          id: Number(id),
        },
        data: {
          nombre,
        },
      });

    res.json(subcategoria);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error:
        "Error editando subcategoría",
    });
  }
};

export const eliminarSubcategoria = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    await prisma.subcategoria.delete({
      where: {
        id: Number(id),
      },
    });

    res.json({
      mensaje: "Subcategoría eliminada",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error:
        "Error eliminando subcategoría",
    });
  }
};