import Link from "next/link";
import { CATEGORIES, CategoryId, NewsSourceId } from "@/lib/config";

interface CategoryNavProps {
  activeId?: string;
  activeSourceId?: NewsSourceId | "all";
}

function buildCategoryHref(
  categoryId: CategoryId,
  activeSourceId?: NewsSourceId | "all",
) {
  if (activeSourceId && activeSourceId !== "all") {
    return `/${categoryId}?source=${activeSourceId}`;
  }
  return `/${categoryId}`;
}

export function CategoryNav({ activeId, activeSourceId }: CategoryNavProps) {
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
            href={buildCategoryHref(category.id, activeSourceId)}
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
