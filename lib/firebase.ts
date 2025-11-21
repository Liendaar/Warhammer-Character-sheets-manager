import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBn98qfjr40cKFnJPfjVzN24x8Q69Eb7Ns",
    authDomain: "warhammer-character-sheets.firebaseapp.com",
    projectId: "warhammer-character-sheets",
    storageBucket: "warhammer-character-sheets.firebasestorage.app",
    messagingSenderId: "606947495550",
    appId: "1:606947495550:web:26150abdec9efa3126522f",
    measurementId: "G-ZE9VGPLJFE"
};

// Initialize Firebase
// Check if firebase is already initialized to avoid errors in development with hot reloading
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
