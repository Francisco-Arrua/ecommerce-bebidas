import { v2 as cloudinary } from "cloudinary";

export const subirImagen = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        mensaje: "No se recibió ninguna imagen",
      });
    }

    // Subida directa desde el buffer de memoria
    const resultado = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "tienda-online" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    return res.json({
      url: resultado.secure_url,
    });
  } catch (error) {
    console.error("Error en Cloudinary:", error);
    return res.status(500).json({
      mensaje: "Error al subir imagen",
    });
  }
};