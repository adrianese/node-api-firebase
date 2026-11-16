// Rutas de productos: solo definen URL + método HTTP y delegan en el controlador.
import { Router } from "express";
import { getAllProducts, getProductById } from "../controllers/products.controller.js";

const router = Router();

router.get("/", getAllProducts); // GET /api/products (admite ?actividad=)
router.get("/:id", getProductById); // GET /api/products/:id

export default router;
