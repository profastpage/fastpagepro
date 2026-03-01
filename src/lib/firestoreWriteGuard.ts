import {
  type DocumentData,
  type DocumentReference,
  getDoc,
  setDoc,
  type SetOptions,
} from "firebase/firestore";

interface VerifyWriteOptions {
  expectedUpdatedAt?: number;
  requiredFields?: string[];
  errorMessage?: string;
}

function readPathValue(input: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (!acc || typeof acc !== "object") return undefined;
    return (acc as Record<string, unknown>)[key];
  }, input);
}

export async function setDocWithVerification<T extends DocumentData>(
  ref: DocumentReference<T>,
  payload: Partial<T>,
  options: SetOptions = { merge: true },
  verify: VerifyWriteOptions = {},
) {
  await setDoc(ref, payload as T, options);

  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) {
    throw new Error(verify.errorMessage || "No se pudo confirmar el guardado en Firestore.");
  }

  const savedData = snapshot.data() as Record<string, unknown>;
  const expectedUpdatedAt = Number(verify.expectedUpdatedAt || 0);
  if (expectedUpdatedAt > 0) {
    const remoteUpdatedAt = Number(savedData.updatedAt || 0);
    if (!Number.isFinite(remoteUpdatedAt) || remoteUpdatedAt < expectedUpdatedAt) {
      throw new Error(verify.errorMessage || "Guardado no confirmado en servidor. Intenta nuevamente.");
    }
  }

  if (Array.isArray(verify.requiredFields) && verify.requiredFields.length > 0) {
    const missingField = verify.requiredFields.find((field) => {
      const value = readPathValue(savedData, field);
      if (typeof value === "string") return value.trim().length === 0;
      return value === null || value === undefined;
    });
    if (missingField) {
      throw new Error(
        verify.errorMessage || `Guardado incompleto en Firestore. Falta el campo "${missingField}".`,
      );
    }
  }

  return snapshot.data() as T;
}
