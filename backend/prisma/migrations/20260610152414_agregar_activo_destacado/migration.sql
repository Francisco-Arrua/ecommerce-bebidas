-- AlterTable
ALTER TABLE "Producto" ADD COLUMN     "activo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "destacado" BOOLEAN NOT NULL DEFAULT false;
