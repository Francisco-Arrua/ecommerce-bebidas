/*
  Warnings:

  - You are about to drop the column `imagen` on the `Producto` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Producto" DROP COLUMN "imagen";

-- CreateTable
CREATE TABLE "ImagenProducto" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "productoId" INTEGER NOT NULL,

    CONSTRAINT "ImagenProducto_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ImagenProducto" ADD CONSTRAINT "ImagenProducto_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE CASCADE ON UPDATE CASCADE;
