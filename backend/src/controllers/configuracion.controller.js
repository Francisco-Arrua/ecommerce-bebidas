import { prisma } from "../db/prisma.js";

export const getConfiguracion = async (
  req,
  res
) => {
  try {
    let configuracion =
      await prisma.configuracion.findUnique({
        where: {
          id: 1,
        },
      });

    if (!configuracion) {
      configuracion =
        await prisma.configuracion.create({
          data: {
            id: 1,
          },
        });
    }

    res.json(configuracion);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje:
        "Error obteniendo configuración",
    });
  }
};

export const actualizarConfiguracion =
  async (req, res) => {
    try {
      const configuracion =
        await prisma.configuracion.upsert({
          where: {
            id: 1,
          },

          update: req.body,

          create: {
            id: 1,
            ...req.body,
          },
        });

      res.json(configuracion);

    } catch (error) {
      console.error(error);

      res.status(500).json({
        mensaje:
          "Error actualizando configuración",
      });
    }
  };