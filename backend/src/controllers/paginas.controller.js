import { prisma } from "../db/prisma.js";
import { deleteCloudinaryResourceByUrl } from "../utils/cloudinaryCleanup.js";

export const getPaginas = async (
  req,
  res
) => {
  try {
    const { visible } = req.query;

    const paginas =
      await prisma.paginaContenido.findMany({
        where:
          visible === "true"
            ? {
                visibleEnMenu: true,
              }
            : undefined,

        orderBy: {
          orden: "asc",
        },
      });

    res.json(paginas);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje:
        "Error obteniendo páginas",
    });
  }
};

export const getPaginaPorSlug =
  async (req, res) => {
    try {
      const pagina =
        await prisma.paginaContenido.findUnique({
          where: {
            slug: req.params.slug,
          },
        });

      if (!pagina) {
        return res.status(404).json({
          mensaje:
            "Página no encontrada",
        });
      }

      res.json(pagina);

    } catch (error) {
      console.error(error);

      res.status(500).json({
        mensaje:
          "Error obteniendo página",
      });
    }
  };

export const crearPagina = async (req, res) => {
  try {
    // Desestructuramos para extraer solo lo necesario e ignorar cualquier "id" que venga del front
    const { titulo, slug, contenido, imagen, visibleEnMenu, orden } = req.body;

    const pagina = await prisma.paginaContenido.create({
      data: {
        titulo,
        slug,
        contenido,
        imagen: imagen === "" ? null : imagen, // Nos aseguramos de guardar null si viene vacío
        visibleEnMenu: Boolean(visibleEnMenu),
        orden: Number(orden) || 0,
      },
    });

    res.status(201).json(pagina);
  } catch (error) {
    console.error("Error en crearPagina backend:", error);
    res.status(500).json({
      mensaje: "Error creando página",
    });
  }
};

export const editarPagina = async (req, res) => {
  try {
    const { titulo, slug, contenido, imagen, visibleEnMenu, orden } = req.body;

    const paginaActual = await prisma.paginaContenido.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!paginaActual) {
      return res.status(404).json({ mensaje: "Página no encontrada" });
    }

    const nuevaImagen = imagen === "" ? null : imagen;

    const pagina = await prisma.paginaContenido.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        titulo,
        slug,
        contenido,
        imagen: nuevaImagen,
        visibleEnMenu: Boolean(visibleEnMenu),
        orden: Number(orden) || 0,
      },
    });

    if (paginaActual.imagen && paginaActual.imagen !== nuevaImagen) {
      await deleteCloudinaryResourceByUrl(paginaActual.imagen);
    }

    res.json(pagina);
  } catch (error) {
    console.error("Error en editarPagina backend:", error);
    res.status(500).json({
      mensaje: "Error editando página",
    });
  }
};

export const eliminarPagina =
  async (req, res) => {
    try {
      const pagina = await prisma.paginaContenido.findUnique({
        where: {
          id: Number(req.params.id),
        },
      });

      if (!pagina) {
        return res.status(404).json({ mensaje: "Página no encontrada" });
      }

      await prisma.paginaContenido.delete({
        where: {
          id: Number(req.params.id),
        },
      });

      if (pagina.imagen) {
        await deleteCloudinaryResourceByUrl(pagina.imagen);
      }

      res.json({
        mensaje:
          "Página eliminada",
      });

    } catch (error) {
      console.error(error);

      res.status(500).json({
        mensaje:
          "Error eliminando página",
      });
    }
  };