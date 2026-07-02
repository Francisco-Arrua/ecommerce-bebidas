import { prisma } from "../db/prisma.js";

export const obtenerClientes = async (req, res) => {
  try {
    const clientes = await prisma.usuario.findMany({
        where: {
            rol: "CLIENTE"
        },
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
        creadoEn: true,
      },
      orderBy: {
        id: "desc",
      },
    });

    res.json(clientes);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error obteniendo clientes",
    });
  }
};