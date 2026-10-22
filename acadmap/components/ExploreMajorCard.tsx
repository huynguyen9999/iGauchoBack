"use client";

import Link from "next/link";

import type { ExploreMajor } from "@/lib/explore-types";

export type ExploreMajorCardProps = {
  major: ExploreMajor;
  onCompare?: (major: ExploreMajor) => void;
  compareSelected?: boolean;
  compareDisabled?: boolean;
};

function experienceLabel(type: ExploreMajor["experienceType"]): string {
  switch (type) {
    case "graph":
      return "Interactive graph";
    case "guide":
      return "Major guide";
    default:
      return "Catalog entry";
  }
}

function experienceStyles(type: ExploreMajor["experienceType"]): string {
  switch (type) {
    case "graph":
      return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300";
    case "guide":
      return "bg-gaucho-blue/10 text-gaucho-blue dark:text-gaucho-gold-light";
    default:
      return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";
  }
}

export function ExploreMajorCard({
  major,
  onCompare,
  compareSelected = false,
  compareDisabled,
}: ExploreMajorCardProps) {
  const primaryHref = major.hrefGraph ?? major.hrefMajor;
  const primaryLabel = major.hasInteractiveGraph
    ? "Open graph"
    : major.hasDetailPage
      ? "View major guide"
      : "View details";

  return (
    <article className="card-glow flex h-full flex-col rounded-lg border border-gaucho-blue/15 bg-white p-4 dark:bg-gaucho-blue-dark/40">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:bg-gaucho-blue/30 dark:text-slate-300">
          {major.schoolShortName.toUpperCase()}
        </span>
        <span className="rounded bg-gaucho-blue/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gaucho-blue dark:text-gaucho-gold-light">
          {major.collegeLabel}
        </span>
        {major.programLevel === "graduate" && (
          <span className="rounded bg-violet-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-violet-700 dark:text-violet-200">
            Graduate
          </span>
        )}
        <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-gaucho-blue/30 dark:text-slate-300">
          {major.degreeType}
        </span>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${experienceStyles(major.experienceType)}`}
        >
          {experienceLabel(major.experienceType)}
        </span>
      </div>

      <h3 className="text-base font-semibold text-gaucho-blue dark:text-white">
        {major.name}
      </h3>
      <p className="mt-0.5 text-xs text-slate-500">{major.department}</p>
      <p className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
        {major.hook}
      </p>

      <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
        <Link
          href={primaryHref}
          className="inline-flex min-h-11 items-center rounded-md bg-gaucho-blue px-3 py-2 text-xs font-semibold text-white transition hover:bg-gaucho-blue-light"
        >
          {primaryLabel}
        </Link>
        {major.hrefGraph && major.hasDetailPage && (
          <Link
            href={major.hrefMajor}
            className="inline-flex min-h-11 items-center rounded-md border border-gaucho-blue/20 px-3 py-2 text-xs font-medium text-gaucho-blue transition hover:bg-gaucho-blue/5 dark:border-gaucho-gold/25 dark:text-gaucho-gold-light"
          >
            Major guide
          </Link>
        )}
        {major.officialUrl && (
          <a
            href={major.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center rounded-md px-2 text-xs text-slate-500 underline-offset-2 hover:bg-slate-100 hover:text-gaucho-blue hover:underline dark:hover:bg-gaucho-blue/40 dark:hover:text-gaucho-gold"
          >
            Official ↗
          </a>
        )}
        {onCompare && (
          <button
            type="button"
            disabled={compareDisabled}
            onClick={() => onCompare(major)}
            aria-pressed={compareSelected}
            aria-label={
              compareSelected
                ? `Remove ${major.name} from comparison`
                : `Add ${major.name} to comparison`
            }
            className={[
              "ml-auto min-h-11 rounded-md px-3 py-2 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-40",
              compareSelected
                ? "bg-gaucho-blue/10 text-gaucho-blue dark:bg-gaucho-gold/15 dark:text-gaucho-gold"
                : "text-gaucho-blue-light hover:bg-slate-100 hover:text-gaucho-blue dark:text-gaucho-gold dark:hover:bg-gaucho-blue/40 dark:hover:text-gaucho-gold-light",
            ].join(" ")}
          >
            {compareSelected ? "Selected" : "Compare"}
          </button>
        )}
      </div>
    </article>
  );
}
