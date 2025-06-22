import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase/config";

// Колекція товарів
const PRODUCTS_COLLECTION = "products";

// Отримати всі товари
export const getAllProducts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    return products;
  } catch (error) {
    console.error("Помилка отримання товарів:", error);
    throw error;
  }
};

// Отримати товар за ID
export const getProductById = async (productId) => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, productId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      };
    } else {
      throw new Error("Товар не знайдено");
    }
  } catch (error) {
    console.error("Помилка отримання товару:", error);
    throw error;
  }
};

// Отримати товари за категорією
export const getProductsByCategory = async (category) => {
  try {
    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      where("category", "==", category)
    );
    const querySnapshot = await getDocs(q);
    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    return products;
  } catch (error) {
    console.error("Помилка отримання товарів за категорією:", error);
    throw error;
  }
};

// Додати новий товар
export const addProduct = async (productData) => {
  try {
    const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Помилка додавання товару:", error);
    throw error;
  }
};

// Оновити товар
export const updateProduct = async (productId, productData) => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, productId);
    await updateDoc(docRef, {
      ...productData,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Помилка оновлення товару:", error);
    throw error;
  }
};

// Видалити товар
export const deleteProduct = async (productId) => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, productId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Помилка видалення товару:", error);
    throw error;
  }
};

// Отримати категорії товарів
export const getCategories = async () => {
  try {
    const products = await getAllProducts();
    const categories = [
      ...new Set(products.map((product) => product.category)),
    ];
    return categories.filter(Boolean); // Видаляємо пусті значення
  } catch (error) {
    console.error("Помилка отримання категорій:", error);
    throw error;
  }
};

// Пошук товарів
export const searchProducts = async (searchTerm) => {
  try {
    const products = await getAllProducts();
    const searchLower = searchTerm.toLowerCase();

    return products.filter(
      (product) =>
        product.name?.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower) ||
        product.category?.toLowerCase().includes(searchLower)
    );
  } catch (error) {
    console.error("Помилка пошуку товарів:", error);
    throw error;
  }
};
