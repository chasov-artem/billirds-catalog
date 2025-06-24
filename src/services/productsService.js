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
import { uploadImage, deleteImage } from "./imageService";

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
      where("Категорія", "==", category)
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
export const addProduct = async (productData, imageFile = null) => {
  try {
    console.log("Початок додавання товару:", productData);

    // Спочатку додаємо товар без зображення
    const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log("Товар додано до Firestore, ID:", docRef.id);

    // Якщо є зображення, завантажуємо його
    if (imageFile) {
      console.log("Початок завантаження зображення:", imageFile.name);
      try {
        const imageUrl = await uploadImage(imageFile, docRef.id);
        console.log("Зображення завантажено, URL:", imageUrl);

        await updateDoc(docRef, {
          imageUrl: imageUrl,
          updatedAt: new Date(),
        });
        console.log("URL зображення додано до товару");
      } catch (imageError) {
        console.error("Помилка завантаження зображення:", imageError);
        // Не кидаємо помилку, товар вже створено
        // Просто логуємо помилку
      }
    }

    console.log("Товар успішно створено з ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Помилка додавання товару:", error);
    throw error;
  }
};

// Оновити товар
export const updateProduct = async (
  productId,
  productData,
  imageFile = null
) => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, productId);

    // Якщо є нове зображення, завантажуємо його
    if (imageFile) {
      const imageUrl = await uploadImage(imageFile, productId);
      productData.imageUrl = imageUrl;
    }

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

    // Отримуємо дані товару перед видаленням
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const productData = docSnap.data();

      // Видаляємо зображення, якщо воно є
      if (productData.imageUrl) {
        try {
          await deleteImage(productData.imageUrl);
        } catch (imageError) {
          console.warn("Не вдалося видалити зображення:", imageError);
        }
      }
    }

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
      ...new Set(products.map((product) => product.Категорія)),
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
        product.Назва?.toLowerCase().includes(searchLower) ||
        product.Опис?.toLowerCase().includes(searchLower) ||
        product.Категорія?.toLowerCase().includes(searchLower)
    );
  } catch (error) {
    console.error("Помилка пошуку товарів:", error);
    throw error;
  }
};
