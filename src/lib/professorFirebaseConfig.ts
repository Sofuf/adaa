// lib/professorFirebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Professor project Firebase configuration
const professorFirebaseConfig = {
  apiKey: "AIzaSyDTvFT01j9QxXh0TWPuWQdiFSwHhP3vHuI",
  authDomain: "al-professor-c7fa9.firebaseapp.com",
  projectId: "al-professor-c7fa9",
  storageBucket: "al-professor-c7fa9.appspot.com",
  messagingSenderId: "693737166085",
  appId: "1:693737166085:web:17c54ffac4fadc667ed36c",
  measurementId: "G-05PHPJZG2Y"
};

// Initialize second Firebase app with a unique name
const professorApp = initializeApp(professorFirebaseConfig, 'professor-app');
const professorStorage = getStorage(professorApp);

export { professorStorage };