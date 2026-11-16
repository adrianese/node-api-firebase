// Servicio de productos: única capa que accede a Firestore.
// Si cambia la fuente de datos, solo se modifica este archivo.
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db, COLLECTION } from "./firebase.service.js";

// Adapta cada documento al formato público de la API:
// agrega "modelo" (imagen sin extensión) y la ruta pública de la imagen.
const format = ({ id, nombre, imagen, actividad, disponible, precio }) => ({
  id,
  nombre,
  modelo: imagen?.replace(/\.jpg$/i, ""),
  imagen: imagen && `public/${imagen}`,
  actividad,
  disponible,
  precio,
});

// Lee todos los documentos de la colección. El id del documento se usa como id del producto
// porque data() no lo incluye.
export const getAllProducts = async () => {
  const snapshot = await getDocs(collection(db, COLLECTION));
  return snapshot.docs.map((d) => format({ ...d.data(), id: d.id }));
};

// Busca un documento por id; devuelve null si no existe para que el controlador responda 404.
export const getProductById = async (id) => {
  const snapshot = await getDoc(doc(db, COLLECTION, id));
  return snapshot.exists() ? format({ ...snapshot.data(), id: snapshot.id }) : null;
};
