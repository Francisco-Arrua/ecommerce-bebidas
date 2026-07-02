import { prisma } from "../db/prisma.js";

// 1. OBTENER TODAS LAS COLECCIONES (Público)
export const obtenerColeccionesPublicas = async (req, res) => {
  try {
    const colecciones = await prisma.coleccion.findMany({
      where: { activo: true },
      orderBy: { orden: "asc" },
    });
    res.json(colecciones);
  } catch (error) {
    console.error("Error al obtener colecciones:", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

// 2. OBTENER DETALLE (Público)
export const obtenerDetalleColeccion = async (req, res) => {
  try {
    const { id } = req.params;

    const coleccion = await prisma.coleccion.findUnique({
      where: { id: Number(id) },
      include: {
        productos: {
          where: { activo: true },
          include: {
            imagenes: true,
            categoria: true
          }
        }
      }
    });

    if (!coleccion || !coleccion.activo) {
      return res.status(404).json({ mensaje: "La colección no existe o no está disponible" });
    }

    res.json(coleccion);
  } catch (error) {
    console.error("Error al obtener detalle de la colección:", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

// ==========================================
// SECCIÓN ADMIN (Crear / Editar / Eliminar)
// ==========================================

export const crearColeccion = async (req, res) => {
  try {
    const { nombre, subtitulo, descripcion, imagen, productosIds } = req.body;
    
    const nuevaColeccion = await prisma.coleccion.create({
      data: {
        nombre,
        subtitulo,
        descripcion,
        imagen,
        productos: {
          connect: productosIds ? productosIds.map(id => ({ id: Number(id) })) : []
        }
      }
    });

    res.status(201).json(nuevaColeccion);
  } catch (error) {
    console.error("Error al crear colección:", error);
    res.status(500).json({ mensaje: "Error al crear colección" });
  }
};

export const actualizarColeccion = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, subtitulo, descripcion, imagen, activo, productosIds } = req.body;

    const coleccionActualizada = await prisma.coleccion.update({
      where: { id: Number(id) },
      data: {
        nombre,
        subtitulo,
        descripcion,
        imagen,
        activo,
        productos: {
          set: productosIds ? productosIds.map(id => ({ id: Number(id) })) : []
        }
      }
    });

    res.json(coleccionActualizada);
  } catch (error) {
    console.error("Error al actualizar colección:", error);
    res.status(500).json({ mensaje: "Error al actualizar" });
  }
};

// NUEVO: 3. ELIMINAR COLECCIÓN (Admin)
export const eliminarColeccion = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.coleccion.delete({
      where: { id: Number(id) },
    });

    res.json({ mensaje: "Colección eliminada con éxito" });
  } catch (error) {
    console.error("Error al eliminar colección:", error);
    res.status(500).json({ mensaje: "Error al eliminar la colección" });
  }
};