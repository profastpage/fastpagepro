"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Pencil } from "lucide-react";

interface InlineEditablePermissions {
  canEdit?: boolean;
  reason?: string;
}

interface InlineEditableProps {
  value: string;
  field: string;
  projectId: string;
  onChange: (value: string) => void;
  permissions?: InlineEditablePermissions;
  className?: string;
  placeholder?: string;
  multiline?: boolean;
}

export default function InlineEditable({
  value,
  field,
  projectId,
  onChange,
  permissions,
  className,
  placeholder,
  multiline = false,
}: InlineEditableProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value || "");
  const [hovered, setHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  const canEdit = permissions?.canEdit !== false;

  useEffect(() => {
    if (!editing) {
      setDraft(value || "");
    }
  }, [editing, value]);

  useEffect(() => {
    if (!editing) return;
    inputRef.current?.focus();
    inputRef.current?.select();
  }, [editing]);

  const ariaLabel = useMemo(() => `Editar ${field} en ${projectId}`.trim(), [field, projectId]);

  const commit = () => {
    if (!canEdit) return;
    const next = draft.trim();
    const safeValue = next || placeholder || "";
    onChange(safeValue);
    setEditing(false);
  };

  const cancel = () => {
    setDraft(value || "");
    setEditing(false);
  };

  if (editing && canEdit) {
    if (multiline) {
      return (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={commit}
          onKeyDown={(event) => {
            if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
              event.preventDefault();
              commit();
            }
            if (event.key === "Escape") {
              event.preventDefault();
              cancel();
            }
          }}
          aria-label={ariaLabel}
          className={`w-full rounded-lg border border-cyan-500/40 bg-white/95 px-2 py-1 text-inherit shadow outline-none focus:ring-2 focus:ring-cyan-400/50 ${className || ""}`}
        />
      );
    }

    return (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            commit();
          }
          if (event.key === "Escape") {
            event.preventDefault();
            cancel();
          }
        }}
        aria-label={ariaLabel}
        className={`w-full rounded-lg border border-cyan-500/40 bg-white/95 px-2 py-1 text-inherit shadow outline-none focus:ring-2 focus:ring-cyan-400/50 ${className || ""}`}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => canEdit && setEditing(true)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`group relative inline-flex w-full items-center gap-2 rounded-md px-1.5 py-0.5 text-left transition-colors ${
        canEdit ? "hover:bg-cyan-500/10 focus-visible:ring-2 focus-visible:ring-cyan-400/50" : "cursor-not-allowed"
      } ${className || ""}`}
      title={!canEdit ? permissions?.reason || "No tienes permisos para editar" : `Editar ${field}`}
      aria-label={ariaLabel}
    >
      <span className="truncate">{value || placeholder || "-"}</span>
      {canEdit && (hovered || editing) ? <Pencil className="h-3.5 w-3.5 shrink-0 text-cyan-500" /> : null}
    </button>
  );
}
