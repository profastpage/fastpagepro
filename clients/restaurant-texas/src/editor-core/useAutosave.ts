"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useEditorState } from "@/editor-core/useEditorState";
import type { EditorChangeKind, EditorState } from "@/editor-core/types";

interface UseAutosaveOptions<TData = any> {
  enabled?: boolean;
  onSave: (
    params: { state: EditorState<TData>; reason: "manual" | "debounced" },
  ) => Promise<void | boolean>;
  debounceTextMs?: number;
  debounceImageMs?: number;
  debounceBulkMs?: number;
  intervalMs?: number;
}

function resolveDebounce(kind: EditorChangeKind | undefined, options: UseAutosaveOptions) {
  if (kind === "image") return options.debounceImageMs ?? 0;
  if (kind === "bulk") return options.debounceBulkMs ?? 1500;
  return options.debounceTextMs ?? 800;
}

export function useAutosave<TData = any>(options: UseAutosaveOptions<TData>) {
  const { state, setStatus, markSaved, setError } = useEditorState<TData>();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inflightRef = useRef(false);
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const saveNow = useCallback(
    async (reason: "manual" | "debounced" = "manual") => {
      if (!options.enabled) return false;
      if (inflightRef.current) return false;

      const current = stateRef.current;
      if (reason === "debounced" && current.status !== "dirty") return false;

      inflightRef.current = true;
      setStatus("saving");
      setError(null);
      try {
        const saveResult = await options.onSave({ state: current, reason });
        if (saveResult === false) {
          setStatus("dirty");
          return false;
        }
        markSaved("draft");
        return true;
      } catch (error: any) {
        setStatus("dirty");
        setError(error?.message || "No se pudo guardar automaticamente.");
        return false;
      } finally {
        inflightRef.current = false;
      }
    },
    [markSaved, options, setError, setStatus],
  );

  useEffect(() => {
    if (!options.enabled) return;
    if (state.status !== "dirty") return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    const debounce = resolveDebounce(state.lastChangeKind, options);
    timerRef.current = setTimeout(() => {
      void saveNow("debounced");
    }, debounce);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [options, saveNow, state.lastChangeKind, state.status]);

  useEffect(() => {
    if (!options.enabled) return;
    if (!options.intervalMs || options.intervalMs <= 0) return;
    const timer = setInterval(() => {
      if (stateRef.current.status !== "dirty") return;
      void saveNow("debounced");
    }, options.intervalMs);
    return () => clearInterval(timer);
  }, [options.enabled, options.intervalMs, saveNow]);

  return useMemo(
    () => ({
      saveNow,
      autosaving: state.status === "saving",
      canAutosave: Boolean(options.enabled),
    }),
    [options.enabled, saveNow, state.status],
  );
}
