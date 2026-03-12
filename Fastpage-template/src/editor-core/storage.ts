"use client";

import { doc as firestoreDoc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { EditorProjectType } from "@/editor-core/types";

export interface SaveEditorDraftParams<TData = any> {
  projectId: string;
  userId: string;
  projectType: EditorProjectType;
  data: TData;
}

export interface PublishEditorDraftParams<TData = any> extends SaveEditorDraftParams<TData> {
  publishedUrl?: string;
}

export interface EditorProjectDocument<TData = any> {
  id: string;
  userId: string;
  type: EditorProjectType;
  status: "draft" | "published";
  draftData: TData;
  publishedData?: TData;
  publishedAt?: number;
  updatedAt: number;
}

const PROJECTS_COLLECTION = "projects";
const ANALYTICS_COLLECTION = "analytics";

export async function saveEditorDraft<TData = any>(params: SaveEditorDraftParams<TData>) {
  const now = Date.now();
  const payload: EditorProjectDocument<TData> = {
    id: params.projectId,
    userId: params.userId,
    type: params.projectType,
    status: "draft",
    draftData: params.data,
    updatedAt: now,
  };

  await setDoc(firestoreDoc(db, PROJECTS_COLLECTION, params.projectId), payload, { merge: true });
}

export async function publishEditorDraft<TData = any>(params: PublishEditorDraftParams<TData>) {
  const now = Date.now();
  const payload: EditorProjectDocument<TData> & { publishedUrl?: string } = {
    id: params.projectId,
    userId: params.userId,
    type: params.projectType,
    status: "published",
    draftData: params.data,
    publishedData: params.data,
    publishedAt: now,
    updatedAt: now,
    ...(params.publishedUrl ? { publishedUrl: params.publishedUrl } : {}),
  };

  await setDoc(firestoreDoc(db, PROJECTS_COLLECTION, params.projectId), payload, { merge: true });
}

export async function readEditorProject<TData = any>(projectId: string) {
  const snap = await getDoc(firestoreDoc(db, PROJECTS_COLLECTION, projectId));
  if (!snap.exists()) return null;
  return snap.data() as EditorProjectDocument<TData>;
}

export async function ensureAnalyticsDocument(projectId: string) {
  const ref = firestoreDoc(db, ANALYTICS_COLLECTION, projectId);
  const snap = await getDoc(ref);
  if (snap.exists()) return;

  await setDoc(
    ref,
    {
      visitsTotal: 0,
      clicksTotal: 0,
      avgTimeOnPage: 0,
      conversionRate: 0,
      weeklyTraffic: [],
      technical: {
        lcp: null,
        seoScore: null,
        accessibility: null,
      },
      updatedAt: Date.now(),
    },
    { merge: true },
  );
}
