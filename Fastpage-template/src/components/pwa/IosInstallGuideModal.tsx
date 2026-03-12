"use client";

import { Share2, PlusSquare, X } from "lucide-react";

type IosInstallGuideModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function IosInstallGuideModal({ open, onClose }: IosInstallGuideModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[140] flex items-end justify-center bg-black/55 px-4 pb-6 pt-16 md:items-center md:py-8">
      <div className="w-full max-w-sm rounded-2xl border border-amber-300/45 bg-[linear-gradient(165deg,rgba(251,191,36,0.2),rgba(20,16,10,0.92)_40%,rgba(8,8,10,0.98))] p-4 shadow-[0_20px_45px_-24px_rgba(251,191,36,0.78)]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-amber-300">iPhone / iPad</p>
            <h3 className="mt-1 text-base font-black text-amber-50">Agregar a pantalla de inicio</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-white/5 text-zinc-100 transition hover:border-amber-300/45 hover:text-amber-200"
            aria-label="Cerrar guia de instalacion iOS"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <ol className="mt-3 space-y-2 text-sm text-amber-100">
          <li className="flex items-start gap-2">
            <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-300/20 text-[11px] font-black text-amber-200">
              1
            </span>
            <span className="inline-flex items-center gap-1.5">
              Toca <Share2 className="h-4 w-4" /> Compartir en Safari.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-300/20 text-[11px] font-black text-amber-200">
              2
            </span>
            <span className="inline-flex items-center gap-1.5">
              Elige <PlusSquare className="h-4 w-4" /> Anadir a pantalla de inicio.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-300/20 text-[11px] font-black text-amber-200">
              3
            </span>
            <span>Confirma con Anadir. La app quedara instalada en tu iPhone.</span>
          </li>
        </ol>

        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full rounded-full border border-amber-200/70 bg-amber-200 px-3 py-2 text-sm font-black text-zinc-900 transition hover:bg-amber-100"
        >
          Entendido
        </button>
      </div>
    </div>
  );
}

