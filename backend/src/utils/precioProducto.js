export const obtenerPrecioVigente = (producto) => {
  const precioNormal = Number(producto?.precio || 0);
  const precioOferta = Number(producto?.precioOferta);

  if (producto?.enOferta && precioOferta > 0 && precioOferta < precioNormal) {
    return precioOferta;
  }

  return precioNormal;
};

export const agregarPrecioVigente = (producto) => ({
  ...producto,
  precioFinal: obtenerPrecioVigente(producto),
});