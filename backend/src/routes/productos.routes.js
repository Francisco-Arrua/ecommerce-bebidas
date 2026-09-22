import { Router } from "express";
import {
  getProductos,
  getProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  actualizarStock,
  cambiarActivo,
  cambiarDestacado,
  getProductosRelacionados,
} from "../controllers/productos.controller.js";

// Importá tus middlewares de autenticación y rol
import { verificarToken } from "../middlewares/auth.middleware.js";
import { soloAdmin } from "../middlewares/roles.middleware.js";

const router = Router();

/*   RUTAS PÚBLICAS (Catálogo y Storefront) */

// Obtener todos los productos (soporta query params: ?search= &categoria= &subcategoria= &page= &limit=)
router.get("/", getProductos);

// Obtener un producto por ID
router.get("/:id", getProducto);

// Obtener productos relacionados de la misma categoría
router.get("/:id/relacionados", getProductosRelacionados);


/*   RUTAS PRIVADAS (Solo Administradores) */

// Crear un nuevo producto (soporta recibir array de talles e imágenes)
router.post("/", [verificarToken, soloAdmin], crearProducto);

// Actualizar un producto completo por ID
router.put("/:id", [verificarToken, soloAdmin], actualizarProducto);

// Eliminar un producto por ID
router.delete("/:id", [verificarToken, soloAdmin], eliminarProducto);

// Actualizar el stock general o el stock de un talle
router.patch("/:id/stock", [verificarToken, soloAdmin], actualizarStock);

// Cambiar estado activo/inactivo (visibilidad en la tienda)
router.patch("/activo/:id", [verificarToken, soloAdmin], cambiarActivo);

// Cambiar estado destacado (para carrusel/banner principal)
router.patch("/destacado/:id", [verificarToken, soloAdmin], cambiarDestacado);

export default router;