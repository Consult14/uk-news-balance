import Link from "next/link";
import {
  CATEGORIES,
  CategoryId,
  NewsSourceId,
  PoliticalLean,
} from "@/lib/config";

interface CategoryNavProps {
  activeId?: string;
  activeSourceId?: NewsSourceId | "all";
  activeLean?: PoliticalLean | "all";
}

function buildCategoryHref(
  categoryId: CategoryId,
  activeSourceId?: NewsSourceId | "all",
  activeLean: PoliticalLean | "all" = "all",
) {
  const params = new URLSearchParams();
  if (activeSourceId && activeSourceId !== "all") {
    params.set("source", activeSourceId);
  }
  if (activeLean !== "all") params.set("lean", activeLean);
  const query = params.toString();
  return query ? `/${categoryId}?${query}` : `/${categoryId}`;
}

export function CategoryNav({
  activeId,
  activeSourceId,
  activeLean = "all",
}: CategoryNavProps) {
  return (
    <nav
      className="scrollbar-hide -mx-4 flex gap-2 overflow-x-auto px-4 pb-1"
      aria-label="News categories"
    >
      {CATEGORIES.map((category) => {
        const isActive = category.id === activeId;
        return (
          <Link
            key={category.id}
            href={buildCategoryHref(category.id, activeSourceId, activeLean)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
            }`}
          >
            <span aria-hidden>{category.icon}</span>
            {category.name}
          </Link>
        );
      })}
    </nav>
  );
}

export function BottomNav({
  activeId,
  activeSourceId,
  activeLean = "all",
}: CategoryNavProps) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur md:hidden"
      aria-label="Mobile navigation"
    >
      <div className="scrollbar-hide flex gap-1 overflow-x-auto px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
        {CATEGORIES.map((category) => {
          const isActive = category.id === activeId;
          return (
            <Link
              key={category.id}
              href={buildCategoryHref(category.id, activeSourceId, activeLean)}
              className={`flex min-w-[4rem] shrink-0 flex-col items-center gap-0.5 rounded-lg px-2 py-1.5 text-[10px] font-medium ${
                isActive
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-500"
              }`}
            >
              <span className="text-lg leading-none" aria-hidden>
                {category.icon}
              </span>
              {category.name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
