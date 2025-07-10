const admin = require("firebase-admin");
const fs = require("fs");

// === 1. Скачайте serviceAccountKey.json з Firebase Console ===
// Project settings > Service accounts > Generate new private key
const serviceAccount = require("./serviceAccountKey.json");

// === 2. Вкажіть projectId вашого проекту ===
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: "billiard-catalog", // <-- ваш projectId
});

const db = admin.firestore();

// === 3. Вкажіть назву колекції для експорту ===
const COLLECTION = "products"; // або "categories"

async function exportCollection() {
  const snapshot = await db.collection(COLLECTION).get();
  const docs = [];
  snapshot.forEach((doc) => {
    docs.push({ id: doc.id, ...doc.data() });
  });
  fs.writeFileSync(`${COLLECTION}.json`, JSON.stringify(docs, null, 2));
  console.log(`Експортовано ${docs.length} документів у ${COLLECTION}.json`);
}

exportCollection();
