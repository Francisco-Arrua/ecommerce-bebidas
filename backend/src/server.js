import "dotenv/config";
import express from "express";
import cors from "cors";
import { prisma } from "./db/prisma.js";

import productosRoutes from "./routes/productos.routes.js";
import categoriasRoutes from "./routes/categorias.routes.js";
import subcategoriasRoutes from "./routes/subcategorias.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import heroRoutes from "./routes/hero.routes.js";
import configuracionRoutes from "./routes/configuracion.routes.js";
import paginasRoutes from "./routes/paginas.routes.js";
import bannerRoutes from "./routes/banner.routes.js";
import cloudinaryRoutes from "./routes/cloudinary.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import authRoutes from "./routes/auth.routes.js" 
import carritoRoutes from "./routes/carrito.routes.js"
import clientesRoutes from "./routes/clientes.routes.js";
import coleccionRoutes from "./routes/coleccion.routes.js";
import ordenRoutes from "./routes/orden.routes.js";
import envioRoutes from "./routes/envio.routes.js";
import pagoRoutes from "./routes/pago.routes.js";
import configuracionPagoRoutes from "./routes/configuracionpago.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/productos", productosRoutes);
app.use("/categorias", categoriasRoutes);
app.use("/subcategorias", subcategoriasRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/hero", heroRoutes);
app.use("/configuracion", configuracionRoutes);
app.use("/paginas", paginasRoutes);
app.use("/banner", bannerRoutes);
app.use("/cloudinary", cloudinaryRoutes);
app.use("/upload", uploadRoutes);
app.use("/auth", authRoutes);
app.use("/carrito", carritoRoutes);
app.use("/clientes", clientesRoutes);
app.use("/coleccion", coleccionRoutes);
app.use("/orden", ordenRoutes);
app.use("/envio", envioRoutes);
app.use("/pagos", pagoRoutes);
app.use("/configuracionpago", configuracionPagoRoutes);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});