// Punto de entrada: crea la app Express, registra middlewares y rutas, y levanta el servidor.
import express from "express";
import cors from "cors";
import router from "./routes/index.js";
import { getAllProducts } from "./services/products.service.js";

const app = express();

// Middlewares: se ejecutan en orden en cada petición.
app.use(cors()); // permite que otros orígenes (ej. un front) consuman la API
app.use(express.json()); // interpreta el cuerpo JSON y lo deja en req.body

// Todas las rutas de la API quedan bajo el prefijo /api
app.use("/api", router);

// Middleware final sin ruta: solo se alcanza si ninguna ruta anterior respondió
app.use((req, res) => {
  res.status(404).send("Recurso no encontrado");
});

const PORT = 3000;
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
