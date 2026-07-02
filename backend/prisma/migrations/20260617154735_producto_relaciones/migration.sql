/*
  Warnings:

  - You are about to drop the column `categoria` on the `Producto` table. All the data in the column will be lost.
  - You are about to drop the column `subcategoria` on the `Producto` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Producto" DROP COLUMN "categoria",
DROP COLUMN "subcategoria",
ADD COLUMN     "categoriaId" INTEGER,
ADD COLUMN     "subcategoriaId" INTEGER;

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_subcategoriaId_fkey" FOREIGN KEY ("subcategoriaId") REFERENCES "Subcategoria"("id") ON DELETE SET NULL ON UPDATE CASCADE;
