// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// REPLACE these values with your own from the Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyChE6lQ6gK8BXUKi0yadJcy15f8dwfOug0",
  authDomain: "vocabularydatabase-bc954.firebaseapp.com",
  projectId: "vocabularydatabase-bc954",
  storageBucket: "vocabularydatabase-bc954.firebasestorage.app",
  messagingSenderId: "887716031344",
  appId: "1:887716031344:web:307dfbce3b6ab5d2307db5",
  measurementId: "G-560YF60MH8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
