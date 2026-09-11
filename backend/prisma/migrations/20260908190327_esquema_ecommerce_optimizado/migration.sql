/*
  Warnings:

  - You are about to drop the column `mercadoPagoPaymentId` on the `Orden` table. All the data in the column will be lost.
  - The `estado` column on the `Pago` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[mpPaymentId]` on the table `Pago` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "EstadoPago" AS ENUM ('PENDIENTE', 'APROBADO', 'RECHAZADO', 'REEMBOLSADO');

-- DropForeignKey
ALTER TABLE "Subcategoria" DROP CONSTRAINT "Subcategoria_categoriaId_fkey";

-- DropIndex
DROP INDEX "Pago_ordenId_key";

-- AlterTable
ALTER TABLE "ItemOrden" ADD COLUMN     "imagenUrl" TEXT;

-- AlterTable
ALTER TABLE "Orden" DROP COLUMN "mercadoPagoPaymentId";

-- AlterTable
ALTER TABLE "Pago" DROP COLUMN "estado",
ADD COLUMN     "estado" "EstadoPago" NOT NULL DEFAULT 'PENDIENTE';

-- AlterTable
ALTER TABLE "Producto" ADD COLUMN     "tieneTalles" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "ImagenProducto_productoId_idx" ON "ImagenProducto"("productoId");

-- CreateIndex
CREATE INDEX "ItemCarrito_carritoId_idx" ON "ItemCarrito"("carritoId");

-- CreateIndex
CREATE INDEX "ItemOrden_ordenId_idx" ON "ItemOrden"("ordenId");

-- CreateIndex
CREATE INDEX "Orden_usuarioId_idx" ON "Orden"("usuarioId");

-- CreateIndex
CREATE INDEX "Orden_estado_idx" ON "Orden"("estado");

-- CreateIndex
CREATE INDEX "Orden_createdAt_idx" ON "Orden"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Pago_mpPaymentId_key" ON "Pago"("mpPaymentId");

-- CreateIndex
CREATE INDEX "Pago_ordenId_idx" ON "Pago"("ordenId");

-- CreateIndex
CREATE INDEX "Pago_mpPaymentId_idx" ON "Pago"("mpPaymentId");

-- CreateIndex
CREATE INDEX "Producto_categoriaId_idx" ON "Producto"("categoriaId");

-- CreateIndex
CREATE INDEX "Producto_subcategoriaId_idx" ON "Producto"("subcategoriaId");

-- CreateIndex
CREATE INDEX "Producto_activo_destacado_idx" ON "Producto"("activo", "destacado");

-- CreateIndex
CREATE INDEX "Subcategoria_categoriaId_idx" ON "Subcategoria"("categoriaId");

-- CreateIndex
CREATE INDEX "TalleProducto_productoId_idx" ON "TalleProducto"("productoId");

-- CreateIndex
CREATE INDEX "Usuario_email_idx" ON "Usuario"("email");

-- AddForeignKey
ALTER TABLE "Subcategoria" ADD CONSTRAINT "Subcategoria_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE CASCADE ON UPDATE CASCADE;
