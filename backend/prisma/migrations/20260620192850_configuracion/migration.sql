-- CreateTable
CREATE TABLE "Configuracion" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "nombreTienda" TEXT DEFAULT 'Mi Tienda',
    "whatsapp" TEXT,
    "instagram" TEXT,
    "facebook" TEXT,
    "mostrarSobreNosotros" BOOLEAN NOT NULL DEFAULT true,
    "mostrarContacto" BOOLEAN NOT NULL DEFAULT true,
    "mostrarPreguntasFrecuentes" BOOLEAN NOT NULL DEFAULT true,
    "mostrarComoComprar" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Configuracion_pkey" PRIMARY KEY ("id")
);
