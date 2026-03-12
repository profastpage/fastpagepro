"use client";

function ShimmerBlock({ className = "" }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-xl bg-slate-200/70 ${className}`}>
      <div className="absolute inset-0 animate-[carta-shimmer_1.3s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
    </div>
  );
}

export default function CartaMenuSkeleton() {
  return (
    <div className="min-h-screen bg-slate-100 px-3 py-5">
      <div className="mx-auto w-full max-w-md rounded-[2.2rem] border border-slate-200 bg-white p-4">
        <ShimmerBlock className="h-10 w-40" />
        <div className="mt-4 space-y-3">
          <ShimmerBlock className="h-11 w-full" />
          <div className="flex gap-2 overflow-hidden">
            {Array.from({ length: 4 }).map((_, idx) => (
              <ShimmerBlock key={idx} className="h-9 w-20 shrink-0 rounded-full" />
            ))}
          </div>
        </div>
        <div className="mt-5 space-y-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="rounded-2xl border border-slate-200 p-3">
              <div className="flex gap-3">
                <ShimmerBlock className="h-[104px] w-[104px] shrink-0" />
                <div className="min-w-0 flex-1 space-y-2">
                  <ShimmerBlock className="h-5 w-3/4" />
                  <ShimmerBlock className="h-4 w-full" />
                  <ShimmerBlock className="h-4 w-2/3" />
                  <ShimmerBlock className="h-10 w-full rounded-xl" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes carta-shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}

