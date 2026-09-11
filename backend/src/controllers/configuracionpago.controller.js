import { prisma } from "../db/prisma.js";
import { encriptar, desencriptar } from "../utils/crypto.util.js";
import { invalidarCacheMP } from "../config/mercadopago.config.js";

const enmascarar = (valor) => {
  if (!valor || valor.length < 8) return "••••••••";
  return `${valor.slice(0, 8)}${"•".repeat(Math.max(valor.length - 12, 4))}${valor.slice(-4)}`;
};

// GET /admin/configuracion-pago
// Nunca devuelve el access token ni el webhook secret en texto plano.
export const getCredencialesMP = async (req, res) => {
  try {
    const config = await prisma.configuracionPago.findFirst();

    if (!config) {
      return res.json({ configurado: false });
    }

    res.json({
      configurado: Boolean(config.mpAccessToken && config.mpPublicKey),
      mpPublicKey: config.mpPublicKey || null, // esta sí es pública
      mpAccessTokenEnmascarado: config.mpAccessToken
        ? enmascarar(desencriptar(config.mpAccessToken))
        : null,
      mpWebhookSecretConfigurado: Boolean(config.mpWebhookSecret),
      updatedAt: config.updatedAt,
    });
  } catch (error) {
    console.error("Error obteniendo credenciales de Mercado Pago:", error);
    res.status(500).json({ mensaje: "Error obteniendo la configuración de pagos" });
  }
};

// PUT /admin/configuracion-pago
// Body: { mpAccessToken, mpPublicKey, mpWebhookSecret? }
export const actualizarCredencialesMP = async (req, res) => {
  try {
    const { mpAccessToken, mpPublicKey, mpWebhookSecret } = req.body;

    if (!mpAccessToken || !mpPublicKey) {
      return res.status(400).json({ mensaje: "El Access Token y la Public Key son obligatorios" });
    }

    const dataAGuardar = {
      mpAccessToken: encriptar(mpAccessToken),
      mpPublicKey,
    };

    // El webhook secret es opcional: si no lo mandan, no lo pisamos
    if (mpWebhookSecret) {
      dataAGuardar.mpWebhookSecret = encriptar(mpWebhookSecret);
    }

    const configExistente = await prisma.configuracionPago.findFirst();

    if (configExistente) {
      await prisma.configuracionPago.update({
        where: { id: configExistente.id },
        data: dataAGuardar,
      });
    } else {
      await prisma.configuracionPago.create({ data: dataAGuardar });
    }

    // Muy importante: forzamos a que la próxima operación de pago vuelva
    // a leer de la DB en vez de usar credenciales viejas cacheadas en memoria.
    invalidarCacheMP();

    res.json({ mensaje: "Credenciales de Mercado Pago actualizadas correctamente", configurado: true });
  } catch (error) {
    console.error("Error actualizando credenciales de Mercado Pago:", error);
    res.status(500).json({ mensaje: "Error guardando la configuración de pagos" });
  }
};