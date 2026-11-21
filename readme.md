### ADRIAN SERI - adrianseri@hotmail.com - CURSO NODE 2026
https://github.com/adrianese/node-api-firebase.git

# API Firebase – API REST con Express (Routes → Controllers → Services → Models)

API en Node.js/Express que consulta y administra productos en **Firebase (Cloud Firestore)** con una arquitectura en capas.

### Arquitectura en capas
```
Cliente ──► index.js ──► routes ──► controllers ──► services ──► models ──► Firebase Firestore
```

| Entrada | `index.js` | Crea la app Express, registra middlewares (`cors`, `body-parser`), monta los routers y maneja el 404. |

| Rutas | `src/routes/` | Define *qué URL y método HTTP* se atienden y a qué controlador se derivan. Usa `express.Router()`.

| Controladores | `src/controllers/` | Reciben `req`/`res`, llaman al servicio y arman la respuesta HTTP (200, 201, 404, 500). No conocen la fuente de datos.

| Servicios | `src/services/` | Aplican la lógica de la aplicación y adaptan los productos al formato público. `firebase.service.js` configura la conexión compartida. |

| Modelos | `src/models/` | Consultan, crean y eliminan documentos en Firestore, devolviendo sus datos y el ID del documento. |

### Conceptos clave

- **Express Router**: permite dividir las rutas en archivos. `src/routes/index.js` monta `/products`; `index.js` lo monta bajo `/api`, por lo que la URL final es `/api` + `/products` + `/:id`.
- **Middlewares**: `cors()` habilita orígenes cruzados, `bodyParser.json()` interpreta el cuerpo JSON y `authentication` verifica el JWT para crear o eliminar productos. El último middleware captura las rutas no encontradas y responde 404.
- **Separación de responsabilidades**: cada capa hace una sola cosa, lo que facilita reutilizar y probar el código.
- **ES Modules**: `"type": "module"` en `package.json` habilita `import`/`export`. Los imports locales requieren la extensión `.js`.
- **Acceso a productos**: las consultas son públicas; crear y eliminar requiere un token.
- **Códigos de estado**: `200` OK, `201` creado, `400` datos inválidos, `401` credenciales incorrectas o token ausente, `403` token inválido o expirado, `404` no encontrado, `500` error del servidor y `501` operación no implementada.
- **Firebase / Firestore**: los productos son documentos de la colección `products`; el ID del documento es el `id` del producto. La conexión se inicializa en `src/services/firebase.service.js` con el SDK `firebase`.
- **Variables de entorno**: las credenciales viven en `.env` (cargado con `dotenv`), que no debe subirse al repositorio. `.env.example` muestra las variables necesarias.

### Estructura del proyecto

```
node-api-firebase/
├── .env / .env.example
├── index.js
├── package.json
├── readme.md
└── src/
    ├── routes/
    │   ├── index.js
    │   ├── auth.routes.js
    │   └── products.routes.js
    ├── controllers/
    │   ├── auth.controller.js
    │   └── products.controller.js
    ├── middlewares/
    │   ├── authentication.js
    │   └── error-handler.js
    ├── services/
    │   ├── firebase.service.js
    │   ├── auth.service.js
    │   └── products.service.js
    ├── models/
    │   └── products.model.js
    └── utils/
        └── token-generator.js
```

### Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/auth/login` | Valida credenciales y devuelve un token JWT |
| GET | `/api/products` | Lista pública de productos (filtro opcional `?actividad=running`) |
| GET | `/api/products/:id` | Producto por ID, público |
| POST | `/api/products/create` | Crea un producto; requiere token |
| DELETE | `/api/products/:id` | Elimina un producto; requiere token |
| PUT / PATCH | `/api/products/:id` | Responde `501`: actualización no implementada |

### Formato de los datos

Datos para crear un producto:

```json
{ "nombre": "Puna", "imagen": "PU-6100.jpg", "actividad": "trekking", "disponible": true, "precio": 89000 }

{ "nombre": "Adedos", "imagen": "AD-6720.jpg", "actividad": "running", "disponible": true, "precio": 99500 }
```

`nombre`, `imagen` y `actividad` son textos no vacíos; `disponible` es booleano y `precio` es un número no negativo. Firestore genera el ID; la respuesta `201` incluye ese `id` y utiliza el mismo formato que los GET (incluyendo `modelo` y el prefijo `public/` en la imagen).

## 2. Puesta en marcha

1. **Instalar dependencias** (desde la carpeta del proyecto):
   ```bash
   npm install
   ```
2. **Configurar `.env`**: copia `.env.example` a `.env` en la raíz y completa la API key de Firebase y el secreto JWT:

   ```dotenv
   FIREBASE_API_KEY=tu_api_key
   JWT_SECRET_KEY=una_clave_larga_y_aleatoria
   ```

   El proyecto `zapa-api` y la colección `products` están fijados en `src/services/firebase.service.js`. Usa una clave JWT propia; el servidor no arranca si falta `JWT_SECRET_KEY`. El login usa por ahora un usuario fijo de prueba en el controlador: no es seguro para producción. No compartas ni subas el `.env`.

3. **Iniciar el servidor**:
   ```bash
   npm start
   ```
4. Debe mostrarse en consola: `http://localhost:3000`.

## 3. Verificación en Postman

1. Consulta `GET http://localhost:3000/api/products`, `GET http://localhost:3000/api/products?actividad=running` o `GET http://localhost:3000/api/products/:id` sin token.
2. Para crear o eliminar, envía `POST http://localhost:3000/auth/login`. En **Body → raw → JSON**, envía las credenciales de prueba:

   ```json
   { "email": "axxxx@gmail.com", "password": "1xxx56" }
   ```

3. Copia el valor `token` de la respuesta. Tiene una duración de una hora.
4. Envía `POST http://localhost:3000/api/products/create` con el JSON de producto mostrado arriba y el token en **Authorization → Bearer Token**. La respuesta incluye el ID generado.
5. Para eliminar, envía `DELETE http://localhost:3000/api/products/:id` con el token y el ID del documento. Si no existe, responde `404`.
6. `PUT` y `PATCH` a `http://localhost:3000/api/products/:id` no modifican datos y responden `501` con `{"message":"Ruta no implementada para actualizar productos"}`. No requieren token porque no realizan ninguna operación.

En POST y DELETE, sin token la respuesta será `401`; con un token inválido o expirado será `403`. El JWT protege estas rutas de la API, pero no autentica al SDK cliente ante Firestore. Las reglas de Firestore deben permitir las operaciones para que funcionen; permitir escrituras sin autenticación también permitiría el acceso directo, eludiendo la API. Para producción es necesario configurar un acceso seguro a Firestore por separado.
