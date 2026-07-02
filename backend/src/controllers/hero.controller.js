import { prisma } from "../db/prisma.js";

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
        imagen,
        orden: Number(orden),
      },
    });

  res.json(slide);
};

export const eliminarSlide = async (
  req,
  res
) => {
  const { id } = req.params;

  await prisma.heroSlide.delete({
    where: {
      id: Number(id),
    },
  });

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