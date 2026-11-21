// Conexión a Firebase: se inicializa una sola vez y se comparte con los modelos.
import "dotenv/config"; // carga el archivo .env en process.env (debe ir antes de leer las variables)
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const app = initializeApp({
  apiKey: process.env.FIREBASE_API_KEY,
  projectId: "zapa-api",
});

export const db = getFirestore(app); // instancia de Firestore
export const COLLECTION = "products";
