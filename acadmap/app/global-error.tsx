"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-slate-100">
        <main className="w-full max-w-md rounded-xl border border-amber-400/30 bg-slate-900 p-6 text-center shadow-xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-300">
            iGauchoBack
          </p>
          <h1 className="mt-3 text-2xl font-bold">Something went wrong</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            The error was recorded. Try loading this page again.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-amber-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-amber-300"
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
