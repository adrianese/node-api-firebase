// Router principal: agrupa los routers de cada recurso para que index.js monte uno solo.
import { Router } from "express";
import productsRouter from "./products.routes.js";

const router = Router();

// Con el prefijo /api de index.js, la URL final es /api/products
router.use("/products", productsRouter);

export default router;
