import cloudinary from "../config/cloudinary.js";

export const testCloudinary = async (req, res) => {
  try {
    const resultado =
      await cloudinary.api.ping();

    res.json({
      mensaje: "Cloudinary conectado",
      resultado,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error conectando Cloudinary",
    });
  }
};