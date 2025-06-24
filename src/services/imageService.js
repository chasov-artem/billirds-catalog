import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
} from "firebase/storage";
import { storage } from "../firebase/config";

// Завантажити зображення
export const uploadImage = async (file, productId) => {
  try {
    console.log(
      "Початок uploadImage для файлу:",
      file.name,
      "productId:",
      productId
    );

    const timestamp = Date.now();
    const fileName = `${productId}_${timestamp}_${file.name}`;
    const storageRef = ref(storage, `products/${fileName}`);

    console.log("Створено storageRef:", storageRef.fullPath);
    console.log("Розмір файлу:", file.size, "байт");

    const snapshot = await uploadBytes(storageRef, file);
    console.log("Файл завантажено, snapshot:", snapshot);

    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log("Отримано downloadURL:", downloadURL);

    return downloadURL;
  } catch (error) {
    console.error("Помилка завантаження зображення:", error);
    console.error("Деталі помилки:", {
      code: error.code,
      message: error.message,
      stack: error.stack,
    });
    throw error;
  }
};

// Отримати URL зображення
export const getImageURL = async (imagePath) => {
  try {
    const imageRef = ref(storage, imagePath);
    return await getDownloadURL(imageRef);
  } catch (error) {
    console.error("Помилка отримання URL зображення:", error);
    throw error;
  }
};

// Видалити зображення
export const deleteImage = async (imagePath) => {
  try {
    const imageRef = ref(storage, imagePath);
    await deleteObject(imageRef);
  } catch (error) {
    console.error("Помилка видалення зображення:", error);
    throw error;
  }
};

// Отримати всі зображення для товару
export const getProductImages = async (productId) => {
  try {
    const listRef = ref(storage, `products/`);
    const res = await listAll(listRef);

    const productImages = [];
    for (const itemRef of res.items) {
      if (itemRef.name.startsWith(productId)) {
        const url = await getDownloadURL(itemRef);
        productImages.push({
          name: itemRef.name,
          url: url,
        });
      }
    }

    return productImages;
  } catch (error) {
    console.error("Помилка отримання зображень товару:", error);
    throw error;
  }
};
