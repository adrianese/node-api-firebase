// Rutas de productos: solo definen URL + método HTTP y delegan en el controlador.
import { Router } from "express";
import { createProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from "../controllers/products.controller.js";
import { authentication } from "../middlewares/authentication.js";

const router = Router();
router.get("/", getAllProducts); // GET /api/products (admite ?actividad=)
router.get("/:id", getProductById); // GET /api/products/:id
router.post("/create", authentication, createProduct);
router.delete("/:id", authentication, deleteProduct);
router.put("/:id", updateProduct);
router.patch("/:id", updateProduct);

export default router;
