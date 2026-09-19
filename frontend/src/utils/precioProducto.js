export const obtenerPrecioVigente = (producto) => {
  if (producto?.precioFinal !== undefined && producto?.precioFinal !== null) {
    return Number(producto.precioFinal);
  }

  const precioNormal = Number(producto?.precio || 0);
  const precioOferta = Number(producto?.precioOferta);

  return producto?.enOferta && precioOferta > 0 && precioOferta < precioNormal
    ? precioOferta
    : precioNormal;
};

export const tieneOfertaVigente = (producto) => {
  const precioNormal = Number(producto?.precio || 0);
  return producto?.enOferta && obtenerPrecioVigente(producto) < precioNormal;
};