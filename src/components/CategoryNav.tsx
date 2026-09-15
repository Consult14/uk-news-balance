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
      className="scrollbar-hide -mx-4 flex h-[42px] items-center gap-1.5 overflow-x-auto px-4"
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
            className={`flex h-11 shrink-0 items-center gap-1 rounded-full px-3 text-[14px] font-medium transition-colors sm:h-[34px] sm:px-2.5 sm:text-[13px] ${
              isActive
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white text-slate-700 ring-1 ring-slate-200/90 hover:bg-slate-50"
            }`}
          >
            <span aria-hidden className="text-xs sm:text-[11px]">
              {item.icon}
            </span>
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
