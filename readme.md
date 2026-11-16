### ADRIAN SERI - CURSO NODE 2026
https://github.com/adrianese/node-api-firebase.git
### adrianseri@hotmail.com

# API Firebase – API REST con Express (Routes → Controllers → Services)

API en Node.js/Express que consume los productos desde **Firebase (Cloud Firestore)** y los expone con una arquitectura en capas.

### Arquitectura en capas
```
Cliente ──► index.js ──► routes ──► controllers ──► services ──► Firebase Firestore
```

| Entrada | `index.js` | Crea la app Express, registra middlewares (`cors`, `express.json`), monta el router en `/api` y maneja el 404. |

| Rutas | `routes/` | Define *qué URL y método HTTP* se atienden y a qué controlador se derivan. Usa `express.Router()`. 

| Controladores | `controllers/` | Reciben `req`/`res`, llaman al servicio y arman la respuesta HTTP (200, 201, 404, 500). No conocen la fuente de datos. 

| Servicios | `services/` | Acceden a los datos. Aquí se consulta Firestore. Si cambia la fuente de datos, solo se modifica esta capa. |

### Conceptos clave

- **Express Router**: permite dividir las rutas en archivos. `routes/index.js` monta `/products`; `index.js` lo monta bajo `/api`, por lo que la URL final es `/api` + `/products` + `/:id`.
- **Middlewares**: funciones que se ejecutan en orden por cada petición. `cors()` habilita orígenes cruzados, `express.json()` interpreta el cuerpo JSON (`req.body`), y el último middleware (sin ruta) captura lo no encontrado y responde 404.
- **Separación de responsabilidades**: cada capa hace una sola cosa, lo que facilita reutilizar y probar el código.
- **ES Modules**: `"type": "module"` en `package.json` habilita `import`/`export`. Los imports locales requieren la extensión `.js`.
- **Solo lectura**: la API expone únicamente GET.
- **Códigos de estado**: `200` OK, `201` creado, `404` no encontrado, `500` error del servidor/MockAPI.
- **Firebase / Firestore**: los productos son documentos de la colección `products`; el ID del documento es el `id` del producto. La conexión se inicializa en `services/firebase.service.js` con el SDK `firebase`.
- **Variables de entorno**: las credenciales viven en `.env` (cargado con `dotenv`), que no debe subirse al repositorio. `.env.example` muestra las variables necesarias.

### Estructura del proyecto

```
node-api-firebase/
├── index.js
├── .env / .env.example
├── package.json
├── routes/
│   ├── index.js
│   ├── products.routes.js
├── controllers/
│   ├── products.controller.js
└── services/
    ├── firebase.service.js   # inicializa Firebase/Firestore con el .env
    ├── products.service.js
```

### Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/products` | Lista productos (filtro opcional `?actividad=running`) |
| GET | `/api/products/:id` | Producto por ID |

### Formato de los datos

Producto:

```json
{ "id": "20", "nombre": "Adedos", "imagen": "AD-6720.jpg", "actividad": "running", "disponible": true, "precio": 99500 }
```

## 2. Puesta en marcha


1. **Instalar dependencias** (desde la carpeta del proyecto):
   ```bash
   npm install
   ```
   Si partes de cero: `npm init -y`, agregar `"type": "module"` al `package.json` y `npm i express cors firebase dotenv`.
2. **Configurar `.env`**: copia `.env.example` a `.env` y completa los datos de tu proyecto Firebase (`FIREBASE_API_KEY`, `FIREBASE_AUTH_DOMAIN`, `FIREBASE_PROJECT_ID`, `FIREBASE_STORAGE_BUCKET`, `FIREBASE_MESSAGING_SENDER_ID`, `FIREBASE_APP_ID`, `FIREBASE_COLLECTION`).

3. **Iniciar el servidor**:
   ```bash
   npm start
   ```
4. Debe mostrarse en consola: `http://localhost:3000`.

## 3. Verificación

Con el servidor corriendo, en otra terminal:

```bash
# Listado y detalle de productos
curl http://localhost:3000/api/products
curl http://localhost:3000/api/products/20
curl "http://localhost:3000/api/products?actividad=running"

```

Resultados esperados:

| Prueba | Resultado |
|--------|-----------|
| `GET /api/products/20` | `200` con el producto "Adedos" |
| `GET /api/products/99999` | `404` `{"message":"Producto no encontrado"}` |
| `GET /ruta-inexistente` | `404` `Recurso no encontrado` |

También puedes probar desde el navegador abriendo `http://localhost:3000/api/products` o usando Postman/Thunder Client.

