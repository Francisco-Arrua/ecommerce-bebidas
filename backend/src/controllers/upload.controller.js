import { v2 as cloudinary } from "cloudinary";

export const subirImagen = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        mensaje: "No se recibió ninguna imagen",
      });
    }

    const resultado = await cloudinary.uploader.upload(
      req.file.path,
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
  }
};