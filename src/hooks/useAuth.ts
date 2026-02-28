import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export interface User {
  email: string;
  name: string;
  uid?: string;
  photoURL?: string;
  status?: 'active' | 'suspended' | 'disabled';
}

const RECORDING_DEMO_TARGET_EMAIL = 'gozustrike@gmail.com';
const PREVIEW_OWNER_STORAGE_KEY = 'fp_preview_owner_email';

function toDemoVersion(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 1;
}

export function useAuth(requireAuth = false) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 1. First, check localStorage for immediate (but potentially stale) session
    const localSession = localStorage.getItem('fp_session');
    if (localSession) {
      try {
        const parsed = JSON.parse(localSession);
        setUser(parsed);
      } catch (e) {
        console.error('Error parsing local session', e);
      }
    }

    // 2. Listen to Firebase Auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        let userDataFromDb = null;

        try {
          // Timeout for slow connections.
          const fetchDoc = getDoc(doc(db, 'users', firebaseUser.uid));
          const timeout = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Timeout Firestore')), 10000),
          );

          const userDoc = (await Promise.race([fetchDoc, timeout])) as any;
          userDataFromDb = userDoc.data();
        } catch (err) {
          console.warn('Firestore inaccessible or timeout. Using Auth basic data.', err);
          // If it fails, continue with Auth data to avoid blocking the user.
        }

        if (userDataFromDb?.status === 'suspended' || userDataFromDb?.status === 'disabled') {
          await signOut(auth);
          localStorage.removeItem('fp_session');
          setUser(null);
          router.push('/auth?error=' + userDataFromDb.status);
          setLoading(false);
          return;
        }

        const userData: User = {
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Usuario',
          uid: firebaseUser.uid,
          photoURL: firebaseUser.photoURL || undefined,
          status: userDataFromDb?.status || 'active',
        };
        setUser(userData);
        // Update localStorage to keep it in sync
        localStorage.setItem('fp_session', JSON.stringify(userData));
        const normalizedEmail = String(userData.email || '').trim().toLowerCase();
        if (normalizedEmail === RECORDING_DEMO_TARGET_EMAIL) {
          localStorage.setItem(PREVIEW_OWNER_STORAGE_KEY, normalizedEmail);
        } else {
          localStorage.removeItem(PREVIEW_OWNER_STORAGE_KEY);
        }

        // Optional demo reset on login (per demo account setting).
        try {
          if (
            userDataFromDb?.isDemo === true &&
            String(userDataFromDb?.resetMode || '').toLowerCase() === 'on_login'
          ) {
            const currentVersion = toDemoVersion(userDataFromDb?.demoVersion);
            const resetGuardKey = `fp_demo_reset_${firebaseUser.uid}_v${currentVersion}`;
            if (!sessionStorage.getItem(resetGuardKey)) {
              const idToken = await firebaseUser.getIdToken(true);
              const response = await fetch('/api/demo/reset-own-on-login', {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${idToken}`,
                },
              });
              const payload = await response.json().catch(() => ({}));
              sessionStorage.setItem(resetGuardKey, '1');

              const nextVersion = toDemoVersion(payload?.demoVersion || currentVersion);
              sessionStorage.setItem(`fp_demo_reset_${firebaseUser.uid}_v${nextVersion}`, '1');
            }
          }
        } catch (demoResetError) {
          console.warn('[useAuth] Demo login reset failed.', demoResetError);
        }

        // Sync subscription session cookie for middleware feature gating.
        try {
          const idToken = await firebaseUser.getIdToken();
          await fetch('/api/subscription/session', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          });
          await fetch('/api/subscription/current', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          }).catch(() => undefined);
        } catch (syncError) {
          console.warn('[useAuth] Could not sync subscription session.', syncError);
        }
      } else {
        if (!localStorage.getItem('fp_session')) {
          setUser(null);
          if (requireAuth) {
            router.push('/auth');
          }
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [requireAuth, router]);

  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('fp_session');
      setUser(null);
      router.push('/auth');
    } catch (error) {
      console.error('Error logging out', error);
    }
  };

  return { user, loading, logout };
}
