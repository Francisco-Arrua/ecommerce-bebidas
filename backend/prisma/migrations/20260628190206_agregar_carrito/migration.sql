-- CreateTable
CREATE TABLE "Carrito" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Carrito_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemCarrito" (
    "id" SERIAL NOT NULL,
    "carritoId" INTEGER NOT NULL,
    "productoId" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "ItemCarrito_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Carrito_usuarioId_key" ON "Carrito"("usuarioId");

-- AddForeignKey
ALTER TABLE "Carrito" ADD CONSTRAINT "Carrito_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemCarrito" ADD CONSTRAINT "ItemCarrito_carritoId_fkey" FOREIGN KEY ("carritoId") REFERENCES "Carrito"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemCarrito" ADD CONSTRAINT "ItemCarrito_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
