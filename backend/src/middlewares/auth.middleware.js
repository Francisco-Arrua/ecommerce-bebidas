import jwt from "jsonwebtoken";

export const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const cookieHeader = req.headers.cookie || "";
  const authCookie = cookieHeader
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith("auth_token="));
  const cookieToken = authCookie ? decodeURIComponent(authCookie.slice("auth_token=".length)) : null;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : cookieToken;

  if (!token) {
    return res.status(401).json({ mensaje: "No hay token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: "ecommerce-api",
      audience: "ecommerce-frontend",
    });
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ mensaje: "Token inválido" });
  }
}; 