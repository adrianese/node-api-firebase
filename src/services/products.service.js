// Servicio de productos: adapta los datos del modelo al formato público de la API.
import * as model from "../models/products.model.js";

// Adapta cada documento al formato público de la API:
// agrega "modelo" (imagen sin extensión) y la ruta pública de la imagen.
const format = ({ id, nombre, imagen, actividad, disponible, precio }) => ({
  id,
  nombre,
  modelo: imagen?.replace(/\.jpg$/i, ""),
  imagen: imagen && `public/${imagen}`,
  actividad,
  disponible,
  precio,
});

export const getAllProducts = async () => {
  const products = await model.getAllProducts();
  return products.map(format);
};

export const getProductById = async (id) => {
  const product = await model.getProductById(id);
  return product ? format(product) : null;
};

export const createProduct = async (product) => {
  return format(await model.createProduct(product));
};

export const deleteProduct = async (id) => model.deleteProduct(id);
