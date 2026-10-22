"use client";

import { useEffect, useState } from "react";

import type { GradesSearchEntry } from "@/lib/ucsb-grades-types";
import { formatGpa } from "@/lib/ucsb-grades-utils";

const RESULTS_PAGE_SIZE = 50;

export type GradesResultsTableProps = {
  courses: GradesSearchEntry[];
  selectedCourseId: string | null;
  onSelect: (course: GradesSearchEntry) => void;
};

export function GradesResultsTable({
  courses,
  selectedCourseId,
  onSelect,
}: GradesResultsTableProps) {
  const [visibleCount, setVisibleCount] = useState(RESULTS_PAGE_SIZE);

  useEffect(() => {
    setVisibleCount(RESULTS_PAGE_SIZE);
  }, [courses]);

  if (courses.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gaucho-blue-light/30 bg-slate-50 px-6 py-12 text-center dark:bg-slate-900/40">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          No courses match your search.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gaucho-blue-light/25 dark:border-gaucho-gold/20">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-gaucho-blue-light/20 bg-gaucho-blue/5 dark:bg-gaucho-blue-dark/40">
          <tr>
            <th className="px-4 py-3 font-semibold text-gaucho-blue dark:text-gaucho-gold">
              Course
            </th>
            <th className="px-4 py-3 font-semibold text-gaucho-blue dark:text-gaucho-gold">
              Avg GPA
            </th>
            <th className="hidden px-4 py-3 font-semibold text-gaucho-blue dark:text-gaucho-gold sm:table-cell">
              Offerings
            </th>
          </tr>
        </thead>
        <tbody>
          {courses.slice(0, visibleCount).map((course) => {
            const selected = selectedCourseId === course.courseId;
            return (
              <tr
                key={course.courseId}
                className={[
                  "border-b border-gaucho-blue-light/10 transition last:border-0",
                  selected
                    ? "bg-teal-500/10"
                    : "hover:bg-slate-50 dark:hover:bg-slate-800/50",
                ].join(" ")}
              >
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => onSelect(course)}
                    aria-pressed={selected}
                    className="inline-flex min-h-11 items-center rounded-md px-2 text-left transition hover:bg-teal-500/10"
                  >
                    <span className="font-mono text-xs font-semibold text-gaucho-blue dark:text-gaucho-gold">
                      {course.courseId}
                    </span>
                    <span className="ml-2 text-xs text-slate-500">{course.dept}</span>
                  </button>
                </td>
                <td className="px-4 py-3 font-mono text-slate-700 dark:text-slate-300">
                  {formatGpa(course.avgGpa)}
                </td>
                <td className="hidden px-4 py-3 text-slate-600 dark:text-slate-400 sm:table-cell">
                  {course.offeringCount}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {visibleCount < courses.length ? (
        <div className="border-t border-gaucho-blue-light/15 bg-slate-50 p-3 text-center dark:bg-slate-900/50">
          <button
            type="button"
            className="btn-secondary min-w-40"
            onClick={() =>
              setVisibleCount((count) => count + RESULTS_PAGE_SIZE)
            }
          >
            Show more ({courses.length - visibleCount} remaining)
          </button>
        </div>
      ) : null}
    </div>
  );
}
