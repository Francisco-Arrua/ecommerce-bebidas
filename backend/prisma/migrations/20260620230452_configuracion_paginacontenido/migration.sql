/*
  Warnings:

  - You are about to drop the column `mostrarComoComprar` on the `Configuracion` table. All the data in the column will be lost.
  - You are about to drop the column `mostrarContacto` on the `Configuracion` table. All the data in the column will be lost.
  - You are about to drop the column `mostrarPreguntasFrecuentes` on the `Configuracion` table. All the data in the column will be lost.
  - You are about to drop the column `mostrarSobreNosotros` on the `Configuracion` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Configuracion" DROP COLUMN "mostrarComoComprar",
DROP COLUMN "mostrarContacto",
DROP COLUMN "mostrarPreguntasFrecuentes",
DROP COLUMN "mostrarSobreNosotros";

-- CreateTable
CREATE TABLE "PaginaContenido" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "visibleEnMenu" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaginaContenido_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PaginaContenido_slug_key" ON "PaginaContenido"("slug");
