import { Router } from "express";
import multer from "multer";
import { verificarToken } from "../middlewares/auth.middleware.js";
import { soloAdmin } from "../middlewares/roles.middleware.js";
import { subirImagen } from "../controllers/upload.controller.js";

const router = Router();

// Cambiamos 'dest' por 'storage: multer.memoryStorage()'
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1, fields: 10 },
  fileFilter: (req, file, callback) => {
    callback(null, ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.mimetype));
  },
});

router.post("/", [verificarToken, soloAdmin, upload.single("file")], subirImagen);

router.get("/test", (req, res) => {
  res.json({
    mensaje: "upload funcionando",
  });
});

export default router;