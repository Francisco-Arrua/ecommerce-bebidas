import { prisma } from "../db/prisma.js";

// 1. Obtener opciones de envío activas (Para el cliente en el checkout)
export const getOpcionesEnvioActivas = async (req, res) => {
  try {
    const opciones = await prisma.opcionEnvio.findMany({
      where: { activo: true },
    });

    res.json(opciones);
  } catch (error) {
    console.error("Error al obtener opciones de envío:", error);
    res.status(500).json({ mensaje: "Error al obtener las opciones de envío" });
  }
};

// 2. Obtener todas las opciones de envío (Para el Panel de Admin)
export const getTodasLasOpcionesEnvio = async (req, res) => {
  try {
    const opciones = await prisma.opcionEnvio.findMany();
    res.json(opciones);
  } catch (error) {
    console.error("Error al obtener las opciones de envío (Admin):", error);
    res.status(500).json({ mensaje: "Error al obtener opciones de envío" });
  }
};

// 3. Crear una nueva opción de envío (Solo Admin)
export const crearOpcionEnvio = async (req, res) => {
  try {
    const { nombre, costo, descripcion, activo } = req.body;

    if (!nombre || costo === undefined) {
      return res.status(400).json({ mensaje: "Nombre y costo son campos obligatorios" });
    }

    const nuevaOpcion = await prisma.opcionEnvio.create({
      data: {
        nombre,
        costo: Number(costo),
        descripcion: descripcion || null,
        activo: activo !== undefined ? Boolean(activo) : true,
      },
    });

    res.status(201).json({
      mensaje: "Opción de envío creada exitosamente",
      opcion: nuevaOpcion,
    });
  } catch (error) {
    console.error("Error al crear opción de envío:", error);
    res.status(500).json({ mensaje: "Error al registrar la opción de envío" });
  }
};

// 4. Actualizar una opción de envío (Solo Admin)
export const actualizarOpcionEnvio = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, costo, descripcion, activo } = req.body;

    const opcionExiste = await prisma.opcionEnvio.findUnique({
      where: { id: Number(id) },
    });

    if (!opcionExiste) {
      return res.status(404).json({ mensaje: "Opción de envío no encontrada" });
    }

    const opcionActualizada = await prisma.opcionEnvio.update({
      where: { id: Number(id) },
      data: {
        ...(nombre && { nombre }),
        ...(costo !== undefined && { costo: Number(costo) }),
        ...(descripcion !== undefined && { descripcion }),
        ...(activo !== undefined && { activo: Boolean(activo) }),
      },
    });

    res.json({
      mensaje: "Opción de envío actualizada correctamente",
      opcion: opcionActualizada,
    });
  } catch (error) {
    console.error("Error al actualizar opción de envío:", error);
    res.status(500).json({ mensaje: "Error al actualizar la opción de envío" });
  }
};

// 5. Eliminar una opción de envío (Solo Admin)
export const eliminarOpcionEnvio = async (req, res) => {
  try {
    const { id } = req.params;

    const opcionExiste = await prisma.opcionEnvio.findUnique({
      where: { id: Number(id) },
    });

    if (!opcionExiste) {
      return res.status(404).json({ mensaje: "Opción de envío no encontrada" });
    }

    await prisma.opcionEnvio.delete({
      where: { id: Number(id) },
    });

    res.json({ mensaje: "Opción de envío eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar opción de envío:", error);
    res.status(500).json({ mensaje: "Error al borrar la opción de envío" });
  }
};