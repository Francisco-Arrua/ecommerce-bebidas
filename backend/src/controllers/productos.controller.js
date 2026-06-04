import { prisma } from "../db/prisma.js";

export const getProductos = async (req, res) => {
  const productos = await prisma.producto.findMany();

  res.json(productos);
};

export const crearProducto = async (req, res) => {
  const producto = await prisma.producto.create({
    data: req.body,
  });

  res.status(201).json(producto);
};