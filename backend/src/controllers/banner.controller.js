import { prisma } from "../db/prisma.js";
import { deleteCloudinaryResourceByUrl } from "../utils/cloudinaryCleanup.js";

export const getBanners = async (req, res) => {
  const banners = await prisma.banner.findMany({
    orderBy: {
      orden: "asc",
    },
  });

  res.json(banners);
};

export const crearBanner = async (req, res) => {
  const {
    titulo,
    subtitulo,
    imagen,
    colorInicio,
    colorFin,
    orden,
  } = req.body;

  const banner = await prisma.banner.create({
    data: {
      titulo,
      subtitulo,
      imagen,
      colorInicio,
      colorFin,
      orden: Number(orden) || 0,
    },
  });

  res.status(201).json(banner);
};

export const actualizarBanner = async (req, res) => {
  const { id } = req.params;

  const {
    titulo,
    subtitulo,
    imagen,
    colorInicio,
    colorFin,
    orden,
  } = req.body;

  const bannerActual = await prisma.banner.findUnique({
    where: { id: Number(id) },
  });

  if (!bannerActual) {
    return res.status(404).json({ mensaje: "Banner no encontrado" });
  }

  const imagenActual = bannerActual.imagen;
  const nuevaImagen = imagen === "" ? null : imagen;

  const banner = await prisma.banner.update({
    where: {
      id: Number(id),
    },
    data: {
      titulo,
      subtitulo,
      imagen: nuevaImagen,
      colorInicio,
      colorFin,
      orden: Number(orden) || 0,
    },
  });

  if (imagenActual && imagenActual !== nuevaImagen) {
    await deleteCloudinaryResourceByUrl(imagenActual);
  }

  res.json(banner);
};

export const eliminarBanner = async (req, res) => {
  const { id } = req.params;

  const banner = await prisma.banner.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!banner) {
    return res.status(404).json({ mensaje: "Banner no encontrado" });
  }

  await prisma.banner.delete({
    where: {
      id: Number(id),
    },
  });

  if (banner.imagen) {
    await deleteCloudinaryResourceByUrl(banner.imagen);
  }

  res.json({
    mensaje: "Banner eliminado",
  });
};

export const cambiarActivo = async (req, res) => {
  const { id } = req.params;

  const bannerActual = await prisma.banner.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!bannerActual) {
    return res.status(404).json({
      mensaje: "Banner no encontrado",
    });
  }

  const banner = await prisma.banner.update({
    where: {
      id: Number(id),
    },
    data: {
      activo: !bannerActual.activo,
    },
  });

  res.json(banner);
};