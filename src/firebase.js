// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Replace with your own Firebase config (from Firebase Console → Project Settings)
const firebaseConfig = {
 apiKey: "AIzaSyBHMCiSG5pc0i3averfcTS7XRi4hjo7Bqc",
  authDomain: "gyanexia.firebaseapp.com",
  projectId: "gyanexia",
  storageBucket: "gyanexia.firebasestorage.app",
  messagingSenderId: "245032840025",
  appId: "1:245032840025:web:13737d89f32039c439ba48",
  measurementId: "G-9J9DNR9440"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firestore DB
export const db = getFirestore(app);
