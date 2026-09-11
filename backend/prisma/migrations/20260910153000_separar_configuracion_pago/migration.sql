-- Separate Mercado Pago credentials from the general store configuration.
CREATE TABLE "ConfiguracionPago" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "mpAccessToken" TEXT,
    "mpPublicKey" TEXT,
    "mpWebhookSecret" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConfiguracionPago_pkey" PRIMARY KEY ("id")
);

-- Preserve credentials created by the previous schema before removing those columns.
INSERT INTO "ConfiguracionPago" ("id", "mpAccessToken", "mpPublicKey")
SELECT 1, "mpAccessToken", "mpPublicKey"
FROM "Configuracion"
WHERE "id" = 1;

ALTER TABLE "Configuracion" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Configuracion" DROP COLUMN "mpAccessToken";
ALTER TABLE "Configuracion" DROP COLUMN "mpPublicKey";
