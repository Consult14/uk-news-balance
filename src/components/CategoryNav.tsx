import Link from "next/link";
import { CATEGORIES, NewsSourceId } from "@/lib/config";
import { buildCategoryPageHref, buildWeeklySummaryHref } from "@/lib/url";
import { ScrollablePillNav } from "./ScrollablePillNav";

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
    <ScrollablePillNav aria-label="News categories">
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
                ? "bg-brand-navy text-white shadow-sm"
                : "bg-white text-brand-navy ring-1 ring-brand-navy/15 hover:bg-brand-light"
            }`}
          >
            <span aria-hidden>{item.icon}</span>
            {item.name}
          </Link>
        );
      })}
    </ScrollablePillNav>
  );
}
