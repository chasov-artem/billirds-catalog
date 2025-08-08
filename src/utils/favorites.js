// Утиліти для роботи з обраним
const FAVORITES_KEY = "billirds_favorites";

// Отримати всі обрані товари
export const getFavorites = () => {
  try {
    const favorites = localStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error("Помилка отримання обраного:", error);
    return [];
  }
};

// Додати товар до обраного
export const addToFavorites = (productId) => {
  try {
    const favorites = getFavorites();
    if (!favorites.includes(productId)) {
      favorites.push(productId);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
    return true;
  } catch (error) {
    console.error("Помилка додавання до обраного:", error);
    return false;
  }
};

// Видалити товар з обраного
export const removeFromFavorites = (productId) => {
  try {
    const favorites = getFavorites();
    const updatedFavorites = favorites.filter((id) => id !== productId);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
    return true;
  } catch (error) {
    console.error("Помилка видалення з обраного:", error);
    return false;
  }
};

// Перевірити, чи товар в обраному
export const isInFavorites = (productId) => {
  try {
    const favorites = getFavorites();
    return favorites.includes(productId);
  } catch (error) {
    console.error("Помилка перевірки обраного:", error);
    return false;
  }
};

// Очистити все обране
export const clearFavorites = () => {
  try {
    localStorage.removeItem(FAVORITES_KEY);
    return true;
  } catch (error) {
    console.error("Помилка очищення обраного:", error);
    return false;
  }
};

// Отримати кількість обраних товарів
export const getFavoritesCount = () => {
  return getFavorites().length;
};
