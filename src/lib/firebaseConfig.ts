// lib/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyApt2HewSQdFbHolnk62Ds-WEmhPtFA84w",
  authDomain: "teacher-evaluation-57bc3.firebaseapp.com",
  projectId: "teacher-evaluation-57bc3",
  storageBucket: "teacher-evaluation-57bc3.appspot.com",
  messagingSenderId: "1084446927417",
  appId: "1:1084446927417:web:2c6960c6c21358ede93be8",
  measurementId: "G-F86P3S7ER9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null; // Avoid analytics error in SSR
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, analytics, auth, db, storage };
