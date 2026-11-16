// Conexión a Firebase: se inicializa una sola vez y se comparte con los demás servicios.
import "dotenv/config"; // carga el archivo .env en process.env (debe ir antes de leer las variables)
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Las credenciales salen del .env para no dejarlas escritas en el código
const app = initializeApp({
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
});

export const db = getFirestore(app); // instancia de Firestore
// Nombre de la colección de productos (configurable desde .env)
export const COLLECTION = process.env.FIREBASE_COLLECTION || "products";
