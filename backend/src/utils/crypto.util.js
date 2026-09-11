import crypto from "node:crypto";

// Definí en tu .env: CREDENCIALES_ENCRYPTION_KEY=<una cadena larga y aleatoria>
// Generarla: openssl rand -hex 32
// Esta clave NUNCA va a la base de datos. Si se pierde, las credenciales
// guardadas quedan irrecuperables (vas a tener que volver a cargarlas).

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;

const obtenerClaveMaestra = () => {
  const clave = process.env.CREDENCIALES_ENCRYPTION_KEY;
  if (!clave || clave.length < 16) {
    throw new Error(
      "CREDENCIALES_ENCRYPTION_KEY no está definida (o es muy corta) en las variables de entorno"
    );
  }
  // Derivamos siempre 32 bytes exactos sin importar el largo de la clave original
  return crypto.createHash("sha256").update(clave).digest();
};

export const encriptar = (texto) => {
  if (!texto) return null;
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, obtenerClaveMaestra(), iv);
  const encriptado = Buffer.concat([cipher.update(texto, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return Buffer.concat([iv, authTag, encriptado]).toString("base64");
};

export const desencriptar = (textoEncriptado) => {
  if (!textoEncriptado) return null;
  const buffer = Buffer.from(textoEncriptado, "base64");
  const iv = buffer.subarray(0, IV_LENGTH);
  const authTag = buffer.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
  const encriptado = buffer.subarray(IV_LENGTH + AUTH_TAG_LENGTH);
  const decipher = crypto.createDecipheriv(ALGORITHM, obtenerClaveMaestra(), iv);
  decipher.setAuthTag(authTag);
  return Buffer.concat([decipher.update(encriptado), decipher.final()]).toString("utf8");
};