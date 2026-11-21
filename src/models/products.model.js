// Acceso a los documentos de productos en Firestore.
import { addDoc, collection, doc, getDoc, getDocs, runTransaction } from "firebase/firestore";
import { db, COLLECTION } from "../services/firebase.service.js";

export const getAllProducts = async () => {
  const snapshot = await getDocs(collection(db, COLLECTION));
  return snapshot.docs.map((document) => ({ ...document.data(), id: document.id }));
};

export const getProductById = async (id) => {
  const snapshot = await getDoc(doc(db, COLLECTION, id));
  return snapshot.exists() ? { ...snapshot.data(), id: snapshot.id } : null;
};

export const createProduct = async (product) => {
  const reference = await addDoc(collection(db, COLLECTION), product);
  return { ...product, id: reference.id };
};

export const deleteProduct = async (id) => {
  const reference = doc(db, COLLECTION, id);
  return runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(reference);
    if (!snapshot.exists()) return false;
    transaction.delete(reference);
    return true;
  });
};
