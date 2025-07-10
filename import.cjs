const admin = require("firebase-admin");
const fs = require("fs");

// === 1. Вкажіть serviceAccountKey нового проекту ===
const serviceAccount = require("./serviceAccountKey-billiards-3564f.json");

// === 2. Вкажіть projectId нового проекту ===
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: "billiards-3564f", // <-- новий projectId
});

const db = admin.firestore();

// === 3. Вкажіть назву колекції для імпорту ===
const COLLECTION = "products"; // або "categories"

// === 4. Зчитайте дані з JSON ===
const docs = JSON.parse(fs.readFileSync(`${COLLECTION}.json`, "utf8"));

async function importCollection() {
  for (const doc of docs) {
    const { id, ...data } = doc;
    await db.collection(COLLECTION).doc(id).set(data);
    console.log(`Імпортовано: ${id}`);
  }
  console.log(`Імпорт завершено: ${docs.length} документів у ${COLLECTION}`);
}

importCollection();
