// Firebase configuration and initialization for Panganify
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAW8qeWARRVu9eEALBmXXqiXdEX1c8wupA",
  authDomain: "panganify.firebaseapp.com",
  projectId: "panganify",
  storageBucket: "panganify.firebasestorage.app",
  messagingSenderId: "355583439766",
  appId: "1:355583439766:web:467e76a2400e2b352923b7",
  measurementId: "G-DK4PBGYVZL"
};

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore Database
export const db = getFirestore(app);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Analytics safely (checking browser environment support)
export let analytics = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {
    // Ignore analytics error in environments where IndexedDB/cookies are disabled
  });
}

export default app;
