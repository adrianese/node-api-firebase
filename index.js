// Punto de entrada: crea la app Express, registra middlewares y rutas, y levanta el servidor.
import express from "express";
import cors from "cors";
import router from "./src/routes/index.js";
import authRouter from "./src/routes/auth.routes.js";
import bodyParser from "body-parser";
import { getAllProducts } from "./src/services/products.service.js";
import { errorHandler } from "./src/middlewares/error-handler.js";

const app = express();
// Middlewares: se ejecutan en orden en cada petición.
app.use(cors()); // permite que otros orígenes (ej. un front) consuman la API
app.use(bodyParser.json()); // interpreta el cuerpo JSON y lo deja en req.body

// Todas las rutas de la API quedan bajo el prefijo /api
app.use("/api", router);
app.use("/auth", authRouter);
// Middleware final sin ruta: solo se alcanza si ninguna ruta anterior respondió
app.use((req, res) => {
  res.status(404).send("Recurso no encontrado");
});
app.use(errorHandler);

const PORT = 3000;
const missingAuthConfig = ["JWT_SECRET_KEY"]
  .filter((name) => !process.env[name]);
if (missingAuthConfig.length) {
  throw new Error(`Faltan variables de autenticación: ${missingAuthConfig.join(", ")}`);
}

app.listen(PORT, async () => {
  const url = `http://localhost:${PORT}/api/products`;
  console.log(`http://localhost:${PORT}`);
  // Guía en consola: se consultan los productos para listar las actividades reales.
  // Si Firestore falla, el servidor sigue funcionando y solo se informa el error.
  try {
    const products = await getAllProducts();
    // Set elimina repetidos; filter(Boolean) descarta valores vacíos
    const actividades =  [...new Set(products.map((p) => p.actividad).filter(Boolean))].sort();
    console.log("\n# Listado y detalle de productos");
    console.log(`Todos los productos   =>  ${url}`);
    console.log(`Productos por id  =>  ${url}/:id`);
    console.log(`# Actividades disponibles: ${JSON.stringify(actividades)}`);
    console.log(` Productos por actividad  => "${url}?actividad=${actividades[0] ?? "running"}"`);
  } catch (e) {
    console.error(`No se pudieron obtener las actividades: ${e.message}`);
  }
});
