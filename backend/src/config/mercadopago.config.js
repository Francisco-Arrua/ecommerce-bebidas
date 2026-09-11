import { MercadoPagoConfig } from "mercadopago";
import { prisma } from "../db/prisma.js";
import { desencriptar } from "../utils/crypto.util.js";

const TTL_MS = 60_000; // 1 minuto de caché para no pegarle a la DB en cada pago

let cache = { client: null, webhookSecret: null, expiraEn: 0 };

// Se llama desde el controller de admin cada vez que se actualizan las credenciales,
// para que el próximo pago use las nuevas sin esperar a que venza el TTL.
export const invalidarCacheMP = () => {
  cache = { client: null, webhookSecret: null, expiraEn: 0 };
};

const cargarDesdeDB = async () => {
  const config = await prisma.configuracionPago.findFirst();

  if (!config?.mpAccessToken) {
    throw new Error(
      "Mercado Pago no está configurado todavía. Cargá el Access Token en el panel de administrador."
    );
  }

  const accessToken = desencriptar(config.mpAccessToken);
  const client = new MercadoPagoConfig({ accessToken });

  cache = {
    client,
    webhookSecret: config.mpWebhookSecret ? desencriptar(config.mpWebhookSecret) : null,
    expiraEn: Date.now() + TTL_MS,
  };
};

export const obtenerClienteMP = async () => {
  if (!cache.client || Date.now() >= cache.expiraEn) {
    await cargarDesdeDB();
  }
  return cache.client;
};

export const obtenerWebhookSecretMP = async () => {
  if (!cache.client || Date.now() >= cache.expiraEn) {
    await cargarDesdeDB();
  }
  return cache.webhookSecret;
};