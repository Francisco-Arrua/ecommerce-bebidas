import express from "express";
import cors from "cors";
import { prisma } from "./db/prisma.js";

import productosRoutes from "./routes/productos.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/productos", productosRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});