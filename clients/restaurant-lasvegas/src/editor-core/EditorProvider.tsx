"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { EditorChangeKind, EditorProjectType, EditorState, EditorStatus } from "@/editor-core/types";

type StateUpdater<TData> = TData | ((current: TData) => TData);

interface ReplaceDataOptions {
  syncPreview?: boolean;
  markDirty?: boolean;
  changeKind?: EditorChangeKind;
}

interface EditorContextValue<TData = any> {
  state: EditorState<TData>;
  setProjectMeta: (projectId: string, projectType?: EditorProjectType) => void;
  replaceData: (updater: StateUpdater<TData>, options?: ReplaceDataOptions) => void;
  replacePreviewData: (updater: StateUpdater<TData>) => void;
  markDirty: (kind?: EditorChangeKind) => void;
  setStatus: (status: EditorStatus) => void;
  setError: (message: string | null) => void;
  markSaved: (status?: "draft" | "published") => void;
}

interface EditorProviderProps<TData = any> {
  projectId: string;
  projectType: EditorProjectType;
  initialData: TData;
  initialPreviewData?: TData;
  initialStatus?: "draft" | "published";
  children: ReactNode;
}

const EditorStateContext = createContext<EditorContextValue | null>(null);

function resolveNextData<TData>(updater: StateUpdater<TData>, current: TData): TData {
  if (typeof updater === "function") {
    return (updater as (value: TData) => TData)(current);
  }
  return updater;
}

export function EditorProvider<TData = any>({
  projectId,
  projectType,
  initialData,
  initialPreviewData,
  initialStatus = "draft",
  children,
}: EditorProviderProps<TData>) {
  const [state, setState] = useState<EditorState<TData>>({
    projectId,
    projectType,
    status: initialStatus,
    data: initialData,
    previewData: initialPreviewData ?? initialData,
    lastError: null,
  });

  const setProjectMeta = useCallback((nextProjectId: string, nextProjectType?: EditorProjectType) => {
    setState((prev) => ({
      ...prev,
      projectId: nextProjectId,
      projectType: nextProjectType ?? prev.projectType,
    }));
  }, []);

  const replaceData = useCallback(
    (updater: StateUpdater<TData>, options?: ReplaceDataOptions) => {
      setState((prev) => {
        const nextData = resolveNextData(updater, prev.data);
        const shouldMarkDirty = options?.markDirty ?? true;
        return {
          ...prev,
          data: nextData,
          previewData: options?.syncPreview === false ? prev.previewData : nextData,
          status: shouldMarkDirty ? "dirty" : prev.status,
          lastChangedAt: Date.now(),
          lastChangeKind: options?.changeKind ?? "bulk",
          lastError: null,
        };
      });
    },
    [],
  );

  const replacePreviewData = useCallback((updater: StateUpdater<TData>) => {
    setState((prev) => ({
      ...prev,
      previewData: resolveNextData(updater, prev.previewData),
      lastChangedAt: Date.now(),
      lastError: null,
    }));
  }, []);

  const markDirty = useCallback((kind: EditorChangeKind = "text") => {
    setState((prev) => ({
      ...prev,
      status: "dirty",
      lastChangedAt: Date.now(),
      lastChangeKind: kind,
      lastError: null,
    }));
  }, []);

  const setStatus = useCallback((status: EditorStatus) => {
    setState((prev) => ({ ...prev, status }));
  }, []);

  const setError = useCallback((message: string | null) => {
    setState((prev) => ({ ...prev, lastError: message }));
  }, []);

  const markSaved = useCallback((status: "draft" | "published" = "draft") => {
    setState((prev) => ({
      ...prev,
      status,
      lastSavedAt: Date.now(),
      lastError: null,
    }));
  }, []);

  const value = useMemo<EditorContextValue<TData>>(
    () => ({
      state,
      setProjectMeta,
      replaceData,
      replacePreviewData,
      markDirty,
      setStatus,
      setError,
      markSaved,
    }),
    [markDirty, markSaved, replaceData, replacePreviewData, setError, setProjectMeta, setStatus, state],
  );

  return <EditorStateContext.Provider value={value}>{children}</EditorStateContext.Provider>;
}

export function useEditorState<TData = any>() {
  const context = useContext(EditorStateContext);
  if (!context) {
    throw new Error("useEditorState must be used inside <EditorProvider>");
  }

  return context as EditorContextValue<TData>;
}
