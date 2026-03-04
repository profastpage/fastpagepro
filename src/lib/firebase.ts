import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

function resolveFirebaseAuthDomain(): string {
  const fallback = "fastpage-7ceb3.firebaseapp.com";
  const raw = String(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "").trim();
  if (!raw) return fallback;

  const normalized = raw.toLowerCase();
  const isFirebaseManaged =
    normalized.endsWith(".firebaseapp.com") ||
    normalized.endsWith(".web.app") ||
    normalized.startsWith("localhost") ||
    normalized.startsWith("127.0.0.1");

  // Prevent OAuth redirect_uri_mismatch caused by custom domains not registered in Google OAuth client.
  if (!isFirebaseManaged) return fallback;
  return raw;
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAkb9GtjFXt2NPjuM_-M41Srd6aUK7Ch2Y",
  authDomain: resolveFirebaseAuthDomain(),
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "fastpage-7ceb3",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "fastpage-7ceb3.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "812748660444",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:812748660444:web:4bf4184a13a377bc26de19"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
