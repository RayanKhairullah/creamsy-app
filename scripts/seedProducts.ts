import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

console.log("Menggunakan project ID:", firebaseConfig.projectId);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


const seedProducts = async () => {
  const products = [
    { name: "Es Krim Coklat", price: 15000, type: "base", image: "https://cdn.pixabay.com/photo/2018/04/27/10/55/dessert-3354303_960_720.jpg"  },
    { name: "Es Krim Vanilla", price: 13000, type: "base", image: "https://cdn.pixabay.com/photo/2018/04/27/10/55/dessert-3354303_960_720.jpg"  },
    { name: "Es Krim Stroberi", price: 16000, type: "base", image: "https://cdn.pixabay.com/photo/2018/04/27/10/55/dessert-3354303_960_720.jpg"  },
    { name: "Topping Oreo", price: 5000, type: "topping" },
    { name: "Topping Kacang", price: 3000, type: "topping" },
    { name: "Topping Sprinkles", price: 2000, type: "topping" },
    { name: "Topping Coklat Cair", price: 4000, type: "topping" },
    { name: "Topping Keju", price: 6000, type: "topping" },
  ];

  try {
    for (const product of products) {
      await addDoc(collection(db, "products"), product);
      console.log(`Added: ${product.name}`);
    }
    console.log("✅ Seed data berhasil!");
  } catch (e) {
    console.error("Error seeding data:", e);
  }
};

seedProducts();