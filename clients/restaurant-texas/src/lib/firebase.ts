import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const DEFAULT_FIREBASE_AUTH_DOMAIN = "fastpage-7ceb3.firebaseapp.com";
const DEFAULT_ALLOWED_AUTH_DOMAINS = [
  "www.fastpagepro.com",
  "fastpagepro.com",
  "fastpage-7ceb3.firebaseapp.com",
  "fastpage-7ceb3.web.app",
  "localhost",
  "127.0.0.1",
];

function normalizeDomain(raw: string): string {
  return String(raw || "")
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "");
}

function stripPort(host: string): string {
  return String(host || "")
    .trim()
    .toLowerCase()
    .replace(/:\d+$/, "");
}

function readAllowedDomains(): Set<string> {
  const raw = String(process.env.NEXT_PUBLIC_FIREBASE_AUTH_ALLOWED_DOMAINS || "").trim();
  const entries = raw
    ? raw.split(",").map((entry) => normalizeDomain(entry))
    : DEFAULT_ALLOWED_AUTH_DOMAINS.map((entry) => normalizeDomain(entry));

  return new Set(entries.filter(Boolean));
}

function canUseAsAuthDomain(host: string, allowedDomains: Set<string>): boolean {
  const normalizedHost = normalizeDomain(host);
  if (!normalizedHost) return false;
  if (allowedDomains.has(normalizedHost)) return true;
  const hostWithoutPort = stripPort(normalizedHost);
  return allowedDomains.has(hostWithoutPort);
}

function resolveFirebaseAuthDomain(): string {
  const fallback = DEFAULT_FIREBASE_AUTH_DOMAIN;
  const configured = normalizeDomain(String(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || ""));
  const forceSameOrigin =
    String(process.env.NEXT_PUBLIC_FIREBASE_AUTH_FORCE_SAME_ORIGIN || "0")
      .trim()
      .toLowerCase() === "1";
  const allowedDomains = readAllowedDomains();

  // Enable same-origin only when explicitly requested by env, since it requires
  // OAuth redirect URIs to be configured for every runtime host.
  if (typeof window !== "undefined") {
    const currentHost = normalizeDomain(window.location.host);
    if (forceSameOrigin && canUseAsAuthDomain(currentHost, allowedDomains)) {
      return currentHost;
    }
  }

  if (configured && canUseAsAuthDomain(configured, allowedDomains)) {
    return configured;
  }

  return fallback;
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
