-- AlterTable
ALTER TABLE "Banner" ADD COLUMN     "imagen" TEXT,
ALTER COLUMN "titulo" DROP NOT NULL;

-- AlterTable
ALTER TABLE "HeroSlide" ADD COLUMN     "imagen" TEXT;

-- AlterTable
ALTER TABLE "ImagenProducto" ADD COLUMN     "principal" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "PaginaContenido" ADD COLUMN     "imagen" TEXT;
