import Link from "next/link";
import { CATEGORIES, NewsSourceId } from "@/lib/config";
import { buildCategoryPageHref, buildWeeklySummaryHref } from "@/lib/url";

export type CategoryNavId = (typeof CATEGORIES)[number]["id"] | "weekly-summary";

interface CategoryNavProps {
  activeId: CategoryNavId;
  activeSourceId?: NewsSourceId | "all";
}

const WEEKLY_SUMMARY = {
  id: "weekly-summary" as const,
  name: "Weekly Summary",
  icon: "📅",
};

export function CategoryNav({
  activeId,
  activeSourceId = "all",
}: CategoryNavProps) {
  const items = [WEEKLY_SUMMARY, ...CATEGORIES];

  return (
    <nav
      className="scrollbar-hide -mx-4 flex gap-2 overflow-x-auto px-4 pb-1"
      aria-label="News categories"
    >
      {items.map((item) => {
        const isActive = item.id === activeId;
        const href =
          item.id === "weekly-summary"
            ? buildWeeklySummaryHref()
            : buildCategoryPageHref(item.id, { source: activeSourceId });

        return (
          <Link
            key={item.id}
            href={href}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
            }`}
          >
            <span aria-hidden>{item.icon}</span>
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
