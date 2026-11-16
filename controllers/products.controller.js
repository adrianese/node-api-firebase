// Controlador: recibe req/res, llama al servicio y arma la respuesta HTTP.
// No sabe de dónde vienen los datos (Firestore u otra fuente).
import * as service from "../services/products.service.js";

// Helpers de respuesta para no repetir códigos de estado y mensajes
const notFound = (res) => res.status(404).json({ message: "Producto no encontrado" });
const fail = (res, error) => res.status(500).json({ message: error.message });

// Lista todos los productos; el filtro por actividad se aplica aquí sobre el resultado
export const getAllProducts = async (req, res) => {
  try {
    const products = await service.getAllProducts();
    const { actividad } = req.query;
    res.status(200).json(actividad ? products.filter((p) => p.actividad === actividad) : products);
  } catch (e) {
    fail(res, e);
  }
};

// Devuelve un producto por id, o 404 si el servicio devuelve null
export const getProductById = async (req, res) => {
  try {
    const product = await service.getProductById(req.params.id);
    product ? res.status(200).json(product) : notFound(res);
  } catch (e) {
    fail(res, e);
  }
};

