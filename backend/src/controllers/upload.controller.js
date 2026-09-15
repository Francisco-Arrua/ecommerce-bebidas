import { v2 as cloudinary } from "cloudinary";
import { unlink } from "node:fs/promises";

export const subirImagen = async (req, res) => {
  let archivoTemporal;
  try {
    if (!req.file) {
      return res.status(400).json({
        mensaje: "No se recibió ninguna imagen",
      });
    }

    archivoTemporal = req.file.path;
    const resultado = await cloudinary.uploader.upload(
      archivoTemporal,
      {
        folder: "tienda-online",
      }
    );

    res.json({
      url: resultado.secure_url,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al subir imagen",
    });
  } finally {
    if (archivoTemporal) {
      await unlink(archivoTemporal).catch(() => {});
    }
  }
};