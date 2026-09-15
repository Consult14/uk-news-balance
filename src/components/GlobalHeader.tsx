import Link from "next/link";
import { CATEGORIES } from "@/lib/config";
import { buildCategoryPageHref } from "@/lib/url";
import { BrandLogo } from "./BrandLogo";
import { CategoryNavId } from "./CategoryNav";

interface GlobalHeaderProps {
  activeCategoryId?: CategoryNavId;
  activeSourceId?: "all" | import("@/lib/config").NewsSourceId;
}

export function GlobalHeader({
  activeCategoryId,
  activeSourceId = "all",
}: GlobalHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/95 shadow-sm backdrop-blur-sm">
      <div className="mx-auto flex h-[68px] max-w-6xl items-center gap-4 px-4 sm:px-5 lg:px-6">
        <BrandLogo compact className="max-w-[180px]" />

        <nav
          className="scrollbar-hide hidden min-w-0 flex-1 items-center gap-1 overflow-x-auto md:flex"
          aria-label="Primary sections"
        >
          {CATEGORIES.map((category) => {
            const isActive = activeCategoryId === category.id;
            return (
              <Link
                key={category.id}
                href={buildCategoryPageHref(category.id, {
                  source: activeSourceId,
                })}
                className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {category.name}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <Link
            href="/weekly-summary"
            className={`hidden rounded-full px-3 py-1.5 text-sm font-medium transition-colors sm:inline-flex ${
              activeCategoryId === "weekly-summary"
                ? "bg-slate-900 text-white"
                : "text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
            }`}
          >
            Weekly
          </Link>
          <Link
            href="/weekly-summary"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-slate-600 ring-1 ring-slate-200 transition-colors hover:bg-slate-50 lg:hidden"
            aria-label="Weekly summary"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-5 w-5"
              aria-hidden
            >
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
}
