export const soloAdmin = (req, res, next) => {
  if (req.usuario.rol !== "ADMIN") {
    return res.status(403).json({ mensaje: "No autorizado" });
  }
  next();
};