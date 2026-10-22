"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { AuthControls } from "@/components/AuthControls";
import { ThemeToggle } from "@/components/ThemeToggle";
import { APP_LOGO_ALT, APP_LOGO_PATH, APP_NAME } from "@/lib/brand";
import type { NavAuthState } from "@/lib/auth-session";

type NavLink = {
  href: string;
  label: string;
  ucsbOnly?: boolean;
  accent?: "grades" | "graduate";
};

const NAV_LINKS: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/schools", label: "Schools" },
  { href: "/schools/ucsb/courses", label: "Courses", ucsbOnly: true },
  { href: "/schools/ucsb/grades", label: "Grades", ucsbOnly: true, accent: "grades" },
  { href: "/schools/ucsb/graduate", label: "Graduate", ucsbOnly: true, accent: "graduate" },
  { href: "/explore", label: "Explore" },
  { href: "/contribute", label: "Contribute" },
];

function schoolFromPath(pathname: string): string | null {
  const match = pathname.match(/^\/schools\/([^/]+)/);
  return match?.[1]?.toLowerCase() ?? null;
}

function isGraduateNavActive(pathname: string, href: string): boolean {
  if (href !== "/schools/ucsb/graduate") return false;
  if (pathname.startsWith("/schools/ucsb/graduate")) return true;
  if (pathname.startsWith("/roadmap/ucsb/") && /-(ms|phd)$/.test(pathname)) {
    return true;
  }
  return false;
}

function isGradesNavActive(pathname: string, href: string): boolean {
  return href === "/schools/ucsb/grades" && pathname.startsWith(href);
}

function isNavLinkActive(pathname: string, link: NavLink): boolean {
  if (link.accent === "graduate") {
    return isGraduateNavActive(pathname, link.href);
  }
  if (link.accent === "grades") {
    return isGradesNavActive(pathname, link.href);
  }
  return link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
}

export type NavbarProps = {
  className?: string;
  initialAuth: NavAuthState;
};

export function Navbar({ className = "", initialAuth }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const activeSchool = schoolFromPath(pathname);
  const showUcsbTools = !activeSchool || activeSchool === "ucsb";

  const visibleLinks = NAV_LINKS.filter(
    (link) => !link.ucsbOnly || showUcsbTools,
  );

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
        mobileMenuButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileMenuOpen]);

  return (
    <header
      className={`sticky top-0 z-40 border-b-2 border-gaucho-gold/80 bg-white/95 backdrop-blur dark:border-gaucho-gold/40 dark:bg-gaucho-blue-dark/95 ${className}`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-2.5 sm:px-6 lg:gap-4 lg:py-3.5">
        <Link href="/" className="group flex min-w-0 items-center gap-2 sm:gap-3">
          <Image
            src={APP_LOGO_PATH}
            alt={APP_LOGO_ALT}
            width={44}
            height={30}
            className="h-9 w-auto shrink-0 rounded-sm object-contain"
            priority
          />
          <span className="flex min-w-0 flex-col gap-0.5">
            <span className="text-lg font-bold tracking-tight text-gaucho-blue dark:text-white">
              {APP_NAME}
            </span>
            <span className="hidden text-xs text-slate-500 dark:text-slate-400 sm:block">
              Degree planning & community
            </span>
          </span>
        </Link>

        <div className="hidden min-w-0 items-center gap-2 xl:flex">
          <nav
            className="flex min-w-0 items-center gap-0.5 rounded-lg border border-gaucho-blue/15 bg-slate-50 p-0.5 dark:border-gaucho-gold/20 dark:bg-gaucho-blue/30"
            aria-label="Main"
          >
            {visibleLinks.map((link) => {
              const { href, label, accent } = link;
              const active = isNavLinkActive(pathname, link);

              return (
                <Link
                  key={href}
                  href={href}
                  className={[
                    "inline-flex min-h-11 items-center rounded-md px-3.5 py-2 text-sm font-medium transition",
                    active
                      ? accent === "graduate"
                        ? "bg-violet-600 text-white"
                        : accent === "grades"
                          ? "bg-teal-600 text-white"
                          : "bg-gaucho-blue text-white dark:bg-gaucho-gold dark:text-gaucho-blue-dark"
                      : accent === "graduate"
                        ? "text-violet-700 hover:text-violet-900 dark:text-violet-300 dark:hover:text-violet-100"
                        : accent === "grades"
                          ? "text-teal-700 hover:text-teal-900 dark:text-teal-300 dark:hover:text-teal-100"
                          : "text-slate-600 hover:text-gaucho-blue dark:text-slate-300 dark:hover:text-gaucho-gold-light",
                  ].join(" ")}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
          <AuthControls initialAuth={initialAuth} />
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-1 xl:hidden">
          <ThemeToggle />
          <button
            ref={mobileMenuButtonRef}
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-gaucho-blue/20 text-gaucho-blue transition hover:bg-gaucho-blue/5 dark:border-gaucho-gold/30 dark:text-gaucho-gold dark:hover:bg-gaucho-blue/40"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-main-navigation"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            <span className="sr-only">{mobileMenuOpen ? "Close" : "Menu"}</span>
            <span aria-hidden className="text-xl leading-none">
              {mobileMenuOpen ? "×" : "☰"}
            </span>
          </button>
        </div>
      </div>

      {mobileMenuOpen ? (
        <div
          id="mobile-main-navigation"
          className="border-t border-gaucho-blue/10 px-4 pb-4 pt-3 dark:border-gaucho-gold/15 xl:hidden"
        >
          <nav className="grid grid-cols-2 gap-2" aria-label="Mobile main navigation">
            {visibleLinks.map((link) => {
              const { href, label, accent } = link;
              const active = isNavLinkActive(pathname, link);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={[
                    "inline-flex min-h-11 items-center justify-center rounded-lg px-3 py-2 text-sm font-semibold transition",
                    active
                      ? accent === "graduate"
                        ? "bg-violet-600 text-white"
                        : accent === "grades"
                          ? "bg-teal-600 text-white"
                          : "bg-gaucho-blue text-white dark:bg-gaucho-gold dark:text-gaucho-blue-dark"
                      : "border border-gaucho-blue/15 bg-slate-50 text-gaucho-blue dark:border-gaucho-gold/20 dark:bg-gaucho-blue/30 dark:text-slate-100",
                  ].join(" ")}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-3 flex min-h-11 items-center justify-end border-t border-gaucho-blue/10 pt-3 dark:border-gaucho-gold/15">
            <AuthControls initialAuth={initialAuth} />
          </div>
        </div>
      ) : null}
    </header>
  );
}
