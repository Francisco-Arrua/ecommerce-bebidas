import { Router } from "express";
import multer from "multer";

import { subirImagen } from "../controllers/upload.controller.js";

const router = Router();

const upload = multer({
  dest: "temp/",
});


router.post("/", upload.single("file"), subirImagen);


router.get("/test", (req, res) => {
  res.json({
    mensaje: "upload funcionando",
  });
});


export default router;