import crypto from "node:crypto";
import { Preference, Payment } from "mercadopago";
import { prisma } from "../db/prisma.js";
import {
  obtenerClienteMP,
  obtenerWebhookSecretMP,
} from "../config/mercadopago.config.js";
import { obtenerPrecioVigente } from "../utils/precioProducto.js";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const BACKEND_URL = process.env.BACKEND_URL; // debe ser una URL pública (https) para que MP pueda llamarla

const esUrlPublica = (valor) => {
  try {
    const url = new URL(valor);
    return url.protocol === "https:" && !["localhost", "127.0.0.1"].includes(url.hostname);
  } catch {
    return false;
  }
};

// ─────────────────────────────────────────────────────────
// 1. Crear la preferencia de pago (Checkout Pro)
//    Se llama desde Pago.jsx cuando el usuario aprieta "Pagar con Mercado Pago"
// ─────────────────────────────────────────────────────────
export const crearPreferencia = async (req, res) => {
  try {
    const mpClient = await obtenerClienteMP();
    const usuarioId = Number(req.usuario.id);
    const { datosEnvio, opcionEnvioId } = req.body;

    if (!datosEnvio) {
      return res.status(400).json({ mensaje: "Los datos de envío son obligatorios" });
    }

    const {
      nombreRecibe,
      telefono,
      provincia,
      localidad,
      codigoPostal,
      calle,
      numero,
      pisoDepto,
      aclaraciones,
    } = datosEnvio;

    const opcionEnvio = await prisma.opcionEnvio.findFirst({
      where: { id: Number(opcionEnvioId), activo: true },
    });

    if (!opcionEnvio) {
      return res.status(400).json({ mensaje: "La opción de envío no existe o ya no está disponible" });
    }

    const esRetiro = opcionEnvio.nombre.toLowerCase().includes("retiro");

    if (!nombreRecibe || !telefono) {
      return res.status(400).json({ mensaje: "Nombre y teléfono son obligatorios" });
    }
    if (!esRetiro && (!provincia || !localidad || !codigoPostal || !calle || !numero)) {
      return res.status(400).json({ mensaje: "Faltan campos obligatorios en la dirección de envío" });
    }

    // Traemos el carrito actual del usuario
    const carrito = await prisma.carrito.findUnique({
      where: { usuarioId },
      include: {
        items: {
          include: {
            producto: { include: { imagenes: { orderBy: { orden: "asc" }, take: 1 } } },
            talle: true,
          },
        },
      },
    });

    if (!carrito || carrito.items.length === 0) {
      return res.status(400).json({ mensaje: "El carrito está vacío" });
    }

    // Validamos stock (solo lectura, todavía no descontamos nada)
    let totalProductosCalculado = 0;
    const itemsOrdenParaCrear = [];
    const itemsMercadoPago = [];

    for (const item of carrito.items) {
      const { producto, talle, cantidad } = item;

      if (producto.tieneTalles) {
        if (!talle) {
          throw new Error(`El producto "${producto.nombre}" requiere talle.`);
        }
        if (talle.stock < cantidad) {
          throw new Error(
            `Stock insuficiente para "${producto.nombre}" (${talle.talle}). Disp: ${talle.stock}, Solicitado: ${cantidad}`
          );
        }
      } else if (producto.stock < cantidad) {
        throw new Error(
          `Stock insuficiente para "${producto.nombre}". Disp: ${producto.stock}, Solicitado: ${cantidad}`
        );
      }

      const precio = obtenerPrecioVigente(producto);
      totalProductosCalculado += precio * cantidad;

      itemsOrdenParaCrear.push({
        productoId: producto.id,
        talleId: talle ? talle.id : null,
        nombreProducto: producto.nombre,
        imagenUrl: producto.imagenes[0]?.url || null,
        talle: talle ? talle.talle : null,
        precioUnitario: precio,
        cantidad,
      });

      itemsMercadoPago.push({
        id: String(producto.id),
        title: talle ? `${producto.nombre} (Talle ${talle.talle})` : producto.nombre,
        quantity: cantidad,
        unit_price: precio,
        currency_id: "ARS",
        picture_url: producto.imagenes[0]?.url || undefined,
      });
    }

    const costoEnvioNum = Number(opcionEnvio.costo);
    const totalGeneralCalculado = totalProductosCalculado + costoEnvioNum;

    if (costoEnvioNum > 0) {
      itemsMercadoPago.push({
        id: "envio",
        title: "Costo de envío",
        quantity: 1,
        unit_price: costoEnvioNum,
        currency_id: "ARS",
      });
    }

    // Creamos la Orden en PENDIENTE. Sin descontar stock ni vaciar el carrito todavía:
    // eso solo pasa cuando el webhook confirme el pago como aprobado.
    const orden = await prisma.orden.create({
      data: {
        usuarioId,
        totalProductos: totalProductosCalculado,
        costoEnvio: costoEnvioNum,
        totalGeneral: totalGeneralCalculado,
        metodoEnvio: opcionEnvio.nombre,
        estado: "PENDIENTE",
        estadoEnvio: "PENDIENTE_DESPACHO",
        items: { create: itemsOrdenParaCrear },
        direccion: {
          create: {
            nombreRecibe,
            telefono,
            provincia: provincia || "Retiro en local",
            localidad: localidad || "Retiro en local",
            codigoPostal: codigoPostal || "S/N",
            calle: calle || "Retiro en local",
            numero: numero || "S/N",
            pisoDepto: pisoDepto || null,
            aclaraciones: aclaraciones || null,
          },
        },
        pagos: {
          create: {
            metodoPago: "MERCADO_PAGO",
            monto: totalGeneralCalculado,
            estado: "PENDIENTE",
          },
        },
      },
    });

    const tieneRetornoPublico = esUrlPublica(FRONTEND_URL);
    const tieneWebhookPublico = esUrlPublica(BACKEND_URL);
    const datosRetorno = tieneRetornoPublico
      ? {
          back_urls: {
            success: `${FRONTEND_URL}/pago/resultado`,
            failure: `${FRONTEND_URL}/pago/resultado`,
            pending: `${FRONTEND_URL}/pago/resultado`,
          },
          auto_return: "approved",
        }
      : {};

    const preferenceClient = new Preference(mpClient);
    const preferenceResponse = await preferenceClient.create({
      body: {
        items: itemsMercadoPago,
        payer: {
          name: nombreRecibe,
          phone: { number: telefono },
        },
        external_reference: String(orden.id),
        ...datosRetorno,
        notification_url: tieneWebhookPublico ? `${BACKEND_URL}/pagos/webhook` : undefined,
        statement_descriptor: "MI TIENDA",
      },
    });

    await prisma.orden.update({
      where: { id: orden.id },
      data: { mercadoPagoPreferenceId: preferenceResponse.id },
    });

    res.status(201).json({
      mensaje: "Preferencia de pago creada",
      ordenId: orden.id,
      // En producción usá init_point. sandbox_init_point sirve para probar con usuarios de prueba.
      initPoint: preferenceResponse.init_point,
      sandboxInitPoint: preferenceResponse.sandbox_init_point,
    });
  } catch (error) {
    console.error("Error creando preferencia de pago:", error);
    res.status(400).json({ mensaje: error.message || "No se pudo iniciar el pago" });
  }
};

// ─────────────────────────────────────────────────────────
// Valida que la notificación realmente venga de Mercado Pago
// usando el header x-signature (HMAC-SHA256 con tu clave secreta de webhooks)
// ─────────────────────────────────────────────────────────
const validarFirmaWebhook = async (req) => {
  const secret = await obtenerWebhookSecretMP();

  // Si todavía no configuraste la clave secreta (la sacás del panel de
  // Tus integraciones > Webhooks en Mercado Pago), rechazamos la notificación.
  if (!secret) {
    throw new Error("El secreto del webhook de Mercado Pago no está configurado");
  }

  const signature = req.headers["x-signature"];
  const requestId = req.headers["x-request-id"];
  const dataId = req.query["data.id"] || req.query.id;

  if (!signature || !dataId) return false;

  const partes = Object.fromEntries(
    signature.split(",").map((p) => {
      const idx = p.indexOf("=");
      return [p.slice(0, idx).trim(), p.slice(idx + 1).trim()];
    })
  );

  const manifest = `id:${String(dataId).toLowerCase()};request-id:${requestId};ts:${partes.ts};`;
  const firmaEsperada = crypto.createHmac("sha256", secret).update(manifest).digest("hex");

  if (!partes.ts || !partes.v1 || !requestId) return false;

  const firmaEsperadaBuffer = Buffer.from(firmaEsperada, "hex");
  const firmaRecibidaBuffer = Buffer.from(partes.v1, "hex");

  return (
    firmaEsperadaBuffer.length === firmaRecibidaBuffer.length &&
    crypto.timingSafeEqual(firmaEsperadaBuffer, firmaRecibidaBuffer)
  );
};

// ─────────────────────────────────────────────────────────
// 2. Webhook: acá es donde Mercado Pago te avisa el resultado real del pago
// ─────────────────────────────────────────────────────────
export const recibirWebhook = async (req, res) => {
  try {
    const topic = req.query.type || req.query.topic || req.body?.type;
    const paymentId = req.query["data.id"] || req.body?.data?.id;

    // Solo nos interesan las notificaciones de tipo "payment"
    if (topic !== "payment" || !paymentId) {
      return res.sendStatus(200);
    }

    if (!(await validarFirmaWebhook(req))) {
      console.warn("Firma de webhook inválida, se ignora la notificación");
      return res.sendStatus(401);
    }

    const paymentClient = new Payment(await obtenerClienteMP());
    const pago = await paymentClient.get({ id: paymentId });

    const ordenId = Number(pago.external_reference);
    if (!ordenId) return res.sendStatus(200);

    const orden = await prisma.orden.findUnique({
      where: { id: ordenId },
      include: { items: true },
    });
    if (!orden) return res.sendStatus(200);

    const montoRecibido = Math.round(Number(pago.transaction_amount) * 100);
    const montoEsperado = Math.round(Number(orden.totalGeneral) * 100);
    if (!Number.isFinite(montoRecibido) || montoRecibido !== montoEsperado) {
      console.error(
        `Monto inválido para la orden ${orden.id}: esperado ${orden.totalGeneral}, recibido ${pago.transaction_amount}`
      );
      return res.sendStatus(422);
    }

    const estadoPagoMap = {
      approved: "APROBADO",
      rejected: "RECHAZADO",
      cancelled: "RECHAZADO",
      refunded: "REEMBOLSADO",
      pending: "PENDIENTE",
      in_process: "PENDIENTE",
    };
    const estadoPago = estadoPagoMap[pago.status] || "PENDIENTE";

    await prisma.$transaction(async (tx) => {
      // mpPaymentId es único, así que las notificaciones repetidas actualizan
      // el mismo intento en lugar de crear pagos duplicados.
      await tx.pago.upsert({
        where: { mpPaymentId: String(pago.id) },
        update: { estado: estadoPago, monto: pago.transaction_amount },
        create: {
          ordenId: orden.id,
          metodoPago: "MERCADO_PAGO",
          monto: pago.transaction_amount,
          estado: estadoPago,
          mpPaymentId: String(pago.id),
        },
      });

      if (pago.status === "approved") {
        // Solo una notificación puede cambiar la orden de PENDIENTE a PAGADO.
        // Si otra notificación ya lo hizo, no se vuelve a tocar el stock.
        const ordenMarcadaComoPagada = await tx.orden.updateMany({
          where: { id: orden.id, estado: "PENDIENTE" },
          data: { estado: "PAGADO" },
        });

        if (ordenMarcadaComoPagada.count === 0) return;

        for (const item of orden.items) {
          if (item.talleId) {
            const talleActualizado = await tx.talleProducto.updateMany({
              where: { id: item.talleId, stock: { gte: item.cantidad } },
              data: { stock: { decrement: item.cantidad } },
            });
            if (talleActualizado.count === 0) {
              throw new Error(`Stock insuficiente para el talle ${item.talle || item.talleId}`);
            }
          } else if (item.productoId) {
            const productoActualizado = await tx.producto.updateMany({
              where: { id: item.productoId, stock: { gte: item.cantidad } },
              data: { stock: { decrement: item.cantidad } },
            });
            if (productoActualizado.count === 0) {
              throw new Error(`Stock insuficiente para el producto ${item.productoId}`);
            }
          }
        }

        // Vaciamos el carrito del comprador recién ahora que se confirmó el pago
        await tx.itemCarrito.deleteMany({
          where: { carrito: { usuarioId: orden.usuarioId } },
        });
      } else if (["rejected", "cancelled"].includes(pago.status)) {
        await tx.orden.updateMany({
          where: { id: orden.id, estado: "PENDIENTE" },
          data: { estado: "CANCELADO" },
        });
      }
    });

    res.sendStatus(200);
  } catch (error) {
    console.error("Error procesando webhook de Mercado Pago:", error);
    // Un error interno debe provocar un reintento de Mercado Pago.
    res.sendStatus(500);
  }
};