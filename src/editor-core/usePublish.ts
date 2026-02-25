"use client";

import { useCallback, useMemo } from "react";
import { useEditorState } from "@/editor-core/useEditorState";
import type { EditorState } from "@/editor-core/types";

interface UsePublishOptions<TData = any> {
  onPublish: (params: { state: EditorState<TData> }) => Promise<void>;
}

export function usePublish<TData = any>(options: UsePublishOptions<TData>) {
  const { state, setStatus, setError, markSaved } = useEditorState<TData>();

  const publish = useCallback(async () => {
    if (state.status === "publishing") return false;

    setStatus("publishing");
    setError(null);
    try {
      await options.onPublish({ state });
      markSaved("published");
      return true;
    } catch (error: any) {
      setStatus("dirty");
      setError(error?.message || "No se pudo publicar.");
      return false;
    }
  }, [markSaved, options, setError, setStatus, state]);

  return useMemo(
    () => ({
      publish,
      publishing: state.status === "publishing",
      isPublished: state.status === "published",
    }),
    [publish, state.status],
  );
}
