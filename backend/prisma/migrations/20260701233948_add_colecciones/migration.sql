-- CreateTable
CREATE TABLE "Coleccion" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "subtitulo" TEXT,
    "descripcion" TEXT,
    "imagen" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Coleccion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ColeccionToProducto" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ColeccionToProducto_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ColeccionToProducto_B_index" ON "_ColeccionToProducto"("B");

-- AddForeignKey
ALTER TABLE "_ColeccionToProducto" ADD CONSTRAINT "_ColeccionToProducto_A_fkey" FOREIGN KEY ("A") REFERENCES "Coleccion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ColeccionToProducto" ADD CONSTRAINT "_ColeccionToProducto_B_fkey" FOREIGN KEY ("B") REFERENCES "Producto"("id") ON DELETE CASCADE ON UPDATE CASCADE;
