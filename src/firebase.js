import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB5QHNzoqnb4hebySr0kX3uXSgPZodcbjs",
  authDomain: "e-mail-push.firebaseapp.com",
  projectId: "e-mail-push",
  storageBucket: "e-mail-push.firebasestorage.app",
  messagingSenderId: "492763281422",
  appId: "1:492763281422:web:70b9635a41cabb4974a45f"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };