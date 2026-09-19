import { prisma } from "../db/prisma.js";
import { deleteCloudinaryResourceByUrl } from "../utils/cloudinaryCleanup.js";

export const getSlides = async (
  req,
  res
) => {
  const slides =
    await prisma.heroSlide.findMany({
      orderBy: {
        orden: "asc",
      },
    });

  res.json(slides);
};

export const crearSlide = async (
  req,
  res
) => {
  const {
    titulo,
    subtitulo,
    textoBoton,
    linkBoton,
    orden,
    imagen,
  } = req.body;

  const slide =
    await prisma.heroSlide.create({
      data: {
        titulo,
        subtitulo,
        textoBoton,
        linkBoton,
        imagen,
        orden: Number(orden),
      },
    });

  res.status(201).json(slide);
};

export const actualizarSlide = async (
  req,
  res
) => {
  const { id } = req.params;

  const {
    titulo,
    subtitulo,
    textoBoton,
    linkBoton,
    imagen,
    orden,
  } = req.body;

  const slideActual = await prisma.heroSlide.findUnique({
    where: { id: Number(id) },
  });

  if (!slideActual) {
    return res.status(404).json({ mensaje: "Slide no encontrado" });
  }

  const nuevaImagen = imagen === "" ? null : imagen;

  const slide =
    await prisma.heroSlide.update({
      where: {
        id: Number(id),
      },
      data: {
        titulo,
        subtitulo,
        textoBoton,
        linkBoton,
        imagen: nuevaImagen,
        orden: Number(orden),
      },
    });

  if (slideActual.imagen && slideActual.imagen !== nuevaImagen) {
    await deleteCloudinaryResourceByUrl(slideActual.imagen);
  }

  res.json(slide);
};

export const eliminarSlide = async (
  req,
  res
) => {
  const { id } = req.params;

  const slide = await prisma.heroSlide.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!slide) {
    return res.status(404).json({ mensaje: "Slide no encontrado" });
  }

  await prisma.heroSlide.delete({
    where: {
      id: Number(id),
    },
  });

  if (slide.imagen) {
    await deleteCloudinaryResourceByUrl(slide.imagen);
  }

  res.json({
    mensaje: "Slide eliminado",
  });
};

export const cambiarActivo = async (
  req,
  res
) => {
  const { id } = req.params;

  const slideActual =
    await prisma.heroSlide.findUnique({
      where: {
        id: Number(id),
      },
    });

  if (!slideActual) {
    return res.status(404).json({
      mensaje: "Slide no encontrado",
    });
  }

  const slide =
    await prisma.heroSlide.update({
      where: {
        id: Number(id),
      },
      data: {
        activo: !slideActual.activo,
      },
    });

  res.json(slide);
};