import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, signOut, User as FirebaseAuthUser } from 'firebase/auth';
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
const SESSION_STORAGE_KEY = 'fp_session';
const USER_DOC_TIMEOUT_MS = 3500;
const USER_DOC_CACHE_TTL_MS = 2 * 60 * 1000;
const SUBSCRIPTION_SYNC_TTL_MS = 2 * 60 * 1000;

type AuthUserDoc = {
  status?: User['status'];
  isDemo?: boolean;
  resetMode?: string;
  demoVersion?: number;
} | null;

const userDocCache = new Map<string, { value: AuthUserDoc; expiresAt: number }>();
const userDocInflight = new Map<string, Promise<AuthUserDoc>>();
const subscriptionSyncAt = new Map<string, number>();
const subscriptionSyncInflight = new Map<string, Promise<void>>();
const demoResetInflight = new Set<string>();

function toDemoVersion(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 1;
}

function mergeUserStatus(current: User, status?: User['status']): User {
  if (!status) return current;
  if (current.status === status) return current;
  return { ...current, status };
}

async function fetchUserDocWithCache(uid: string): Promise<AuthUserDoc> {
  const now = Date.now();
  const cached = userDocCache.get(uid);
  if (cached && cached.expiresAt > now) {
    return cached.value;
  }

  const inflight = userDocInflight.get(uid);
  if (inflight) return inflight;

  const request = (async () => {
    try {
      const fetchDoc = getDoc(doc(db, 'users', uid));
      const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Timeout Firestore')), USER_DOC_TIMEOUT_MS),
      );
      const userDoc = await Promise.race([fetchDoc, timeout]);
      const raw = (userDoc as { data: () => Record<string, unknown> | undefined }).data?.() || {};
      const payload: AuthUserDoc = {
        status: raw?.status === 'suspended' || raw?.status === 'disabled' || raw?.status === 'active'
          ? (raw.status as User['status'])
          : 'active',
        isDemo: raw?.isDemo === true,
        resetMode: String(raw?.resetMode || ''),
        demoVersion: Number(raw?.demoVersion || 1),
      };
      userDocCache.set(uid, { value: payload, expiresAt: now + USER_DOC_CACHE_TTL_MS });
      return payload;
    } catch (error) {
      console.warn('Firestore inaccessible or timeout. Using Auth basic data.', error);
      userDocCache.set(uid, { value: null, expiresAt: now + 30_000 });
      return null;
    } finally {
      userDocInflight.delete(uid);
    }
  })();

  userDocInflight.set(uid, request);
  return request;
}

async function ensureSubscriptionSessionSynced(firebaseUser: FirebaseAuthUser): Promise<void> {
  const uid = firebaseUser.uid;
  const now = Date.now();
  const lastSyncAt = subscriptionSyncAt.get(uid) || 0;
  if (now - lastSyncAt < SUBSCRIPTION_SYNC_TTL_MS) return;

  const inflight = subscriptionSyncInflight.get(uid);
  if (inflight) {
    await inflight;
    return;
  }

  const request = (async () => {
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
      subscriptionSyncAt.set(uid, Date.now());
    } catch (syncError) {
      console.warn('[useAuth] Could not sync subscription session.', syncError);
    } finally {
      subscriptionSyncInflight.delete(uid);
    }
  })();

  subscriptionSyncInflight.set(uid, request);
  await request;
}

async function maybeResetDemoOnLogin(firebaseUser: FirebaseAuthUser, userDataFromDb: AuthUserDoc): Promise<void> {
  if (typeof window === 'undefined') return;
  if (!userDataFromDb?.isDemo) return;
  if (String(userDataFromDb.resetMode || '').toLowerCase() !== 'on_login') return;

  const currentVersion = toDemoVersion(userDataFromDb.demoVersion);
  const resetGuardKey = `fp_demo_reset_${firebaseUser.uid}_v${currentVersion}`;
  if (sessionStorage.getItem(resetGuardKey)) return;
  if (demoResetInflight.has(resetGuardKey)) return;

  demoResetInflight.add(resetGuardKey);
  try {
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
  } catch (demoResetError) {
    console.warn('[useAuth] Demo login reset failed.', demoResetError);
  } finally {
    demoResetInflight.delete(resetGuardKey);
  }
}

export function useAuth(requireAuth = false) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let active = true;

    // 1. First, check localStorage for immediate (but potentially stale) session
    const localSession = localStorage.getItem(SESSION_STORAGE_KEY);
    if (localSession) {
      try {
        const parsed = JSON.parse(localSession);
        setUser(parsed);
      } catch (e) {
        console.error('Error parsing local session', e);
      }
    }

    // 2. Listen to Firebase Auth state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!active) return;

      if (firebaseUser) {
        const optimisticUser: User = {
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Usuario',
          uid: firebaseUser.uid,
          photoURL: firebaseUser.photoURL || undefined,
          status: 'active',
        };
        setUser(optimisticUser);
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(optimisticUser));
        const normalizedEmail = String(optimisticUser.email || '').trim().toLowerCase();
        if (normalizedEmail === RECORDING_DEMO_TARGET_EMAIL) {
          localStorage.setItem(PREVIEW_OWNER_STORAGE_KEY, normalizedEmail);
        } else {
          localStorage.removeItem(PREVIEW_OWNER_STORAGE_KEY);
        }
        setLoading(false);

        void (async () => {
          const userDataFromDb = await fetchUserDocWithCache(firebaseUser.uid);
          if (!active) return;

          if (userDataFromDb?.status === 'suspended' || userDataFromDb?.status === 'disabled') {
            await signOut(auth);
            localStorage.removeItem(SESSION_STORAGE_KEY);
            setUser(null);
            router.push('/auth?error=' + userDataFromDb.status);
            return;
          }

          const mergedUser = mergeUserStatus(optimisticUser, userDataFromDb?.status);
          setUser(mergedUser);
          localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(mergedUser));

          await maybeResetDemoOnLogin(firebaseUser, userDataFromDb);
          void ensureSubscriptionSessionSynced(firebaseUser);
        })();
      } else {
        if (!localStorage.getItem(SESSION_STORAGE_KEY)) {
          setUser(null);
          if (requireAuth) {
            router.push('/auth');
          }
        }
        setLoading(false);
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [requireAuth, router]);

  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem(SESSION_STORAGE_KEY);
      setUser(null);
      router.push('/auth');
    } catch (error) {
      console.error('Error logging out', error);
    }
  };

  return { user, loading, logout };
}
