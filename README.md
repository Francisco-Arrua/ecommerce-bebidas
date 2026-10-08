# Ecommerce Template v2
 
Plantilla de tienda online full‑stack con catálogo, carrito, checkout con **Mercado Pago**, gestión de pedidos y un **panel de administración** para manejar productos y contenido del sitio (portadas, anuncios, colecciones, páginas, configuración).
 
## Stack
 
| Capa | Tecnologías |
| --- | --- |
| Frontend | React 19, Vite, React Router 7, `browser-image-compression` |
| Backend | Node.js, Express 5, Prisma 6 |
| Base de datos | PostgreSQL |
| Autenticación | JWT (cookie `httpOnly` + header `Authorization: Bearer`), bcrypt |
| Pagos | Mercado Pago Checkout Pro + webhooks firmados |
| Imágenes | Cloudinary (subida vía `multer` en memoria) |
| Emails | Resend (recuperación de contraseña) |
| Deploy | Vercel (frontend y backend como proyectos separados) |
 
## Funcionalidades
 
**Tienda (cliente)**
- Home con portadas (hero), anuncios, productos destacados y en oferta, páginas de contenido.
- Catálogo por categoría, buscador, detalle de producto con talles y productos relacionados.
- Colecciones / promociones.
- Registro, login, cambio de contraseña y recuperación por email.
- Carrito persistido en base de datos (requiere sesión), validación de stock por producto o por talle.
- Checkout: datos de envío + opción de envío → pago en Mercado Pago → pantalla de resultado.
- Botón flotante de WhatsApp (configurable).
 
**Panel de administración (`/admin`, solo rol `ADMIN`)**
- Inicio (dashboard con métricas de catálogo).
- Productos (CRUD, imágenes, talles y stock, activo/destacado, ofertas).
- Categorías y subcategorías.
- Portadas (hero slides), anuncios (banners), colecciones y secciones (páginas de contenido).
- Pedidos (estado de orden, estado de envío, código de seguimiento).
- Clientes.
- Configuración de la tienda (nombre, redes, WhatsApp, monto mínimo para envío gratis).
- Credenciales de Mercado Pago (se guardan encriptadas en la base).
 
## Estructura del repositorio
 
```
.
├── backend/              API REST (Express + Prisma)
│   ├── api/index.js      Entry point para Vercel (exporta la app)
│   ├── prisma/           schema.prisma + migraciones
│   ├── src/
│   │   ├── server.js     Configuración de Express y montaje de rutas
│   │   ├── config/       Cloudinary y cliente de Mercado Pago
│   │   ├── controllers/  Lógica de cada recurso
│   │   ├── routes/       Definición de endpoints
│   │   ├── middlewares/  verificarToken, soloAdmin
│   │   ├── db/           Cliente de Prisma
│   │   └── utils/        Encriptación, precios, limpieza de Cloudinary
│   └── vercel.json
├── frontend/             SPA (React + Vite)
│   ├── src/
│   │   ├── App.jsx       Rutas
│   │   ├── pages/        Pantallas de la tienda
│   │   ├── components/   Componentes públicos y admin/
│   │   ├── context/      AuthContext, CartContext
│   │   └── utils/
│   └── vercel.json
└── docs/                 Documentación detallada
```
 
## Puesta en marcha local
 
### Requisitos
- Node.js 20+ y npm
- PostgreSQL 14+
- Cuenta de Cloudinary (para subir imágenes)
- Opcional: cuenta de Resend (emails) y de Mercado Pago (pagos)
 
### 1. Backend
 
```bash
cd backend
cp .env.example .env          # completar las variables (ver docs/despliegue.md)
npm install                   # corre `prisma generate` en el postinstall
npx prisma migrate deploy     # crea las tablas (o `npx prisma migrate dev` en desarrollo)
npm run dev                   # http://localhost:3000 con nodemon
```
 
### 2. Frontend
 
```bash
cd frontend
cp .env.example .env          # VITE_API_URL=http://localhost:3000
npm install
npm run dev                   # http://localhost:5173
```
 
### 3. Crear el primer administrador
 
El registro siempre crea usuarios con rol `CLIENTE`. Para tener un admin, registrate desde `/register` y luego actualizá el rol en la base:
 
```sql
UPDATE "Usuario" SET rol = 'ADMIN' WHERE email = 'tu@email.com';
```
 
(o usá `npx prisma studio`). Cerrá sesión y volvé a entrar para que el token incluya el nuevo rol.
 
### 4. Configuración inicial desde el panel
1. **Credenciales MP**: cargar Access Token, Public Key y (opcional) el secreto de webhooks.
2. **Configuración**: nombre de la tienda, WhatsApp, redes, monto para envío gratis.
3. Crear al menos una **opción de envío** (endpoint `/envio/admin`); el checkout la exige.
4. Cargar categorías, productos, portadas, etc.
 
## Scripts
 
| Carpeta | Script | Descripción |
| --- | --- | --- |
| backend | `npm run dev` | Servidor con nodemon |
| backend | `npm start` | Servidor en modo producción |
| backend | `npm run build` | `prisma generate` |
| frontend | `npm run dev` | Servidor de desarrollo Vite |
| frontend | `npm run build` | Build de producción en `dist/` |
| frontend | `npm run preview` | Sirve el build localmente |
| frontend | `npm run lint` | ESLint |
 
## Documentación
 
- [Arquitectura](docs/arquitectura.md): cómo se conectan frontend y backend, autenticación, carrito y precios.
- [API REST](docs/api.md): todos los endpoints, permisos y parámetros.
- [Base de datos](docs/base-de-datos.md): modelos de Prisma y relaciones.
- [Pagos con Mercado Pago](docs/mercadopago.md): flujo de checkout, webhook y credenciales.
- [Variables de entorno y despliegue](docs/despliegue.md): configuración y deploy en Vercel.