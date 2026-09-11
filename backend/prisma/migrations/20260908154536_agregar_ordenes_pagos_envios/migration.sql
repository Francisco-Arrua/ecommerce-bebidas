/*
  Warnings:

  - You are about to alter the column `precio` on the `Producto` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(12,2)`.
  - Added the required column `updatedAt` to the `Producto` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EstadoOrden" AS ENUM ('PENDIENTE', 'PAGADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "EstadoEnvio" AS ENUM ('PENDIENTE_DESPACHO', 'ENVIADO', 'ENTREGADO');

-- DropForeignKey
ALTER TABLE "ItemCarrito" DROP CONSTRAINT "ItemCarrito_productoId_fkey";

-- AlterTable
ALTER TABLE "Configuracion" ADD COLUMN     "montoMinimoEnvioGratis" DECIMAL(12,2),
ADD COLUMN     "mpAccessToken" TEXT,
ADD COLUMN     "mpPublicKey" TEXT;

-- AlterTable
ALTER TABLE "ItemCarrito" ADD COLUMN     "talleId" INTEGER;

-- AlterTable
ALTER TABLE "Producto" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "precio" SET DATA TYPE DECIMAL(12,2);

-- CreateTable
CREATE TABLE "TalleProducto" (
    "id" SERIAL NOT NULL,
    "talle" TEXT NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "productoId" INTEGER NOT NULL,

    CONSTRAINT "TalleProducto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Orden" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "estado" "EstadoOrden" NOT NULL DEFAULT 'PENDIENTE',
    "estadoEnvio" "EstadoEnvio" NOT NULL DEFAULT 'PENDIENTE_DESPACHO',
    "totalProductos" DECIMAL(12,2) NOT NULL,
    "costoEnvio" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "totalGeneral" DECIMAL(12,2) NOT NULL,
    "metodoEnvio" TEXT,
    "mercadoPagoPaymentId" TEXT,
    "mercadoPagoPreferenceId" TEXT,
    "codigoSeguimiento" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Orden_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemOrden" (
    "id" SERIAL NOT NULL,
    "ordenId" INTEGER NOT NULL,
    "productoId" INTEGER,
    "talleId" INTEGER,
    "nombreProducto" TEXT NOT NULL,
    "talle" TEXT,
    "precioUnitario" DECIMAL(12,2) NOT NULL,
    "cantidad" INTEGER NOT NULL,

    CONSTRAINT "ItemOrden_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DireccionEnvio" (
    "id" SERIAL NOT NULL,
    "ordenId" INTEGER NOT NULL,
    "nombreRecibe" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "provincia" TEXT NOT NULL,
    "localidad" TEXT NOT NULL,
    "codigoPostal" TEXT NOT NULL,
    "calle" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "pisoDepto" TEXT,
    "aclaraciones" TEXT,

    CONSTRAINT "DireccionEnvio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pago" (
    "id" SERIAL NOT NULL,
    "ordenId" INTEGER NOT NULL,
    "metodoPago" TEXT NOT NULL DEFAULT 'MERCADO_PAGO',
    "monto" DECIMAL(12,2) NOT NULL,
    "estado" TEXT NOT NULL,
    "mpPaymentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pago_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OpcionEnvio" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "costo" DECIMAL(12,2) NOT NULL,
    "descripcion" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "OpcionEnvio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TalleProducto_productoId_talle_key" ON "TalleProducto"("productoId", "talle");

-- CreateIndex
CREATE UNIQUE INDEX "DireccionEnvio_ordenId_key" ON "DireccionEnvio"("ordenId");

-- CreateIndex
CREATE UNIQUE INDEX "Pago_ordenId_key" ON "Pago"("ordenId");

-- AddForeignKey
ALTER TABLE "ItemCarrito" ADD CONSTRAINT "ItemCarrito_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemCarrito" ADD CONSTRAINT "ItemCarrito_talleId_fkey" FOREIGN KEY ("talleId") REFERENCES "TalleProducto"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TalleProducto" ADD CONSTRAINT "TalleProducto_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orden" ADD CONSTRAINT "Orden_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemOrden" ADD CONSTRAINT "ItemOrden_ordenId_fkey" FOREIGN KEY ("ordenId") REFERENCES "Orden"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemOrden" ADD CONSTRAINT "ItemOrden_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemOrden" ADD CONSTRAINT "ItemOrden_talleId_fkey" FOREIGN KEY ("talleId") REFERENCES "TalleProducto"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DireccionEnvio" ADD CONSTRAINT "DireccionEnvio_ordenId_fkey" FOREIGN KEY ("ordenId") REFERENCES "Orden"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pago" ADD CONSTRAINT "Pago_ordenId_fkey" FOREIGN KEY ("ordenId") REFERENCES "Orden"("id") ON DELETE CASCADE ON UPDATE CASCADE;
